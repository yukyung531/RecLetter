package com.sixcube.recletter.clip.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@ToString
public class ClipInfo {

    private Integer clipId;

    private String clipTitle;

    private String clipOwner;

    private Integer clipOrder;

    private Integer clipVolume;

    private String clipContent;

    private String clipUrl;



}
