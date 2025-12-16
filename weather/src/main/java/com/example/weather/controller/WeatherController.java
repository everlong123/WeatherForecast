package com.example.weather.controller;

import com.example.weather.dto.WeatherDataDTO;
import com.example.weather.service.WeatherDataService;
import com.example.weather.service.WeatherApiService;
import com.example.weather.service.OpenWeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/weather")
public class WeatherController {
    @Autowired
    private WeatherDataService weatherDataService;

    @Autowired
    private WeatherApiService weatherApiService;

    @Autowired(required = false)
    private OpenWeatherService openWeatherService;

    @GetMapping("/current")
    public ResponseEntity<WeatherDataDTO> getCurrentWeather(
            @RequestParam Double lat,
            @RequestParam Double lng) {
        WeatherDataDTO weather = weatherDataService.getCurrentWeather(lat, lng);
        if (weather == null) {
            // Try WeatherAPI.com first, then OpenWeather
            weather = weatherApiService.fetchAndSaveWeather(lat, lng, null, null, null);
            if (weather == null && openWeatherService != null) {
                weather = openWeatherService.fetchAndSaveWeather(lat, lng, null, null, null);
            }
        }
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/history")
    public ResponseEntity<List<WeatherDataDTO>> getWeatherHistory(
            @RequestParam Double lat,
            @RequestParam Double lng) {
        return ResponseEntity.ok(weatherDataService.getWeatherHistory(lat, lng));
    }

    @PostMapping("/fetch")
    public ResponseEntity<WeatherDataDTO> fetchWeather(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ward) {
        // Try WeatherAPI.com first
        WeatherDataDTO weather = weatherApiService.fetchAndSaveWeather(lat, lng, city, district, ward);
        if (weather == null && openWeatherService != null) {
            weather = openWeatherService.fetchAndSaveWeather(lat, lng, city, district, ward);
        }
        return ResponseEntity.ok(weather);
    }
}

