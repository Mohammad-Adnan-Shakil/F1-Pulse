package com.f1pulse.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.f1pulse.backend.model.DriverDTO;
import com.f1pulse.backend.model.TeamDTO;
import com.f1pulse.backend.model.RaceDTO;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Component
public class F1ApiClient {

    private final RestTemplate restTemplate;

    private final String BASE_URL = "https://api.jolpi.ca/ergast/f1";

    public F1ApiClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<DriverDTO> fetchDrivers() {
        try {
            String response = restTemplate.getForObject(BASE_URL + "/current/drivers.json", String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode drivers = root
                    .path("MRData")
                    .path("DriverTable")
                    .path("Drivers");

            List<DriverDTO> result = new ArrayList<>();

            for (JsonNode driver : drivers) {
                String name = driver.path("givenName").asText() + " " + driver.path("familyName").asText();
                String code = driver.path("code").asText();
                String nationality = driver.path("nationality").asText();

                result.add(new DriverDTO(name, code, nationality));
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching drivers: " + e.getMessage());
        }
    }

    public List<TeamDTO> fetchTeams() {
        try {
            String response = restTemplate.getForObject(BASE_URL + "/current/constructors.json", String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode teams = root
                    .path("MRData")
                    .path("ConstructorTable")
                    .path("Constructors");

            List<TeamDTO> result = new ArrayList<>();

            for (JsonNode team : teams) {
                String name = team.path("name").asText();
                String nationality = team.path("nationality").asText();

                result.add(new TeamDTO(name, nationality));
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching teams: " + e.getMessage());
        }
    }

    public List<RaceDTO> fetchRaces() {
        try {
            String response = restTemplate.getForObject(BASE_URL + "/current/races.json", String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);

            JsonNode races = root
                    .path("MRData")
                    .path("RaceTable")
                    .path("Races");

            List<RaceDTO> result = new ArrayList<>();

            for (JsonNode race : races) {

                String raceName = race.path("raceName").asText();
                String date = race.path("date").asText();

                JsonNode circuit = race.path("Circuit");
                String circuitName = circuit.path("circuitName").asText();

                JsonNode locationNode = circuit.path("Location");
                String location = locationNode.path("locality").asText();
                String country = locationNode.path("country").asText();

                result.add(new RaceDTO(
                        raceName,
                        circuitName,
                        location,
                        country,
                        date
                ));
            }

            return result;

        } catch (Exception e) {
            throw new RuntimeException("Error fetching races: " + e.getMessage());
        }
    }
}