package com.sixcube.recletter.user.dto.res;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchUserInfoRes {

    private String userId;
    private String userNickname;
    private String userEmail;
    private String userRole;

}
