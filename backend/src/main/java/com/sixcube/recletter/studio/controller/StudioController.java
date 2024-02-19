package com.sixcube.recletter.studio.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.studio.dto.*;
import com.sixcube.recletter.studio.dto.req.CompleteLetterReq;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.dto.req.LetterVideoReq;
import com.sixcube.recletter.studio.dto.req.UpdateStudioReq;
import com.sixcube.recletter.studio.dto.res.*;
import com.sixcube.recletter.studio.service.StudioParticipantService;
import com.sixcube.recletter.studio.service.StudioService;
import com.sixcube.recletter.user.dto.User;
import jakarta.validation.Valid;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import static java.time.LocalDate.now;
import static org.springframework.http.MediaType.APPLICATION_JSON;

@RestController
@RequestMapping("/studio")
@RequiredArgsConstructor
@Slf4j
public class StudioController {

  private final RedisService redisService;
  private final StudioService studioService;
  private final StudioParticipantService studioParticipantService;
  private final KafkaTemplate<String, LetterVideoReq> kafkaProducerTemplate;
  @Value("${KAFKA_LETTER_REQUEST_TOPIC}")
  private String KAFKA_LETTER_REQUEST_TOPIC;


  @GetMapping
  public ResponseEntity<SearchStudioListRes> searchStudioList(@AuthenticationPrincipal User user) {
    // 참가중인 studio의 studioId 불러오기
    List<String> participantStudioIdList = studioParticipantService.searchStudioParticipantByUser(user)
        .stream()
        .map(StudioParticipant::getStudioId)
        .toList();

    // 참가중인 Studio 정보 불러오기
    List<Studio> studioList = studioService.searchAllStudioByStudioIdList(participantStudioIdList);

    SearchStudioListRes result = new SearchStudioListRes();
    // 불러온 Studio들을 통해 StudioInfo List 생성후 할당.
    result.setStudioInfoList(
        studioList.stream().map(studio -> {
          StudioInfo studioInfo=StudioInfo.builder()
            .studioId(studio.getStudioId())
            .studioTitle(studio.getStudioTitle())
            .isStudioOwner(user.getUserId().equals(studio.getStudioOwner()))
            .studioStatus(studio.getStudioStatus())
            .thumbnailUrl(studioService.searchMainClipInfo(studio.getStudioId()).getClipUrl())
            .expireDate(studio.getExpireDate())
            .hasMyClip(studioService.hasMyClip(studio.getStudioId(), user.getUserId()))
            .attendMember(studioService.attendMember(studio.getStudioId()))
            .videoCount(studioService.searchStudioClipInfoList(studio.getStudioId()).size())
            .studioFrameId(studio.getStudioFrameId())
            .studioStickerUrl(studioService.searchStudioStickerUrl(studio.getStudioId()))
            .build();

          //redis에 encoding없는데, studioStatus ENCODING인 경우 비정상 종료이므로 FAIL로 상태 변경
          if(studio.getStudioStatus().equals(StudioStatus.ENCODING) && !redisService.hasKey(RedisPrefix.ENCODING.prefix() + studio.getStudioId())){
            studioService.updateStudioStatus(studio.getStudioId(),StudioStatus.FAIL);
            studioInfo.setStudioStatus(StudioStatus.FAIL);
          }
          return studioInfo;
        }
        ).toList()
    );

    log.debug("StudioController.searchStudioList : end");
    return ResponseEntity.ok().body(result);
  }

  //TODO - studioStickerUrl 추가
  @GetMapping("/{studioId}")
  public ResponseEntity<SearchStudioDetailRes> searchStudioDetail(@PathVariable String studioId,
      @AuthenticationPrincipal User user) {
    // 찾을 수 없을 경우 StudioNotFoundException 발생
    // 자신이 참여하지 않은 Studio를 검색할 경우 UnauthorizedToSearchStudioException 발생
    // studioSticker는 없으면 빈 값
    Studio studio = studioService.searchStudioByStudioId(studioId, user);

    SearchStudioDetailRes result = SearchStudioDetailRes.builder()
        .studioId(studio.getStudioId())
        .studioTitle(studio.getStudioTitle())
        .studioStatus(studio.getStudioStatus())
        .studioOwner(studio.getStudioOwner())
        .expireDate(studio.getExpireDate())
        .clipInfoList(studioService.searchStudioClipInfoList(studioId))
        .studioFrameId(studio.getStudioFrameId())
        .studioBgmId(studio.getStudioBgmId())
        .studioBgmVolume(studio.getStudioBgmVolume())
        .studioStickerUrl(studioService.searchStudioStickerUrl(studioId))
        .build();
    log.debug(result.toString());
    return ResponseEntity.ok().body(result);
  }

