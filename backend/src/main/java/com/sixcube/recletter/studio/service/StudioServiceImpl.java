package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.clip.service.ClipService;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.exception.MaxStudioOwnCountExceedException;
import com.sixcube.recletter.studio.exception.StudioCreateFailureException;
import com.sixcube.recletter.studio.exception.StudioDeleteFailureException;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.studio.exception.UnauthorizedToDeleteStudioException;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.template.dto.Frame;
import com.sixcube.recletter.template.service.TemplateService;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.service.UserService;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class StudioServiceImpl implements StudioService {

  private final StudioRepository studioRepository;

  private final StudioParticipantService studioParticipantService;

  private final TemplateService templateService;

  private final UserService userService;

  private final ClipService clipService;

  private final int MAX_STUDIO_OWN_COUNT = 3;

  @Override
  public Studio searchStudioByStudioId(String studioId) throws StudioNotFoundException {
    return studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
  }

  @Override
  public List<Studio> searchAllStudioByStudioIdList(List<String> studioIdList) {
    return studioRepository.findByStudioIdIn(studioIdList);
  }

  @Override
  public List<Studio> searchAllStudioByStudioOwner(User user) {
    return studioRepository.findAllByStudioOwner(user);
  }

  @Override
  public void createStudio(CreateStudioReq createStudioReq, User user)
      throws StudioCreateFailureException, MaxStudioOwnCountExceedException {
    Studio studio = Studio.builder()
        .studioOwner(user)
        .studioTitle(createStudioReq.getStudioTitle())
        .expireDate(createStudioReq.getExpireDate())
        .studioFrame(Frame.builder().frameId(createStudioReq.getStudioFrameId()).build())
        .build();

    List<Studio> myStudioList = studioRepository.findAllByStudioOwner(user);

    // 최대 생성 가능 수 확인
    if (myStudioList.size() >= MAX_STUDIO_OWN_COUNT) {
      throw new MaxStudioOwnCountExceedException();
    }

    // 생성 시도
    try {
      Studio studioResult = studioRepository.save(studio);
      studioParticipantService.createStudioParticipant(
          StudioParticipant.builder()
              .studioId(studioResult.getStudioId())
              .userId(user.getUserId())
              .build()
      );
    } catch (Exception e) {
      throw new StudioCreateFailureException(e);
    }
  }

  @Override
  public void deleteStudioByStudioId(String studioId, User user)
      throws StudioNotFoundException, UnauthorizedToDeleteStudioException, UnauthorizedToDeleteStudioException {

    Studio result = studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

    if (result.getStudioOwner().getUserId().equals(user.getUserId())) {
      try {
        studioRepository.deleteById(studioId);
      } catch (Exception e) {
        throw new StudioDeleteFailureException(e);
      }
    } else {
      throw new UnauthorizedToDeleteStudioException();
    }

  }

  @Override
  public void updateStudioTitle(String studioId, String studioTitle) {
    Studio studio = studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    studio.setStudioTitle(studioTitle);
  }

  @Override
  public ClipInfo searchMainClipInfo(String studioId) {
    List<ClipInfo> mainClip = clipService.searchClipInfoList(studioId);
    if (mainClip.isEmpty()) {
      return ClipInfo.builder().clipUrl("").build();
    } else {
      return mainClip.get(0);
    }
  }

  @Override
  public Boolean hasMyClip(String studioId, String userId) {
    List<ClipInfo> clipInfoList = clipService.searchClipInfoList(studioId);
    return clipInfoList.stream().anyMatch(clipInfo -> studioId.equals(clipInfo.getClipOwner()));
  }

  @Override
  public List<ClipInfo> searchStudioClipInfoList(String studioId) {
    return clipService.searchClipInfoList(studioId);
  }

}
