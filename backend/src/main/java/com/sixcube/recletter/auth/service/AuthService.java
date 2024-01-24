package com.sixcube.recletter.auth.service;

import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.auth.dto.Code;
import com.sixcube.recletter.email.service.EmailService;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Random;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class AuthService {

    private static final String AUTH_CODE_PREFIX = "AuthCode ";

    private final UserRepository userRepository;

    private final EmailService mailService;

    private final RedisService redisService;

    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;


    public void sendCodeToEmail(String toEmail) throws Exception {
        this.checkDuplicatedEmail(toEmail);
        String title = "Recletter 이메일 인증 번호";
        String authCode = this.createCode();
        mailService.sendEmail(toEmail, title, authCode);
        Code code = new Code(authCode, false);
        redisService.setValues(toEmail, code, Duration.ofMillis(this.authCodeExpirationMillis));

    }

    private void checkDuplicatedEmail(String email) throws Exception {
        User user = userRepository.findByUserEmail(email);
        if (user != null && user.getDeletedAt()==null) {
            log.debug("MemberServiceImpl.checkDuplicatedEmail exception occur email: {}", email);
            throw new Exception("이미 존재하는 이메일입니다.");
        }
    }

    private String createCode() throws Exception {
        int length = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < length; i++) {
                builder.append(random.nextInt(10));
            }
            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            log.debug("AuthService.createCode() exception occur");
            throw new Exception();
        }
    }


    public boolean verifyCode(String email, String authCode) {
        //키가 존재하지 않으면 바로 false 리턴
        if(!redisService.hasKey(email)){
            return false;
        }
        Code redisAuthCode = (Code) redisService.getValues(email);
        boolean isValid = false;
        if (redisAuthCode.getCode().equals(authCode)) { //코드 검증이 완료되면
            redisAuthCode.setFlag(true);
            redisService.setValues(email, redisAuthCode); //flag를 true로 변경
            isValid = true;
        }
        return isValid;
    }
}