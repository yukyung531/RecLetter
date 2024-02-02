package com.sixcube.recletter.oauth2.dto;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class GoogleRepoId implements Serializable {
    private String clientRegistrationId;
    private String principalName;
}