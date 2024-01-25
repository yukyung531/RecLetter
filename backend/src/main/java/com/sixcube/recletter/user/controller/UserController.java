package com.sixcube.recletter.user.controller;

import com.sixcube.recletter.user.dto.UserInfo;
import com.sixcube.recletter.user.dto.req.CreateUserReq;
import com.sixcube.recletter.user.dto.req.UpdateUserPasswordReq;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.dto.req.UpdateUserReq;
import com.sixcube.recletter.user.dto.res.SearchUserInfoRes;
import com.sixcube.recletter.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    //회원가입
    @PostMapping
    public ResponseEntity<Void> createUser(@Valid @RequestBody CreateUserReq createUserReq) throws Exception {
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

    @PutMapping
    public ResponseEntity<Void> updateUser(@RequestBody UpdateUserReq updateUserReq, @AuthenticationPrincipal User user) {
        log.debug("UserController.updateUser: start");
        userService.updateUser(updateUserReq, user);

        log.debug("UserController.updateUser: end");
        return ResponseEntity.ok().build();
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updateUserPassword(@RequestBody UpdateUserPasswordReq updateUserPasswordReq, @AuthenticationPrincipal User user) {
        log.debug("UserController.updateUserPassword: start");
        boolean passwordCorrect = userService.updateUserPassword(updateUserPasswordReq, user);
        log.debug("UserController.updateUserPassword: end");
        if(passwordCorrect){
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteUser(@AuthenticationPrincipal User user) {
        log.debug("UserController.deleteUser: start");
        userService.deleteUser(user);
        log.debug("UserController.deleteUser: end");
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<SearchUserInfoRes> searchUserInfo(@AuthenticationPrincipal User user) {
        log.debug("UserController.searchUserInfo: start");
        UserInfo userInfo = new UserInfo(user);
        log.debug("UserController.searchUserInfo: end");

        return ResponseEntity.ok()
                .body(
                        SearchUserInfoRes.builder()
                                .userInfo(userInfo)
                                .build()
                );
    }
}
