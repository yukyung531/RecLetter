package com.sixcube.recletter.user.service;

import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.auth.dto.Code;
import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.dto.UserInfo;
import com.sixcube.recletter.user.dto.req.UpdateUserPasswordReq;
import com.sixcube.recletter.user.dto.req.UpdateUserReq;
import com.sixcube.recletter.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserDetailsService, UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RedisService redisService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUserId(username);
    }

    public UserInfo searchUserInfoByUserId(String userId) {
        return new UserInfo(userRepository.findByUserId(userId));
    }

    public User createUser(User user) throws Exception {

        if (userRepository.findByUserId(user.getUserId()) != null && user.getDeletedAt() != null) {
            throw new Exception("이미 존재하는 아이디입니다.");
        }
        if (userRepository.findByUserEmail(user.getUserEmail()) != null && user.getDeletedAt() != null) {
            throw new Exception("이미 존재하는 이메일입니다.");
        }
        String key = RedisPrefix.REGIST.prefix() + user.getUserEmail();
        if (!redisService.hasKey(key)) {
            throw new Exception("이메일 인증이 완료되지 않았습니다.");
        }
        Code redisAuthCode = (Code) redisService.getValues(key);
        if (!redisAuthCode.isFlag()) {
            throw new Exception("이메일 인증이 완료되지 않았습니다.");
        }
        //레디스에서 제거
        redisService.deleteValues(key);

        String unencryptedPassword = user.getPassword();
        user.setUserPassword(passwordEncoder.encode(unencryptedPassword));
        return userRepository.save(user);
    }

    public void updateUser(UpdateUserReq updateUserReq, User user) {
        if (updateUserReq.getUserEmail() != null) {
            user.setUserEmail(updateUserReq.getUserEmail());
        }
        if (updateUserReq.getUserNickname() != null) {
            user.setUserNickname(updateUserReq.getUserNickname());
        }
        userRepository.save(user);
    }

    public boolean updateUserPassword(UpdateUserPasswordReq updateUserPasswordReq, User user) {

        if (passwordEncoder.matches(updateUserPasswordReq.getOriginalPassword(), user.getUserPassword())) {
            String unencryptedPassword = updateUserPasswordReq.getNewPassword();
            String encryptedPassword = passwordEncoder.encode(unencryptedPassword);
            user.setUserPassword(encryptedPassword);
            userRepository.save(user);
            return true;
        } else {
            // TODO - 기존 비밀번호를 잘못 입력 -> 예외 처리
            return false;
        }
    }

    public void deleteUser(User user) {
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public boolean checkDuplicatiedId(String userId) {
        User user = userRepository.findByUserId(userId);
        if (user == null || user.getDeletedAt() != null) {
            return false;
        }
        return true;
    }

    public void resetPassword(String password, String email) throws Exception {

        String key = RedisPrefix.RESET_PASSOWRD.prefix() + email;
        if (!redisService.hasKey(key)) {
            throw new Exception("이메일 인증이 완료되지 않았습니다.");
        }
        Code redisAuthCode = (Code) redisService.getValues(key);
        if (!redisAuthCode.isFlag()) {
            throw new Exception("이메일 인증이 완료되지 않았습니다.");
        }
        //레디스에서 제거
        redisService.deleteValues(key);

        String unencryptedPassword = password;
        String encryptedPassword = passwordEncoder.encode(unencryptedPassword);
        User user = userRepository.findByUserEmail(email);
        user.setUserPassword(encryptedPassword);
        userRepository.save(user);
    }
}
