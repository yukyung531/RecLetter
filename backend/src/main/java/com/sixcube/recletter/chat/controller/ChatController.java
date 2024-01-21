package com.sixcube.recletter.chat.controller;

import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.chat.exhandler.ChatException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@Slf4j
public class ChatController {

    // 각 스튜디오의 참여자 리스트(key - studioId, value - 참여자들)
    private Map<String, List<String>> chattinglist = new HashMap<>();

    /**
     * 채팅방에 참여하는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/join")
    @SendTo("/topic/{studioId}")
    public ChatMessage joinChat(@DestinationVariable String studioId, @Payload ChatMessage chatMessage) {
        log.info("ChatController.joinChat : start");
        // TODO - 로그인한 유저로 테스트해봐야 함
//        // 사용자 아이디로 사용자 정보 조회
//        UserInfo userInfo = UserService.searchUserInfoByUserId(principal.getName());
//
//        // 사용자 닉네임으로 메시지 설정
//        chatMessage.setSender(userInfo.getUserName());
//        chatMessage.setContent(userInfo.getUserName() +  "님이 참여하였습니다.");

        if (studioId == null || studioId.isEmpty()) {
            throw new ChatException("Invalid studioId: " + studioId);
        }

        // 채팅방 참여자 리스트에 추가
        List<String> users = chattinglist.getOrDefault(studioId, new ArrayList<>());
        if (!users.contains(chatMessage.getSender())) {
            users.add(chatMessage.getSender());
        }
        chattinglist.put(studioId, users);

        // builder형식을 사용하게 되면 새로운 ChatMessage 객체를 생성하게 되므로 사용하지 않음
        // 메시지를 보낸 시간 설정
        chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        // 참여 메시지 설정
        chatMessage.setContent(chatMessage.getSender() + "님이 참여하였습니다.");

        log.info("ChatController.joinChat : end");
        return chatMessage;
    }

    /**
     * 메시지를 보내는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/sendMessage") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("/topic/{studioId}") // 메서드가 처리한 결과를 보낼 목적지 지정
    /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
       @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
             (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 ChatMessage 객체로 변환하여 메서드에 전달)
     */
    public ChatMessage sendMessage(@DestinationVariable String studioId, @Payload ChatMessage chatMessage) {
        log.info("ChatController.sendMessage : start");

        if (studioId == null || studioId.isEmpty()) {
            throw new ChatException("Invalid studioId: " + studioId);
        }
        // 메시지를 보낸 시간 설정
        chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

        log.info("ChatController.sendMessage : end");
        // 메시지를 채팅방에 브로드캐스트한다.
        return chatMessage;
    }

    /**
     * 채팅방 나가는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/leave")
    @SendTo("/topic/{studioId}")
    public ChatMessage leaveChat(@DestinationVariable String studioId, @Payload ChatMessage chatMessage) {

        log.info("ChatController.leaveChat : start");

        // 예외 처리
        if (studioId == null || studioId.isEmpty()) {
            throw new ChatException("Invalid studioId: " + studioId);
        }
        // 메시지를 보낸 시간 설정
        chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
        // 퇴장 메시지 설정
        chatMessage.setContent(chatMessage.getSender() + "님이 퇴장하였습니다.");

        // 채팅방 참여자 리스트에서 제거
        List<String> users = chattinglist.get(studioId);
        if (users != null) {
            users.remove(chatMessage.getSender());
            chattinglist.put(studioId, users);
        }

        log.info("ChatController.leaveChat : end");
        return chatMessage;
    }

    /**
     * 채팅방에 참여중인 사용자 조회
     */
    @GetMapping("/chat/{studioId}/userList")
    public ResponseEntity<List<String>> searchChatUserList(@PathVariable String studioId) {

        log.info("ChatController.searchChatUserList : start");
        // 리턴할 객체 생성
        ResponseEntity<List<String>> responseEntity;

        try {
            responseEntity = new ResponseEntity<List<String>>(chattinglist.getOrDefault(studioId, new ArrayList<>()), HttpStatus.OK);
            log.info("ChatController.searchChatUserList : end");
        } catch (NullPointerException e) { // 예외 처리
            log.error("ChatController.searchChatUserList : error", e);
            responseEntity = new ResponseEntity<List<String>>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }
}

