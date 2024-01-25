package com.sixcube.recletter.studio.exhandler;

import com.sixcube.recletter.studio.exception.StudioCreateFailureException;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice(basePackages = "com.sixcube.recletter.studio.controller")
public class StudioExceptionHandler {

  private final MessageSource messageSource;

  @ExceptionHandler(StudioNotFoundException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> studioNotFoundExceptionHandler(StudioNotFoundException e) {
    StackTraceElement[] stackTrace = e.getStackTrace();
    StringBuilder errorMessage = new StringBuilder();
    if (stackTrace.length > 0) {
      StackTraceElement topFrame = stackTrace[0];
      String className = topFrame.getClassName();
      String methodName = topFrame.getMethodName();

      errorMessage.append(className).append(".").append(methodName).append(": ");
    }

    errorMessage.append("스튜디오를 찾을 수 없습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(StudioCreateFailureException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> studioCreateFailureExceptionHandler(
      StudioCreateFailureException e) {
    StackTraceElement[] stackTrace = e.getStackTrace();
    StringBuilder errorMessage = new StringBuilder();
    if (stackTrace.length > 0) {
      StackTraceElement topFrame = stackTrace[0];
      String className = topFrame.getClassName();
      String methodName = topFrame.getMethodName();

      errorMessage.append(className).append(".").append(methodName).append(": ");
    }

    errorMessage.append("스튜디오 생성에 실패했습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }
}
