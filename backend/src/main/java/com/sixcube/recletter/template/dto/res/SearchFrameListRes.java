package com.sixcube.recletter.template.dto.res;

import com.sixcube.recletter.template.dto.Frame;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SearchFrameListRes {
    private List<Frame> frameTemplate;

    public SearchFrameListRes(List<Frame> frameTemplate) {
        this.frameTemplate = frameTemplate;
    }
}
