package com.sixcube.recletter.template.dto.res;

import com.sixcube.recletter.template.dto.Script;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class SearchScriptListRes {

    private List<Script> scriptTemplate;
    public SearchScriptListRes(List<Script> scriptTemplate) {
        this.scriptTemplate = scriptTemplate;
    }

}
