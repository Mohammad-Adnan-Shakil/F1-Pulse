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
            logger.info("Delta Analyst processing telemetry analysis for drivers: {} vs {}", 
                    request.getDriver1(), request.getDriver2());
            
            logger.debug("Question: {}", request.getUserMessage());
            logger.debug("Telemetry payload present - Speed: {}, Throttle: {}, Brake: {}, Gear: {}, Sector: {}",
                    request.getSpeedData() != null,
                    request.getThrottleData() != null,
                    request.getBrakeData() != null,
                    request.getGearData() != null,
                    request.getSectorDelta() != null);

            String analysis = deltaAnalystService.analyzeTelemetry(request);
            
            logger.info("Successfully generated telemetry analysis for drivers: {} vs {}", 
                    request.getDriver1(), request.getDriver2());

            return ResponseEntity.ok(
                    new ApiResponse<>(true, "Telemetry analysis completed", analysis)
            );
            
        } catch (Exception e) {
            logger.error("Error in Delta Analyst service: {}", e.getMessage(), e);
            return ResponseEntity.status(500)
                    .body(new ApiResponse<>(false, "Internal server error", null));
        }
    }

}
