package com.sixcube.recletter.template.controller;

import com.sixcube.recletter.template.dto.BGM;
import com.sixcube.recletter.template.dto.Font;
import com.sixcube.recletter.template.dto.Frame;
import com.sixcube.recletter.template.dto.Script;
import com.sixcube.recletter.template.dto.res.SearchBGMListRes;
import com.sixcube.recletter.template.dto.res.SearchFontListRes;
import com.sixcube.recletter.template.dto.res.SearchFrameListRes;
import com.sixcube.recletter.template.dto.res.SearchScriptListRes;
import com.sixcube.recletter.template.service.TemplateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/template")
@RequiredArgsConstructor
public class TemplateController {

    private final TemplateService templateService;
    @GetMapping("/font")
    public ResponseEntity<SearchFontListRes> searchFontList() {
        List<Font> fontList= templateService.searchFontList();
        SearchFontListRes searchFontListRes=new SearchFontListRes(fontList);

        return ResponseEntity.ok(searchFontListRes);
    }

    @GetMapping("/frame")
    public ResponseEntity<SearchFrameListRes> searchFrameList() {
        List<Frame> frameList= templateService.searchFrameList();
        SearchFrameListRes searchFrameListRes=new SearchFrameListRes(frameList);

        return ResponseEntity.ok(searchFrameListRes);

    }

    @GetMapping("/bgm")
    public ResponseEntity<SearchBGMListRes> searchBGMList() {
        List<BGM> bgmList= templateService.searchBGMList();
        SearchBGMListRes searchBGMListRes=new SearchBGMListRes(bgmList);

        return ResponseEntity.ok(searchBGMListRes);
    }

    @GetMapping("/script")
    public ResponseEntity<SearchScriptListRes> searchScriptList() {
        List<Script> scriptList= templateService.searchScriptList();
        SearchScriptListRes searchScriptListRes=new SearchScriptListRes(scriptList);

        return ResponseEntity.ok(searchScriptListRes);

    }
}
