package com.sixcube.recletter.clip.dto.res;

import com.sixcube.recletter.clip.dto.ClipInfo;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SearchClipInfoListRes {
    List<ClipInfo> clipInfoList;
}
