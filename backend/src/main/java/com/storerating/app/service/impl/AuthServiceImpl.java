package com.storerating.app.service.impl;

import com.storerating.app.dto.LoginRequest;
import com.storerating.app.dto.SignupRequest;
import com.storerating.app.dto.UpdatePasswordRequest;
import com.storerating.app.dto.UpdateProfileRequest;
import com.storerating.app.model.User;
import com.storerating.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.storerating.app.service.AuthService;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setAddress(request.getAddress());
        user.setRole("NORMAL_USER");
        return userRepository.save(user);
    }

    @Override
    public User login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        return user;
    }

    @Override
    public User updatePassword(Long userId, UpdatePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (!user.getPassword().equals(request.getOldPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }
        user.setPassword(request.getNewPassword());
        return userRepository.save(user);
    }

    @Override
    public User updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(request.getName());
        user.setAddress(request.getAddress());
        return userRepository.save(user);
    }

    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
