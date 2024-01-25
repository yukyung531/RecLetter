package com.sixcube.recletter.meeting.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.user.dto.User;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class MeetingController {

    @Autowired
    StudioRepository studioRepository;

    // TODO: OPENVIDU_URL, OPENVIDU_SECRET => 나중에 application.yml에 넣을 예정
    private static final String OPENVIDU_URL = "http://localhost:4443/api/sessions";
    private static final String OPENVIDU_SECRET = "MY_SECRET";

    private RestTemplate restTemplate;

    /**
     * OpenVidu 서버에 새로운 세션을 생성하는 요청을 보내는 메서드
     * 화면 공유를 할 수 있는 환경(세션)을 생성(화면 공유를 시작하려는 사용자가 실행)
     * 이 세션에 대한 연결 개체가 생성되고 해당 토큰이 클라이언트 측에 전달될 수 있으므로, 클라이언트는 이를 사용하여 세션에 연결가능
     * @param studioId 스튜디오 ID. 이 아이디는 생성될 세션의 고유 아이디로 사용됨
     * @param user 현재 인증된 사용자. 이 사용자의 아이디는 편집 중인 사용자로 세션 정보에 추가됩니다.
     * @return 세션 정보를 담은 JSON 문자열을 포함하는 ResponseEntity 객체를 반환합니다. 세션 생성에 실패하면 에러 메시지를 담은 ResponseEntity를 반환합니다.
     */
    @PostMapping("/meeting/{studioId}")
    public ResponseEntity<String> initializeSession(@PathVariable("studioId") String studioId, @AuthenticationPrincipal User user) {
        // 스튜디오 존재 확인
        studioRepository.findById(studioId).orElseThrow(() -> new RuntimeException("Studio not found"));

        // RestTemplate 생성
        restTemplate = new RestTemplate();

        // OpenVidu 서버에 직접 HTTP POST 요청 보내기
        // 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

        // 요청 본문 생성
        String requestJson = "{\"customSessionId\":\"" + studioId + "\"}";

        // HttpEntity 생성 (헤더와 본문 포함)
        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        try {
            // POST 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                // ObjectMapper 생성(Java 객체와 JSON 사이의 변환을 담당)
                ObjectMapper mapper = new ObjectMapper();

                // 세션 객체(JSON 문자열)를 Map으로 변환(editingUserId를 세션 정보에 추가하기 위해)
                Map<String, Object> sessionInfoMap = mapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>(){});

                // 세션 정보에 사용자 ID 추가
                sessionInfoMap.put("editingUserId", user.getUserId());

                // 세션 정보를 JSON 문자열로 변환(HTTP 응답 본문은 문자열 형태로 전달되기 때문)
                String sessionInfo = mapper.writeValueAsString(sessionInfoMap);

                return new ResponseEntity<>(sessionInfo, HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Error: " + response.getStatusCode(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 세션에서 새 연결 생성(화면 공유를 시작하는 사용자 포함 화면공유 세션에 참여하려면 실행)
     * @param sessionId 세션의 ID
     * @param params    연결 설정에 사용할 매개변수 (옵션)
     * @param user      현재 인증된 사용자
     * @return 연결 정보가 포함된 ResponseEntity 객체
     */
    @PostMapping("/meeting/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId, @RequestBody(required = false) Map<String, Object> params, @AuthenticationPrincipal User user) {
        // 스튜디오 존재 확인
        studioRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Studio not found"));

        // RestTemplate 객체를 생성하여 HTTP 요청을 보낼 준비
        restTemplate = new RestTemplate();

        // HTTP 요청 헤더를 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

        // HttpEntity 객체를 생성하여 헤더를 포함
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 세션 정보를 가져오기 위한 GET 요청을 보냄
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId, HttpMethod.GET, entity, String.class);

            // 응답받은 세션 정보의 본문 가져오기
            String sessionInfo = response.getBody();


            // TODO - params를 안쓸 것 같아서 주석처리해둠 .인자에서도 params를 지우고 테스트해보자.
//            // JSON 문자열을 파싱하기 위해 ObjectMapper 객체를 생성
//            ObjectMapper mapper = new ObjectMapper();
//            // 세션 정보를 JSON 문자열에서 Map 객체로 변환
//            Map<String, Object> sessionInfoMap = mapper.readValue(sessionInfo, new TypeReference<Map<String, Object>>(){});
//
//            // 요청 본문 생성 (params를 사용하여 연결 속성 설정)
//            Map<String, Object> requestBody = new HashMap<>();
//            requestBody.put("sessionInfo", sessionInfoMap);
//            if (params != null) {
//                requestBody.put("params", params);
//            }
//
//            // 요청 본문을 JSON 문자열로 변환
//            String requestJson = mapper.writeValueAsString(requestBody);
//            // HttpEntity 생성 (헤더와 본문 포함)
//            HttpEntity<String> postEntity = new HttpEntity<>(requestJson, headers);

            // TODO - 새로 추가한 것. params를 지우고 테스트 했을 때 잘 되면 놔두기
            HttpEntity<String> postEntity = new HttpEntity<>(sessionInfo, headers);

            // POST 요청 보내기
            ResponseEntity<String> postResponse = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId + "/connection", HttpMethod.POST, postEntity, String.class);

            // 응답받은 연결 정보의 본문 가져오기
            String connectionInfo = postResponse.getBody();

            // JSON 문자열을 파싱하기 위해 ObjectMapper 객체를 생성
            ObjectMapper mapper = new ObjectMapper();

            // 연결 정보를 JSON 문자열에서 Map 객체로 변환
            Map<String, Object> connectionInfoMap = mapper.readValue(connectionInfo, new TypeReference<Map<String, Object>>(){});

            // 연결 정보에 사용자 ID 추가
            connectionInfoMap.put("joinUserId", user.getUserId());

            // 연결 정보를 JSON 문자열로 다시 변환
            connectionInfo = mapper.writeValueAsString(connectionInfoMap);

            // 연결 정보를 포함한 ResponseEntity 객체 반환
            return new ResponseEntity<>(connectionInfo, HttpStatus.OK);
        } catch (Exception e) {
            // 예외가 발생한 경우 에러 메시지와 함께 500 상태 코드 반환
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 세션 종료(해당 세션의 모든 프로세스가 중지됨. 모든 연결, 스트림 및 녹음이 닫힘)
     * @param sessionId 스튜디오마다 화면공유를 할 수 있는 환경을 생성하기 위한 param
     * @param user 현재 인증된 사용자
     * @return
     */
    @DeleteMapping("/meeting/{sessionId}")
    public ResponseEntity<String> deleteSession(@PathVariable("sessionId") String sessionId, @AuthenticationPrincipal User user) {
        // 스튜디오 존재 확인
        studioRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Studio not found"));

        // RestTemplate 생성
        restTemplate = new RestTemplate();

        // 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

        // HttpEntity 생성 (헤더 포함)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // DELETE 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId, HttpMethod.DELETE, entity, String.class);

            if (response.getStatusCode() == HttpStatus.NO_CONTENT) {
                return new ResponseEntity<>("Session deleted successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Error: " + response.getStatusCode(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}