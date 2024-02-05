package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.clip.service.ClipService;
import com.sixcube.recletter.studio.S3Util;
import com.sixcube.recletter.studio.StudioUtil;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.UsedClipInfo;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.dto.req.UpdateStudioReq;
import com.sixcube.recletter.studio.exception.*;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.template.service.TemplateService;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.service.UserService;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.StringTokenizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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

  private final S3Util s3Util;

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
    return clipInfoList.stream().anyMatch(clipInfo -> studioId.equals(clipInfo.getClipOwner()));
  }

  @Override
  public List<ClipInfo> searchStudioClipInfoList(String studioId) {
    return clipService.searchClipInfoList(studioId);
  }

  //TODO- 스티커 적용 안 받았을 때 인풋 결정 : 일단 null로 진행
  //TODO- clipOrder 변경 transactional 고려
  @Override
  public void updateStudio(UpdateStudioReq updateStudioReq, User user) {
    //스튜디오 참여자의 요청인지 검증
    if(!studioUtil.isStudioParticipant(updateStudioReq.getStudioId(),user.getUserId())){
      throw new UnauthorizedToUpdateStudioException();
    }
    //받아온 정보를 바탕으로 스튜디오 객체 생성
    Studio studio=Studio.builder()
            .studioId(updateStudioReq.getStudioId())
            .studioBgmId(updateStudioReq.getStudioBgmId())
            .studioFrameId(updateStudioReq.getStudioFrameId())
            .studioFontId(updateStudioReq.getStudioFontId())
            .studioFontBold(updateStudioReq.getStudioFontBold())
            .studioFontSize(updateStudioReq.getStudioFontSize())
            .studioVolume(updateStudioReq.getStudioVolume())
            .build();

    //스튜디오 스티커 이미지 저장
    MultipartFile studioSticker= updateStudioReq.getStudioSticker();
    try {
      if(studioSticker!=null){
        if(!"image/png".equals(studioSticker.getContentType())) {
          throw new InvalidStudioStickerFormatException();
        }
        s3Util.saveObject(studio.getStudioId() + ".png", updateStudioReq.getStudioSticker());
      }
    } catch (IOException e) {
      throw new InvalidStudioStickerFormatException();
    }

    studioRepository.save(studio);
    for(UsedClipInfo clipInfo:updateStudioReq.getUsedClipList()){
      clipService.updateUsedClip(studio.getStudioId(), clipInfo.getClipId(), clipInfo.getClipVolume(), clipInfo.getClipVolume());
    }
    for(int clipId:updateStudioReq.getUnsuedClipList()){
      clipService.updateUnusedClip(studio.getStudioId(), clipId);
    }
  }

  @Override
  public String searchStudioStickerUrl(String studioId){
    StringBuilder fileName=new StringBuilder()
            .append(studioId)
            .append(".png");
    if(s3Util.isObject(fileName.toString())){
      return s3Util.getSignedUrl(fileName.toString());
    }
    return "";
  }
}
