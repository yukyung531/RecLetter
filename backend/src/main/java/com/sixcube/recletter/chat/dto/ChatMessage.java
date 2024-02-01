package com.sixcube.recletter.chat.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    public enum MessageType{
        JOIN, // 채팅방 참여
        CHAT, // 메시지 전송
        LEAVE // 채팅방 퇴장
    }

    private String studioId; // 채팅방 ID
    private String content; // 메시지 내용
    private String UUID; // 메시지를 보낸 사용자의 UUID
    private String sender; // 메시지를 보낸 사용자
    private MessageType type; // 메시지 타입
    private String time; // 메시지를 보낸 시간
}
