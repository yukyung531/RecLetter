package com.sixcube.recletter.chat.dto;

import lombok.Builder;
import lombok.Getter;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;

@Getter
public class ChatRoom {
    private String studioId; // 채팅방 ID
    private Set<WebSocketSession> sessions = new HashSet<>(); // 채팅방에 참여하고 있는 사용자들의 세션

    @Builder
    public ChatRoom(String studioId) {
        this.studioId = studioId;
    }

}
