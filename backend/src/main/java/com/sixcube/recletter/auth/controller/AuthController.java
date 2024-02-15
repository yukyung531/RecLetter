package com.sixcube.recletter.auth.controller;

import com.sixcube.recletter.auth.dto.res.LoginRes;
import com.sixcube.recletter.auth.dto.res.VerifyCodeRes;
import com.sixcube.recletter.auth.jwt.JWTUtil;
import com.sixcube.recletter.auth.service.AuthService;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.auth.dto.req.SendCodeToEmailReq;
import com.sixcube.recletter.auth.dto.req.TokenReq;
import com.sixcube.recletter.auth.dto.req.VerifyCodeReq;
import com.sixcube.recletter.auth.dto.res.TokenRes;
import com.sixcube.recletter.user.dto.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final RedisService redisService;
    private final JWTUtil jwtUtil;


    private final String REGIST = "REGIST";
    private final String RESET_PASSWORD = "RESET_PASSWORD";


    @GetMapping("/logout")
    public ResponseEntity<Void> logout(@AuthenticationPrincipal User user) {
        String key = RedisPrefix.REFRESH_TOKEN.prefix() + user.getUserId();
        redisService.deleteValues(key);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/token")
    public ResponseEntity<TokenRes> tokenRegenerate(@RequestBody TokenReq tokenReq, @AuthenticationPrincipal User user) {
        String refreshToken = tokenReq.getRefreshToken();

        //refreshToken 같으면 token 재발급
        if (tokenReq.getRefreshToken().equals(refreshToken)) {
            String userId = user.getUserId();
            String role = user.getUserRole();
            String accessToken = jwtUtil.createJwt(userId, role, 1000 * 60 * 60L);
            refreshToken = jwtUtil.createJwt(userId, role, 1000 * 60 * 60 * 24 * 14L);

            return ResponseEntity.ok().body(TokenRes
                    .builder()
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build()
            );
        }

        return ResponseEntity.badRequest().build(); //리프레시 토큰 만료 또는 불일치 하는 경우
    }


    //이메일 발송 요청(회원가입)
    @PostMapping("/email")
    public ResponseEntity<Void> sendEmailToRegister(@Valid @RequestBody SendCodeToEmailReq sendCodeToEmailReq) {

        authService.sendEmail(sendCodeToEmailReq.getUserEmail(), REGIST);

        return ResponseEntity.ok().build();
    }

    //인증코드 검증(회원가입)
    @PostMapping("/email/code")
    public ResponseEntity<VerifyCodeRes> verifyCodeToRegister(@Valid @RequestBody VerifyCodeReq verifyCodeReq) {

        boolean isValid = authService.verifyCode(verifyCodeReq.getUserEmail(), verifyCodeReq.getCode(), REGIST);

        return ResponseEntity.ok().body(VerifyCodeRes
                .builder()
                .isValid(isValid)
                .build()
        );
    }


    //이메일 발송 요청(비밀번호 초기화)
    @PostMapping("/password")
    public ResponseEntity<Void> sendEmailToResetPassword(@Valid @RequestBody SendCodeToEmailReq sendCodeToEmailReq) {

        authService.sendEmail(sendCodeToEmailReq.getUserEmail(), RESET_PASSWORD);

        return ResponseEntity.ok().build();
    }

    //인증코드 검증(비밀번호 초기화)
    @PostMapping("/password/code")
    public ResponseEntity<VerifyCodeRes> verifyCodeToResetPassword(@Valid @RequestBody VerifyCodeReq verifyCodeReq) {

        boolean isValid = authService.verifyCode(verifyCodeReq.getUserEmail(), verifyCodeReq.getCode(), RESET_PASSWORD);

        return ResponseEntity.ok().body(VerifyCodeRes
                .builder()
                .isValid(isValid)
                .build()
        );
    }

    @RequestMapping("/social")
    public ResponseEntity<LoginRes> socialLogin(HttpServletRequest request) {

        String userEmail = (String) request.getAttribute("userEmail");
        LoginRes loginRes = authService.socialLogin(userEmail);

        return ResponseEntity.ok().body(loginRes);
    }

}