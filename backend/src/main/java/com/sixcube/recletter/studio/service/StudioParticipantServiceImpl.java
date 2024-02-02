package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.StudioParticipantId;
import com.sixcube.recletter.studio.exception.AlreadyJoinedStudioException;
import com.sixcube.recletter.studio.exception.StudioParticipantCreateFailureException;
import com.sixcube.recletter.studio.exception.StudioParticipantNotFound;
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
  public List<StudioParticipant> searchStudioParticipantByUser(User user) {
    return studioParticipantRepository.findAllByUser(user);
  }

  @Override
  public void createStudioParticipant(String studioId, User user)
      throws StudioParticipantCreateFailureException, AlreadyJoinedStudioException {
    studioParticipantRepository.findById(new StudioParticipantId(studioId, user.getUserId()))
        .ifPresentOrElse(studioParticipant -> {
        }, () -> {
          try {
            studioParticipantRepository.save(
                StudioParticipant.builder()
                    .studioId(studioId)
                    .userId(user.getUserId())
                    .build());
          } catch (Exception e) {
            throw new StudioParticipantCreateFailureException(e);
          }
        });
  }

  @Override
  public StudioParticipant searchStudioParticipantByUserIdAndStudioId(String studioId,
      String userId) {
    return studioParticipantRepository.findById(new StudioParticipantId(studioId, userId))
        .orElseThrow(
            StudioParticipantNotFound::new);
  }
}
