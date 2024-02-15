package com.sixcube.recletter.auth.service;

import com.sixcube.recletter.auth.dto.res.LoginRes;
import com.sixcube.recletter.auth.exception.CodeCreateException;
import com.sixcube.recletter.auth.exception.EmailAlreadyExistsException;
import com.sixcube.recletter.auth.exception.NoEmailException;
import com.sixcube.recletter.auth.jwt.JWTUtil;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.auth.dto.Code;
import com.sixcube.recletter.email.service.EmailService;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.exception.EmailNullException;
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
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final EmailService mailService;

    private final RedisService redisService;
    private final JWTUtil jwtUtil;

    @Value("${spring.mail.auth-code-expiration-millis}")
    private long authCodeExpirationMillis;

    public void sendEmail(String toEmail, String emailType) {
        String title = "";
        String key = "";
        if (emailType.equals("REGIST")) {
            if (userRepository.findByUserEmailAndDeletedAtIsNull(toEmail).isPresent()) {
                throw new EmailAlreadyExistsException();
            }
            title = "Recletter 이메일 인증 번호";
            key = RedisPrefix.REGIST.prefix() + toEmail;
        } else { //emailType.equals("RESET")
            userRepository.findByUserEmailAndDeletedAtIsNull(toEmail).orElseThrow(() -> new NoEmailException());

            title = "Recletter 비밀번호 재설정";
            key = RedisPrefix.RESET_PASSOWRD.prefix() + toEmail;
        }
        String authCode = this.createCode();
        mailService.sendEmail(toEmail, title, authCode);
        Code code = new Code(authCode, false);

        redisService.setValues(key, code, Duration.ofMillis(this.authCodeExpirationMillis));
    }

    //이메일 인증 코드 검증
    public boolean verifyCode(String email, String authCode, String emailType) {
        String key = "";
        boolean isValid = false;

        //회원가입 이메일 인증인 경우
        if (emailType.equals("REGIST")) {
            key = RedisPrefix.REGIST.prefix() + email;
        }
        //비밀번호 초기화 이메일 인증인 경우
        else {
            key = RedisPrefix.RESET_PASSOWRD.prefix() + email;
        }

        //키가 존재하지 않으면 바로 false 리턴
        if (!redisService.hasKey(key)) {
            return false;
        }

        Code redisAuthCode = (Code) redisService.getValues(key);

        if (redisAuthCode.getCode().equals(authCode)) { //코드 검증이 완료되면
            //flag를 true로 변경
            redisAuthCode.setFlag(true);
            redisService.setValues(key, redisAuthCode);
            //검증 완료
            isValid = true;
        }
        return isValid;
    }

    public String createCode() throws CodeCreateException {
        int length = 6;
        try {
            Random random = SecureRandom.getInstanceStrong();
            StringBuilder builder = new StringBuilder();
            for (int i = 0; i < length; i++) {
                builder.append(random.nextInt(10));
            }

            return builder.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new CodeCreateException();
        }

    }

    @Override
    public LoginRes socialLogin(String userEmail) {
        User user = userRepository.findByUserEmailAndDeletedAtIsNull(userEmail).get();

        //accessToken 생성
        String accessToken = jwtUtil.createJwt(user.getUserId(), user.getUserRole(), 1000 * 60 * 60L);

        //refreshToken 생성
        String refreshToken = jwtUtil.createJwt(user.getUserId(), user.getUserRole(), 1000 * 60 * 60 * 24 * 14L);

        //Redis에 refreshToken 저장
        String key = RedisPrefix.REFRESH_TOKEN.prefix() + user.getUserId();
        redisService.setValues(key, refreshToken);

        return LoginRes.builder().accessToken(accessToken).refreshToken(refreshToken).build();


    }
}