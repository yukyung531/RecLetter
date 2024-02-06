package com.sixcube.recletter.studio.dto.req;

import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.studio.dto.LetterClipInfo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LetterVideoReq {

    String studioId;
    Integer studioFrameId;
    Integer studioBgmId;
    Integer studioVolume;
    Integer studioFontId;
    Integer studioFontSize;
    Boolean studioFontBold;
    List<LetterClipInfo> clipInfoList;

}
