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
public class Script {

    @Id
    @Column(name = "script_id")
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer scriptId;

    @Column(name = "script_title")
    private String scriptTitle;

    @Column(name = "script_content")
    private String scriptContent;
}
