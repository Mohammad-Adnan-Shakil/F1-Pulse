package com.f1pulse.backend.controller;

import com.f1pulse.backend.dto.UserResponse;
import com.f1pulse.backend.dto.FavoriteDriverRequest;
import com.f1pulse.backend.service.UserService;
import com.f1pulse.backend.dto.ApiResponse;
import com.f1pulse.backend.exception.UserNotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User Profile", description = "User profile management and preferences")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    
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

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> getProfile() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();

        UserResponse user = userService.getCurrentUser(email);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Profile fetched successfully", user)
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @Valid @RequestBody FavoriteDriverRequest request) {
        
        try {
            logger.info("Updating profile for user with favorite driver: {}", request.getFavoriteDriver());
            
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            logger.debug("Authenticated user email: {}", email);

            UserResponse user = userService.updateFavoriteDriver(email, request);
            
            logger.info("Successfully updated favorite driver for user: {}", email);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Profile updated successfully", user)
            );
            
        } catch (UserNotFoundException e) {
            logger.error("User not found during profile update: {}", e.getMessage());
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(false, "User not found", null));

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid profile update request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
                    
        } catch (Exception e) {
            logger.error("Error updating profile: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, "Internal server error", null));
        }
    }

    @PutMapping("/profile/favorite-driver")
    public ResponseEntity<ApiResponse<UserResponse>> updateFavoriteDriver(
            @Valid @RequestBody FavoriteDriverRequest request) {
        
        try {
            logger.info("Updating favorite driver for user: {}", request.getFavoriteDriver());
            
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = auth.getName();
            
            logger.debug("Authenticated user email: {}", email);

            UserResponse user = userService.updateFavoriteDriver(email, request);
            
            logger.info("Successfully updated favorite driver for user: {}", email);

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Favorite driver updated successfully", user)
            );
            
        } catch (UserNotFoundException e) {
            logger.error("User not found during favorite driver update: {}", e.getMessage());
            return ResponseEntity.status(404)
                    .body(new ApiResponse<>(false, "User not found", null));

        } catch (IllegalArgumentException e) {
            logger.warn("Invalid favorite driver update request: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(new ApiResponse<>(false, e.getMessage(), null));
                    
        } catch (Exception e) {
            logger.error("Error updating favorite driver: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, "Internal server error", null));
        }
    }
}
