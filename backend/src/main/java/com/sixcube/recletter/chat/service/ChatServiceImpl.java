package com.sixcube.recletter.chat.service;

import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.chat.exhandler.ChatException;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.repository.StudioParticipantRepository;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.user.dto.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChatServiceImpl implements ChatService {
    @Autowired
    StudioRepository studioRepository;

    @Autowired
    StudioParticipantRepository studioParticipantRepository;

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

            log.debug("ChatServiceImpl.leaveChat : end");
            return chatMessage;
        } catch(Exception e) {
            log.error("ChatServiceImpl.leaveChat : Exception", e);
            throw new ChatException("Error occurred while leaving chat");
        }
    }

    /**
     * 현재 채팅방(스튜디오)에 참여하고 있는 유저 리스트 조회
     * @param studioId
     * @return
     */
    @Override
    public List<String> searchChatUserList(String studioId) {
        try {
            log.debug("ChatServiceImpl.searchChatUserList : start");
            // 스튜디오 아이디에 해당하는 스튜디오 정보 가져오기
            Studio studio = studioRepository.findById(studioId)
                    .orElseThrow(() -> new ChatException("Studio not found: " + studioId));
            // 스튜디오에 참여하고 있는 참여자들 가져오기
            List<StudioParticipant> participants = studioParticipantRepository.findAllByStudio(studio);
            // userId 리스트 만들기
            List<String> users = participants.stream()
                    .map(participant -> participant.getUser().getUserId())
                    .collect(Collectors.toList());
            log.debug("ChatServiceImpl.searchChatUserList : end");
            // userId 리스트 반환
            return users;
        } catch(Exception e) {
            log.error("ChatServiceImpl.searchChatUserList : Exception", e);
            throw new ChatException("Error occurred while searching chat user list");
        }
    }
}
