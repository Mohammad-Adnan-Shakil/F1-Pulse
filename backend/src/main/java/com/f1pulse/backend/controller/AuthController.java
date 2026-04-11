package com.f1pulse.backend.controller;

import com.f1pulse.backend.dto.AuthRequest;
import com.f1pulse.backend.dto.AuthResponse;
import com.f1pulse.backend.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.f1pulse.backend.dto.ApiResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    // Constructor Injection (Best Practice)
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody AuthRequest request
    ) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {

    AuthResponse response = authService.login(request);

    return ResponseEntity.ok(
            new ApiResponse<>(true, "Login successful", response)
    );
}
}