package com.sixcube.recletter.template.dto.res;

import com.sixcube.recletter.template.dto.BGM;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SearchBGMListRes {
    private List<BGM> bgmTemplate;

    public SearchBGMListRes(List<BGM> bgmTemplate) {
        this.bgmTemplate = bgmTemplate;
    }
}
