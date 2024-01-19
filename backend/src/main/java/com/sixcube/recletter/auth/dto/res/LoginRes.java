package com.sixcube.recletter.auth.dto.res;

import com.sixcube.recletter.user.dto.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginRes {

  private UserInfo userInfo;
  private String accessToken;
  private String refreshToken;
}