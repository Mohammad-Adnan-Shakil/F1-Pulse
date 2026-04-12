package com.f1pulse.ai.service;

import com.f1pulse.ai.dto.PredictionRequestDTO;
import com.f1pulse.ai.dto.PredictionResponseDTO;
import org.springframework.stereotype.Service;

@Service
public class PredictionServiceImpl implements PredictionService {

    @Override
    public PredictionResponseDTO predictRaceOutcome(PredictionRequestDTO request) {

        // TEMPORARY LOGIC (will replace with ML later)

        double score =
                (0.4 * request.getGridPosition()) +
                (0.3 * request.getDriverForm()) +
                (0.2 * request.getTeamPerformance()) +
                (0.1 * request.getTrackAffinity());

        double predictedPosition = Math.max(1, 20 - score);

        String confidence = "MEDIUM";

        return new PredictionResponseDTO(predictedPosition, confidence);
    }
}