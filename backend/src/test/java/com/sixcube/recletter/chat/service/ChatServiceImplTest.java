package com.sixcube.recletter.chat.service;

import com.sixcube.recletter.chat.dto.ChatMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ChatServiceImplTest {

    private ChatServiceImpl chatService;

    @BeforeEach
    void setUp() {
        chatService = new ChatServiceImpl(); // 직접 인스턴스 생성
    }

    @Test
    void joinChatTest() {
        ChatMessage chatMessage = ChatMessage.builder()
                .sender("user1")
                .build();

        ChatMessage result = chatService.joinChat("testStudio", chatMessage);
        assertEquals(chatMessage.getSender()+"님이 참여하였습니다.", result.getContent());
        // 채팅방에 사용자가 추가되었는지 검증
        List<String> users = chatService.searchChatUserList("testStudio");
        assertTrue(users.contains("user1"));
    }

    @Test
    void sendMessageTest() {
        ChatMessage chatMessage = ChatMessage.builder()
                .sender("user1")
                .content("Hello")
                .build();

        ChatMessage result = chatService.sendMessage("testStudio", chatMessage);
        assertEquals("Hello", result.getContent());
    }

    @Test
    void leaveChatTest() {
        // 먼저 사용자를 채팅방에 추가
        ChatMessage joinMessage = ChatMessage.builder()
                .sender("user1")
                .build();
        chatService.joinChat("testStudio", joinMessage);

        // 사용자를 채팅방에서 퇴장시킴
        ChatMessage leaveMessage = ChatMessage.builder()
                .sender("user1")
                .build();
        ChatMessage result = chatService.leaveChat("testStudio", leaveMessage);
        assertEquals("user1님이 퇴장하였습니다.", result.getContent());
        // 채팅방에서 사용자가 제거되었는지 검증
        List<String> users = chatService.searchChatUserList("testStudio");
        assertFalse(users.contains("user1"));
    }

    @Test
    void searchChatUserListTest() {
        // 먼저 사용자를 채팅방에 추가
        ChatMessage joinMessage1 = ChatMessage.builder()
                .sender("user1")
                .build();
        chatService.joinChat("testStudio", joinMessage1);

        ChatMessage joinMessage2 = ChatMessage.builder()
                .sender("user2")
                .build();
        chatService.joinChat("testStudio", joinMessage2);

        // 채팅방의 사용자 목록을 검색
        List<String> users = chatService.searchChatUserList("testStudio");

        // 사용자 목록에 추가한 사용자들이 모두 포함되어 있는지 확인
        assertTrue(users.contains("user1"));
        assertTrue(users.contains("user2"));
    }
}