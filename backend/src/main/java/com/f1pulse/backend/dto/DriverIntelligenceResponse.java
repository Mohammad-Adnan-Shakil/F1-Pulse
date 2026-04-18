package com.f1pulse.backend.dto;

public class DriverIntelligenceResponse {

    private Long driverId;
    private double rfPrediction;
    private double xgbPrediction;
    private double confidence;
    private String confidenceLabel;
    private String simulationImpact;
    private String finalInsight;

    // GETTERS

    public Long getDriverId() {
        return driverId;
    }

    public double getRfPrediction() {
        return rfPrediction;
    }

    public double getXgbPrediction() {
        return xgbPrediction;
    }

    public double getConfidence() {
        return confidence;
    }

    public String getConfidenceLabel() {
        return confidenceLabel;
    }

    public String getSimulationImpact() {
        return simulationImpact;
    }

    public String getFinalInsight() {
        return finalInsight;
    }

    // SETTERS

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public void setRfPrediction(double rfPrediction) {
        this.rfPrediction = rfPrediction;
    }

    public void setXgbPrediction(double xgbPrediction) {
        this.xgbPrediction = xgbPrediction;
    }

    public void setConfidence(double confidence) {
        this.confidence = confidence;
    }

    public void setConfidenceLabel(String confidenceLabel) {
        this.confidenceLabel = confidenceLabel;
    }

    public void setSimulationImpact(String simulationImpact) {
        this.simulationImpact = simulationImpact;
    }

    public void setFinalInsight(String finalInsight) {
        this.finalInsight = finalInsight;
    }
}