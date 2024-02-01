package com.sixcube.recletter.meeting.exhandler;

import com.sixcube.recletter.meeting.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "com.sixcube.recletter.meeting.controller")
public class MeetingExceptionHandler {
    private void makeErrorMessage(StringBuilder errorMessage, Exception e) {
        // 예외 객체에서 스택 트레이스 정보를 가져온다.
        StackTraceElement[] stackTrace = e.getStackTrace();

        if (stackTrace.length > 0) {
            // 스택 트레이스의 첫 번째 요소(예외가 발생한 위치) 가져옴
            StackTraceElement topFrame = stackTrace[0];
            // 예외가 발생한 클래스의 이름을 가져옴.
            String className = topFrame.getClassName();
            // 예외가 발생한 메서드의 이름을 가져옴.
            String methodName = topFrame.getMethodName();

            errorMessage.append(className).append(".").append(methodName).append(": ");
        }
    }
    @ExceptionHandler(MaxMeetingParticipantException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<String> maxMeetingParticipantExceptionHandler(MaxMeetingParticipantException e){
        StringBuilder errorMessage = new StringBuilder();

        makeErrorMessage(errorMessage, e);

        errorMessage.append("최대 참여자 수를 초과했습니다.");
        return ResponseEntity.badRequest().body(errorMessage.toString());
    }

    @ExceptionHandler(MeetingInitializeSessionFailureException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<String> meetingInitializeSessionFailureExceptionHandler(MeetingInitializeSessionFailureException e){
        StringBuilder errorMessage = new StringBuilder();

        makeErrorMessage(errorMessage, e);

        errorMessage.append("세션 생성에 실패했습니다.");
        return ResponseEntity.badRequest().body(errorMessage.toString());
    }

    @ExceptionHandler(MeetingCreateConnectionFailureException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<String> meetingCreateConnectionFailureExceptionHandler(MeetingCreateConnectionFailureException e){
        StringBuilder errorMessage = new StringBuilder();

        makeErrorMessage(errorMessage, e);

        errorMessage.append("세션 연결에 실패했습니다.");
        return ResponseEntity.badRequest().body(errorMessage.toString());
    }

    @ExceptionHandler(MeetingDeleteSessionFailureException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<String> meetingDeleteSessionFailureExceptionHandler(MeetingDeleteSessionFailureException e){
        StringBuilder errorMessage = new StringBuilder();

        makeErrorMessage(errorMessage, e);

        errorMessage.append("세션 종료에 실패했습니다.");
        return ResponseEntity.badRequest().body(errorMessage.toString());
    }

    @ExceptionHandler(MeetingCheckSessionFailureException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<String> MeetingCheckSessionFailureExceptionHandler(MeetingCheckSessionFailureException e){
        StringBuilder errorMessage = new StringBuilder();

        makeErrorMessage(errorMessage, e);

        errorMessage.append("해당 세션 정보 가져오기를 실패했습니다.");
        return ResponseEntity.badRequest().body(errorMessage.toString());
    }
}
