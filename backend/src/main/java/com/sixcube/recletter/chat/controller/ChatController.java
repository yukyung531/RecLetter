package com.sixcube.recletter.chat.controller;

import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.chat.service.ChatService;
import com.sixcube.recletter.redis.RedisListService;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.user.dto.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.security.Principal;
import java.util.List;

@RequiredArgsConstructor
@Controller
public class ChatController {

    private final ChatService chatService;

    private final RedisListService redisListService;

    /**
     * 채팅방에 참여하는 엔드포인트
     * @param studioId 클라이언트가 보낸 메시지의 목적지에서 추출한 스튜디오 ID.
     * @param chatMessage 클라이언트가 보낸 메시지의 본문. JSON 형태의 메시지를 ChatMessage 객체로 변환하여 전달함.
     * @param principal 현재 인증된 사용자의 정보(JwtTokenChannelInterceptor에서 인증받은 사용자의 정보).
     * @return 채팅 서비스의 joinChat 메서드가 처리한 결과. 채팅 참가 요청의 처리 결과를 ChatMessage 객체로 반환.
     */
    @MessageMapping("/chat/{studioId}/join") // 클라이언트에서 보낸 메시지를 받을 메서드 지정
    @SendTo("/topic/{studioId}") // 메서드가 처리한 결과를 보낼 목적지 지정
    public ChatMessage joinChat(@DestinationVariable String studioId, @Payload ChatMessage chatMessage, Principal principal) {
          /* @DestinationVariable: 메시지의 목적지에서 변수를 추출
             @Payload: 메시지 본문(body)의 내용을 메서드의 인자로 전달할 때 사용
                      (클라이언트가 JSON 형태의 메시지를 보냈다면, 이를 ChatMessage 객체로 변환하여 메서드에 전달)
          */
        // 현재 인증된 사용자의 정보를 User 객체로 변환
        User user = (User) ((Authentication) principal).getPrincipal();
        return chatService.joinChat(studioId, chatMessage, user);
    }

    /**
     * 메시지를 보내는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/sendMessage")
    @SendTo("/topic/{studioId}")
    public ChatMessage sendMessage(@DestinationVariable String studioId, @Payload ChatMessage chatMessage, Principal principal) {
        User user = (User) ((Authentication) principal).getPrincipal();
        return chatService.sendMessage(studioId, chatMessage, user);
    }

    /**
     * 채팅방 나가는 엔드포인트
     */
    @MessageMapping("/chat/{studioId}/leave")
    @SendTo("/topic/{studioId}")
    public ChatMessage leaveChat(@DestinationVariable String studioId, @Payload ChatMessage chatMessage, Principal principal) {
        User user = (User) ((Authentication) principal).getPrincipal();
        return chatService.leaveChat(studioId, chatMessage, user);
    }

    /**
     * 채팅방(스튜디오)에 현재 접속해있는 유저리스트 조회
     * @param studioId 확인할 채팅방(스튜디오)
     * @return 채팅방(스튜디오)에 현재 접속해있는 유저리스트 반환
     */
    @GetMapping("/chat/{studioId}/userList")
    public ResponseEntity<List<String>> searchChatUserList(@PathVariable String studioId) {
        String key = RedisPrefix.STUDIO.prefix() + studioId;
        List<String> userList = redisListService.getList(key);
        return new ResponseEntity<>(userList, HttpStatus.OK);
    }

}