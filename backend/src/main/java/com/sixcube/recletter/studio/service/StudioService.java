package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.user.dto.User;
import java.util.List;

public interface StudioService {

  Studio searchStudioByStudioId(String studioId) throws StudioNotFoundException;

  List<Studio> searchAllStudioByStudioIdList(List<String> studioIdList);

  void createStudio(CreateStudioReq createStudioReq, User user);

  void deleteStudioByStudioId(String studioId);

  void updateStudioTitle(String studioId, String studioTitle);

  ClipInfo searchMainClipInfo(String studioId);

  Boolean hasMyClip(String studioId, String userId);

  List<ClipInfo> searchStudioClipInfoList(String studioId);
}
