package com.sixcube.recletter.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = {"com.sixcube.recletter.auth.controller"})
public class AuthExceptionHandler {
  @ExceptionHandler(InternalAuthenticationServiceException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> handleInternalAuthenticationServiceException(
      InternalAuthenticationServiceException e) {
    return new ResponseEntity<>("로그인 정보를 다시 확인하세요", HttpStatus.BAD_REQUEST);
  }

}
