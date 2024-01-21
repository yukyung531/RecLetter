package com.sixcube.recletter.studio.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "studio_participant")
@IdClass(StudioParticipantId.class)
public class StudioParticipant implements Serializable {
  @Id
  String studioId;

  @Id
  String userId;
}
