package com.sixcube.recletter.studio.dto;

import com.sixcube.recletter.template.dto.BGM;
import com.sixcube.recletter.template.dto.Font;
import com.sixcube.recletter.template.dto.Frame;
import com.sixcube.recletter.user.dto.User;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;

@Entity
@ToString
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@DynamicInsert
public class Studio implements Serializable {

  @Id
  @Column(name = "studio_id")
  @Builder.Default
  private String studioId = UUID.randomUUID().toString();

  private String studioOwner;

  private String studioTitle;

  private LocalDateTime expireDate;

  private Integer studioFrameId;

  private Integer studioBgmId;

  private Integer studioBgmVolume;

  @Enumerated(EnumType.STRING)
  private StudioStatus studioStatus;

  private String studioSticker;

}
