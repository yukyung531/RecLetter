package com.sixcube.recletter.user.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class ResetPasswordReq {

    private String userEmail;
    @NotBlank
    @Size(min = 8, max = 16)
    private String newPassword;
}