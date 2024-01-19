package com.sixcube.recletter.chat.controller;

import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.chat.dto.ChatRoom;
import com.sixcube.recletter.chat.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.WebSocketSession;

@Controller
public class ChatController {

    // 메시지를 보내는 엔드포인트
    @MessageMapping("/chat/{roomId}/sendMessage")
    @SendTo("/topic/chatrooms/{roomId}")
    public ChatMessage sendMessage(
            @DestinationVariable String roomId,
            @Payload ChatMessage chatMessage
    ) {
        // 메시지를 채팅방에 브로드캐스트합니다.
        return chatMessage;
    }

    // 채팅방에 사용자를 추가하는 엔드포인트
    @MessageMapping("/chat/{roomId}/addUser")
    @SendTo("/topic/chatrooms/{roomId}")
    public ChatMessage addUser(
            @DestinationVariable String roomId,
            @Payload ChatMessage chatMessage
    ) {
        // 채팅방에 사용자를 추가하는 로직을 처리합니다.
        // 여기서는 채팅방에 참가했다는 메시지를 브로드캐스트합니다.
        chatMessage.setContent(chatMessage.getSender() + " joined!");
        return chatMessage;
    }

}

