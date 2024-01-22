package com.sixcube.recletter.chat.exhandler;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * chat 관련 예외 처리 담당 클래스
 */
@ControllerAdvice(basePackages = "com.sixcube.recletter.chat.controller")
public class ChatControllerAdvice {
    /**
     * ChatException을 처리하는 메서드
     * @param e: 예외
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(ChatException.class)
    public String handleCustomException(ChatException e) {
        // 예외 객체에서 스택 트레이스 정보를 가져온다.
        StackTraceElement[] stackTrace = e.getStackTrace();
        // 스택 트레이스에 정보가 있다면
        if (stackTrace.length > 0) {
            // 스택 트레이스의 첫 번째 요소(예외가 발생한 위치) 가져옴
            StackTraceElement element = stackTrace[0];
            // 예외 정보 반환
            return element.getClassName() + "." + element.getMethodName() + " : error - " + e.getMessage();
        } else {
            // 스택 트레이스에 정보가 없다면, 위치를 알 수 없다는 메시지 반환
            return "Unknown location : error - " + e.getMessage();
        }
    }
}

