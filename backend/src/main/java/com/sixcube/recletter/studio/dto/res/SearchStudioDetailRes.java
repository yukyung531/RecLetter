package com.sixcube.recletter.studio.dto.res;

import java.util.List;
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
public class SearchStudioDetailRes {
  private String studioId;
  private String studioTitle;
  private Boolean isCompleted;
  private String studioOwner;
//  private List<ClipInfo> clipInfoList;
  private Integer studioFrameId;
  private Integer studioFontId;
  private Integer studioBgmId;
}
