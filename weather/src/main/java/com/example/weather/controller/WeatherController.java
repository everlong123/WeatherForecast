package com.example.weather.controller;

import com.example.weather.dto.WeatherDataDTO;
import com.example.weather.service.WeatherDataService;
import com.example.weather.service.MockWeatherService;
import com.example.weather.service.WeatherPredictionService;
import com.example.weather.service.LocationCoordinateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/weather")
public class WeatherController {
    @Autowired
    private WeatherDataService weatherDataService;

    @Autowired
    private MockWeatherService mockWeatherService;

    @Autowired
    private WeatherPredictionService predictionService;
    
    @Autowired(required = false)
    private com.example.weather.service.OpenWeatherService openWeatherService;

    @Autowired
    private LocationCoordinateService locationCoordinateService;

    @GetMapping("/current")
    public ResponseEntity<WeatherDataDTO> getCurrentWeather(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ward) {
        
        // Nếu không có lat/lng, lấy từ địa điểm bằng OpenWeatherMap Geocoding API
        if (lat == null || lng == null) {
            if (openWeatherService != null && openWeatherService.isAvailable()) {
                Map<String, Double> coords = openWeatherService.getCoordinatesFromLocation(city, district, ward);
                if (coords != null && coords.containsKey("lat") && coords.containsKey("lng")) {
                    lat = coords.get("lat");
                    lng = coords.get("lng");
                } else {
                    // Fallback: tọa độ mặc định
                    lat = 16.0583;
                    lng = 108.2772;
                }
            } else {
                // Fallback: tọa độ mặc định
                lat = 16.0583;
                lng = 108.2772;
            }
        }
        
        // Kiểm tra xem có dữ liệu trong database không
        WeatherDataDTO weather = weatherDataService.getCurrentWeather(lat, lng);
        
        // Nếu không có, thử lấy từ OpenWeatherMap API (FREE)
        if (weather == null && openWeatherService != null && openWeatherService.isAvailable()) {
            weather = openWeatherService.getCurrentWeather(lat, lng, city, district, ward);
        }
        
        // Nếu vẫn không có, tạo dữ liệu giả (fallback)
        if (weather == null) {
            weather = mockWeatherService.generateWeatherData(lat, lng, city, district, ward);
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
        // Tạo dữ liệu thời tiết giả mới
        WeatherDataDTO weather = mockWeatherService.generateWeatherData(lat, lng, city, district, ward);
        return ResponseEntity.ok(weather);
    }

    @GetMapping("/forecast")
    public ResponseEntity<List<Map<String, Object>>> getWeatherForecast(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "24") int hoursAhead) {
        // Lấy thời tiết hiện tại
        WeatherDataDTO currentWeather = weatherDataService.getCurrentWeather(lat, lng);
        
        // Nếu không có, thử lấy từ OpenWeatherMap API
        if (currentWeather == null && openWeatherService != null && openWeatherService.isAvailable()) {
            currentWeather = openWeatherService.getCurrentWeather(lat, lng, null, null, null);
        }
        
        // Nếu vẫn không có, tạo dữ liệu giả (fallback)
        if (currentWeather == null) {
            currentWeather = mockWeatherService.generateWeatherData(lat, lng, null, null, null);
        }
        
        // Dự đoán thời tiết
        List<Map<String, Object>> predictions = predictionService.predictWeather(currentWeather, hoursAhead);
        
        if (predictions == null) {
            return ResponseEntity.status(503).build();
        }
        
        return ResponseEntity.ok(predictions);
    }
}

