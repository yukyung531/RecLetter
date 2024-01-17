package com.sixcube.recletter.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class RegistReq {

  @NotBlank
  @Size(min = 8, max = 16)
  private String userId;

  @NotBlank
  @Email
  private String userEmail;

  @NotBlank
  @Size(min = 8, max = 16)
  private String userPassword;

  @NotBlank
  @Size(min = 2, max = 16)
  private String userName;
}
