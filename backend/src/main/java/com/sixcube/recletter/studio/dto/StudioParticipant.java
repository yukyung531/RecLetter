package com.sixcube.recletter.studio.dto;

import com.sixcube.recletter.user.dto.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
  @ManyToOne
  @JoinColumn(name = "studio_id", referencedColumnName = "studio_id")
  Studio studio;

  @Id
  @ManyToOne
  @JoinColumn(name = "user_id", referencedColumnName = "user_id")
  User user;
}
