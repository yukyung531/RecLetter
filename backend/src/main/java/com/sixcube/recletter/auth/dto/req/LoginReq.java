package com.springtowinter.springboottemplate.auth.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginReq {

  @NotBlank
  private String userId;

  @NotBlank
  private String userPassword;
}
