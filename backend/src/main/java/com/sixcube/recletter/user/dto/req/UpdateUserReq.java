package com.sixcube.recletter.user.dto.req;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원 정보 수정 시에 사용할 RequestBody
 */
@NoArgsConstructor
@Getter
public class UpdateUserReq {

    @NotBlank
    @Email
    private String userEmail;

    @NotBlank
    @Size(min = 2, max = 16)
    private String userNickname;
}