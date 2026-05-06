package com.f1pulse.backend.ai.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;

public class DeltaAnalystChatRequest {

    @NotBlank(message = "Driver 1 is required")
    private String driver1;

    @NotBlank(message = "Driver 2 is required")
    private String driver2;

    private Object speedData;
    private Object throttleData;
    private Object brakeData;
    private Object gearData;
    private Object sectorDelta;

    @NotBlank(message = "User message is required")
    @JsonAlias("question")
    private String userMessage;

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

    public Object getSpeedData() {
        return speedData;
    }

    public void setSpeedData(Object speedData) {
        this.speedData = speedData;
    }

    public Object getThrottleData() {
        return throttleData;
    }

    public void setThrottleData(Object throttleData) {
        this.throttleData = throttleData;
    }

    public Object getBrakeData() {
        return brakeData;
    }

    public void setBrakeData(Object brakeData) {
        this.brakeData = brakeData;
    }

    public Object getGearData() {
        return gearData;
    }

    public void setGearData(Object gearData) {
        this.gearData = gearData;
    }

    public Object getSectorDelta() {
        return sectorDelta;
    }

    public void setSectorDelta(Object sectorDelta) {
        this.sectorDelta = sectorDelta;
    }

    public String getUserMessage() {
        return userMessage;
    }

    public void setUserMessage(String userMessage) {
        this.userMessage = userMessage;
    }
}
