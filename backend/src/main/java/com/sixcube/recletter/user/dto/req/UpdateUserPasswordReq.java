package com.sixcube.recletter.user.dto.req;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원 비밀번호 수정 시에 사용할 RequestBody
 */
@NoArgsConstructor
@Getter
public class UpdateUserPasswordReq {

    private String originalPassword;
    private String newPassword;
}