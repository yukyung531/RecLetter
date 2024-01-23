package com.sixcube.recletter.meeting.controller;

import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.user.repository.UserRepository;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
public class MeetingController {

    private StudioRepository studioRepository;
    private UserRepository userRepository;

    public MeetingController(StudioRepository studioRepository, UserRepository userRepository) {
        this.studioRepository = studioRepository;
        this.userRepository = userRepository;
    }

    // TODO: OPENVIDU_URL, OPENVIDU_SECRET => 나중에 application.yml에 넣을 예정
    private static final String OPENVIDU_URL = "http://localhost:4443/";
    private static final String OPENVIDU_SECRET = "MY_SECRET";

    // OpenVidu 객체 선언
    private OpenVidu openVidu;

    /**
     * OpenVidu 인스턴스 생성
     */
    @PostConstruct
    public void init() {
        this.openVidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * 세션 초기화: 화면 공유를 할 수 있는 환경(세션)을 생성
     *
     * @param studioId  스튜디오마다 화면공유를 할 수 있는 환경을 생성하기 위한 param
     * @param userToken 로그인한 유저인지 확인하기 위한 토큰
     * @return sessionId
     */
    @PostMapping("/api/sessions/{studioId}")
    public ResponseEntity<String> initializeSession(@PathVariable("studioId") String studioId, @RequestHeader("userToken") String userToken) throws OpenViduJavaClientException, OpenViduHttpException {
        // TODO: userToken을 사용하여 사용자 인증 확인 로직 구현 필요

        // 스튜디오 존재 확인
        Studio studio = studioRepository.findById(studioId).orElseThrow(() -> new RuntimeException("Studio not found"));

        // TODO: user기능이 다 구현되면 주석해제
//        if (!studio.getStudioOwner().equals(user.getId())) {
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }

        // session ID를 studioId로 설정
        SessionProperties properties = new SessionProperties.Builder().customSessionId(studioId).build();

        // 새 세션 생성
        Session session = openVidu.createSession(properties);

        // 세션ID 반환
        return new ResponseEntity<>(session.getSessionId(), HttpStatus.OK);
    }

    /**
     * 특정 스튜디오에서 연결 생성
     *
     * @param sessionId The Session in which to create the Connection
     * @param params    The Connection properties(프론트엔드로부터 받는 연결 속성을 나타내는 JSON 객체)
     * @return The Token associated to the Connection
     */
    @PostMapping("/api/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId, @RequestBody(required = false) Map<String, Object> params) throws OpenViduJavaClientException, OpenViduHttpException {
        // 활성 세션을 가져옴
        Session session = openVidu.getActiveSession(sessionId);
        // 세션이 존재하지 않으면 404 에러 반환
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // 요청 본문에서 연결 속성 빌드
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();
        // 새 연결 생성
        Connection connection = session.createConnection(properties);
        // 연결 토큰(프론트엔드에서 OpenVidu 세션에 참가하기 위해 사용) 반환
        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }

    /**
     * 화면 공유를 중지하거나, 화면 공유를 보는 방을 나가기
     *
     * @param sessionId    The Session from which to disconnect
     * @param connectionId The Connection to disconnect(특정 OpenVidu 세션에 참여하는 사용자를 식별하는 데 사용되는 값, 사용자가 세션에 참여할 때마다 새로 생성)
     */
    @PostMapping("/api/sessions/{sessionId}/disconnect")
    public ResponseEntity<String> disconnect(@PathVariable("sessionId") String sessionId, String connectionId) throws OpenViduJavaClientException, OpenViduHttpException {
        // 활성 세션을 가져옴
        Session session = openVidu.getActiveSession(sessionId);
        // 세션이 존재하지 않으면 404 에러 반환
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        // 활성 세션에서 모든 연결을 가져옴
        List<Connection> activeConnections = session.getActiveConnections();

        // 연결 ID가 connectionId인 연결을 찾음
        Connection connection = activeConnections.stream()
                // 각 연결의 연결 ID가 connectionId와 같은지 확인
                .filter(c -> c.getConnectionId().equals(connectionId))
                // 첫 번째로 일치하는 연결을 선택
                .findFirst()
                // 일치하는 연결이 없으면 null을 반환
                .orElse(null);
        // 연결이 존재하지 않으면 404 에러 반환
        if (connection == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // 연결을 끊음
        //모든 사용자가 세션에서 나가면 세션은 자동으로 종료되는 것이 아니라, 해당 세션에 다른 사용자가 재접속할 수 있는 상태가 유지됨
        session.forceDisconnect(connection);

        // 성공 메시지 반환
        return new ResponseEntity<>("Disconnected successfully", HttpStatus.OK);
    }

}

