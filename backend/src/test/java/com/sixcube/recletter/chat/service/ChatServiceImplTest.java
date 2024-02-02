package com.sixcube.recletter.chat.service;

import com.sixcube.recletter.RecLetterApplication;
import com.sixcube.recletter.chat.dto.ChatMessage;
import com.sixcube.recletter.redis.RedisListService;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.user.dto.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@ContextConfiguration(classes = RecLetterApplication.class)
class ChatServiceImplTest {

    @Autowired
    private ChatServiceImpl chatService;

    @Autowired
    private RedisListService redisListService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .userId("testUser")
                .userEmail("test@ssafy.com")
                .userPassword("unEncodedTestPassword")
                .userNickname("test")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void joinChatTest() {

        ChatMessage chatMessage = ChatMessage.builder().build();

        ChatMessage result = chatService.joinChat("testStudio", chatMessage, testUser);
        assertEquals(chatMessage.getSender()+"님이 참여하였습니다.", result.getContent());
        // 채팅방에 사용자가 추가되었는지 검증
        String key = RedisPrefix.STUDIO.prefix() + "testStudio";
        List<String> userList = redisListService.getList(key);
        assertTrue(userList.contains(testUser.getUserNickname()));
    }

    @Test
    void sendMessageTest() {
        ChatMessage chatMessage = ChatMessage.builder()
                .content("Hello")
                .build();

        ChatMessage result = chatService.sendMessage("testStudio", chatMessage, testUser);
        assertEquals("Hello", result.getContent());
    }

    @Test
    void leaveChatTest() {
        // 먼저 사용자를 채팅방에 추가
        ChatMessage joinMessage = ChatMessage.builder().build();
        chatService.joinChat("testStudio", joinMessage, testUser);

        // 사용자를 채팅방에서 퇴장시킴
        ChatMessage leaveMessage = ChatMessage.builder().build();
        ChatMessage result = chatService.leaveChat("testStudio", leaveMessage, testUser);
        assertEquals(leaveMessage.getSender()+"님이 퇴장하였습니다.", result.getContent());
        // 채팅방에서 사용자가 제거되었는지 검증
        String key = RedisPrefix.STUDIO.prefix() + "testStudio";
        List<String> userList = redisListService.getList(key);
        assertFalse(userList.contains(leaveMessage.getSender()));

    }

    @Test
    void searchChatUserListTest() {
        // 먼저 사용자를 채팅방에 추가
        ChatMessage joinMessage1 = ChatMessage.builder().build();
        chatService.joinChat("testStudio", joinMessage1, testUser);

        User testUser2 = User.builder()
                .userId("testUser2")
                .userEmail("test2@ssafy.com")
                .userPassword("unEncodedTestPassword")
                .userNickname("test2")
                .createdAt(LocalDateTime.now())
                .build();

        ChatMessage joinMessage2 = ChatMessage.builder().build();
        chatService.joinChat("testStudio", joinMessage2, testUser2);

        // 채팅방의 사용자 목록을 검색
        String key = RedisPrefix.STUDIO.prefix() + "testStudio";
        List<String> userList = redisListService.getList(key);

        // 사용자 목록에 추가한 사용자들이 모두 포함되어 있는지 확인
        assertTrue(userList.contains(testUser.getUserNickname()));
        assertTrue(userList.contains(testUser2.getUserNickname()));
    }
}