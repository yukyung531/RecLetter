package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.studio.dto.Studio;
import java.util.List;
import java.util.UUID;

public interface StudioService {
  Studio searchStudioByStudioId(String studioId);

  List<Studio> searchAllStudioByStudioIdList(List<String> studioIdList);

  void createStudio(Studio studio);

  void deleteStudioByStudioId(String studioId);

  void updateStudioTitle(String studioId, String studioTitle);
}
