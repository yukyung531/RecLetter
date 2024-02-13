package com.sixcube.recletter.studio.dto.res;

import com.sixcube.recletter.clip.dto.ClipInfo;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.sixcube.recletter.studio.dto.StudioStatus;
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
  private StudioStatus studioStatus;
  private String studioOwner;
  private LocalDateTime expireDate;
  private List<ClipInfo> clipInfoList;
  private Integer studioFrameId;
  private Integer studioBgmId;
  private Integer studioBgmVolume;
  private String studioStickerUrl;
}
