package com.sixcube.recletter.chat.service;

import com.sixcube.recletter.chat.dto.ChatMessage;

import java.util.List;

public interface ChatService {

    ChatMessage joinChat(String studioId, ChatMessage chatMessage);

    ChatMessage sendMessage(String studioId, ChatMessage chatMessage);

    ChatMessage leaveChat(String studioId, ChatMessage chatMessage);

    List<String> searchChatUserList(String studioId);
}
