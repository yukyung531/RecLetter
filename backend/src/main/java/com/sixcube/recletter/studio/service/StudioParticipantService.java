package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.studio.dto.StudioParticipant;
import java.util.List;
import java.util.UUID;

public interface StudioParticipantService {
  List<StudioParticipant> searchParticipantStudioByUserId(String userId);
}
