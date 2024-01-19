package com.sixcube.recletter.studio.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Studio {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer studioId;
  private String studioCode;
  private String studioOwner;
  private String studioTitle;
  private LocalDateTime expireDate;
  private Integer studioFrameId;
  private Integer studioFontId;
  private Integer studioFontSize;
  private Boolean studioFontBold;
  private Integer studioBgmId;
  private Integer studioVolume;
  private Boolean isCompleted;

}
