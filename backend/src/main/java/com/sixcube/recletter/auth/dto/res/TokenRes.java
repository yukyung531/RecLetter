package com.sixcube.recletter.auth.dto.res;

import com.sixcube.recletter.auth.dto.Token;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenRes {

  private String accessToken;
  private String refreshToken;

  public TokenRes(Token token) {
    this.accessToken = token.getAccessToken();
    this.refreshToken = token.getRefreshToken();
  }
}
