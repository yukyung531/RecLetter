package com.sixcube.recletter.chat.service;

import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.chat.exception.ChatJoinFailureException;
import com.sixcube.recletter.chat.exception.ChatLeaveFailureException;
import com.sixcube.recletter.chat.exception.ChatSendMessageFailureException;
import com.sixcube.recletter.chat.exception.SearchChatUserListFailureException;
import com.sixcube.recletter.chat.exhandler.ChatExceptionHandler;
import com.sixcube.recletter.redis.RedisListService;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.studio.StudioUtil;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.StudioParticipantId;
import com.sixcube.recletter.studio.exception.AlreadyJoinedStudioException;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.studio.exception.StudioParticipantCreateFailureException;
import com.sixcube.recletter.studio.repository.StudioParticipantRepository;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.user.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final StudioRepository studioRepository;

    private final RedisListService redisListService;

    private final StudioUtil studioUtil;

    @Override
    public ChatMessage joinChat(String studioId, ChatMessage chatMessage, User user) throws StudioNotFoundException, AlreadyJoinedStudioException, ChatJoinFailureException {
        try {
            // studioId에 해당하는 studio가 존재하는지 확인
            studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

            // 해당 스튜디오에 현재 참여중인지 확인
            studioUtil.isStudioParticipant(studioId, user.getUserId());

            // 접속 정보를 레디스에 저장
            String key = RedisPrefix.STUDIO.prefix() + studioId;
            redisListService.addValueToList(key, user.getUserNickname());

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 메시지 studioId에 studioId 등록
            chatMessage.setStudioId(studioId);

            // 메시지 UUID에 UUID 등록
            chatMessage.setUUID(user.getUserId());

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

            // 참여 메시지 설정
            chatMessage.setContent(chatMessage.getSender() + "님이 참여하였습니다.");

            // 메시지를 채팅방에 브로드캐스트한다.
            return chatMessage;
        } catch (Exception e) {
            throw new ChatJoinFailureException(e);
        }
    }

    @Override
    public ChatMessage sendMessage(String studioId, ChatMessage chatMessage, User user) throws StudioNotFoundException, ChatSendMessageFailureException {
        try {
            // studioId에 해당하는 studio가 존재하는지 확인
            studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

            // 해당 스튜디오에 현재 참여중인지 확인
            studioUtil.isStudioParticipant(studioId, user.getUserId());

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 메시지 UUID에 UUID 등록
            chatMessage.setUUID(user.getUserId());

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

            return chatMessage;
        } catch (Exception e) {
            throw new ChatSendMessageFailureException(e);
        }
    }

    @Override
    public ChatMessage leaveChat(String studioId, ChatMessage chatMessage, User user) throws StudioNotFoundException, ChatLeaveFailureException {
        try {

            // studioId에 해당하는 studio가 존재하는지 확인
            studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

            // 해당 스튜디오에 현재 참여중인지 확인
            studioUtil.isStudioParticipant(studioId, user.getUserId());

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 메시지 studioId에 studioId 등록
            chatMessage.setStudioId(studioId);

            // 메시지 UUID에 UUID 등록
            chatMessage.setUUID(user.getUserId());

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

            // 퇴장 메시지 설정
            chatMessage.setContent(chatMessage.getSender() + "님이 퇴장하였습니다.");

            /* 퇴장 정보를 레디스에 저장
               redis key값에 해당 studioId가 존재하고 해당 user가 접속중이라면, 그 key의 value에 userNickname 제거(하나만 제거, 중복될 수 있으니까)
               redis key값에 해당 studioId가 존재하지 않는다면, 예외처리
             */
            String key = RedisPrefix.STUDIO.prefix() + studioId;
            List<String> list = redisListService.getList(key);

            if(list != null && list.contains(user.getUserNickname())) {
                // 리스트에 userNickname이 존재하면, userNickname 제거
                redisListService.removeValueFromList(key,user.getUserNickname());
            } else {
                // 리스트에 userNickname이 존재하지 않으면, 예외 발생
                throw new NoSuchElementException("The userNickname does not exist in the list");
            }

            return chatMessage;
        } catch (Exception e) {
            throw new ChatLeaveFailureException(e);
        }
    }

}
