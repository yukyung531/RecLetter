package com.sixcube.recletter.studio.controller;

import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioInfo;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.dto.req.LetterVideoReq;
import com.sixcube.recletter.studio.dto.req.UpdateStudioReq;
import com.sixcube.recletter.studio.dto.res.SearchActiveUserRes;
import com.sixcube.recletter.studio.dto.res.SearchStudioDetailRes;
import com.sixcube.recletter.studio.dto.res.SearchStudioListRes;
import com.sixcube.recletter.studio.dto.res.SearchStudioThumbnailRes;
import com.sixcube.recletter.studio.service.StudioParticipantService;
import com.sixcube.recletter.studio.service.StudioService;
import com.sixcube.recletter.user.dto.User;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static java.time.LocalDate.now;

@RestController
@RequestMapping("/studio")
@RequiredArgsConstructor
@Slf4j
public class StudioController {

  private final StudioService studioService;
  private final StudioParticipantService studioParticipantService;

  @GetMapping
  public ResponseEntity<SearchStudioListRes> searchStudioList(@AuthenticationPrincipal User user) {
    log.debug("StudioController.searchStudioList : start");
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
            .isCompleted(studio.getIsCompleted())
            .thumbnailUrl(studioService.searchMainClipInfo(studio.getStudioId()).getClipUrl())
            .expireDate(studio.getExpireDate())
            .hasMyClip(studioService.hasMyClip(studio.getStudioId(), user.getUserId()))
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
        .isCompleted(studio.getIsCompleted())
        .studioOwner(studio.getStudioOwner())
        .clipInfoList(studioService.searchStudioClipInfoList(studioId))
        .studioFrameId(studio.getStudioFrameId())
        .studioFontId(studio.getStudioFontId())
        .studioBgmId(studio.getStudioBgmId())
        .studioStickerUrl(studioService.searchStudioStickerUrl(studioId))
        .build();

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

  // TODO - redis 예외처리
  @GetMapping("/{studioId}/active")
  public ResponseEntity<SearchActiveUserRes> searchActiveUser(@PathVariable String studioId) {
    // TODO - 해당 studioId로 활성화된 챗팅방이 있는를 체크해서 반환
    return ResponseEntity.ok().body(SearchActiveUserRes.builder().isActive(false).build());
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
  @PutMapping
  public ResponseEntity<Void> updateStudio(@ModelAttribute UpdateStudioReq updateStudioReq, @AuthenticationPrincipal User user) {

    studioService.updateStudio(updateStudioReq,user);

    return ResponseEntity.ok().build();
  }

  //TODO- clipInfo 포함 정보 확정
  @GetMapping("/{studioId}/letter")
  public ResponseEntity<Void> createLetter(@PathVariable String studioId, @AuthenticationPrincipal User user){
    //사용한 클립 리스트, 프레임, 등등을 전달 해줘야 함!
  //- 메인 화면의 진행 정도를 표시해주는 곳에 완료 버튼이 있고, 방장만 사용할 수 있다.
    //- 기한 이틀 전에는 모든 사용자들에게 완료(인코딩) 권한이 주어진다.
    LetterVideoReq letterVideoReq=studioService.createLetterVideoReq(studioId,user);
    log.debug(letterVideoReq.toString());
    //TODO- python server로 인코딩 요청전송

    return ResponseEntity.ok().build();
  }

}
