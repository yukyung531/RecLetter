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
  private Integer studioFrameId;
  private Integer studioBgmId;
  private Integer studioBgmVolume;
  private MultipartFile studioSticker;
}
