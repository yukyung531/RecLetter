package com.sixcube.recletter.template.dto.res;

import com.sixcube.recletter.template.dto.Font;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SearchFontListRes {
    private List<Font> fontTemplate;

    public SearchFontListRes(List<Font> fontTemplate) {
        this.fontTemplate=fontTemplate;
    }
}
