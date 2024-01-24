package com.sixcube.recletter.template.repository;

import com.sixcube.recletter.template.dto.Frame;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FrameRepository extends JpaRepository<Frame, Integer> {
}
