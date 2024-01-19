package com.sixcube.recletter.user.controller;

import com.sixcube.recletter.user.dto.CreateUserReq;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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

  //회원가입
  @PostMapping
  public ResponseEntity<Void> createUser(@Valid @RequestBody CreateUserReq createUserReq) {
    log.debug("UserController.createUser: start");
    User result = userService.createUser(new User(createUserReq));

    if (result == null) {
      log.debug("UserController.createUser: end");
      return ResponseEntity.internalServerError().build();
    } else {
      log.debug("UserController.createUser: end");
      return ResponseEntity.ok().build();
    }
  }

}
