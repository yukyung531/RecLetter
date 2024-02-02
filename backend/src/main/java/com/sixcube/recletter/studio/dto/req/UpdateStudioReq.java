package com.sixcube.recletter.studio.dto.req;

import com.sixcube.recletter.studio.dto.UsedClipInfo;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStudioReq {

  private String studioId;
  private List<UsedClipInfo> usedClipList;
  private List<String> unsuedClipList;
  private Integer studioFrameId;
  private Integer studioFontId;
  private Integer studioFontSize;
  private Integer studioFontBold;
  private Integer studioBgmId;
  private Integer studioVolume;
}
