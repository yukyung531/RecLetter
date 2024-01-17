package com.sixcube.recletter.auth;

import com.sixcube.recletter.user.dto.User;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JwtToUserConverter implements Converter<Jwt, UsernamePasswordAuthenticationToken> {

    private final UserDetailsService userDetailsService;

    @Override
    public UsernamePasswordAuthenticationToken convert(Jwt jwt) {
        Map <String, Object> claims = jwt.getClaims();
        User user = (User) userDetailsService.loadUserByUsername((String) claims.get("userId"));
        return new UsernamePasswordAuthenticationToken(user, jwt, user.getAuthorities());
    }
}
