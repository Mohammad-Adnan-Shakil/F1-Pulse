package com.f1pulse.backend.controller;

import com.f1pulse.backend.dto.UserResponse;
import com.f1pulse.backend.service.UserService;
import com.f1pulse.backend.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {

    Authentication auth = SecurityContextHolder.getContext().getAuthentication();
    String email = auth.getName();

    UserResponse user = userService.getCurrentUser(email);

    return ResponseEntity.ok(
            new ApiResponse<>(true, "User fetched successfully", user)
    );
}
}