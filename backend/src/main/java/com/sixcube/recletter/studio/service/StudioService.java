package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.studio.dto.Studio;
import java.util.List;
import java.util.UUID;

public interface StudioService {
  Studio searchStudioByStudioId(UUID studioId);

  List<Studio> searchAllStudioByStudioIdList(List<UUID> studioIdList);

  void createStudio(Studio studio);

  void deleteStudioByStudioId(UUID studioId);

  void updateStudioTitle(Studio studio);
}
