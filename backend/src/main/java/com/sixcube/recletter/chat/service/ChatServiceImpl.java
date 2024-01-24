package com.sixcube.recletter.chat.service;

import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.chat.exhandler.ChatException;
import com.sixcube.recletter.user.dto.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class ChatServiceImpl implements ChatService {

    // 각 스튜디오의 참여자 리스트(key - studioId, value - 참여자들)
    private Map<String, List<String>> chattinglist = new HashMap<>();

    @Override
    public ChatMessage joinChat(String studioId, ChatMessage chatMessage, User user) {
        try {
            log.debug("ChatServiceImpl.joinChat : start");
            // studioId가 없다면 예외처리
            if (studioId == null || studioId.isEmpty()) {
                throw new ChatException("Invalid studioId: " + studioId);
            }

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 채팅방 참여자 리스트에 추가
            List<String> users = chattinglist.getOrDefault(studioId, new ArrayList<>());
            if (!users.contains(chatMessage.getSender())) {
                users.add(chatMessage.getSender());
            }
            chattinglist.put(studioId, users);

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
            // 참여 메시지 설정
            chatMessage.setContent(chatMessage.getSender() + "님이 참여하였습니다.");

            log.debug("ChatServiceImpl.joinChat : end");
            // 메시지를 채팅방에 브로드캐스트한다.
            return chatMessage;
        } catch(Exception e) {
            log.error("ChatServiceImpl.joinChat : Exception", e);
            throw new ChatException("Error occurred while joining chat");
        }
    }

    @Override
    public ChatMessage sendMessage(String studioId, ChatMessage chatMessage, User user) {
        try {
            log.debug("ChatServiceImpl.sendMessage : start");
            if (studioId == null || studioId.isEmpty()) {
                throw new ChatException("Invalid studioId: " + studioId);
            }
            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

            log.debug("ChatServiceImpl.sendMessage : end");
            return chatMessage;
        } catch(Exception e) {
            log.error("ChatServiceImpl.sendMessage : Exception", e);
            throw new ChatException("Error occurred while sending message");
        }
    }

    @Override
    public ChatMessage leaveChat(String studioId, ChatMessage chatMessage, User user) {
        try {
            log.debug("ChatServiceImpl.leaveChat : start");
            if (studioId == null || studioId.isEmpty()) {
                throw new ChatException("Invalid studioId: " + studioId);
            }
            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());
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
            log.debug("ChatServiceImpl.leaveChat : end");
            return chatMessage;
        } catch(Exception e) {
            log.error("ChatServiceImpl.leaveChat : Exception", e);
            throw new ChatException("Error occurred while leaving chat");
        }
    }

    @Override
    public List<String> searchChatUserList(String studioId) {
        try {
            log.debug("ChatServiceImpl.searchChatUserList : start");
            List<String> userList = chattinglist.getOrDefault(studioId, new ArrayList<>());
            log.debug("ChatServiceImpl.searchChatUserList : end");
            return userList;
        } catch(Exception e) {
            log.error("ChatServiceImpl.searchChatUserList : Exception", e);
            throw new ChatException("Error occurred while searching chat user list");
        }
    }
}
