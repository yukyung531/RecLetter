package com.springtowinter.springboottemplate.user.controller;

import com.springtowinter.springboottemplate.user.dto.RegistReq;
import com.springtowinter.springboottemplate.user.dto.User;
import com.springtowinter.springboottemplate.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

  private final UserService userService;

  @PostMapping
  public ResponseEntity<Void> regist(@Valid @RequestBody RegistReq registReq) {
    log.info(registReq.toString());
    User result = userService.createUser(new User(registReq));

    if (result == null) {
      return ResponseEntity.internalServerError().build();
    } else {
      return ResponseEntity.ok().build();
    }
  }

}
