package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.clip.service.ClipService;
import com.sixcube.recletter.studio.S3Util;
import com.sixcube.recletter.studio.StudioUtil;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.UsedClipInfo;
import com.sixcube.recletter.studio.dto.req.LetterVideoReq;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.dto.req.UpdateStudioReq;
import com.sixcube.recletter.studio.exception.*;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.template.service.TemplateService;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.service.UserService;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.StringTokenizer;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import static java.time.LocalDate.now;

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

    //받아온 정보를 바탕으로 스튜디오 객체 업데이트
    Studio studio=studioRepository.findById(updateStudioReq.getStudioId()).orElseThrow(StudioNotFoundException::new);
    studio.setStudioBgmId(updateStudioReq.getStudioBgmId());
    studio.setStudioFontId(updateStudioReq.getStudioFontId());
    studio.setStudioFrameId(updateStudioReq.getStudioFrameId());
    studio.setStudioFontBold(updateStudioReq.getStudioFontBold());
    studio.setStudioFontSize(updateStudioReq.getStudioFontSize());
    studio.setStudioVolume(updateStudioReq.getStudioVolume());

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

//    studioRepository.save(studio);
    int order=1;
    for(UsedClipInfo clipInfo:updateStudioReq.getUsedClipList()){
      clipService.updateUsedClip(studio.getStudioId(), clipInfo.getClipId(), order++, clipInfo.getClipVolume());
    }
    for(int clipId:updateStudioReq.getUnusedClipList()){
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

  @Override
  public LetterVideoReq createLetterVideoReq(String studioId, User user){
    Studio studio=searchStudioByStudioId(studioId, user);
    int leftDays= Period.between(now(), LocalDate.from(studio.getExpireDate())).getDays();
    //- 기본적으로는 방장만 완료 가능.
    //- 만료 기한 이틀 전에는 모든 사용자들에게 완료(인코딩) 권한이 주어짐
    if(leftDays<0){
      throw new ExpiredStudioException(); //기한 만료 스튜디오
    } else if (leftDays<2 || studio.getStudioOwner().equals(user.getUserId())){ //기한이 2일 이내 남았거나, 방장인 경우
      //진행
        return LetterVideoReq.builder()
              .studioId(studio.getStudioId())
              .studioFrameId(studio.getStudioFrameId())
              .studioFontId(studio.getStudioFontId())
                .studioFontSize(studio.getStudioFontSize())
                .studioFontBold(studio.getStudioFontBold())
              .studioBgmId(studio.getStudioBgmId())
              .studioVolume(studio.getStudioVolume())
              .clipInfoList(clipService.searchLetterClipInfoByOrder(studioId))
              .build();
    } else{
      throw new UnauthorizedToCreateLetterException(); //완성요청 접근 권한 없음
    }
  }

  @Override
  public void updateStudioIsCompleted(String studioId, boolean isCompleted){
    Studio studio=studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    studio.setIsCompleted(isCompleted);
    studioRepository.save(studio);
  }

}
