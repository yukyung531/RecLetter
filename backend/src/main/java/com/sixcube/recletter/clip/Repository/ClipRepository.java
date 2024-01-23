package com.sixcube.recletter.clip.Repository;

import com.sixcube.recletter.clip.dto.Clip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClipRepository extends JpaRepository<Clip, Integer> {

    Clip findClipByClipId(Integer clipId);

}
