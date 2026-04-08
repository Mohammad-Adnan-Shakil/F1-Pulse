package com.f1pulse.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.f1pulse.backend.model.DriverDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Service
public class F1Service {

    private final RestTemplate restTemplate;
    private final String url = "https://api.jolpi.ca/ergast/f1/current/drivers.json";

    public F1Service(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<DriverDTO> getDrivers() {
        try {
            String response = restTemplate.getForObject(url, String.class);

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
            throw new RuntimeException("Error parsing drivers: " + e.getMessage());
        }
    }
}