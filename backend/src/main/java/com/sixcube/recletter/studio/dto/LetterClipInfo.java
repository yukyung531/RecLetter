package com.sixcube.recletter.studio.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LetterClipInfo {
    private Integer clipId;
    private String clipTitle;
    private Integer clipVolume;
}
