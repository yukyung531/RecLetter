package com.sixcube.recletter.user.repository;

import com.sixcube.recletter.user.dto.User;

import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUserEmailAndDeletedAtIsNull(String userEmail);
    Optional<User> findByUserId(String userId);
}
