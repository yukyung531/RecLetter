package com.sixcube.recletter.clip.dto.req;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
public class UpdateClipReq {

    private String clipTitle;
    private String clipContent;
    private MultipartFile clip;
}
