package com.f1pulse.backend.ai.dto;

import jakarta.validation.constraints.*;

public class PredictionRequestDTO {

    @NotNull
    @Min(1)
    @Max(20)
    private Integer gridPosition;

    @NotNull
    @Min(0)
    @Max(10)
    private Integer driverForm;

    @NotNull
    @Min(0)
    @Max(10)
    private Integer teamPerformance;

    @NotNull
    @Min(0)
    @Max(10)
    private Integer trackAffinity;

    // getters & setters
}