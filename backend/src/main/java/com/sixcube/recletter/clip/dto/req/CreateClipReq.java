package com.sixcube.recletter.clip.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
@NoArgsConstructor
@ToString
public class CreateClipReq {

    private String studioId;

    @NotBlank
//    @Pattern(regexp = "[^\\/:*?\"<>|]")
    private String clipTitle;
    private String clipContent;
    private MultipartFile clip;
}
