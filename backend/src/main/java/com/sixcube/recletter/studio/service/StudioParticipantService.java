package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.exception.AlreadyJoinedStudioException;
import com.sixcube.recletter.studio.exception.StudioParticipantCreateFailureException;
import com.sixcube.recletter.user.dto.User;
import java.util.List;
import java.util.UUID;

public interface StudioParticipantService {

  List<StudioParticipant> searchParticipantStudioByUserId(String userId);

  void createStudioParticipant(String studioId, User user)
      throws StudioParticipantCreateFailureException, AlreadyJoinedStudioException;

}
