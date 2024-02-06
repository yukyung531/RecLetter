package com.sixcube.recletter.common.exhandler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RequiredArgsConstructor
@RestControllerAdvice(basePackages = "com.sixcube.recletter")
public class ValidationExceptionHandler {

  private final MessageSource messageSource;

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  protected ResponseEntity<String> handleConstraintViolationException(
      MethodArgumentNotValidException ex) {
    BindingResult bindingResult = ex.getBindingResult();
    StringBuilder errorMessage = new StringBuilder(bindingResult.getObjectName() + " : ");

    for (FieldError fieldError : bindingResult.getFieldErrors()) {
      errorMessage
          //.append(fieldError.getField())
          //.append(" ")
          .append(messageSource.getMessage(fieldError, LocaleContextHolder.getLocale()))
          //.append(fieldError.getCode())
          .append(", ");
    }

    // Remove the trailing comma and space
    errorMessage.delete(errorMessage.length() - 2, errorMessage.length());

    log.info(errorMessage.toString());
    return ResponseEntity.badRequest().body(errorMessage.toString());
  }
}
