package com.storerating.app.controller;

import com.storerating.app.dto.LoginRequest;
import com.storerating.app.dto.SignupRequest;
import com.storerating.app.dto.UpdatePasswordRequest;
import com.storerating.app.dto.UpdateProfileRequest;
import com.storerating.app.model.User;
import com.storerating.app.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest request) {
        try {
            User user = authService.signup(request);
            return ResponseEntity.ok(toResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = authService.login(request);
            return ResponseEntity.ok(toResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(401).body(error(e.getMessage()));
        }
    }

    @GetMapping("/me/{id}")
    public ResponseEntity<?> getMe(@PathVariable Long id) {
        try {
            User user = authService.getUserById(id);
            return ResponseEntity.ok(toResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(error(e.getMessage()));
        }
    }

    @PutMapping("/password/{id}")
    public ResponseEntity<?> updatePassword(@PathVariable Long id, @Valid @RequestBody UpdatePasswordRequest request) {
        try {
            authService.updatePassword(id, request);
            return ResponseEntity.ok(success("Password updated successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @Valid @RequestBody UpdateProfileRequest request) {
        try {
            User user = authService.updateProfile(id, request);
            return ResponseEntity.ok(toResponse(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(error(e.getMessage()));
        }
    }

    private Map<String, Object> toResponse(User user) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", user.getId());
        map.put("name", user.getName());
        map.put("email", user.getEmail());
        map.put("address", user.getAddress());
        map.put("role", user.getRole());
        return map;
    }

    private Map<String, String> error(String message) {
        Map<String, String> map = new HashMap<>();
        map.put("message", message);
        return map;
    }

    private Map<String, String> success(String message) {
        Map<String, String> map = new HashMap<>();
        map.put("message", message);
        return map;
    }
}
