package com.lifelink.controller;

import com.lifelink.dto.UserProfileDto;
import com.lifelink.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final AuthService authService;

    public ProfileController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<UserProfileDto> getProfile() {
        return ResponseEntity.ok(UserProfileDto.fromUser(authService.getCurrentAuthenticatedUser()));
    }

    @PutMapping
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UserProfileDto updateDto) {
        return ResponseEntity.ok(authService.updateProfile(updateDto));
    }
}
