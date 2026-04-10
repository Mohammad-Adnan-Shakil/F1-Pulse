package com.f1pulse.backend.service;

import com.f1pulse.backend.model.*;
import com.f1pulse.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class F1Service {

    private final DriverRepository driverRepository;
    private final TeamRepository teamRepository;
    private final RaceRepository raceRepository;
    private final SyncMetaRepository syncMetaRepository;
    private final F1ApiClient f1ApiClient;

    public F1Service(DriverRepository driverRepository,
                     TeamRepository teamRepository,
                     RaceRepository raceRepository,
                     SyncMetaRepository syncMetaRepository,
                     F1ApiClient f1ApiClient) {

        this.driverRepository = driverRepository;
        this.teamRepository = teamRepository;
        this.raceRepository = raceRepository;
        this.syncMetaRepository = syncMetaRepository;
        this.f1ApiClient = f1ApiClient;
    }

    // ================= DRIVERS =================

    public List<DriverDTO> getDrivers() {
        return f1ApiClient.fetchDrivers();
    }

    public List<Driver> saveDrivers() {

        String key = "drivers";

        SyncMeta meta = syncMetaRepository.findById(key).orElse(null);
        long currentTime = System.currentTimeMillis();

        long cacheDuration = 60 * 60 * 1000;

        if (meta != null && (currentTime - meta.getLastSyncTime()) < cacheDuration) {
            System.out.println("Using cached drivers data");
            return driverRepository.findAll();
        }

        System.out.println("Fetching fresh drivers data");

        driverRepository.deleteAll();

        List<DriverDTO> dtos = f1ApiClient.fetchDrivers();
        List<Driver> drivers = new ArrayList<>();

        for (DriverDTO dto : dtos) {
            drivers.add(new Driver(
                    dto.getName(),
                    dto.getCode(),
                    dto.getNationality()
            ));
        }

        syncMetaRepository.save(new SyncMeta(key, currentTime));

        return driverRepository.saveAll(drivers);
    }

    public List<Driver> getDriversFromDB() {
        return driverRepository.findAll();
    }

    // ================= TEAMS =================

    public List<TeamDTO> getTeams() {
        return f1ApiClient.fetchTeams();
    }

    public List<Team> saveTeams() {

        String key = "teams";

        SyncMeta meta = syncMetaRepository.findById(key).orElse(null);
        long currentTime = System.currentTimeMillis();

        long cacheDuration = 60 * 60 * 1000;

        if (meta != null && (currentTime - meta.getLastSyncTime()) < cacheDuration) {
            System.out.println("Using cached teams data");
            return teamRepository.findAll();
        }

        System.out.println("Fetching fresh teams data");

        teamRepository.deleteAll();

        List<TeamDTO> dtos = f1ApiClient.fetchTeams();
        List<Team> teams = new ArrayList<>();

        for (TeamDTO dto : dtos) {
            teams.add(new Team(
                    dto.getName(),
                    dto.getNationality()
            ));
        }

        syncMetaRepository.save(new SyncMeta(key, currentTime));

        return teamRepository.saveAll(teams);
    }

    public List<Team> getTeamsFromDB() {
        return teamRepository.findAll();
    }

    // ================= RACES =================

    public List<RaceDTO> getRaces() {
        return f1ApiClient.fetchRaces();
    }

    public List<Race> saveRaces() {

        String key = "races";

        SyncMeta meta = syncMetaRepository.findById(key).orElse(null);
        long currentTime = System.currentTimeMillis();

        long cacheDuration = 60 * 60 * 1000;

        if (meta != null && (currentTime - meta.getLastSyncTime()) < cacheDuration) {
            System.out.println("Using cached races data");
            return raceRepository.findAll();
        }

        System.out.println("Fetching fresh races data");

        raceRepository.deleteAll();

        List<RaceDTO> dtos = f1ApiClient.fetchRaces();
        List<Race> races = new ArrayList<>();

        for (RaceDTO dto : dtos) {
            races.add(new Race(
                    dto.getRaceName(),
                    dto.getCircuitName(),
                    dto.getLocation(),
                    dto.getCountry(),
                    dto.getDate()
            ));
        }

        syncMetaRepository.save(new SyncMeta(key, currentTime));

        return raceRepository.saveAll(races);
    }

    public List<Race> getRacesFromDB() {
        return raceRepository.findAll();
    }
}