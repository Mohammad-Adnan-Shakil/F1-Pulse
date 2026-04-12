package com.f1pulse.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.f1pulse.backend.dto.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 🔴 USER NOT FOUND
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleUserNotFound(UserNotFoundException ex) {

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(new ApiResponse<>(false, ex.getMessage(), null));
    }

    // 🔴 USER ALREADY EXISTS
   @ExceptionHandler(UserAlreadyExistsException.class)
public ResponseEntity<ApiResponse<?>> handleUserAlreadyExists(UserAlreadyExistsException ex) {
    return ResponseEntity.badRequest().body(
        new ApiResponse<>(false, ex.getMessage(), null)
    );
}

    // 🔴 GENERIC FALLBACK
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneric(Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(false, "Something went wrong", null));
    }
}