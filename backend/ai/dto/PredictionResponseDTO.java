package com.f1pulse.ai.dto;

public class PredictionResponseDTO {

    private double predictedPosition;
    private String confidence;

    public PredictionResponseDTO() {}

    public PredictionResponseDTO(double predictedPosition, String confidence) {
        this.predictedPosition = predictedPosition;
        this.confidence = confidence;
    }

    public double getPredictedPosition() {
        return predictedPosition;
    }

    public void setPredictedPosition(double predictedPosition) {
        this.predictedPosition = predictedPosition;
    }

    public String getConfidence() {
        return confidence;
    }

    public void setConfidence(String confidence) {
        this.confidence = confidence;
    }
}