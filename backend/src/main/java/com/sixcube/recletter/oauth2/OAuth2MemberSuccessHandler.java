package com.sixcube.recletter.oauth2;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixcube.recletter.auth.dto.res.LoginRes;
import com.sixcube.recletter.auth.jwt.JWTUtil;
import com.sixcube.recletter.oauth2.dto.CustomOAuth2User;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;


import java.io.IOException;
import java.net.URI;

@RequiredArgsConstructor
@Slf4j
public class OAuth2MemberSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final JWTUtil jwtUtil;
    private final RedisService redisService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException, IOException {

        // 사용자 정보 가져오기
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String userEmail = oAuth2User.getUserEmail();
        User user = userRepository.findByUserEmailAndDeletedAtIsNull(userEmail).get();

        //accessToken 생성
        String accessToken = jwtUtil.createJwt(user.getUserId(), user.getUserRole(), 1000 * 60 * 60L);

        //refreshToken 생성
        String refreshToken = jwtUtil.createJwt(user.getUserId(), user.getUserRole(), 1000 * 60 * 60 * 24 * 14L);

        //Redis에 refreshToken 저장
        String key = RedisPrefix.REFRESH_TOKEN.prefix() + user.getUserId();
        redisService.setValues(key, refreshToken);


        //response에 토큰 담아서 반환
        ObjectMapper objectMapper = new ObjectMapper();
        // content -type
        response.setContentType("application/json");
        response.setCharacterEncoding("utf-8");

        LoginRes loginRes = new LoginRes();
        loginRes.setAccessToken(accessToken);
        loginRes.setRefreshToken(refreshToken);

        // JSON 형태로 변환하기
        // {"accessToken" : "12344", "refreshToken" : "dasgfdsa"}
        String result = objectMapper.writeValueAsString(loginRes);

        response.getWriter().write(result);

    }


}

