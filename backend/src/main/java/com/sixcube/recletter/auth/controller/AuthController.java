package com.sixcube.recletter.auth.controller;

import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.auth.jwt.CustomJwtAuthenticationProvider;
import com.sixcube.recletter.auth.jwt.TokenGenerator;
import com.sixcube.recletter.auth.dto.req.LoginReq;
import com.sixcube.recletter.auth.dto.req.SendCodeToEmailReq;
import com.sixcube.recletter.auth.dto.req.TokenReq;
import com.sixcube.recletter.auth.dto.req.VerifyCodeReq;
import com.sixcube.recletter.auth.dto.res.LoginRes;
import com.sixcube.recletter.auth.dto.Token;
import com.sixcube.recletter.auth.dto.res.TokenRes;
import com.sixcube.recletter.auth.service.AuthService;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.dto.UserInfo;
import com.sixcube.recletter.user.dto.res.CheckDuplicatedIdRes;
import com.sixcube.recletter.user.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final AuthService authService;
    private final TokenGenerator tokenGenerator;
    private final DaoAuthenticationProvider daoAuthenticationProvider;
    private final RedisService redisService;

    @Qualifier("jwtRefreshTokenAuthProvider")
    private final CustomJwtAuthenticationProvider refreshTokenAuthProvider;

    @PostMapping("/login")
    public ResponseEntity<LoginRes> login(@RequestBody LoginReq loginReq) {
        log.debug("AuthController.login: start");

        //인증 완료된 객체를 최종적으로 저장
        Authentication authentication = daoAuthenticationProvider.authenticate(
                UsernamePasswordAuthenticationToken.unauthenticated(loginReq.getUserId(),
                        loginReq.getUserPassword()));

        //인증 완료된 친구들만 토큰 발급
        //principle과 credential을 보고 id 비번이면 새로 토큰 만들고
        //만약 토큰이 들어 있으면 토큰 정보를 통해서 토큰을 재발급
        Token token = tokenGenerator.createToken((authentication));
        UserInfo userInfo = userService.searchUserInfoByUserId(loginReq.getUserId());

        // redis에 refreshToken 저장
        redisService.setValues(userInfo.getUserId(), token.getRefreshToken());

        log.debug("AuthController.login: end");

        return ResponseEntity.ok()
                .body(
                        LoginRes.builder()
                                .accessToken(token.getAccessToken())
                                .refreshToken(token.getRefreshToken())
                                .build()
                );
    }

    @GetMapping("/logout")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal User user) {
        redisService.deleteValues(user.getUserId());
        return ResponseEntity.ok().build();
    }


    //여기에 왔다는 거 자체가 accessToken 토큰이 만료된 것임....
    @PostMapping("/token")
    public ResponseEntity<TokenRes> tokenRegenerate(@RequestBody TokenReq tokenReq) {
        log.debug("AuthController.tokenRegenerate: start");
        Authentication authentication = refreshTokenAuthProvider.authenticate(new BearerTokenAuthenticationToken(tokenReq.getRefreshToken()));
        if (authentication.isAuthenticated()) {
            Jwt jwt = (Jwt) authentication.getCredentials();
            String userId = jwt.getClaim("userId");

            String refreshToken = (String) redisService.getValues(userId);

            //refreshToken 같으면 token 재발급
            if (tokenReq.getRefreshToken().equals(refreshToken)) {
                Token token = tokenGenerator.createToken((authentication));
                log.debug("AuthController.tokenRegenerate: end");
                return ResponseEntity.ok().body(new TokenRes(token));
            }
        }
        log.debug("AuthController.tokenRegenerate: end");
        return ResponseEntity.badRequest().build(); //리프레시 토큰 만료 또는 불일치 하는 경우
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<CheckDuplicatedIdRes> checkDuplicatiedId(@PathVariable("userId") String userId) {
        log.debug("AuthController.checkDuplicatiedId: start");
        boolean isDuplicated = userService.checkDuplicatiedId(userId);
        CheckDuplicatedIdRes checkDuplicatedIdRes = new CheckDuplicatedIdRes();
        checkDuplicatedIdRes.setDuplicated(isDuplicated);
        log.debug("AuthController.checkDuplicatiedId: end");
        return ResponseEntity.ok().body(checkDuplicatedIdRes);
    }


    //이메일 인증 요청
    @PostMapping("/email")
    public ResponseEntity<Void> sendCodeToEmail(@Valid @RequestBody SendCodeToEmailReq sendCodeToEmailReq) throws Exception {
        log.debug("AuthController.sendCodeToEmail: start");
        authService.sendCodeToEmail(sendCodeToEmailReq.getUserEmail());
        log.debug("AuthController.sendCodeToEmail: end");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/email/code")
    public boolean verifyCode(@Valid @RequestBody VerifyCodeReq verifyCodeReq) {
        log.debug("AuthController.verifyCode: start");
        boolean result = authService.verifyCode(verifyCodeReq.getUserEmail(), verifyCodeReq.getCode());
        log.debug("AuthController.verifyCode: end");
        return result;

    }
}