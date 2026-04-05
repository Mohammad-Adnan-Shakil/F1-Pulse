package com.f1pulse.backend.controller;

import com.f1pulse.backend.model.Prediction;
import com.f1pulse.backend.repository.PredictionRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/predictions")
@CrossOrigin
public class PredictionController {

    private final PredictionRepository repository;

    public PredictionController(PredictionRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Prediction> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Prediction create(@RequestBody Prediction prediction) {
        return repository.save(prediction);
    }
}