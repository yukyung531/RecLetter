package com.sixcube.recletter.auth.dto.res;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenRes {

  private String accessToken;
  private String refreshToken;
}
