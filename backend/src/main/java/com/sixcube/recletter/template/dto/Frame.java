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
}
