package com.f1pulse.ai.controller;

import com.f1pulse.ai.dto.PredictionRequestDTO;
import com.f1pulse.ai.service.PredictionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestBody PredictionRequestDTO request) {
        return ResponseEntity.ok(predictionService.predictRaceOutcome(request));
    }
}