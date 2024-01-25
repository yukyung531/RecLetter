package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.StudioParticipantId;
import com.sixcube.recletter.studio.exception.AlreadyJoinedStudioException;
import com.sixcube.recletter.studio.exception.StudioParticipantCreateFailureException;
import com.sixcube.recletter.studio.repository.StudioParticipantRepository;
import com.sixcube.recletter.user.dto.User;
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

  @Override
  public void createStudioParticipant(String studioId, User user)
      throws StudioParticipantCreateFailureException, AlreadyJoinedStudioException {
    studioParticipantRepository.findById(
            new StudioParticipantId(studioId, user.getUserId()))
        .ifPresent(studioParticipant -> {
          throw new AlreadyJoinedStudioException();
        });

    try {
      studioParticipantRepository.save(
          StudioParticipant.builder()
              .studio(Studio.builder().studioId(studioId).build())
              .user(user)
              .build());
    } catch (Exception e) {
      throw new StudioParticipantCreateFailureException(e);
    }
  }
}
