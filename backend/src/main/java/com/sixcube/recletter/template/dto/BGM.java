package com.sixcube.recletter.template.dto;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class BGM {

    @Id
    @Column(name = "bgm_id")
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer bgmId;

    @Column(name = "bgm_title")
    private String bgmTitle;

    @Column(name = "bgm_url")
    private String bgmUrl;
}
