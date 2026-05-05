package com.f1pulse.backend.ai.controller;

import com.f1pulse.backend.ai.service.DeltaAnalystService;
import com.f1pulse.backend.dto.TelemetryAnalysisRequest;
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
            @Valid @RequestBody TelemetryAnalysisRequest request) {
        
        try {
            logger.info("Delta Analyst processing telemetry analysis for drivers: {} vs {}", 
                    request.getDriver1(), request.getDriver2());
            
            logger.debug("Question: {}", request.getQuestion());
            logger.debug("Telemetry data points - Speed: {}, Throttle: {}, Brake: {}, Gear: {}, Sector: {}",
                    request.getSpeedData() != null ? request.getSpeedData().size() : 0,
                    request.getThrottleData() != null ? request.getThrottleData().size() : 0,
                    request.getBrakeData() != null ? request.getBrakeData().size() : 0,
                    request.getGearData() != null ? request.getGearData().size() : 0,
                    request.getSectorDelta() != null ? request.getSectorDelta().size() : 0);

            // Build telemetry context for AI analysis
            TelemetryContext telemetryContext = new TelemetryContext(
                    request.getDriver1(),
                    request.getDriver2(),
                    request.getSpeedData(),
                    request.getThrottleData(),
                    request.getBrakeData(),
                    request.getGearData(),
                    request.getSectorDelta()
            );

            String analysis = deltaAnalystService.analyzeTelemetry(request.getQuestion(), telemetryContext);
            
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

    // Inner class to structure telemetry data for AI analysis
    private static class TelemetryContext {
        private final String driver1;
        private final String driver2;
        private final java.util.List<Double> speedData;
        private final java.util.List<Integer> throttleData;
        private final java.util.List<Double> brakeData;
        private final java.util.List<Integer> gearData;
        private final java.util.List<Double> sectorDelta;

        public TelemetryContext(String driver1, String driver2, 
                           java.util.List<Double> speedData,
                           java.util.List<Integer> throttleData,
                           java.util.List<Double> brakeData,
                           java.util.List<Integer> gearData,
                           java.util.List<Double> sectorDelta) {
            this.driver1 = driver1;
            this.driver2 = driver2;
            this.speedData = speedData;
            this.throttleData = throttleData;
            this.brakeData = brakeData;
            this.gearData = gearData;
            this.sectorDelta = sectorDelta;
        }

        @Override
        public String toString() {
            return String.format(
                    "Driver 1: %s, Driver 2: %s, " +
                    "Speed points: %d, Throttle points: %d, " +
                    "Brake points: %d, Gear points: %d, Sector points: %d",
                    driver1, driver2,
                    speedData != null ? speedData.size() : 0,
                    throttleData != null ? throttleData.size() : 0,
                    brakeData != null ? brakeData.size() : 0,
                    gearData != null ? gearData.size() : 0,
                    sectorDelta != null ? sectorDelta.size() : 0
            );
        }
    }
}
