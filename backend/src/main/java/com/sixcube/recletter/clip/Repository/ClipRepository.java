package com.sixcube.recletter.clip.Repository;

import com.sixcube.recletter.clip.dto.Clip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClipRepository extends JpaRepository<Clip, Integer> {

    Optional<Clip> findClipByClipId(Integer clipId);

    List<Clip> findClipsByStudioId(String studioId);

    List<Clip> findClipsByStudioIdOrderByClipOrder(String studioId);

}
