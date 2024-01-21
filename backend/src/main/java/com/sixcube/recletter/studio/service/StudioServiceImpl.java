package com.sixcube.recletter.studio.service;

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

}
