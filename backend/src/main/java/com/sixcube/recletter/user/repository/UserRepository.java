package com.sixcube.recletter.user.repository;

import com.sixcube.recletter.user.dto.User;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findByUserId(String id);

}
