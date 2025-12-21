package com.example.weather.controller;

import com.example.weather.dto.WeatherDataDTO;
import com.example.weather.service.WeatherDataService;
import com.example.weather.service.MockWeatherService;
import com.example.weather.service.WeatherPredictionService;
import com.example.weather.service.NominatimService;
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
    private NominatimService nominatimService;

    @GetMapping("/current")
    public ResponseEntity<WeatherDataDTO> getCurrentWeather(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ward) {
        
        // Nếu không có lat/lng, lấy từ địa điểm bằng Nominatim
        if (lat == null || lng == null) {
            Map<String, Double> coords = null;
            
            // Thử Nominatim (miễn phí, không cần API key)
            if (nominatimService != null && nominatimService.isAvailable()) {
                coords = nominatimService.getCoordinatesFromLocation(city, district, ward);
            }
            
            // Nếu Nominatim không có kết quả, thử OpenWeather (nếu có API key) - chỉ cho geocoding
            if (coords == null && openWeatherService != null && openWeatherService.isAvailable()) {
                coords = openWeatherService.getCoordinatesFromLocation(city, district, ward);
            }
            
            if (coords != null && coords.containsKey("lat") && coords.containsKey("lng")) {
                lat = coords.get("lat");
                lng = coords.get("lng");
            } else {
                // Fallback: tọa độ mặc định (trung tâm Việt Nam)
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

    /**
     * Dự đoán thời tiết sử dụng ML
     * 
     * LƯU Ý: User chỉ cần nhập địa điểm (lat/lng), KHÔNG cần nhập thông số thời tiết.
     * Backend sẽ TỰ ĐỘNG lấy weather data từ API/Database và gửi vào ML service.
     * 
     * Flow:
     * 1. User nhập lat/lng (hoặc địa điểm)
     * 2. Backend tự động lấy weather data từ OpenWeatherMap API hoặc Database
     * 3. Backend gửi weather data (temperature, humidity, pressure, windSpeed, cloudiness...) vào ML service
     * 4. ML service dự đoán và trả về kết quả
     */
    @GetMapping("/forecast")
    public ResponseEntity<List<Map<String, Object>>> getWeatherForecast(
            @RequestParam Double lat,  // User chỉ nhập địa điểm
            @RequestParam Double lng,  // User chỉ nhập địa điểm
            @RequestParam(defaultValue = "24") int hoursAhead) {
        
        // BƯỚC 1: Tự động lấy weather data từ database (nếu có)
        WeatherDataDTO currentWeather = weatherDataService.getCurrentWeather(lat, lng);
        
        // BƯỚC 2: Nếu không có trong DB, TỰ ĐỘNG lấy từ OpenWeatherMap API
        // API sẽ trả về đầy đủ: temperature, humidity, pressure, windSpeed, cloudiness...
        if (currentWeather == null && openWeatherService != null && openWeatherService.isAvailable()) {
            currentWeather = openWeatherService.getCurrentWeather(lat, lng, null, null, null);
        }
        
        // BƯỚC 3: Nếu API không có, dùng mock data (fallback)
        if (currentWeather == null) {
            currentWeather = mockWeatherService.generateWeatherData(lat, lng, null, null, null);
        }
        
        // BƯỚC 4: Gửi weather data (đã có đầy đủ từ API/DB) vào ML service để dự đoán
        // currentWeather đã có: temperature, humidity, pressure, windSpeed, cloudiness...
        List<Map<String, Object>> predictions = predictionService.predictWeather(currentWeather, hoursAhead);
        
        if (predictions == null) {
            return ResponseEntity.status(503).build();
        }
        
        return ResponseEntity.ok(predictions);
    }
}

