package com.sixcube.recletter.studio.dto.res;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class DownloadLetterRes {
    private String studioTitle;
    private String letterUrl;
}
