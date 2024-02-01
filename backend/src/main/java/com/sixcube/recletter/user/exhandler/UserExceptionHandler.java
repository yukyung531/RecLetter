package com.sixcube.recletter.user.exhandler;

import com.sixcube.recletter.user.exception.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice(basePackages = "com.sixcube.recletter.user.controller")
public class UserExceptionHandler {

  private void makeErrorMessage(StringBuilder errorMessage, Exception e) {
    StackTraceElement[] stackTrace = e.getStackTrace();

    if (stackTrace.length > 0) {
      StackTraceElement topFrame = stackTrace[0];
      String className = topFrame.getClassName();
      String methodName = topFrame.getMethodName();

      errorMessage.append(className).append(".").append(methodName).append(": ");
    }
  }

  @ExceptionHandler(EmailNotVerifiedException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> emailNotVerifiedExceptionHandler(EmailNotVerifiedException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("이메일 인증이 완료되지 않았습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(EmailAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> emailAlreadyExistsExceptionHandler(EmailAlreadyExistsException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("이미 존재하는 이메일입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(WrongPasswordException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> wrongPasswordExceptionHandler(WrongPasswordException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("기존 비밀번호를 잘못 입력하였습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(EmailNullException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> emailNullExceptionHandler(EmailNullException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("이메일을 입력하지 않았습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(NicknameNullException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> nicknameNullExceptionHandler(NicknameNullException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("이름을 입력하지 않았습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(UserNotExistException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> userNotExistExceptionHandler(UserNotExistException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("존재하지 않는 사용자입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }
}
