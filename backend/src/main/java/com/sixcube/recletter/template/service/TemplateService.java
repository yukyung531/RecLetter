package com.sixcube.recletter.template.service;

import com.sixcube.recletter.template.dto.BGM;
import com.sixcube.recletter.template.dto.Font;
import com.sixcube.recletter.template.dto.Frame;
import com.sixcube.recletter.template.dto.Script;

import java.util.List;

public interface TemplateService {

    public List<Font> searchFontList();

    public List<Frame> searchFrameList();


    public List<BGM> searchBGMList();

    public List<Script> searchScriptList();
}
