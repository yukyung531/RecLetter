package com.sixcube.recletter.auth.controller;

import com.sixcube.recletter.auth.dto.res.VerifyCodeRes;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.redis.RedisService;
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
import com.sixcube.recletter.auth.dto.res.CheckDuplicatedIdRes;
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
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
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
    private final JwtAuthenticationProvider refreshTokenAuthProvider;

    private final String REGIST = "REGIST";
    private final String RESET_PASSWORD = "RESET_PASSWORD";

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
        String key = RedisPrefix.REFRESH_TOKEN.prefix() + userInfo.getUserId();
        redisService.setValues(key, token.getRefreshToken());


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
        String key = RedisPrefix.REFRESH_TOKEN.prefix() + user.getUserId();
        redisService.deleteValues(key);
        return ResponseEntity.ok().build();
    }


    @PostMapping("/token")
    public ResponseEntity<TokenRes> tokenRegenerate(@RequestBody TokenReq tokenReq) {

        Authentication authentication = refreshTokenAuthProvider.authenticate(new BearerTokenAuthenticationToken(tokenReq.getRefreshToken()));
        if (authentication.isAuthenticated()) {
            Jwt jwt = (Jwt) authentication.getCredentials();
            String userId = jwt.getClaim("userId");
            String key = RedisPrefix.REFRESH_TOKEN.prefix() + userId;
            String refreshToken = (String) redisService.getValues(key);

            //refreshToken 같으면 token 재발급
            if (tokenReq.getRefreshToken().equals(refreshToken)) {
                Token token = tokenGenerator.createToken((authentication));

                return ResponseEntity.ok().body(new TokenRes(token));
            }
        }

        return ResponseEntity.badRequest().build(); //리프레시 토큰 만료 또는 불일치 하는 경우
    }

    @GetMapping("/id/{userId}")
    public ResponseEntity<CheckDuplicatedIdRes> checkDuplicatiedId(@PathVariable("userId") String userId) {

        boolean isDuplicated = userService.checkDuplicatiedId(userId);
        CheckDuplicatedIdRes checkDuplicatedIdRes = new CheckDuplicatedIdRes();
        checkDuplicatedIdRes.setIsDuplicated(isDuplicated);

        return ResponseEntity.ok().body(checkDuplicatedIdRes);
    }


    //이메일 발송 요청(회원가입)
    @PostMapping("/email")
    public ResponseEntity<Void> sendEmailToRegister(@Valid @RequestBody SendCodeToEmailReq sendCodeToEmailReq) throws Exception {

        authService.sendEmail(sendCodeToEmailReq.getUserEmail(), REGIST);

        return ResponseEntity.ok().build();
    }

    //인증코드 검증(회원가입)
    @PostMapping("/email/code")
    public ResponseEntity<VerifyCodeRes> verifyCodeToRegister(@Valid @RequestBody VerifyCodeReq verifyCodeReq) {

        boolean isValid = authService.verifyCode(verifyCodeReq.getUserEmail(), verifyCodeReq.getCode(), REGIST);

        VerifyCodeRes verifyCodeRes = new VerifyCodeRes();
        verifyCodeRes.setIsValid(isValid);

        return ResponseEntity.ok().body(verifyCodeRes);

    }

    //이메일 발송 요청(비밀번호 초기화)
    @PostMapping("/password")
    public ResponseEntity<Void> sendEmailToResetPassword(@Valid @RequestBody SendCodeToEmailReq sendCodeToEmailReq) throws Exception {

        authService.sendEmail(sendCodeToEmailReq.getUserEmail(), RESET_PASSWORD);

        return ResponseEntity.ok().build();
    }

    //인증코드 검증(비밀번호 초기화)
    @PostMapping("/password/code")
    public ResponseEntity<VerifyCodeRes> verifyCodeToResetPassword(@Valid @RequestBody VerifyCodeReq verifyCodeReq) {

        boolean isValid = authService.verifyCode(verifyCodeReq.getUserEmail(), verifyCodeReq.getCode(), RESET_PASSWORD);

        VerifyCodeRes verifyCodeRes = new VerifyCodeRes();
        verifyCodeRes.setIsValid(isValid);

        return ResponseEntity.ok().body(verifyCodeRes);
    }
}