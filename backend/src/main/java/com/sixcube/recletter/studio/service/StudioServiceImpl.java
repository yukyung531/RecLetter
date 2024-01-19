package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.studio.repository.StudioRepository;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudioServiceImpl implements StudioService {

  private final StudioRepository studioRepository;

  @Override
  public Studio searchStudioByStudioId(UUID studioId) {
    return studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
  }

  @Override
  public List<Studio> searchAllStudioByStudioIdList(List<UUID> studioIdList) {
    return studioRepository.findByStudioIdIn(studioIdList);
  }

  @Override
  public void createStudio(Studio studio) {
    studioRepository.save(studio);
  }

  @Override
  public void deleteStudioByStudioId(UUID studioId) {
    studioRepository.deleteById(studioId);
  }
}