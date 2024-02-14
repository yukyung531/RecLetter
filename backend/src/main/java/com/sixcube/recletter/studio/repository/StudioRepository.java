package com.sixcube.recletter.studio.repository;

import com.sixcube.recletter.studio.dto.Studio;
import com.sixcube.recletter.studio.dto.StudioStatus;
import com.sixcube.recletter.user.dto.User;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudioRepository extends JpaRepository<Studio, String> {

  Studio findStudioByStudioIdAndStudioStatus(String studioId, StudioStatus status);
  List<Studio> findByStudioIdIn(List<String> studioIdList);

  List<Studio> findAllByStudioOwner(String userId);
  List<Studio> findAllByStudioOwnerAndStudioStatus(String userId, StudioStatus status);

}
