package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.exception.MaxStudioOwnCountExceedException;
import com.sixcube.recletter.studio.exception.StudioCreateFailureException;
import com.sixcube.recletter.studio.exception.StudioDeleteFailureException;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.studio.exception.UnauthorizedToDeleteStudioException;
import com.sixcube.recletter.studio.exception.UnauthorizedToSearchStudioException;
import com.sixcube.recletter.user.dto.User;
import java.util.List;

public interface StudioService {

  Studio searchStudioByStudioId(String studioId, User user) throws StudioNotFoundException, UnauthorizedToSearchStudioException;

  List<Studio> searchAllStudioByStudioIdList(List<String> studioIdList);

  List<Studio> searchAllStudioByStudioOwner(User user);

  void createStudio(CreateStudioReq createStudioReq, User user)
      throws StudioCreateFailureException, MaxStudioOwnCountExceedException;

  void deleteStudioByStudioId(String studioId, User user)
      throws StudioNotFoundException, UnauthorizedToDeleteStudioException, StudioDeleteFailureException;

  void updateStudioTitle(String studioId, String studioTitle);

  ClipInfo searchMainClipInfo(String studioId);

  Boolean hasMyClip(String studioId, String userId);

  List<ClipInfo> searchStudioClipInfoList(String studioId);
}
