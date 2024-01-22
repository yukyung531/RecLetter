package com.sixcube.recletter.auth;

import com.sixcube.recletter.user.dto.User;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

/*
 JWT에서 인증 토큰으로 변환하는 로직을 정의하는 클래스
 */
@Component //빈으로 등록해 SecurityConfig에서 주입될 수 있도록 한다.
@RequiredArgsConstructor
public class JwtToUserConverter implements Converter<Jwt, UsernamePasswordAuthenticationToken> {

    private final UserDetailsService userDetailsService;

    //JWT에서 인증 토큰으로 변환하는 메소드
    //UsernamePasswordAuthenticationToken: Authentication 의 하위 클래스
    @Override
    public UsernamePasswordAuthenticationToken convert(Jwt jwt) {
        Map <String, Object> claims = jwt.getClaims();
        User user = (User) userDetailsService.loadUserByUsername((String) claims.get("userId"));
        return new UsernamePasswordAuthenticationToken(user, jwt, user.getAuthorities()); //이 토큰은 인증 전 토큰!!
    }
}