  @GetMapping("/{studioId}/thumbnail")
  public ResponseEntity<SearchStudioThumbnailRes> searchStudioThumbnail(
      @PathVariable String studioId) {

    return ResponseEntity.ok()
        .body(SearchStudioThumbnailRes
            .builder()
            .url(studioService.searchMainClipInfo(studioId).getClipUrl())
            .build());
  }

  //TODO-잘못된 유저의 요청이면 403이 맞다
  @PostMapping
  public ResponseEntity<Void> createStudio(@Valid @RequestBody CreateStudioReq createStudioReq,
      @AuthenticationPrincipal User user) {

    // 생성할 수 없는 경우 StudioCreateFailureException 발생
    studioService.createStudio(createStudioReq, user);

    return ResponseEntity.ok().build();
  }

  @DeleteMapping("/{concatenatedStudioId}")
  public ResponseEntity<Void> deleteStudio(@PathVariable String concatenatedStudioId,
      @AuthenticationPrincipal User user) {

    studioService.deleteStudioByStudioId(concatenatedStudioId, user);

    return ResponseEntity.ok().build();
  }

  @PostMapping("/{studioId}")
  public ResponseEntity<Void> joinStudio(@PathVariable String studioId,
      @AuthenticationPrincipal User user) {

    studioParticipantService.createStudioParticipant(studioId, user);

    return ResponseEntity.ok().build();
  }

  // TODO - JPA 예외처리
  @PutMapping("/{studioId}/title")
  public ResponseEntity<Void> updateStudioTitle(@PathVariable String studioId,
      @RequestBody String studioTitle, @AuthenticationPrincipal User user) {
    // 해당 스튜디오에 참여하지 않은 사용자의 경우 UnauthorizedToUpdateStudioException 발생
    // 스튜디오를 찾지 못한 경우 StudioNotFoundException 발생
    studioService.updateStudioTitle(studioId, studioTitle, user);

    return ResponseEntity.ok().build();
  }

  //TODO- 스티커 적용 안 받았을 때 인풋 결정 : 일단 null로 진행
  //TODO- clipOrder 변경 transactional 고려
  @PutMapping()
  public ResponseEntity<Void> updateStudio(@ModelAttribute UpdateStudioReq updateStudioReq, @AuthenticationPrincipal User user) throws JsonProcessingException { //@RequestParam Map<String,Object> map
    log.debug(updateStudioReq.toString());
    if (updateStudioReq.getUnusedClipList() == null) {
      updateStudioReq.setUnusedClipList(new ArrayList<>());
    }
    if (updateStudioReq.getUsedClipList() == null) {
      updateStudioReq.setUsedClipList(new ArrayList<>());
    }

    studioService.updateStudio(updateStudioReq,user);

    return ResponseEntity.ok().build();
  }

  //인코딩 요청
  @GetMapping("/{studioId}/letter")
  public ResponseEntity<Void> createLetter(@PathVariable String studioId, @AuthenticationPrincipal User user){
    LetterVideoReq letterVideoReq=studioService.createLetterVideoReq(studioId,user);
    log.debug(letterVideoReq.toString());

    String key = RedisPrefix.ENCODING.prefix() + studioId;
    if(!redisService.hasKey(key)){
      kafkaProducerTemplate.send(KAFKA_LETTER_REQUEST_TOPIC,studioId,letterVideoReq);
      studioService.updateStudioStatus(studioId, StudioStatus.ENCODING);
      //인코딩 중 상태 레디스에 표시
      redisService.setValues(key,user.getUserId(), Duration.ofHours(6));
    }
    return ResponseEntity.ok().build();
  }

  @KafkaListener(topics = "${KAFKA_LETTER_RESULTINFO_TOPIC}", containerFactory = "kafkaListenerContainerFactory")
  public void receiveLetterResult(@Payload LetterVideoRes letterVideoRes) {
    String studioId = letterVideoRes.getStudioId();

    if("success".equals(letterVideoRes.getResult())) {
      studioService.completeStudio(studioId);
    } else if("fail".equals(letterVideoRes.getResult())) {
      studioService.updateStudioStatus(studioId, StudioStatus.FAIL);
    }
    //redis에서 인코딩 중 상태 삭제
    String key = RedisPrefix.ENCODING.prefix() + studioId;
    if(redisService.hasKey(key)) {
      redisService.deleteValues(key);
    }
  }

  //url + 누구나 접근 가능해야 함!!!!!!
  @GetMapping("/{studioId}/download")
  public ResponseEntity<DownloadLetterRes> downloadLetter(@PathVariable String studioId){
    DownloadLetterRes downloadLetterRes=studioService.downloadLetter(studioId);
    log.debug(downloadLetterRes.toString()); //s3에 저장 안 되어있다면 url은 빈 값
    return ResponseEntity.ok(downloadLetterRes);
  }
}
