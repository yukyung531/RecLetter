package com.sixcube.recletter.user.dto.req;

import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 회원 정보 수정 시에 사용할 RequestBody
 */
@NoArgsConstructor
@Getter
public class UpdateUserReq {

    private String userEmail;
    private String userNickname;
}