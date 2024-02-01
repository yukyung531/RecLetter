package com.sixcube.recletter.user.service;

import com.sixcube.recletter.auth.exception.EmailAlreadyExistsException;
import com.sixcube.recletter.redis.RedisPrefix;
import com.sixcube.recletter.redis.RedisService;
import com.sixcube.recletter.auth.dto.Code;
import com.sixcube.recletter.user.dto.req.CreateUserReq;
import com.sixcube.recletter.user.exception.*;
import com.sixcube.recletter.user.dto.User;
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
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {

        //DB에서 조회
        User user = userRepository.findByUserEmailAndDeletedAtIsNull(userEmail).orElseThrow(()->new UserNotExistException());

        System.out.println("userEmail-------- = "+user.getUserEmail());

        return user;
    }


    public User createUser(CreateUserReq createUserReq) {
        String userEmail = createUserReq.getUserEmail();

        if (userRepository.findByUserEmailAndDeletedAtIsNull(userEmail).isPresent()) {
            throw new EmailAlreadyExistsException();
        }
        String key = RedisPrefix.REGIST.prefix() + userEmail;
        if (!redisService.hasKey(key)) {
            throw new EmailNotVerifiedException();
        }
        Code redisAuthCode = (Code) redisService.getValues(key);
        if (!redisAuthCode.isFlag()) {
            throw new EmailNotVerifiedException();
        }
        //레디스에서 제거
        redisService.deleteValues(key);

        User user = User.builder()
                .userEmail(userEmail)
                .userNickname(createUserReq.getUserNickname())
                .userRole("ROLE_USER")
                .build();

        String unencryptedPassword = createUserReq.getUserPassword();
        user.setUserPassword(passwordEncoder.encode(unencryptedPassword));
        return userRepository.save(user);
    }

    public void updateUser(UpdateUserReq updateUserReq, User user) {
        String name = updateUserReq.getUserNickname();
        if (name == null) {
            throw new NicknameNullException();
        }
        //이름 변경
        user.setUserNickname(updateUserReq.getUserNickname());

        userRepository.save(user); //수정사항 반영
    }

    public boolean updateUserPassword(UpdateUserPasswordReq updateUserPasswordReq, User user) {

        if (passwordEncoder.matches(updateUserPasswordReq.getOriginalPassword(), user.getUserPassword())) {
            String unencryptedPassword = updateUserPasswordReq.getNewPassword();
            String encryptedPassword = passwordEncoder.encode(unencryptedPassword);
            user.setUserPassword(encryptedPassword);
            userRepository.save(user);
            return true;
        } else {
            throw new WrongPasswordException();
        }
    }

    public void deleteUser(User user) {

        //관련 토큰 모두 레디스에서 제거
        String key = RedisPrefix.REFRESH_TOKEN.prefix() + user.getUserId();
        if(redisService.hasKey(key)){
            redisService.deleteValues(key);
        }
        key = RedisPrefix.REGIST.prefix() + user.getUserEmail();
        if(redisService.hasKey(key)){
            redisService.deleteValues(key);
        }
        key = RedisPrefix.RESET_PASSOWRD.prefix() + user.getUserEmail();
        if(redisService.hasKey(key)){
            redisService.deleteValues(key);
        }

        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }


    public void resetPassword(String password, String email) {

        String key = RedisPrefix.RESET_PASSOWRD.prefix() + email;
        if (!redisService.hasKey(key)) {
            throw new EmailNotVerifiedException();
        }
        Code redisAuthCode = (Code) redisService.getValues(key);
        if (!redisAuthCode.isFlag()) {
            throw new EmailNotVerifiedException();
        }
        //레디스에서 제거
        redisService.deleteValues(key);

        String unencryptedPassword = password;
        String encryptedPassword = passwordEncoder.encode(unencryptedPassword);
        User user = userRepository.findByUserEmail(email).orElseThrow();
        user.setUserPassword(encryptedPassword);
        userRepository.save(user);
    }
}
