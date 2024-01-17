package com.springtowinter.springboottemplate.user.repository;

import com.springtowinter.springboottemplate.user.dto.User;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
    User findByUserId(String id);

}
