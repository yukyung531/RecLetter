package com.sixcube.recletter.studio.dto.req;

import com.sixcube.recletter.clip.dto.ClipInfo;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class LetterVideoReq {

    String studio_id;
    Integer studio_frame_id;
    Integer studio_bgm;
    Integer studio_volume;
    Integer studio_font;
    List<ClipInfo> clip_info_list;
    String studio_sticker_key;

}
