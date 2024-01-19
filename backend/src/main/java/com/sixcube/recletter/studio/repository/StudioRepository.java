package com.sixcube.recletter.studio.repository;

import com.sixcube.recletter.studio.dto.Studio;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudioRepository extends JpaRepository<Studio, UUID> {

  List<Studio> findByStudioIdIn(List<UUID> studoIdList);

}
