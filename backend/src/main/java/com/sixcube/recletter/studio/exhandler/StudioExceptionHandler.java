package com.sixcube.recletter.studio.exhandler;

import com.sixcube.recletter.studio.exception.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice(basePackages = "com.sixcube.recletter.studio.controller")
public class StudioExceptionHandler {

  private void makeErrorMessage(StringBuilder errorMessage, Exception e) {
    StackTraceElement[] stackTrace = e.getStackTrace();

    if (stackTrace.length > 0) {
      StackTraceElement topFrame = stackTrace[0];
      String className = topFrame.getClassName();
      String methodName = topFrame.getMethodName();

      errorMessage.append(className).append(".").append(methodName).append(": ");
    }
  }

  @ExceptionHandler(StudioNotFoundException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> studioNotFoundExceptionHandler(StudioNotFoundException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("스튜디오를 찾을 수 없습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(StudioCreateFailureException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> studioCreateFailureExceptionHandler(
      StudioCreateFailureException e) {
    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("스튜디오 생성에 실패했습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(MaxStudioOwnCountExceedException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> maxStudioOwnCountExceedExceptionHandler(
      MaxStudioOwnCountExceedException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("최대 생성 가능 스튜디오 수를 초과했습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(StudioDeleteFailureException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> studioDeleteFailureExceptionHandler(
      StudioDeleteFailureException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("스튜디오를 삭제하는데 실패했습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(UnauthorizedToDeleteStudioException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> unauthorizedToDeleteStudioExceptionHandler(
      UnauthorizedToDeleteStudioException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("스튜디오를 삭제할 권한이 없습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(UnauthorizedToSearchStudioException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> unauthorizedToSearchStudioExceptionHandler(
      UnauthorizedToSearchStudioException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("스튜디오 상세정보를 검색할 권한이 없습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(UnauthorizedToUpdateStudioException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> unauthorizedToUpdateStudioExceptionHandler(
      UnauthorizedToUpdateStudioException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("스튜디오를 수정할 권한이 없습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(AlreadyJoinedStudioException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> alreadyJoinedStudioExceptionHandler(
      AlreadyJoinedStudioException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("이미 참여중인 스튜디오입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(ExpiredStudioException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> expiredStudioExceptionHandler(
          ExpiredStudioException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("편집기한이 만료된 스튜디오입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(StudioParticipantNotFound.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> studioParticipantNotFoundExceptionHandler(
      StudioParticipantNotFound e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("이미 참여중인 스튜디오 정보를 찾을 수 없습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(StudioParticipantCreateFailureException.class)
  protected ResponseEntity<String> studioParticipantCreateFailureExceptionHandler(
          StudioParticipantCreateFailureException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("스튜디오 참가에 실패했습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(UnauthorizedToCompleteStudioException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> unauthorizedToCompleteStudioExceptionHandler(
          UnauthorizedToCompleteStudioException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("영상편지를 완성할 권한이 없습니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(InvalidStudioStickerFormatException.class)
  protected ResponseEntity<String> invalidStudioStickerFormatExceptionHandler(
          InvalidStudioStickerFormatException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("올바르지 않은 형식의 파일입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  @ExceptionHandler(AlreadyCompletingStudioStatusException.class)
  protected ResponseEntity<String> alreadyCompletingStudioStatusExceptionHandler(
          AlreadyCompletingStudioStatusException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("이미 완성 요청된 스튜디오입니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

  //TODO- 따로 빼서 전반적으로 적용시켜둬야 할듯? - clip, chat에도 사용 중
  @ExceptionHandler(UserNotInStudioException.class)
  protected ResponseEntity<String> userNotInStudioExceptionHandler(
          UnauthorizedToUpdateStudioException e) {

    StringBuilder errorMessage = new StringBuilder();

    makeErrorMessage(errorMessage, e);

    errorMessage.append("스튜디오에 참여중인 사용자가 아닙니다.");
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }

}
