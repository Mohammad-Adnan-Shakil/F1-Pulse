package com.f1pulse.backend.ai.service;

import com.f1pulse.backend.ai.prompts.DeltaAnalystPrompts;
import org.springframework.stereotype.Service;

@Service
public class DeltaAnalystService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DeltaAnalystService.class);

    private final GroqApiService groqApiService;

    public DeltaAnalystService(GroqApiService groqApiService) {
        this.groqApiService = groqApiService;
    }

    public String analyzeTelemetry(String userQuestion, Object telemetryContext) {
        try {
            log.info("Delta Analyst service processing telemetry analysis: {}", userQuestion);
            
            // Build prompts using the new prompt utility
            String systemPrompt = DeltaAnalystPrompts.DELTA_ANALYST_SYSTEM_PROMPT;
            String userPrompt = DeltaAnalystPrompts.buildUserPrompt(userQuestion, telemetryContext.toString());
            
            // Make request using the shared Groq API service
            return groqApiService.makeRequest(systemPrompt, userPrompt, 300, 0.3);
            
        } catch (Exception e) {
            log.error("Unexpected error in Delta Analyst service: {} - {}", e.getClass().getSimpleName(), e.getMessage(), e);
            return "Delta Analyst temporarily unavailable.";
        }
    }
}
