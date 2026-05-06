package com.f1pulse.backend.ai.service;

import com.f1pulse.backend.ai.dto.DeltaAnalystChatRequest;
import com.f1pulse.backend.ai.prompts.DeltaAnalystPrompts;
import com.f1pulse.backend.ai.telemetry.TelemetryPromptContext;
import com.f1pulse.backend.ai.util.AiResponseFormatter;
import org.springframework.stereotype.Service;

@Service
public class DeltaAnalystService {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DeltaAnalystService.class);

    private final GroqApiService groqApiService;

    public DeltaAnalystService(GroqApiService groqApiService) {
        this.groqApiService = groqApiService;
    }

    public String analyzeTelemetry(DeltaAnalystChatRequest request) {
        try {
            log.info("Delta Analyst service processing telemetry analysis: {}", request.getUserMessage());
            
            String systemPrompt = DeltaAnalystPrompts.DELTA_ANALYST_SYSTEM_PROMPT;
            String telemetryContext = new TelemetryPromptContext(request).toPromptText();
            String userPrompt = DeltaAnalystPrompts.buildUserPrompt(request.getUserMessage(), telemetryContext);
            
            String response = groqApiService.makeRequest(systemPrompt, userPrompt, 350, 0.25);
            return AiResponseFormatter.isUnavailable(response)
                    ? AiResponseFormatter.deltaAnalystUnavailable()
                    : response;
            
        } catch (Exception e) {
            log.error("Unexpected error in Delta Analyst service: {} - {}", e.getClass().getSimpleName(), e.getMessage(), e);
            return AiResponseFormatter.deltaAnalystUnavailable();
        }
    }
}
