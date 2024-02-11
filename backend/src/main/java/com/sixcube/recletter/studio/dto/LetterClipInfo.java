package com.sixcube.recletter.studio.dto;

import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LetterClipInfo implements Serializable {
    private Integer clipId;
    private String clipTitle;
    private Integer clipVolume;
}
