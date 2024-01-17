package com.sixcube.recletter.auth.dto.res;

import com.sixcube.recletter.auth.dto.Token;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
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
