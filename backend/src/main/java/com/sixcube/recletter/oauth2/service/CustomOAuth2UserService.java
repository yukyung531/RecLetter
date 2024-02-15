package com.sixcube.recletter.oauth2.service;

import com.sixcube.recletter.oauth2.dto.CustomOAuth2User;
import com.sixcube.recletter.oauth2.dto.GoogleResponse;
import com.sixcube.recletter.oauth2.dto.OAuth2Response;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    //DefaultOAuth2UserService는 OAuth2UserService의 구현체

    private final UserRepository userRepository;

    /**
     * 네이버나 구글의 사용자 정보를 파라미터로 받아오는 메서드
     */
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;

        if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        }
        else {
            return null;
        }

        String userEmail = oAuth2Response.getEmail();
        Optional<User> existData = userRepository.findByUserEmailAndDeletedAtIsNull(userEmail);
        String role = "ROLE_SOCIAL";

        //회원가입(첫 로그인)
        if (existData.isEmpty()) {
            User user = User.builder()
                    .userEmail(oAuth2Response.getEmail())
                    .userNickname(oAuth2Response.getName())
                    .userRole("ROLE_SOCIAL")
                    .build();

            userRepository.save(user);
        }

        //로그인
        else if(existData.get().getUserRole().equals("ROLE_USER")){
            role = "ROLE_BOTH";
            existData.get().setUserRole(role);

            userRepository.save(existData.get());
        }
        return new CustomOAuth2User(oAuth2Response, role);
    }
}
