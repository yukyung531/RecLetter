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
     * 세션 초기화: 화면 공유를 할 수 있는 환경(세션)을 생성
     * OpenVidu Server에서 세션을 초기화한다. 이는 OpenVidu 워크플로에서 수행하는 첫 번째 작업.
     * 그 후, 이 세션에 대한 연결 개체가 생성되고 해당 토큰이 클라이언트 측에 전달될 수 있으므로, 클라이언트는 이를 사용하여 세션에 연결가능
     *
     * @param studioId 스튜디오마다 화면공유를 할 수 있는 환경을 생성하기 위한 param
     * @param user     로그인한 유저인지 확인하기 위한 param
     * @return sessionId
     */
    @PostMapping("/meeting/sessions/{studioId}")
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
                // ObjectMapper 생성
                ObjectMapper mapper = new ObjectMapper();

                // 세션 정보를 Map으로 변환
                Map<String, Object> sessionInfoMap = mapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>(){});

                // 세션 정보에 사용자 ID 추가
                sessionInfoMap.put("editingUserId", user.getUserId());

                // 세션 정보를 JSON 문자열로 변환
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
     * 세션에서 새 연결 생성
     * @param sessionId 스튜디오마다 화면공유를 할 수 있는 환경을 생성하기 위한 param
     * @param params
     * @param user 로그인한 유저인지 확인하기 위한 param
     * @return
     */
    @PostMapping("/meeting/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId, @RequestBody(required = false) Map<String, Object> params, @AuthenticationPrincipal User user) {
        try {
            // RestTemplate 생성
            restTemplate = new RestTemplate();

            // 헤더 생성
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
            headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

            // HttpEntity 생성 (헤더 포함)
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // GET 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId, HttpMethod.GET, entity, String.class);

            // 세션 정보 파싱
            String sessionInfo = response.getBody();

            // ObjectMapper 생성
            ObjectMapper mapper = new ObjectMapper();

            // sessionInfo를 Map으로 변환
            Map<String, Object> sessionInfoMap = mapper.readValue(sessionInfo, new TypeReference<Map<String, Object>>(){});

            // 요청 본문 생성 (params를 사용하여 연결 속성 설정)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("sessionInfo", sessionInfoMap);
            if (params != null) {
                requestBody.put("params", params);
            }

            // 요청 본문을 JSON 문자열로 변환
            String requestJson = mapper.writeValueAsString(requestBody);
            // HttpEntity 생성 (헤더와 본문 포함)
            HttpEntity<String> postEntity = new HttpEntity<>(requestJson, headers);

            // POST 요청 보내기
            ResponseEntity<String> postResponse = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId + "/connection", HttpMethod.POST, postEntity, String.class);

            // 연결 정보 파싱
            String connectionInfo = postResponse.getBody();

            // 연결 정보를 Map으로 변환
            Map<String, Object> connectionInfoMap = mapper.readValue(connectionInfo, new TypeReference<Map<String, Object>>(){});

            // 연결 정보에 사용자 ID 추가
            connectionInfoMap.put("userId", user.getUserId());

            // 연결 정보를 JSON 문자열로 변환
            connectionInfo = mapper.writeValueAsString(connectionInfoMap);

            return new ResponseEntity<>(connectionInfo, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 세션 종료(해당 세션의 모든 프로세스가 중지됨. 모든 연결, 스트림 및 녹음이 닫힘)
     * @param sessionId 스튜디오마다 화면공유를 할 수 있는 환경을 생성하기 위한 param
     * @param user 로그인한 유저인지 확인하기 위한 param
     * @return
     */
    @DeleteMapping("/meeting/sessions/{sessionId}")
    public ResponseEntity<String> deleteSession(@PathVariable("sessionId") String sessionId, @AuthenticationPrincipal User user) {
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