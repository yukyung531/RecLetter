package com.sixcube.recletter.meeting.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixcube.recletter.meeting.service.MeetingService;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.user.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/meeting")
@RequiredArgsConstructor
@Slf4j
public class MeetingController {

    private final MeetingService meetingService;

    /**
     * OpenVidu 서버에 새로운 세션을 생성하는 요청을 보내는 메서드
     * 화면 공유를 할 수 있는 환경(세션)을 생성(화면 공유를 시작하려는 사용자가 실행)
     * 이 세션에 대한 연결 개체가 생성되고 해당 토큰이 클라이언트 측에 전달될 수 있으므로, 클라이언트는 이를 사용하여 세션에 연결가능
     * @param studioId 스튜디오 ID. 이 아이디는 생성될 세션의 고유 아이디로 사용됨
     * @param user 현재 인증된 사용자. 이 사용자의 아이디는 편집 중인 사용자로 세션 정보에 추가됩니다.
     * @return 세션 정보를 담은 JSON 문자열을 포함하는 ResponseEntity 객체를 반환합니다. 세션 생성에 실패하면 에러 메시지를 담은 ResponseEntity를 반환합니다.
     */
    @PostMapping("/{studioId}")
    public ResponseEntity<String> initializeSession(@PathVariable("studioId") String studioId, @AuthenticationPrincipal User user) {
        String sessionInfo = meetingService.initializeSession(studioId, user);
        return ResponseEntity.ok().body(sessionInfo);
    }

    /**
     * 세션에서 새 연결 생성(화면 공유를 시작하는 사용자 포함 화면공유 세션에 참여하려면 실행)
     * @param sessionId 세션의 ID
     * @param user      현재 인증된 사용자
     * @return 연결 정보가 포함된 ResponseEntity 객체
     */
    @PostMapping("/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId, @AuthenticationPrincipal User user) {
        String connectionInfo = meetingService.createConnection(sessionId, user);
        return ResponseEntity.ok().body(connectionInfo);
    }


    /**
     * 세션 종료(해당 세션의 모든 프로세스가 중지됨. 모든 연결, 스트림 및 녹음이 닫힘)
     * @param sessionId 스튜디오마다 화면공유를 할 수 있는 환경을 생성하기 위한 param
     * @param user 현재 인증된 사용자
     * @return 종료 성공 메시지
     */
    @DeleteMapping("/{sessionId}")
    public ResponseEntity<Void> deleteSession(@PathVariable("sessionId") String sessionId, @AuthenticationPrincipal User user) {
        meetingService.deleteSession(sessionId, user);
        return ResponseEntity.ok().build();
    }

    /**
     * sessionId가 활성화되어 있는지 여부를 알려주는 메서드
     * @param sessionId
     * @return 활성화되어있다면 세션 객체를, 아니라면 false 반환
     */
    @GetMapping("/{sessionId}/exists")
    public ResponseEntity<String> checkSession(@PathVariable("sessionId") String sessionId) {
        String sessionInfo = meetingService.checkSession(sessionId);
        return ResponseEntity.ok().body(sessionInfo);
    }
}