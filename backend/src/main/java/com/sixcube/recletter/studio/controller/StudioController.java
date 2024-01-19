package com.sixcube.recletter.studio.controller;

import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioInfo;
import com.sixcube.recletter.studio.dto.StudioParticipant;
import com.sixcube.recletter.studio.dto.req.CreateStudioReq;
import com.sixcube.recletter.studio.dto.res.SearchStudioDetailRes;
import com.sixcube.recletter.studio.dto.res.SearchStudioListRes;
import com.sixcube.recletter.studio.repository.StudioParticipantRepository;
import com.sixcube.recletter.studio.repository.StudioRepository;
import com.sixcube.recletter.studio.service.StudioParticipantService;
import com.sixcube.recletter.studio.service.StudioService;
import com.sixcube.recletter.user.dto.User;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/studio")
@RequiredArgsConstructor
public class StudioController {

  private final StudioService studioService;
  private final StudioParticipantService studioParticipantService;

  // TODO - JPA 예외처리
  @GetMapping
  public ResponseEntity<SearchStudioListRes> searchStudioList(@AuthenticationPrincipal User user) {
    // 참가중인 Studio의 studioId 불러오기
    List<UUID> participantStudioIdList = studioParticipantService.searchParticipantStudioByUserId(user.getUserId())
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
            .isStudioOwner(user.getUserId().equals(studio.getStudioOwner()))
            .isCompleted(studio.getIsCompleted())
            .thumbnailUrl("")
            .expireDate(studio.getExpireDate())
            .isUpload(false)
            .build()
        ).toList()
    );

    return ResponseEntity.ok().body(result);
  }

  // TODO - JPA 예외처리
  @GetMapping("/{studioId}")
  public ResponseEntity<SearchStudioDetailRes> searchStudioDetail(@PathVariable String studioId) {
    Studio studio = studioService.searchStudioByStudioId(UUID.fromString(studioId));

    // TODO - studioId로 보유하고 있는 clipInfoList를 삽입.
    SearchStudioDetailRes result = SearchStudioDetailRes.builder()
        .studioId(studio.getStudioId())
        .studioTitle(studio.getStudioTitle())
        .isCompleted(studio.getIsCompleted())
        .studioOwner(studio.getStudioOwner())
//        .clipInfoList()
        .studioFrameId(studio.getStudioFrameId())
        .studioFontId(studio.getStudioFontId())
        .studioBgmId(studio.getStudioBgmId())
        .build();
    
    return ResponseEntity.ok().body(result);
  }

  // TODO - JPA 예외처리
  @PostMapping
  public ResponseEntity<Void> createStudio(CreateStudioReq createStudioReq, @AuthenticationPrincipal User user) {
    studioService.createStudio(Studio.builder()
        .studioOwner(user.getUserId())
        .studioTitle(createStudioReq.getStudioTitle())
        .expireDate(createStudioReq.getExpireDate())
        .studioFrameId(createStudioReq.getStudioFrameId())
        .build());

    return ResponseEntity.ok().build();
  }

  // TODO - JPA 예외처리
  @DeleteMapping("/{studioId}")
  public ResponseEntity<Void> deleteStudio(@PathVariable String studioId) {
    studioService.deleteStudioByStudioId(UUID.fromString(studioId));

    return ResponseEntity.ok().build();
  }

  // TODO - JPA 예외처리
  @PostMapping("/{studioId}")
  public ResponseEntity<Void> joinStudio(@PathVariable String studioId, @AuthenticationPrincipal User user) {
    studioParticipantService.createStudioParticipant(StudioParticipant.builder()
        .studioId(UUID.fromString(studioId))
        .userId(user.getUserId())
        .build()
    );

    return ResponseEntity.ok().build();
  }

  @GetMapping("/{studioId}/active")
  public ResponseEntity<Boolean> searchActiveUser() {

  }

  @PutMapping("/studio/{studioId}/title")
  public ResponseEntity<> updateStudioTitle(@PathVariable Integer studioId,
      @RequestParam String studioTitle) {

  }


}
