package com.sixcube.recletter.studio.dto;

import java.io.Serializable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudioParticipantId implements Serializable {

  private Integer studioId;
  private String userId;
}
