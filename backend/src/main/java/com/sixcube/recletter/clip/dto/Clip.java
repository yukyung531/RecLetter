package com.sixcube.recletter.clip.dto;

import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;

@Entity
@Table(name="clip") // 안쓰면 엔티티이름과 테이블 이름 매칭
@ToString
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Clip implements Serializable {
    @Id
    @Column(name="clip_id")
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer clipId;

    @Column(name="clip_title")
    private String clipTitle;

    @JoinColumn(name="clip_owner",referencedColumnName = "user_id")
    private String clipOwner;

    @JoinColumn(name="studio_id", referencedColumnName = "studio_id")
    private String studioId;

    @Column(name="clip_order")
    private Integer clipOrder;

    @Column(name="clip_volume")
    private Integer clipVolume;

    private String clipContent;

}
