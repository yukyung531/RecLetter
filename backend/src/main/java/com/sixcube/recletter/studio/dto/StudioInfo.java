package com.sixcube.recletter.studio.dto;

import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudioInfo {
  private String studioId;
  private String studioTitle;
  private Boolean isStudioOwner;
  private StudioStatus studioStatus;
  private String thumbnailUrl;
  private LocalDateTime expireDate;
  private Boolean hasMyClip;
  private Integer videoCount;
  private Integer attendMember;
  private Integer studioFrameId;
  private String studioStickerUrl;
}
