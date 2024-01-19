package com.sixcube.recletter.chat.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {

    public enum MessageType{
        JOIN,
        CHAT,
        LEAVE
    }

    private String roomId;
    private String content;
    private String sender;
    private MessageType type;
}
