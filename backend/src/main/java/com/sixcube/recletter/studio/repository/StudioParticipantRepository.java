package com.sixcube.recletter.studio.repository;

import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.StudioParticipantId;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudioParticipantRepository extends JpaRepository<StudioParticipant, StudioParticipantId> {
  List<StudioParticipant> findAllByStudioId(String studioId);

  List<StudioParticipant> findAllByUserId(String userId);
}
