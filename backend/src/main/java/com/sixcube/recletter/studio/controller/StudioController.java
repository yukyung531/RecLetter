package com.sixcube.recletter.studio.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sixcube.recletter.studio.dto.*;
import com.sixcube.recletter.studio.dto.req.CompleteLetterReq;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.dto.req.LetterVideoReq;
import com.sixcube.recletter.studio.dto.req.UpdateStudioReq;
import com.sixcube.recletter.studio.dto.res.SearchStudioDetailRes;
import com.sixcube.recletter.studio.dto.res.SearchStudioListRes;
import com.sixcube.recletter.studio.dto.res.SearchStudioThumbnailRes;
import com.sixcube.recletter.studio.service.StudioParticipantService;
import com.sixcube.recletter.studio.service.StudioService;
import com.sixcube.recletter.user.dto.User;
import jakarta.validation.Valid;

import java.util.ArrayList;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
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

  private final StudioService studioService;
  private final StudioParticipantService studioParticipantService;


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
        studioList.stream().map(studio -> StudioInfo.builder()
            .studioId(studio.getStudioId())
            .studioTitle(studio.getStudioTitle())
            .isStudioOwner(user.getUserId().equals(studio.getStudioOwner()))
//            .isCompleted(studio.getIsCompleted())
            .studioStatus(studio.getStudioStatus())
            .thumbnailUrl(studioService.searchMainClipInfo(studio.getStudioId()).getClipUrl())
            .expireDate(studio.getExpireDate())
            .hasMyClip(studioService.hasMyClip(studio.getStudioId(), user.getUserId()))
            .studioFrameId(studio.getStudioFrameId())
            .studioStickerUrl(studioService.searchStudioStickerUrl(studio.getStudioId()))
            .build()
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
    // TODO- studioSticker
    Studio studio = studioService.searchStudioByStudioId(studioId, user);

    SearchStudioDetailRes result = SearchStudioDetailRes.builder()
        .studioId(studio.getStudioId())
        .studioTitle(studio.getStudioTitle())
//        .isCompleted(studio.getIsCompleted())
        .studioStatus(studio.getStudioStatus())
        .studioOwner(studio.getStudioOwner())
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

    //python server로 인코딩 요청전송
//    RestClient restClient=RestClient.create();
//    ResponseEntity<Void> response = restClient.post()
//            .uri(videoServerUri + "/video/letter")
//            .contentType(APPLICATION_JSON)
//            .body(letterVideoReq)
//            .retrieve()
//            .toBodilessEntity();

    studioService.updateStudioStatus(studioId, StudioStatus.ENCODING);
    return ResponseEntity.ok().build();
  }

  //TODO- python 요청 시 security 생각!
  @PostMapping("/{studioId}/letter")
  public ResponseEntity<Void> completeLetter(@PathVariable String studioId, @RequestBody CompleteLetterReq completeLetterReq){
    if(completeLetterReq.getIsCompleted()){
      studioService.updateStudioStatus(studioId,StudioStatus.COMPLETE);
    } else{
      studioService.updateStudioStatus(studioId,StudioStatus.FAIL);
    }
    return ResponseEntity.ok().build();
  }

  //url + 누구나 접근 가능해야 함!!!!!!
  @GetMapping("/{studioId}/download")
  public ResponseEntity<String> downloadLetter(@PathVariable String studioId){
    String url=studioService.downloadLetter(studioId);
    log.debug(url); //빈 값이면 객체 없음.
    return ResponseEntity.ok(url);
  }
}
