package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.clip.service.ClipService;
import com.sixcube.recletter.studio.StudioUtil;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.exception.MaxStudioOwnCountExceedException;
import com.sixcube.recletter.studio.exception.StudioCreateFailureException;
import com.sixcube.recletter.studio.exception.StudioDeleteFailureException;
import com.sixcube.recletter.studio.exception.StudioNotFoundException;
import com.sixcube.recletter.studio.exception.UnauthorizedToDeleteStudioException;
import com.sixcube.recletter.studio.exception.UnauthorizedToSearchStudioException;
import com.sixcube.recletter.studio.exception.UnauthorizedToUpdateStudioException;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.template.service.TemplateService;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.service.UserService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.StringTokenizer;
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

  private final StudioUtil studioUtil;

  private final int MAX_STUDIO_OWN_COUNT = 3;

  @Override
  public Studio searchStudioByStudioId(String studioId, User user) throws StudioNotFoundException {

    if (studioUtil.isStudioParticipant(studioId, user.getUserId())) { //스튜디오 참가자 여부 확인
      return studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    } else {
      throw new UnauthorizedToSearchStudioException();
    }
  }

  @Override
  public List<Studio> searchAllStudioByStudioIdList(List<String> studioIdList) {
    return studioRepository.findByStudioIdIn(studioIdList);
  }

  @Override
  public List<Studio> searchAllStudioByStudioOwner(User user) {
    return studioRepository.findAllByStudioOwner(user.getUserId());
  }

  @Override
  public void createStudio(CreateStudioReq createStudioReq, User user)
      throws StudioCreateFailureException, MaxStudioOwnCountExceedException {

    List<Studio> myStudioList = studioRepository.findAllByStudioOwner(user.getUserId());

    // 최대 생성 가능 수 확인
    if (myStudioList.size() >= MAX_STUDIO_OWN_COUNT) {
      throw new MaxStudioOwnCountExceedException();
    }

    LocalDateTime limitDate = LocalDateTime.now().plusDays(14);
    Studio studio = Studio.builder()
        .studioOwner(user.getUserId())
        .studioTitle(createStudioReq.getStudioTitle())
        .expireDate(
            createStudioReq.getExpireDate().isBefore(limitDate) ? createStudioReq.getExpireDate()
                : limitDate)
        .studioFrameId(createStudioReq.getStudioFrameId())
        .build();

    // 생성 시도
    try {
      Studio studioResult = studioRepository.save(studio);
      studioParticipantService.createStudioParticipant(studioResult.getStudioId(), user);
    } catch (Exception e) {
      throw new StudioCreateFailureException(e);
    }
  }

  @Override
  public void deleteStudioByStudioId(String concatenatedStudioId, User user)
      throws StudioNotFoundException, UnauthorizedToDeleteStudioException, StudioDeleteFailureException {

    StringTokenizer st = new StringTokenizer(concatenatedStudioId, ",");
    if (st.countTokens() > 3) {
      throw new UnauthorizedToDeleteStudioException();
    }

    while (st.hasMoreTokens()) {
      String studioId = st.nextToken();

      Studio result = studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

      if (user.getUserId().equals(result.getStudioOwner())) {
        try {
          studioParticipantService.deleteStudioParticipant(studioId);
          studioRepository.deleteById(studioId);
        } catch (Exception e) {
          throw new StudioDeleteFailureException(e);
        }
      } else {
        throw new UnauthorizedToDeleteStudioException();
      }
    }
  }

  @Override
  public void updateStudioTitle(String studioId, String studioTitle, User user)
      throws StudioNotFoundException {
    Studio studio = studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    if (studio.getStudioOwner().equals(user.getUserId())) {
      studio.setStudioTitle(studioTitle);
    } else {
      throw new UnauthorizedToUpdateStudioException();
    }
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
    return clipInfoList.stream().anyMatch(clipInfo -> userId.equals(clipInfo.getClipOwner()));
  }

  @Override
  public List<ClipInfo> searchStudioClipInfoList(String studioId) {
    return clipService.searchClipInfoList(studioId);
  }

}
