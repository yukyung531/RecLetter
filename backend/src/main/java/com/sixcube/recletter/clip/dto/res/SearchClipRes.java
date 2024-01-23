package com.sixcube.recletter.clip.dto.res;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchClipRes {

    private Integer clipId;

    private String clipTitle;

    private String clipContent;

    private String clipDownloadUrl;
}
