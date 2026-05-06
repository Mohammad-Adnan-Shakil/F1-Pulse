package com.f1pulse.backend.ai.telemetry;

import com.f1pulse.backend.ai.dto.DeltaAnalystChatRequest;

import java.util.Collection;
import java.util.List;
import java.util.Map;

public class TelemetryPromptContext {

    private final DeltaAnalystChatRequest request;

    public TelemetryPromptContext(DeltaAnalystChatRequest request) {
        this.request = request;
    }

    public String toPromptText() {
        return String.format(
                "driver1=%s, driver2=%s, speed=%s, throttle=%s, brake=%s, gear=%s, sectorDelta=%s",
                request.getDriver1(),
                request.getDriver2(),
                summarizeData(request.getSpeedData()),
                summarizeData(request.getThrottleData()),
                summarizeData(request.getBrakeData()),
                summarizeData(request.getGearData()),
                summarizeData(request.getSectorDelta())
        );
    }

    private static String summarizeData(Object data) {
        if (data instanceof Map<?, ?> map) {
            return summarizeSeries(map);
        }

        if (data instanceof Collection<?> collection) {
            return summarizeNumbers(collection);
        }

        return data == null ? "none" : String.valueOf(data);
    }

    private static String summarizeSeries(Map<?, ?> data) {
        if (data == null || data.isEmpty()) {
            return "none";
        }

        StringBuilder summary = new StringBuilder();
        data.forEach((driver, values) -> summary
                .append(driver)
                .append(": ")
                .append(values instanceof Collection<?> collection ? summarizeNumbers(collection) : values)
                .append("; "));
        return summary.toString();
    }

    private static String summarizeNumbers(Collection<?> values) {
        if (values == null || values.isEmpty()) {
            return "none";
        }

        List<Double> numbers = values.stream()
                .filter(Number.class::isInstance)
                .map(Number.class::cast)
                .map(Number::doubleValue)
                .toList();

        if (numbers.isEmpty()) {
            return "points=0";
        }

        double min = numbers.stream().mapToDouble(Double::doubleValue).min().orElse(0);
        double max = numbers.stream().mapToDouble(Double::doubleValue).max().orElse(0);
        double avg = numbers.stream().mapToDouble(Double::doubleValue).average().orElse(0);
        return String.format("points=%d min=%.2f max=%.2f avg=%.2f sample=%s",
                numbers.size(), min, max, avg, numbers.subList(0, Math.min(numbers.size(), 8)));
    }
}
