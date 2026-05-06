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
            log.info("🚀 DELTA ANALYST: Service received request for drivers {} vs {} | Question: {}", 
                    request.getDriver1(), request.getDriver2(), request.getUserMessage());
            
            log.debug("📊 TELEMETRY DATA: Speed={}, Throttle={}, Brake={}, Gear={}, SectorDelta={}", 
                    request.getSpeedData() != null, 
                    request.getThrottleData() != null,
                    request.getBrakeData() != null,
                    request.getGearData() != null,
                    request.getSectorDelta() != null);
            
            String systemPrompt = DeltaAnalystPrompts.DELTA_ANALYST_SYSTEM_PROMPT;
            log.debug("📝 System prompt loaded (length: {})", systemPrompt.length());
            
            String telemetryContext = new TelemetryPromptContext(request).toPromptText();
            log.debug("🔍 Telemetry context built: {}", telemetryContext.substring(0, Math.min(200, telemetryContext.length())));
            
            String userPrompt = DeltaAnalystPrompts.buildUserPrompt(request.getUserMessage(), telemetryContext);
            log.debug("💬 User prompt built (length: {})", userPrompt.length());
            
            log.info("🔗 Calling Groq API with max_tokens=350, temperature=0.25");
            String response = groqApiService.makeRequest(systemPrompt, userPrompt, 350, 0.25);
            
            log.info("✅ Groq API response received (length: {})", response != null ? response.length() : 0);
            
            return AiResponseFormatter.isUnavailable(response)
                    ? AiResponseFormatter.deltaAnalystUnavailable()
                    : response;
            
        } catch (Exception e) {
            log.error("❌ DELTA ANALYST ERROR: {} - {} | Cause: {}", 
                    e.getClass().getSimpleName(), e.getMessage(), e.getCause() != null ? e.getCause().getMessage() : "N/A");
            log.error("Stack trace: ", e);
            return AiResponseFormatter.deltaAnalystUnavailable();
        }
    }
}
