package com.sixcube.recletter.oauth2.repository;


import com.sixcube.recletter.oauth2.dto.GoogleRepoId;
import com.sixcube.recletter.oauth2.dto.OAuth2AuthorizedClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;

public interface GoogleRepository extends JpaRepository<OAuth2AuthorizedClientEntity, GoogleRepoId> {
    void delete(OAuth2AuthorizedClientEntity entity);
}
