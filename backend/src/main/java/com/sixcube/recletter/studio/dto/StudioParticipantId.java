package com.sixcube.recletter.studio.dto;

import java.io.Serializable;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudioParticipantId implements Serializable {

  private String studioId;
  private String userId;
}
