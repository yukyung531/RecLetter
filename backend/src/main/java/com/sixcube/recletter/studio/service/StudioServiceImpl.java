package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.clip.dto.Clip;
import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.clip.service.ClipService;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.studio.repository.StudioRepository;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional

public class StudioServiceImpl implements StudioService {

  private final StudioRepository studioRepository;

  private final ClipService clipService;

  @Override
  public Studio searchStudioByStudioId(String studioId) {
    return studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
  }

  @Override
  public List<Studio> searchAllStudioByStudioIdList(List<String> studioIdList) {
    return studioRepository.findByStudioIdIn(studioIdList);
  }

  @Override
  public void createStudio(Studio studio) {
    studioRepository.save(studio);
  }

  @Override
  public void deleteStudioByStudioId(String studioId) {
    studioRepository.deleteById(studioId);
  }

  @Override
  public void updateStudioTitle(String studioId, String studioTitle) {
    Studio studio = studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    studio.setStudioTitle(studioTitle);
  }

  @Override
  public ClipInfo searchMainClipInfo(String studioId) {
    List<ClipInfo> mainClip = clipService.searchClipInfoList(studioId);
    if(mainClip.isEmpty()) {
      return ClipInfo.builder().clipUrl("").build();
    } else {
      return mainClip.get(0);
    }
  }

  @Override
  public Boolean hasMyClip(String studioId, String userId) {
    List<ClipInfo> clipInfoList = clipService.searchClipInfoList(studioId);
    return clipInfoList.stream().anyMatch(clipInfo -> studioId.equals(clipInfo.getClipOwner()));
  }

}
