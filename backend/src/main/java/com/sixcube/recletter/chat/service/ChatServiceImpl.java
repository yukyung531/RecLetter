package com.sixcube.recletter.chat.service;

import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.chat.exception.ChatJoinFailureException;
import com.sixcube.recletter.chat.exception.ChatLeaveFailureException;
import com.sixcube.recletter.chat.exception.ChatSendMessageFailureException;
import com.sixcube.recletter.chat.exception.SearchChatUserListFailureException;
import com.sixcube.recletter.chat.exhandler.ChatExceptionHandler;
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
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final StudioRepository studioRepository;

    private final StudioParticipantRepository studioParticipantRepository;

    @Override
    public ChatMessage joinChat(String studioId, ChatMessage chatMessage, User user) throws StudioNotFoundException,AlreadyJoinedStudioException, ChatJoinFailureException {
        try {
            log.debug("ChatServiceImpl.joinChat : start");
            // studioId에 해당하는 studio가 존재하는지 확인
            studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

            // 참여 메시지 설정
            chatMessage.setContent(chatMessage.getSender() + "님이 참여하였습니다.");

            log.debug("ChatServiceImpl.joinChat : end");
            // 메시지를 채팅방에 브로드캐스트한다.
            return chatMessage;
        } catch (Exception e) {
            throw new ChatJoinFailureException(e);
        }
    }

    @Override
    public ChatMessage sendMessage(String studioId, ChatMessage chatMessage, User user) throws StudioNotFoundException, ChatSendMessageFailureException  {
        try {
            log.debug("ChatServiceImpl.sendMessage : start");
            // studioId에 해당하는 studio가 존재하는지 확인
            studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());

            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));

            log.debug("ChatServiceImpl.sendMessage : end");
            return chatMessage;
        } catch (Exception e) {
            throw new ChatSendMessageFailureException(e);
        }
    }

    @Override
    public ChatMessage leaveChat(String studioId, ChatMessage chatMessage, User user) throws StudioNotFoundException, ChatLeaveFailureException{
        try {
            log.debug("ChatServiceImpl.leaveChat : start");
            // studioId에 해당하는 studio가 존재하는지 확인
            studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

            // 메시지 sender에 userNickname 등록
            chatMessage.setSender(user.getUserNickname());
            // 메시지를 보낸 시간 설정
            chatMessage.setTime(LocalDateTime.now().format(DateTimeFormatter.ofPattern("HH:mm")));
            // 퇴장 메시지 설정
            chatMessage.setContent(chatMessage.getSender() + "님이 퇴장하였습니다.");

            log.debug("ChatServiceImpl.leaveChat : end");
            return chatMessage;
        } catch (Exception e) {
            throw new ChatLeaveFailureException(e);
        }
    }

    @Override
    public List<String> searchChatUserList(String studioId)throws StudioNotFoundException, SearchChatUserListFailureException {
        try {
            log.debug("ChatServiceImpl.searchChatUserList : start");
            // 스튜디오 아이디에 해당하는 스튜디오 정보 가져오기
            Studio studio = studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
            // 스튜디오에 참여하고 있는 참여자들 가져오기
            List<StudioParticipant> participants = studioParticipantRepository.findAllByStudio(studio);
            // userNickname 리스트 만들기
            List<String> userList = participants.stream().map(participant -> participant.getUser().getUserNickname()).collect(Collectors.toList());
            log.debug("ChatServiceImpl.searchChatUserList : end");
            // userNickname 리스트 반환
            return userList;
        } catch (Exception e) {
            throw new SearchChatUserListFailureException(e);
        }
    }
}
