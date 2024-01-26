package com.sixcube.recletter.user.service;

import com.sixcube.recletter.user.dto.User;
import com.sixcube.recletter.user.dto.UserInfo;
import com.sixcube.recletter.user.dto.req.UpdateUserPasswordReq;
import com.sixcube.recletter.user.dto.req.UpdateUserReq;

public interface UserService {

    public UserInfo searchUserInfoByUserId(String userId);

    public User createUser(User user) throws Exception;

    public void updateUser(UpdateUserReq updateUserReq, User user);

    public boolean updateUserPassword(UpdateUserPasswordReq updateUserPasswordReq, User user);

    public void deleteUser(User user);

    public boolean checkDuplicatiedId(String userId);

    public void resetPassword(String password, String email) throws Exception;
}
