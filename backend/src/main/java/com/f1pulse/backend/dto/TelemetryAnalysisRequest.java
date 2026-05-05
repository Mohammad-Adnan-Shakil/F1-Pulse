package com.f1pulse.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class TelemetryAnalysisRequest {

    @NotBlank(message = "Driver 1 is required")
    private String driver1;

    @NotBlank(message = "Driver 2 is required")
    private String driver2;

    @NotNull(message = "Speed data is required")
    private List<Double> speedData;

    @NotNull(message = "Throttle data is required")
    private List<Integer> throttleData;

    @NotNull(message = "Brake data is required")
    private List<Double> brakeData;

    @NotNull(message = "Gear data is required")
    private List<Integer> gearData;

    @NotNull(message = "Sector delta data is required")
    private List<Double> sectorDelta;

    @NotBlank(message = "Question is required")
    private String question;

    public TelemetryAnalysisRequest() {}

    public String getDriver1() {
        return driver1;
    }

    public void setDriver1(String driver1) {
        this.driver1 = driver1;
    }

    public String getDriver2() {
        return driver2;
    }

    public void setDriver2(String driver2) {
        this.driver2 = driver2;
    }

    public List<Double> getSpeedData() {
        return speedData;
    }

    public void setSpeedData(List<Double> speedData) {
        this.speedData = speedData;
    }

    public List<Integer> getThrottleData() {
        return throttleData;
    }

    public void setThrottleData(List<Integer> throttleData) {
        this.throttleData = throttleData;
    }

    public List<Double> getBrakeData() {
        return brakeData;
    }

    public void setBrakeData(List<Double> brakeData) {
        this.brakeData = brakeData;
    }

    public List<Integer> getGearData() {
        return gearData;
    }

    public void setGearData(List<Integer> gearData) {
        this.gearData = gearData;
    }

    public List<Double> getSectorDelta() {
        return sectorDelta;
    }

    public void setSectorDelta(List<Double> sectorDelta) {
        this.sectorDelta = sectorDelta;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }
}
