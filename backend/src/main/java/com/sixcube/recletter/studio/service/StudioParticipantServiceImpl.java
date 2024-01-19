package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.repository.StudioParticipantRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudioParticipantServiceImpl implements StudioParticipantService {


  private final StudioParticipantRepository studioParticipantRepository;

  @Override
  public List<StudioParticipant> searchParticipantStudioByUserId(String userId) {
    return studioParticipantRepository.findAllByUserId(userId);
  }
}
