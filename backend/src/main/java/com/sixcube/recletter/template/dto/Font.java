package com.sixcube.recletter.template.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Font {

    @Id
    @Column(name = "font_id")
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer fontId;

    @Column(name = "font_title")
    private String fontTitle;

    @Column(name = "font_family")
    private String fontFamily;

    @Column(name = "font_url")
    private String fontUrl;
}
