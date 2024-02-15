package com.sixcube.recletter.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sixcube.recletter.auth.dto.req.LoginReq;
import com.sixcube.recletter.auth.dto.res.LoginRes;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.user.dto.User;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Iterator;

@Slf4j
@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JWTUtil jwtUtil;
    private final RedisService redisService;


    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        LoginReq loginReq;

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ServletInputStream inputStream = request.getInputStream();
            String messageBody = StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            loginReq = objectMapper.readValue(messageBody, LoginReq.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        String userEmail = loginReq.getUserEmail();
        String userPassword = loginReq.getUserPassword();

        //스프링 시큐리티에서 username과 password를 검증하기 위해서는 token에 담아야 함
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userEmail, userPassword, null);
        //token에 담은 검증을 위한 AuthenticationManager로 전달
        return authenticationManager.authenticate(authToken);
    }

    //로그인 성공시 실행하는 메소드 (여기서 JWT를 발급하면 됨)
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        //user 객체를 알아내기 위해
        User user = (User) authentication.getPrincipal();

        //userId 추출
        String useruuid = user.getUserId();

        //role 추출
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        //jwt 토큰 생성
        //accessToken 생성
        String accessToken = jwtUtil.createJwt(useruuid, role, 1000 * 60 * 60L);

        //refreshToken 생성
        String refreshToken = jwtUtil.createJwt(useruuid, role, 1000 * 60 * 60 * 24 * 14L);

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

        log.debug("LoginFilter: login success");
    }

    //로그인 실패시 실행하는 메소드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws ServletException, IOException {
        response.setStatus(400);
        log.debug("LoginFilter: login fail");
    }
}