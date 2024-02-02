package com.sixcube.recletter.user.service;

import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.dto.req.CreateUserReq;
import com.sixcube.recletter.user.dto.req.UpdateUserPasswordReq;
import com.sixcube.recletter.user.dto.req.UpdateUserReq;
import org.springframework.http.ResponseEntity;

import java.net.URISyntaxException;

public interface UserService {


    public User createUser(CreateUserReq createUserReq);

    public void updateUser(UpdateUserReq updateUserReq, User user);

    public boolean updateUserPassword(UpdateUserPasswordReq updateUserPasswordReq, User user);

    public void deleteUser(User user) throws URISyntaxException;

    public void resetPassword(String password, String email);
}
