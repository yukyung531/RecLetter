package com.sixcube.recletter.studio.dto.req;

import com.sixcube.recletter.studio.dto.UsedClipInfo;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateStudioReq {

  private String studioId;
  private List<UsedClipInfo> usedClipList;
  private List<Integer> unsuedClipList;
  private Integer studioFrameId;
  private Integer studioFontId;
  private Integer studioFontSize;
  private Boolean studioFontBold;
  private Integer studioBgmId;
  private Integer studioVolume;
  private MultipartFile studioSticker;
}
