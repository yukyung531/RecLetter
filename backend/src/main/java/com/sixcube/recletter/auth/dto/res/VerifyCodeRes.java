package com.sixcube.recletter.auth.dto.res;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerifyCodeRes {
    private Boolean isValid;

}
