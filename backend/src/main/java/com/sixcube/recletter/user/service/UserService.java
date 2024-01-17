package com.sixcube.recletter.user.service;

import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.dto.UserInfo;
import com.sixcube.recletter.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserInfo searchUserInfoByUserId(String userId) {
    return new UserInfo(userRepository.findByUserId(userId));
  }

  public User createUser(User user) {
    String unencryptedPassword = user.getPassword();
    user.setUserPassword(passwordEncoder.encode(unencryptedPassword));
    return userRepository.save(user);
  }

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository.findByUserId(username);
  }
}
