package com.sixcube.recletter.oauth2.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URI;
import java.net.URISyntaxException;

@Service
public class GoogleRevokeService {
    @Value("${social.google.id}")
    private String CLIENT_ID;

    public void revokeGoogleAccessToken(String accessToken) throws URISyntaxException {
        String revokeUrl = "https://oauth2.googleapis.com/revoke";
        String clientId = CLIENT_ID;  // Google Developer Console에서 발급받은 클라이언트 아이디

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String requestBody = "token=" + accessToken + "&client_id=" + clientId;

        RequestEntity<String> requestEntity = RequestEntity
                .post(new URI(revokeUrl))
                .headers(headers)
                .body(requestBody);

        RestTemplate restTemplate = new RestTemplate();
        restTemplate.exchange(requestEntity, String.class);
    }
}
