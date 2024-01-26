package com.sixcube.recletter.user.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원 비밀번호 수정 시에 사용할 RequestBody
 */
@NoArgsConstructor
@Getter
public class UpdateUserPasswordReq {

    private String originalPassword;
    @NotBlank
    @Size(min = 8, max = 16)
    private String newPassword;
}