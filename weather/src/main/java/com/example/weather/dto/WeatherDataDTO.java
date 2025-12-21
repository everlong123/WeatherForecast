package com.example.weather.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class WeatherDataDTO {
    private Long id;
    private Double latitude;
    private Double longitude;
    private String city;
    private String district;
    private String ward;
    private Double temperature;
    private Double feelsLike;
    private Double humidity;
    private Double pressure;
    private Double windSpeed;
    private Double windDirection;
    private Double visibility;
    private Double cloudiness;
    private Double rainVolume;
    private Double snowVolume;
    private String mainWeather;
    private String description;
    private String icon;
    private LocalDateTime recordedAt;
}


























