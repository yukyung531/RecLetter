package com.sixcube.recletter.clip.exhandler;

import com.sixcube.recletter.clip.exception.InvalidClipFormatException;
import com.sixcube.recletter.clip.exception.NotClipOwnerException;
import com.sixcube.recletter.clip.exception.SaveClipFailException;
import com.sixcube.recletter.clip.exception.WeirdClipUserException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.HandlerMethod;

import java.lang.reflect.Method;

@Slf4j
@RestControllerAdvice(basePackages = "com.sixcube.recletter.clip.controller")
public class ClipExceptioinHandler {

    public final String controllerName="ClipController";

    @ExceptionHandler(InvalidClipFormatException.class)
    public ResponseEntity<String> handleInvalidClipFormatException(HandlerMethod handlerMethod,Exception ex) {
        String methodName = handlerMethod.getMethod().getName();//.getDeclaringClass();
        StringBuilder errorMessage=new StringBuilder();
        errorMessage.append(controllerName).append(".").append(methodName).append(" : error - ")
                        .append(ex.getMessage());
        log.warn(errorMessage.toString());
//        log.debug("UserContoller.createUser : error - userPassword/비밀번호는 8자 이상, 16자 이하여야 합니다.");
        return ResponseEntity.badRequest().body("저장하려는 파일이 형식에 어긋납니다.");
    }
    @ExceptionHandler(SaveClipFailException.class)
    public ResponseEntity<String> handleSaveClipFailException(){

        return ResponseEntity.badRequest().body("영상 저장에 실패했습니다.");
    }
    @ExceptionHandler(WeirdClipUserException.class)
    public ResponseEntity<String> handleWeirdClipUserException(){

        return ResponseEntity.badRequest().body("본인이 참여 중인 스튜디오의 영상에만 접근 가능합니다.");
    }

    @ExceptionHandler(NotClipOwnerException.class)
    public ResponseEntity<String> handleNotClipOwnerException(){

        return ResponseEntity.badRequest().body("자신의 영상만 수정 가능합니다.");
    }
}
