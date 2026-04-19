package com.f1pulse.backend.controller;

import com.f1pulse.backend.model.Race;
import com.f1pulse.backend.repository.RaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/races")
public class RaceController {

    private final RaceRepository raceRepository;

    public RaceController(RaceRepository raceRepository) {
        this.raceRepository = raceRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllRaces() {
        try {
            List<Race> races = raceRepository.findBySeasonAndDriverIdIsNullOrderByDateAsc(2026);
            return ResponseEntity.ok(races);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to load races");
        }
    }
}
