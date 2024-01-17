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
    if (!(getUserResult instanceof User)) {
      throw new BadCredentialsException(
          MessageFormat.format("principal {0} is not of User type",
              authentication.getPrincipal().getClass())
      );
    } else {
      user = (User) getUserResult;
    }

    Token tokenDTO = new Token();
    tokenDTO.setUserId(user.getUserId());
    tokenDTO.setAccessToken(createAccessToken(authentication));

    String refreshToken;
    if (authentication.getCredentials() instanceof Jwt) {
      Jwt jwt = (Jwt) authentication.getCredentials();
      Instant now = Instant.now();
      Instant expiresAt = jwt.getExpiresAt();
      Duration duration = Duration.between(now, expiresAt);
      long daysUntilExpired = duration.toDays();
      if (daysUntilExpired < 7) {
        refreshToken = createRefreshToken(authentication);
      } else {
        refreshToken = jwt.getTokenValue();
      }
    } else {
      refreshToken = createRefreshToken(authentication);
    }
    tokenDTO.setRefreshToken(refreshToken);

    return tokenDTO;
  }
}
