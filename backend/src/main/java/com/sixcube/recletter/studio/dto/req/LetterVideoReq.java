package com.sixcube.recletter.studio.dto.req;

import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.studio.dto.LetterClipInfo;
import lombok.*;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LetterVideoReq implements Serializable {

    String studioId;
    Integer studioFrameId;
    Integer studioBgmId;
    Integer studioBgmVolume;
    String studioSticker;
    List<LetterClipInfo> clipInfoList;

}
