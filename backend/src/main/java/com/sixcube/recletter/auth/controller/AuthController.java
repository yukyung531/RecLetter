package com.sixcube.recletter.auth.controller;

import com.sixcube.recletter.auth.TokenGenerator;
import com.sixcube.recletter.auth.dto.req.LoginReq;
import com.sixcube.recletter.auth.dto.req.TokenReq;
import com.sixcube.recletter.auth.dto.res.LoginRes;
import com.sixcube.recletter.auth.dto.Token;
import com.sixcube.recletter.auth.dto.res.TokenRes;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.dto.UserInfo;
import com.sixcube.recletter.user.service.UserService;

import java.util.concurrent.TimeUnit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final TokenGenerator tokenGenerator;
    private final DaoAuthenticationProvider daoAuthenticationProvider;
    private final RedisTemplate<String, Object> redisTemplate;

    @Qualifier("jwtRefreshTokenAuthProvider")
    private final JwtAuthenticationProvider refreshTokenAuthProvider;

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
        redisTemplate.opsForValue().set(userInfo.getUserId(), token.getRefreshToken());

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
    public ResponseEntity<Void> logout(@AuthenticationPrincipal User user) {
        redisTemplate.expire(user.getUserId(), 0, TimeUnit.SECONDS);
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
            ValueOperations<String, Object> values = redisTemplate.opsForValue();

            String refreshToken = "";
            if (values.get(userId) != null) {
                refreshToken = (String) values.get(userId);

                //refreshToken 같으면 token 재발급
                if (tokenReq.getRefreshToken().equals(refreshToken)) {
                    Token token = tokenGenerator.createToken((authentication));
                    log.debug("AuthController.tokenRegenerate: end");
                    return ResponseEntity.ok().body(new TokenRes(token));
                }
            }
        }
        log.debug("AuthController.tokenRegenerate: end");
        return ResponseEntity.badRequest().build(); //리프레시 토큰 만료 또는 불일치 하는 경우
    }
}