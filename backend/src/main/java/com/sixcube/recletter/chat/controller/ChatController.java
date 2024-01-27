package com.sixcube.recletter.chat.controller;

import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.chat.service.ChatService;
import com.sixcube.recletter.user.dto.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;


@Controller
@Slf4j
public class ChatController {

    private ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    /**
     * 채팅방에 참여하는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/join") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("/topic/{studioId}") // 메서드가 처리한 결과를 보낼 목적지 지정
    public ChatMessage joinChat(@DestinationVariable String studioId, @Payload ChatMessage chatMessage, @AuthenticationPrincipal User user) {
          /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
             @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
                      (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 ChatMessage 객체로 변환하여 메서드에 전달)
          */
        return chatService.joinChat(studioId, chatMessage, user);
    }

    /**
     * 메시지를 보내는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/sendMessage")
    @SendTo("/topic/{studioId}")
    public ChatMessage sendMessage(@DestinationVariable String studioId, @Payload ChatMessage chatMessage, @AuthenticationPrincipal User user) {
        return chatService.sendMessage(studioId, chatMessage, user);
    }

    /**
     * 채팅방 나가는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/leave")
    @SendTo("/topic/{studioId}")
    public ChatMessage leaveChat(@DestinationVariable String studioId, @Payload ChatMessage chatMessage, @AuthenticationPrincipal User user) {
        return chatService.leaveChat(studioId, chatMessage, user);
    }

    /**
     * 채팅방에 참여중인 사용자 조회
     */
    @GetMapping("/chat/{studioId}/userList")
    public ResponseEntity<List<String>> searchChatUserList(@PathVariable String studioId) {
        List<String> userList = chatService.searchChatUserList(studioId);
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }
}