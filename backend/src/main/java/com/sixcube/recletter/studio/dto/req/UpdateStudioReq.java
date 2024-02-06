package com.sixcube.recletter.studio.dto.req;

import com.sixcube.recletter.studio.dto.UsedClipInfo;
import java.util.List;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class UpdateStudioReq {

  private String studioId;
  private List<UsedClipInfo> usedClipList;
  private List<Integer> unusedClipList;
  private String usedClipList2;
  private String unusedClipList2;
  private Integer studioFrameId;
  private Integer studioFontId;
  private Integer studioFontSize;
  private Boolean studioFontBold;
  private Integer studioBgmId;
  private Integer studioVolume;
  private MultipartFile studioSticker;
}
