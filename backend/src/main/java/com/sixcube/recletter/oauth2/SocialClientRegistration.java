package com.sixcube.recletter.oauth2;

import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.oidc.IdTokenClaimNames;
import org.springframework.stereotype.Component;

@Component
public class SocialClientRegistration {

//    public ClientRegistration naverClientRegistration() {
//
//        return ClientRegistration.withRegistrationId("naver")
//                .clientId("8TKXMeogRSgxx2FUzBjA")
//                .clientSecret("gLpfx9mwOA")
//                .redirectUri("http://localhost:5173/login/oauth2/code/naver")
//                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
//                .scope("name", "email")
//                .authorizationUri("https://nid.naver.com/oauth2.0/authorize")
//                .tokenUri("https://nid.naver.com/oauth2.0/token")
//                .userInfoUri("https://openapi.naver.com/v1/nid/me")
//                .userNameAttributeName("response")
//                .build();
//    }

    public ClientRegistration googleClientRegistration() {
        return ClientRegistration.withRegistrationId("google")
                .clientId("609466944952-13j1nj6j5cp7q0fctu6jpnu68hlt5gqe.apps.googleusercontent.com")
                .clientSecret("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")
                .redirectUri("http://localhost:5173/login/oauth2/code/google")
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .scope("profile", "email")
                .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                .issuerUri("https://accounts.google.com")
                .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                .userNameAttributeName(IdTokenClaimNames.SUB)
                .build();
    }
}