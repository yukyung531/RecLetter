package com.sixcube.recletter.studio.dto;

import com.sixcube.recletter.user.dto.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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

  @ManyToOne
  @JoinColumn(name = "studio_owner", referencedColumnName = "user_id")
  private User studioOwner;

  @Column(nullable = false)
  private String studioTitle;

  @Column(nullable = false)
  private LocalDateTime expireDate;

//  @ManyToOne
//  @JoinColumn(name = "studio_frame_id", referencedColumnName = "frame_id")
//  private Frame studioFrame;

//  @ManyToOne
//  @JoinColumn(name = "studio_font_id", referencedColumnName = "font_id")
//  private Font studioFontId;

  @Column(name = "studio_font_size")
  private Integer studioFontSize;

  @Column(name = "studio_font_bold")
  private Boolean studioFontBold;

//  @ManyToOne
//  @JoinColumn(name = "studio_bgm_id", referencedColumnName = "bgm_id")
//  private Bgm studioBgm;

  @Column(name = "studio_volume")
  private Integer studioVolume;

  @Column(name = "is_completed")
  private Boolean isCompleted;

}
