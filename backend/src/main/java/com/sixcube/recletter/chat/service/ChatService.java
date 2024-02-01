package com.sixcube.recletter.chat.service;

import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.user.dto.User;

import java.util.List;

public interface ChatService {

    ChatMessage joinChat(String studioId, ChatMessage chatMessage, User user);

    ChatMessage sendMessage(String studioId, ChatMessage chatMessage, User user);

    ChatMessage leaveChat(String studioId, ChatMessage chatMessage, User user);

}
