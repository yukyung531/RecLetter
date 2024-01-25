package com.sixcube.recletter.template.service;

import com.sixcube.recletter.template.dto.BGM;
import com.sixcube.recletter.template.dto.Font;
import com.sixcube.recletter.template.dto.Frame;
import com.sixcube.recletter.template.dto.Script;
import com.sixcube.recletter.template.repository.BGMRepository;
import com.sixcube.recletter.template.repository.FontRepository;
import com.sixcube.recletter.template.repository.FrameRepository;
import com.sixcube.recletter.template.repository.ScriptRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TemplateServiceImpl implements TemplateService {

  private final FrameRepository frameRepository;
  private final BGMRepository bgmRepository;
  private final ScriptRepository scriptRepository;
  private final FontRepository fontRepository;

  @Override
  public List<Font> searchFontList() { return fontRepository.findAll(); }

  @Override
  public List<Frame> searchFrameList() {
    return frameRepository.findAll();
  }

  @Override
  public List<BGM> searchBGMList() {
    return bgmRepository.findAll();
  }

  @Override
  public List<Script> searchScriptList() {
    return scriptRepository.findAll();
  }

}
