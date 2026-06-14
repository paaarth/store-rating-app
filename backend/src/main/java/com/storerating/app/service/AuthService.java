package com.storerating.app.service;

import com.storerating.app.dto.LoginRequest;
import com.storerating.app.dto.SignupRequest;
import com.storerating.app.dto.UpdatePasswordRequest;
import com.storerating.app.dto.UpdateProfileRequest;
import com.storerating.app.model.User;

public interface AuthService {

    User signup(SignupRequest request);

    User login(LoginRequest request);

    User updatePassword(Long userId, UpdatePasswordRequest request);

    User updateProfile(Long userId, UpdateProfileRequest request);

    User getUserById(Long userId);
}
