package com.sixcube.recletter.auth.service;

import com.sixcube.recletter.auth.dto.Code;
import com.sixcube.recletter.auth.dto.res.LoginRes;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.user.dto.User;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.util.Random;

public interface AuthService {
    public void sendEmail(String toEmail, String emailType);

    //이메일 인증 코드 검증
    public boolean verifyCode(String email, String authCode, String emailType);


    public String createCode() throws NoSuchAlgorithmException;

    LoginRes socialLogin(String userEmail);
}
