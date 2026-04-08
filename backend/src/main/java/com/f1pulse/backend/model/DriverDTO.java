package com.f1pulse.backend.model;

public class DriverDTO {

    private String name;
    private String code;
    private String nationality;

    public DriverDTO(String name, String code, String nationality) {
        this.name = name;
        this.code = code;
        this.nationality = nationality;
    }

    public String getName() { return name; }
    public String getCode() { return code; }
    public String getNationality() { return nationality; }
}