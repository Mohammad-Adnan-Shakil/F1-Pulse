package com.f1pulse.backend.ai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.f1pulse.backend.ai.dto.PredictionRequestDTO;
import com.f1pulse.backend.ai.dto.PredictionResponseDTO;
import com.f1pulse.backend.ai.integration.PythonExecutor;
import org.springframework.stereotype.Service;

@Service
public class PredictionServiceImpl implements PredictionService {

    private final PythonExecutor pythonExecutor;
    private final ObjectMapper objectMapper;

    public PredictionServiceImpl(PythonExecutor pythonExecutor, ObjectMapper objectMapper) {
        this.pythonExecutor = pythonExecutor;
        this.objectMapper = objectMapper;
    }

    @Override
public PredictionResponseDTO predictRaceOutcome(PredictionRequestDTO request) {
    try {
        String inputJson = objectMapper.writeValueAsString(request);

        System.out.println("AI Request: " + inputJson);

        String output = pythonExecutor.runPredictionScript(inputJson);

        System.out.println("AI Response: " + output);

        if (output.contains("error")) {
            throw new RuntimeException("AI error: " + output);
        }

        return objectMapper.readValue(output, PredictionResponseDTO.class);

    } catch (Exception e) {
        throw new RuntimeException("AI prediction failed: " + e.getMessage(), e);
    }
}
}