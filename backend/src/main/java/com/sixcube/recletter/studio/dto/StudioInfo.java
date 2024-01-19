package com.sixcube.recletter.studio.dto;

import java.time.LocalDateTime;
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
  private Integer studioId;
  private String studioTitle;
  private Boolean isStudioOwner;
  private Boolean isCompleted;
  private String thumbnailUrl;
  private LocalDateTime expireDate;
  private Boolean isUpload;
}
