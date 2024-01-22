package com.sixcube.recletter.studio.controller;

import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioInfo;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.dto.res.SearchActiveUserRes;
import com.sixcube.recletter.studio.dto.res.SearchStudioDetailRes;
import com.sixcube.recletter.studio.dto.res.SearchStudioListRes;
import com.sixcube.recletter.studio.repository.StudioParticipantRepository;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.studio.service.StudioParticipantService;
import com.sixcube.recletter.studio.service.StudioService;
import com.sixcube.recletter.user.dto.User;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/studio")
@RequiredArgsConstructor
@Slf4j
public class StudioController {

  private final StudioService studioService;
  private final StudioParticipantService studioParticipantService;

  // TODO - JPA 예외처리
  @GetMapping
  public ResponseEntity<SearchStudioListRes> searchStudioList(@AuthenticationPrincipal User user) {
    log.debug("StudioController.searchStudioList : start");
    // 참가중인 Studio의 studioId 불러오기
    List<String> participantStudioIdList = studioParticipantService.searchParticipantStudioByUserId(user.getUserId())
        .stream()
        .map(StudioParticipant::getStudioId)
        .toList();

    // 참가중인 Studio 정보 불러오기
    List<Studio> studioList = studioService.searchAllStudioByStudioIdList(participantStudioIdList);

    SearchStudioListRes result = new SearchStudioListRes();

    // TODO - 가지고 있는 clip을 불러오고, 그중 처음에 위치하는 clip의 thumbnailUrl 가져와 삽입
    // TODO - studioId로 clip을 조회하고, 그 중에 clipOwner가 userId인 clip이 있는지 확인하여 isUpload에 삽입
    // 불러온 Studio들을 통해 StudioInfo List 생성후 할당.
    result.setStudioInfoList(
        studioList.stream().map(studio -> StudioInfo.builder()
            .studioId(studio.getStudioId())
            .studioTitle(studio.getStudioTitle())
            .isStudioOwner(user.getUserId().equals(studio.getStudioOwner().getUserId()))
            .isCompleted(studio.getIsCompleted())
            .thumbnailUrl("")
            .expireDate(studio.getExpireDate())
            .isUpload(false)
            .build()
        ).toList()
    );

    log.debug("StudioController.searchStudioList : end");
    return ResponseEntity.ok().body(result);
  }

  // TODO - JPA 예외처리
  @GetMapping("/{studioId}")
  public ResponseEntity<SearchStudioDetailRes> searchStudioDetail(@PathVariable String studioId) {
    log.debug("StudioController.searchStudioDetail : start");
    Studio studio = studioService.searchStudioByStudioId(studioId);

    // TODO - studioId로 보유하고 있는 clipInfoList를 삽입.
    SearchStudioDetailRes result = SearchStudioDetailRes.builder()
        .studioId(studio.getStudioId())
        .studioTitle(studio.getStudioTitle())
        .isCompleted(studio.getIsCompleted())
        .studioOwner(studio.getStudioOwner().getUserId())
//        .clipInfoList()
//        .studioFrameId(studio.getStudioFrame().getFrameId())
//        .studioFontId(studio.getStudioFont().getFontId())
//        .studioBgmId(studio.getStudioBgm().getBgmId())
        .build();

    log.debug("StudioController.searchStudioDetail : end");
    return ResponseEntity.ok().body(result);
  }

  // TODO - JPA 예외처리
  @PostMapping
  public ResponseEntity<Void> createStudio(@RequestBody CreateStudioReq createStudioReq, @AuthenticationPrincipal User user) {
    // TODO - Frame 객체를 생성하여 삽입
    log.debug("StudioController.createStudio : start");

    studioService.createStudio(Studio.builder()
        .studioOwner(user)
        .studioTitle(createStudioReq.getStudioTitle())
        .expireDate(createStudioReq.getExpireDate())
//        .studioFrame(createStudioReq.getStudioFrameId())
        .build());


    log.debug("StudioController.createStudio : end");
    return ResponseEntity.ok().build();
  }

  // TODO - JPA 예외처리
  @DeleteMapping("/{studioId}")
  public ResponseEntity<Void> deleteStudio(@PathVariable String studioId) {
    log.debug("StudioController.deleteStudio : start");

    studioService.deleteStudioByStudioId(studioId);

    log.debug("StudioController.deleteStudio : end");
    return ResponseEntity.ok().build();
  }

  // TODO - JPA 예외처리
  @PostMapping("/{studioId}")
  public ResponseEntity<Void> joinStudio(@PathVariable String studioId, @AuthenticationPrincipal User user) {
    log.debug("StudioController.joinStudio : start");

    studioParticipantService.createStudioParticipant(StudioParticipant.builder()
        .studioId(studioId)
        .userId(user.getUserId())
        .build()
    );

    log.debug("StudioController.joinStudio : end");
    return ResponseEntity.ok().build();
  }

  // TODO - redis 예외처리
  @GetMapping("/{studioId}/active")
  public ResponseEntity<SearchActiveUserRes> searchActiveUser(@PathVariable String studioId) {
    log.debug("StudioController.searchActiveUser : start");
    // TODO - 해당 studioId로 활성화된 챗팅방이 있는를 체크해서 반환
    log.debug("StudioController.searchActiveUser : end");
    return ResponseEntity.ok().body(SearchActiveUserRes.builder().isActive(false).build());
  }

  // TODO - JPA 예외처리
  @PutMapping("/studio/{studioId}/title")
  public ResponseEntity<Void> updateStudioTitle(@PathVariable String studioId,
      @RequestParam String studioTitle) {
    log.debug("StudioController.updateStudioTitle : start");

    studioService.updateStudioTitle(studioId, studioTitle);

    log.debug("StudioController.updateStudioTitle : end");
    return ResponseEntity.ok().build();
  }


}
