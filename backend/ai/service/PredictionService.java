package com.f1pulse.ai.service;

import com.f1pulse.ai.dto.PredictionRequestDTO;
import com.f1pulse.ai.dto.PredictionResponseDTO;

public interface PredictionService {

    PredictionResponseDTO predictRaceOutcome(PredictionRequestDTO request);
}