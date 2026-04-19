package com.f1pulse.backend.ai.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.f1pulse.backend.ai.dto.PredictionRequestDTO;
import com.f1pulse.backend.ai.dto.PredictionResponseDTO;
import com.f1pulse.backend.util.PythonExecutor;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class PredictionServiceImpl implements PredictionService {

    private final PythonExecutor pythonExecutor;

    public PredictionServiceImpl(PythonExecutor pythonExecutor) {
        this.pythonExecutor = pythonExecutor;
    }

    @Override
    public PredictionResponseDTO predictRaceOutcome(PredictionRequestDTO request) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("gridPosition", request.getGridPosition());
        payload.put("driverForm", request.getDriverForm());
        payload.put("teamPerformance", request.getTeamPerformance());
        payload.put("trackAffinity", request.getTrackAffinity());

        JsonNode mlResult = pythonExecutor.runScript("ml/predict.py", payload);

        double predictedPosition = mlResult.path("predictedPosition").asDouble(Double.NaN);
        double confidence = mlResult.path("confidence").asDouble(Double.NaN);

        if (Double.isNaN(predictedPosition) || Double.isNaN(confidence)) {
            throw new RuntimeException("ML response missing required prediction fields");
        }

        return new PredictionResponseDTO(predictedPosition, confidence);
    }
}
