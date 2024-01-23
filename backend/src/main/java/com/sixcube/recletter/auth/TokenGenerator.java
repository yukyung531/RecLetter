package com.sixcube.recletter.auth;

import com.sixcube.recletter.auth.dto.Token;
import com.sixcube.recletter.user.dto.User;

import java.text.MessageFormat;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Component;

@Component
public class TokenGenerator {

    @Autowired
    JwtEncoder accessTokenEncoder;

    @Autowired
    @Qualifier("jwtRefreshTokenEncoder")
    JwtEncoder refreshTokenEncoder;

    private String createAccessToken(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Instant now = Instant.now();

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer("SWT")
                .issuedAt(now)
                .expiresAt(now.plus(30, ChronoUnit.MINUTES))
                .claim("userId", user.getUserId())
                .build();

        return accessTokenEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
    }

    private String createRefreshToken(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Instant now = Instant.now();

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuer("SWT")
                .issuedAt(now)
                .expiresAt(now.plus(30, ChronoUnit.DAYS))
                .claim("userId", user.getUserId())
                .build();

        return refreshTokenEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
    }

    public Token createToken(Authentication authentication) {
        Object getUserResult = authentication.getPrincipal();
        User user = null;

        //인증되지 않은 사용자인 경우 토큰 발급 x
        if (!(getUserResult instanceof User)) {
            throw new BadCredentialsException(
                    MessageFormat.format("principal {0} is not of User type",
                            authentication.getPrincipal().getClass())
            );
        } else {
          //인증된 사용자인 경우 user에 저장
            user = (User) getUserResult;
        }

        //인증된 사용자인 경우 토큰 발급(인증되지 않았으면 위에서 예외 발생)
        Token tokenDTO = new Token();
        tokenDTO.setUserId(user.getUserId());

        //accessToken 발급
        tokenDTO.setAccessToken(createAccessToken(authentication));

        //refreshToken 발급
        String refreshToken;

        //accessToken이 만료돼서 refreshToken 발급하는 경우
        if (authentication.getCredentials() instanceof Jwt) {
            Jwt jwt = (Jwt) authentication.getCredentials();
            Instant now = Instant.now();
            Instant expiresAt = jwt.getExpiresAt();
            Duration duration = Duration.between(now, expiresAt);
            long daysUntilExpired = duration.toDays();
            //refreshToken 만료일자가 7일 미만으로 남은 경우 refreshToken도 재발급
            if (daysUntilExpired < 7) {
                refreshToken = createRefreshToken(authentication);
            }
            //refreshToken 만료일자가 7일 이상 남은 경우 기존 refreshToken 유지
            else {
                refreshToken = jwt.getTokenValue();
            }
        }

        //로그인할 때 refreshToken 발급하는 경우
        else {
            refreshToken = createRefreshToken(authentication);
        }
        tokenDTO.setRefreshToken(refreshToken);

        return tokenDTO;
    }
}
