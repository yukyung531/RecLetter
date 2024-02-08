package com.sixcube.recletter.meeting.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixcube.recletter.meeting.exception.*;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.user.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class MeetingServiceImpl implements MeetingService {

    private final StudioRepository studioRepository;

    @Value("${openvidu.url}")
    private String OPENVIDU_URL;

    @Value("${openvidu.secret}")
    private String OPENVIDU_SECRET;

    private RestTemplate restTemplate;

    public String initializeSession(String studioId, User user) throws StudioNotFoundException, MeetingInitializeSessionFailureException {
        // 스튜디오 존재 확인
        studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

        // RestTemplate 생성
        restTemplate = new RestTemplate();

        // OpenVidu 서버에 직접 HTTP POST 요청 보내기
        // 헤더 생성
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

        // 요청 본문 생성(sessionId에 studioId를, name에 userId를 넣어서 각 세션에서 편집을 시작한 유저의 정보를 편리하게 관리하고자 함)
        String requestJson = "{\"customSessionId\":\"" + studioId + "\", \"defaultRecordingProperties\": {\"name\": \"" + user.getUserId() + "\"}}";

        // HttpEntity 생성 (헤더와 본문 포함)
        HttpEntity<String> entity = new HttpEntity<>(requestJson, headers);

        try {
            // POST 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL, HttpMethod.POST, entity, String.class);

            // ObjectMapper 생성(Java 객체와 JSON 사이의 변환을 담당)
            ObjectMapper mapper = new ObjectMapper();

            // 세션 객체(JSON 문자열)를 Map으로 변환(editingUserId를 세션 정보에 추가하기 위해)
            Map<String, Object> sessionInfoMap = mapper.readValue(response.getBody(), new TypeReference<Map<String, Object>>() {
            });

            // 세션 정보를 JSON 문자열로 변환(HTTP 응답 본문은 문자열 형태로 전달되기 때문)
            String sessionInfo = mapper.writeValueAsString(sessionInfoMap);

            return sessionInfo;
        } catch (Exception e) {
            throw new MeetingInitializeSessionFailureException(e);
        }
    }

    public String createConnection(String sessionId, User user) throws StudioNotFoundException, MaxMeetingParticipantException, MeetingCreateConnectionFailureException {
        // 참가자 제한 수 설정
        final int PARTICIPANT_LIMIT = 6;

        // 스튜디오 존재 확인
        studioRepository.findById(sessionId).orElseThrow(StudioNotFoundException::new);

        // RestTemplate 객체를 생성하여 HTTP 요청을 보낼 준비
        restTemplate = new RestTemplate();

        // HTTP 요청 헤더를 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));
        headers.setBasicAuth("OPENVIDUAPP", OPENVIDU_SECRET);

        // HttpEntity 객체를 생성(헤더 포함)
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            // 세션 정보를 가져오기 위한 GET 요청을 보냄
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId, HttpMethod.GET, entity, String.class);

            // 응답받은 세션 정보의 본문 가져오기
            String sessionInfo = response.getBody();

            // JSON 문자열을 파싱하기 위해 ObjectMapper 객체를 생성
            ObjectMapper mapper = new ObjectMapper();

            // 세션 정보를 JSON 문자열에서 Map 객체로 변환
            Map<String, Object> sessionInfoMap = mapper.readValue(sessionInfo, new TypeReference<Map<String, Object>>() {
            });

            // 현재 세션의 참가자 수 가져오기
            int currentParticipantCount = (int) ((Map<String, Object>) sessionInfoMap.get("connections")).get("numberOfElements");

            // 참가자 수 제한 확인(6명이 이미 들어와있다면 들어올 수 없음)
            if (currentParticipantCount >= PARTICIPANT_LIMIT) {
                throw new MaxMeetingParticipantException();
            }

            // HttpEntity 객체를 생성(본문, 헤더 포함)
            HttpEntity<String> postEntity = new HttpEntity<>(sessionInfo, headers);

            // POST 요청 보내기
            ResponseEntity<String> postResponse = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId + "/connection", HttpMethod.POST, postEntity, String.class);

            // 응답받은 연결 정보의 본문 가져오기
            String connectionInfo = postResponse.getBody();

            // 연결 정보를 JSON 문자열에서 Map 객체로 변환
            Map<String, Object> connectionInfoMap = mapper.readValue(connectionInfo, new TypeReference<Map<String, Object>>() {
            });

            // 연결 정보에 사용자 ID 추가
            connectionInfoMap.put("joinUserId", user.getUserId());

            // 연결 정보를 JSON 문자열로 다시 변환
            connectionInfo = mapper.writeValueAsString(connectionInfoMap);

            // 연결 정보를 포함한 connetionInfo 반환
            return connectionInfo;
        } catch (Exception e) {
            throw new MeetingCreateConnectionFailureException(e);
        }
    }

    public void deleteSession(String sessionId, User user) throws StudioNotFoundException, MeetingDeleteSessionFailureException{
        // 스튜디오 존재 확인
        studioRepository.findById(sessionId).orElseThrow(StudioNotFoundException::new);

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
            restTemplate.exchange(OPENVIDU_URL + "/" + sessionId, HttpMethod.DELETE, entity, String.class);
        } catch (Exception e) {
            throw new MeetingDeleteSessionFailureException(e);
        }
    }

    public String checkSession(String sessionId) throws StudioNotFoundException, MeetingCheckSessionFailureException {
        // 스튜디오 존재 확인
        studioRepository.findById(sessionId).orElseThrow(StudioNotFoundException::new);

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
            // 해당 세션 정보를 가져오기 위한 GET 요청을 보냄
            log.info("openvidu_url: " + OPENVIDU_URL);
            ResponseEntity<String> response = restTemplate.exchange(OPENVIDU_URL + "/" + sessionId, HttpMethod.GET, entity, String.class);

            // HTTP 상태 코드가 200이면 세션 ID가 활성화되어 있으므로, 세션 객체를 반환
            if (response.getStatusCode() == HttpStatus.OK) {
                return response.getBody();
            }

        } catch (HttpClientErrorException e) {
            // HTTP 상태 코드가 404이면 세션 ID가 존재하지 않음
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return "no exists";
            } else throw new MeetingCheckSessionFailureException(e);
        }

        return "no exists";
    }
}
