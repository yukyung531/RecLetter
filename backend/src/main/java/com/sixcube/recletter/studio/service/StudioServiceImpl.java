package com.sixcube.recletter.studio.service;

import com.sixcube.recletter.clip.dto.ClipInfo;
import com.sixcube.recletter.clip.service.ClipService;
import com.sixcube.recletter.studio.S3Util;
import com.sixcube.recletter.studio.StudioUtil;
import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioStatus;
import com.sixcube.recletter.studio.dto.UsedClipInfo;
import com.sixcube.recletter.studio.dto.req.LetterVideoReq;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.dto.req.UpdateStudioReq;
import com.sixcube.recletter.studio.dto.res.DownloadLetterRes;
import com.sixcube.recletter.studio.exception.*;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.user.dto.User;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
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

    List<Studio> myStudioList = studioRepository.findAllByStudioOwnerAndStudioStatus(user.getUserId(),StudioStatus.INCOMPLETE);

    // 최대 생성 가능 수 확인
    if (myStudioList.size() >= MAX_STUDIO_OWN_COUNT) {
      throw new MaxStudioOwnCountExceedException();
    }

    LocalDateTime limitDate = LocalDateTime.now().plusDays(14);
    LocalTime customTime = LocalTime.of(23, 59, 59); // 원하는 시간 설정
    // 날짜와 시간을 결합하여 LocalDateTime 객체 생성
    LocalDateTime customDateTime;

    if(createStudioReq.getExpireDate().isBefore(limitDate)){
      LocalDate date = createStudioReq.getExpireDate().toLocalDate();
      customDateTime = LocalDateTime.of(date, customTime);
    }else{
      customDateTime = LocalDateTime.of(limitDate.toLocalDate(), customTime);
    }


    Studio studio = Studio.builder()
        .studioOwner(user.getUserId())
        .studioTitle(createStudioReq.getStudioTitle())
        .expireDate(customDateTime)
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
//    if (st.countTokens() > 3) {
//      throw new UnauthorizedToDeleteStudioException();
//    }

    while (st.hasMoreTokens()) {
      String studioId = st.nextToken();

      Studio result = studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);

      if (user.getUserId().equals(result.getStudioOwner())) {
        try {
          studioParticipantService.deleteAllStudioParticipant(studioId);
          studioRepository.deleteById(studioId);
        } catch (Exception e) {
          throw new StudioDeleteFailureException(e);
        }
      } else {
        studioParticipantService.deleteStudioParticipant(studioId,user.getUserId());
//        throw new UnauthorizedToDeleteStudioException();
      }
    }
  }

  @Override
  public void updateStudioTitle(String studioId, String studioTitle, User user)
      throws StudioNotFoundException {
    Studio studio = studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    checkStudioAccessByStudioStatus(studio.getStudioStatus()); //studioStatus가 스튜디오 입장 가능한 상태인지 확인

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
  public Integer attendMember(String studioId){
    return studioParticipantService.searchStudioParticipantByStudioId(studioId).size();
  }

  @Override
  public List<ClipInfo> searchStudioClipInfoList(String studioId) {
    return clipService.searchClipInfoList(studioId);
  }

  //TODO- clipOrder 변경 transactional 고려
  @Override
  public void updateStudio(UpdateStudioReq updateStudioReq, User user) {
    //스튜디오 참여자의 요청인지 검증
    if(!studioUtil.isStudioParticipant(updateStudioReq.getStudioId(),user.getUserId())){
      throw new UnauthorizedToUpdateStudioException();
    }

    //받아온 정보를 바탕으로 스튜디오 객체 업데이트
    Studio studio=studioRepository.findById(updateStudioReq.getStudioId()).orElseThrow(StudioNotFoundException::new);
    checkStudioAccessByStudioStatus(studio.getStudioStatus()); //studioStatus가 스튜디오 입장 가능한 상태인지 확인

    studio.setStudioBgmId(updateStudioReq.getStudioBgmId());
    studio.setStudioFrameId(updateStudioReq.getStudioFrameId());
    studio.setStudioBgmVolume(updateStudioReq.getStudioBgmVolume());
    //스튜디오 스티커 이미지 저장
    MultipartFile studioSticker= updateStudioReq.getStudioSticker();
    try {
      if(studioSticker!=null){
        if(!"image/png".equals(studioSticker.getContentType())) {
          throw new InvalidStudioStickerFormatException();
        }
        String prevSticker=studio.getStudioSticker();
        StringBuilder stickerName=new StringBuilder();
        stickerName.append(studio.getStudioId()).append("/").append(System.currentTimeMillis()).append(".png");

        s3Util.saveObject(stickerName.toString(), updateStudioReq.getStudioSticker());
        studio.setStudioSticker(stickerName.toString());
        if(prevSticker!=null){
          s3Util.deleteObject(prevSticker);
        }
      }
    } catch (IOException e) {
      throw new InvalidStudioStickerFormatException();
    }

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
    Studio studio=studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    if(studio.getStudioSticker()!=null){ // && s3Util.isObject(studio.getStudioSticker())
      return s3Util.getSignedUrl(studio.getStudioSticker());
    }
    return "";
  }

  @Override
  public LetterVideoReq createLetterVideoReq(String studioId, User user){
    Studio studio=searchStudioByStudioId(studioId, user);
    checkStudioAccessByStudioStatus(studio.getStudioStatus()); //studioStatus가 스튜디오 입장 가능한 상태인지 확인

    int leftDays= Period.between(now(), LocalDate.from(studio.getExpireDate())).getDays();
    //- 기본적으로는 방장만 완료 가능.
    //- 만료 기한 이틀 전에는 모든 사용자들에게 완료(인코딩) 권한이 주어짐
    if(leftDays<0){
      throw new ExpiredStudioException(); //기한 만료 스튜디오
    } else if (leftDays<=2 || studio.getStudioOwner().equals(user.getUserId())){ //기한이 2일 이내 남았거나, 방장인 경우
      //진행
        return LetterVideoReq.builder()
              .studioId(studio.getStudioId())
              .studioFrameId(studio.getStudioFrameId())
              .studioBgmId(studio.getStudioBgmId())
              .studioBgmVolume(studio.getStudioBgmVolume())
              .studioSticker(studio.getStudioSticker())
              .clipInfoList(clipService.searchLetterClipInfoByOrder(studioId))
              .build();
    } else{
      throw new UnauthorizedToCompleteStudioException(); //완성요청 접근 권한 없음
    }
  }

  private void checkStudioAccessByStudioStatus(StudioStatus studioStatus){
    if(studioStatus.equals(StudioStatus.COMPLETE) || studioStatus.equals(StudioStatus.ENCODING)){
      throw new AlreadyCompletingStudioStatusException();
    }
  }

  @Override
  public void updateStudioStatus(String studioId, StudioStatus studioStatus){
    Studio studio=studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    studio.setStudioStatus(studioStatus);
    studioRepository.save(studio);
  }

  @Override
  public void completeStudio(String studioId){
    Studio studio=studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    StudioStatus currentStatus=studio.getStudioStatus();
    if(currentStatus.equals(StudioStatus.ENCODING)) {
      studio.setStudioStatus(StudioStatus.COMPLETE);
      studio.setExpireDate(LocalDateTime.now().plusDays(7));
      studioRepository.save(studio);
    }
  }

  @Override
  public DownloadLetterRes downloadLetter(String studioId){
    String url="";

    Studio studio=studioRepository.findById(studioId).orElseThrow(StudioNotFoundException::new);
    if(studio.getStudioStatus()==StudioStatus.COMPLETE){
      String fileName=studioId+".mp4";
      if(s3Util.isObject(fileName)){
        url=s3Util.getSignedUrl(fileName);
      }
    }
    return DownloadLetterRes.builder()
            .studioTitle(studio.getStudioTitle())
            .letterUrl(url)
            .build();
  }

}
