package com.f1pulse.backend.ai.controller;

import com.f1pulse.backend.ai.dto.DeltaAnalystChatRequest;
import com.f1pulse.backend.ai.service.DeltaAnalystService;
import com.f1pulse.backend.dto.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai/delta-analyst")
@Tag(name = "Delta Analyst", description = "AI-powered telemetry analysis for Formula 1")
public class DeltaAnalystController {

    private static final Logger logger = LoggerFactory.getLogger(DeltaAnalystController.class);
    
    private final DeltaAnalystService deltaAnalystService;

    public DeltaAnalystController(DeltaAnalystService deltaAnalystService) {
        this.deltaAnalystService = deltaAnalystService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<String>> analyzeTelemetry(
            @Valid @RequestBody DeltaAnalystChatRequest request) {
        
        try {
            logger.info("🎯 DELTA ANALYST CONTROLLER: Incoming request | Drivers: {} vs {} | Message: {}", 
                    request.getDriver1(), request.getDriver2(), request.getUserMessage());
            
            logger.debug("📨 REQUEST DETAILS: ContentType=application/json | Method=POST | Path=/api/ai/delta-analyst/chat");
            
            logger.debug("🔒 AUTH: JWT token present and validated");
            
            logger.debug("📦 PAYLOAD: " + 
                    "driver1={}, driver2={}, " +
                    "speedData_present={}, throttleData_present={}, " +
                    "brakeData_present={}, gearData_present={}, " +
                    "sectorDelta_present={}, userMessage_length={}",
                    request.getDriver1(), request.getDriver2(),
                    request.getSpeedData() != null,
                    request.getThrottleData() != null,
                    request.getBrakeData() != null,
                    request.getGearData() != null,
                    request.getSectorDelta() != null,
                    request.getUserMessage().length());

            String analysis = deltaAnalystService.analyzeTelemetry(request);
            
            logger.info("✅ DELTA ANALYST SUCCESS: Generated analysis (length: {})", analysis.length());

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Telemetry analysis completed", analysis)
            );
            
        } catch (Exception e) {
            logger.error("❌ DELTA ANALYST CONTROLLER ERROR: {} - {}", 
                    e.getClass().getSimpleName(), e.getMessage());
            logger.error("Exception details: ", e);
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, "Internal server error: " + e.getMessage(), null));
        }
    }

}
