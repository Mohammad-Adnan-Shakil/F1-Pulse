package com.f1pulse.backend.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SyncScheduler {

    private final SyncService syncService;

    public SyncScheduler(SyncService syncService) {
        this.syncService = syncService;
    }

    // Run every 1 hour
    @Scheduled(fixedDelayString = "3600000")
    public void syncDriversAutomatically() {
        System.out.println("Auto-syncing drivers...");
        syncService.syncDrivers();
    }

    @Scheduled(fixedDelayString = "3600000")
    public void syncTeamsAutomatically() {
        System.out.println("Auto-syncing teams...");
        syncService.syncTeams();
    }

    @Scheduled(fixedDelayString = "3600000")
    public void syncRacesAutomatically() {
        System.out.println("Auto-syncing races...");
        syncService.syncRaces();
    }
}