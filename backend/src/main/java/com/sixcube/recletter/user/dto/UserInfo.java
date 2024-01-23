package com.sixcube.recletter.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class UserInfo {

  private String userId;
  private String userNickname;

  public UserInfo(User user) {
    if(user != null) {
      this.userId = user.getUserId();
      this.userNickname = user.getUserNickname();
    }
  }
}
