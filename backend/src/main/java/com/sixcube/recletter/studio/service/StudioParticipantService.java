package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.exception.AlreadyJoinedStudioException;
import com.sixcube.recletter.studio.exception.StudioParticipantCreateFailureException;
import com.sixcube.recletter.user.dto.User;
import java.util.List;

public interface StudioParticipantService {

  List<StudioParticipant> searchStudioParticipantByUser(User user);

  List<StudioParticipant> searchStudioParticipantByStudioId(String studioId);

  void createStudioParticipant(String studioId, User user)
      throws StudioParticipantCreateFailureException, AlreadyJoinedStudioException;

  StudioParticipant searchStudioParticipantByUserIdAndStudioId(String studioId, String userId);

  void deleteAllStudioParticipant(String studioId);

  void deleteStudioParticipant(String studioId, String userId);

}
