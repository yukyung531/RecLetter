package com.sixcube.recletter.auth.dto.res;

import com.sixcube.recletter.user.dto.UserInfo;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CheckDuplicatedIdRes {
    private Boolean isDuplicated;

}
