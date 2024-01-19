package com.sixcube.recletter.studio.repository;

import com.sixcube.recletter.studio.dto.Studio;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudioRepository extends JpaRepository<Studio, Integer> {
  Studio findByStudioId(Integer studioId);

  List<Studio> findByStudioIdIn(List<Integer> studoIdList);

}
