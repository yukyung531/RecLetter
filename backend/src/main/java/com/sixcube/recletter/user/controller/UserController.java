package com.sixcube.recletter.user.controller;

import com.sixcube.recletter.user.dto.req.CreateUserReq;
import com.sixcube.recletter.user.dto.req.ResetPasswordReq;
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

import java.net.URISyntaxException;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    //회원가입
    @PostMapping
    public ResponseEntity<Void> createUser(@Valid @RequestBody CreateUserReq createUserReq) {
        User result = userService.createUser(createUserReq);

        if (result == null) {
            return ResponseEntity.internalServerError().build();
        } else {
            return ResponseEntity.ok().build();
        }
    }

    @PutMapping
    public ResponseEntity<Void> updateUser(@RequestBody UpdateUserReq updateUserReq, @AuthenticationPrincipal User user) {
        userService.updateUser(updateUserReq, user);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updateUserPassword(@RequestBody UpdateUserPasswordReq updateUserPasswordReq, @AuthenticationPrincipal User user) {
        boolean passwordCorrect = userService.updateUserPassword(updateUserPasswordReq, user);
        if (passwordCorrect) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }

    @DeleteMapping
    public void deleteUser(@AuthenticationPrincipal User user) throws URISyntaxException {
        userService.deleteUser(user);
    }

    @GetMapping
    public ResponseEntity<SearchUserInfoRes> searchUserInfo(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok()
                .body(
                        SearchUserInfoRes.builder()
                                .userId(user.getUserId())
                                .userNickname(user.getUserNickname())
                                .userEmail(user.getUserEmail())
                                .userRole(user.getUserRole())
                                .build()
                );
    }

    @PostMapping("/password")
    public ResponseEntity<Void> resetPassword(@RequestBody ResetPasswordReq resetPasswordReq) {
        String password = resetPasswordReq.getNewPassword();
        String email = resetPasswordReq.getUserEmail();
        userService.resetPassword(password, email);

        return ResponseEntity.ok().build();

    }

}
