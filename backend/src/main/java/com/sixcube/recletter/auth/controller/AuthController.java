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
    log.debug("login call");

    Authentication authentication = daoAuthenticationProvider.authenticate(
        UsernamePasswordAuthenticationToken.unauthenticated(loginReq.getUserId(),
            loginReq.getUserPassword()));

    Token token = tokenGenerator.createToken((authentication));
    UserInfo userInfo = userService.searchUserInfoByUserId(loginReq.getUserId());

    // redis에 refreshToken 저장
    redisTemplate.opsForValue().set(userInfo.getUserId(), token.getRefreshToken());

    return ResponseEntity.ok()
        .body(
            LoginRes.builder()
                .userInfo(userInfo)
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

  @PostMapping("/token")
  public ResponseEntity<TokenRes> tokenRegenerate(@RequestBody TokenReq tokenReq) {
    Authentication authentication = refreshTokenAuthProvider.authenticate(new BearerTokenAuthenticationToken(tokenReq.getRefreshToken()));
    if(authentication.isAuthenticated()) {
      Jwt jwt = (Jwt) authentication.getCredentials();
      String userId = jwt.getClaim("userId");
      ValueOperations<String, Object> values = redisTemplate.opsForValue();

      String refreshToken = "";
      if(values.get(userId) != null) {
        refreshToken = (String) values.get(userId);

        if(tokenReq.getRefreshToken().equals(refreshToken)) {
          Token token = tokenGenerator.createToken((authentication));
          return ResponseEntity.ok().body(new TokenRes(token));
        }
      }
    }

    return ResponseEntity.badRequest().build();
  }
}