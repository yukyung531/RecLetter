package com.sixcube.recletter.chat.exhandler;

public class ChatException extends RuntimeException {
    // 예외 메시지를 인자로 받아, 이를 부모 클래스인 RuntimeException의 생성자에 전달
    public ChatException(String message) {
        super(message);
    }
}
