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
public class Frame {

    @Id
    @Column(name = "frame_id")
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer frameId;

    @Column(name = "frame_title")
    private String frameTitle;

    @Column(name = "frame_image_url")
    private String frameImageUrl;

    @Column(name = "frame_body")
    private String frameBody;

    @JoinColumn(name = "font_id", referencedColumnName = "font_id")
    private Integer fontId;

    @Column(name = "font_size")
    private String fontSize;

    @Column(name = "font_bold")
    private String fontBold;

}
