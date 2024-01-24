//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

package com.sixcube.recletter.auth.jwt;

import com.sixcube.recletter.redis.RedisService;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.AccountExpiredException;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.jwt.BadJwtException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.server.resource.InvalidBearerTokenException;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.util.Assert;

public final class CustomJwtAuthenticationProvider implements AuthenticationProvider {
    private final Log logger = LogFactory.getLog(this.getClass());
    private final JwtDecoder jwtDecoder;
    private final RedisService redisService;
    private Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter = new JwtAuthenticationConverter();

    public CustomJwtAuthenticationProvider(JwtDecoder jwtDecoder, RedisService redisService) {
        this.redisService = redisService;

        Assert.notNull(jwtDecoder, "jwtDecoder cannot be null");
        this.jwtDecoder = jwtDecoder;
    }

    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        BearerTokenAuthenticationToken bearer = (BearerTokenAuthenticationToken) authentication;
        Jwt jwt = this.getJwt(bearer);

        AbstractAuthenticationToken token = this.jwtAuthenticationConverter.convert(jwt);
        if (token.getDetails() == null) {
            token.setDetails(bearer.getDetails());
        }
        //여기까지 오면 토큰은 유효

        //Token에서 id 추출해서 레디스 확인. refresh Token 없으면 막기
            Jwt jwtToken = (Jwt) authentication.getCredentials();
            String userId = jwtToken.getClaim("userId");
        System.out.println("유저아이디는 "+userId);

            if (Boolean.FALSE.equals(redisService.hasKey(userId))) {
                System.out.println("인증 실패!!!!!!!!!!!!!");
                throw new AccountExpiredException("인증 실패");
            }

        this.logger.debug("Authenticated token????");
        return token;
    }

    private Jwt getJwt(BearerTokenAuthenticationToken bearer) {
        try {
            return this.jwtDecoder.decode(bearer.getToken());
        } catch (BadJwtException var3) {
            this.logger.debug("Failed to authenticate since the JWT was invalid");
            throw new InvalidBearerTokenException(var3.getMessage(), var3);
        } catch (JwtException var4) {
            throw new AuthenticationServiceException(var4.getMessage(), var4);
        }
    }

    public boolean supports(Class<?> authentication) {
        return BearerTokenAuthenticationToken.class.isAssignableFrom(authentication);
    }

    public void setJwtAuthenticationConverter(Converter<Jwt, ? extends AbstractAuthenticationToken> jwtAuthenticationConverter) {
        Assert.notNull(jwtAuthenticationConverter, "jwtAuthenticationConverter cannot be null");
        this.jwtAuthenticationConverter = jwtAuthenticationConverter;
    }
}
