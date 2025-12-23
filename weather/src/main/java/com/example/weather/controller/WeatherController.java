package com.example.weather.controller;

import com.example.weather.dto.WeatherDataDTO;
import com.example.weather.service.WeatherDataService;
import com.example.weather.service.MockWeatherService;
import com.example.weather.service.WeatherPredictionService;
import com.example.weather.service.NominatimService;
import com.example.weather.service.OpenMeteoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
    
    @Autowired(required = false)
    private OpenMeteoService openMeteoService;
    
    @Autowired
    private NominatimService nominatimService;

    @GetMapping("/current")
    public ResponseEntity<WeatherDataDTO> getCurrentWeather(
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ward) {
        
        // Nếu không có lat/lng, lấy từ địa điểm
        if (lat == null || lng == null) {
            Map<String, Double> coords = null;
            
            // Ưu tiên Open-Meteo (miễn phí, không cần API key, tốt hơn cho tiếng Việt)
            if (openMeteoService != null && openMeteoService.isAvailable()) {
                coords = openMeteoService.getCoordinatesFromLocation(city, district, ward);
            }
            
            // Fallback: Thử Nominatim nếu Open-Meteo không có kết quả
            if (coords == null && nominatimService != null && nominatimService.isAvailable()) {
                coords = nominatimService.getCoordinatesFromLocation(city, district, ward);
            }
            
            // Fallback: Thử OpenWeather (nếu có API key) - chỉ cho geocoding
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
        
        // Nếu không có, ưu tiên lấy từ Open-Meteo API (FREE, không cần API key)
        if (weather == null && openMeteoService != null && openMeteoService.isAvailable()) {
            weather = openMeteoService.getCurrentWeather(lat, lng, city, district, ward);
        }
        
        // Fallback: Thử OpenWeatherMap API nếu Open-Meteo không có kết quả
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
        List<WeatherDataDTO> history = weatherDataService.getWeatherHistory(lat, lng);
        
        // Nếu không có hoặc quá ít dữ liệu lịch sử, tự động tạo thêm
        if (history == null || history.size() < 10) {
            System.out.println("History data is limited (" + (history != null ? history.size() : 0) + " items), generating more...");
            mockWeatherService.generateHistoryData(lat, lng, null, null, null, 7, 4); // 7 ngày, mỗi ngày 4 bản ghi (mỗi 6 giờ)
            history = weatherDataService.getWeatherHistory(lat, lng); // Lấy lại sau khi tạo
        }
        
        return ResponseEntity.ok(history);
    }
    
    /**
     * Endpoint để tạo thêm dữ liệu lịch sử thủ công
     */
    @PostMapping("/history/generate")
    public ResponseEntity<Map<String, Object>> generateHistory(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "7") int days,
            @RequestParam(defaultValue = "4") int recordsPerDay,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ward) {
        int count = mockWeatherService.generateHistoryData(lat, lng, city, district, ward, days, recordsPerDay);
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Đã tạo " + count + " bản ghi lịch sử");
        response.put("count", count);
        return ResponseEntity.ok(response);
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
     * Dự báo thời tiết - Ưu tiên dùng forecast từ API, ML chỉ là fallback
     * 
     * Flow (theo thứ tự ưu tiên):
     * 1. OpenWeatherMap One Call API 3.0 (nếu có subscription) - chính xác nhất
     * 2. Open-Meteo API (miễn phí, không cần API key)
     * 3. ML service (fallback cuối cùng)
     * 
     * LƯU Ý: API forecast thường chính xác hơn và nhanh hơn ML, nên ưu tiên dùng API.
     */
    @GetMapping("/forecast")
    public ResponseEntity<List<Map<String, Object>>> getWeatherForecast(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "24") int hoursAhead) {
        
        // BƯỚC 1: Ưu tiên cao nhất - OpenWeatherMap One Call API 3.0 (nếu có subscription)
        if (openWeatherService != null && openWeatherService.isAvailable()) {
            System.out.println("Attempting OpenWeatherMap One Call API 3.0 forecast...");
            try {
                List<Map<String, Object>> oneCallForecast = openWeatherService.getHourlyForecast(lat, lng, hoursAhead);
                if (oneCallForecast != null && !oneCallForecast.isEmpty()) {
                    System.out.println("Using OpenWeatherMap One Call API 3.0 forecast: " + oneCallForecast.size() + " items");
                    return ResponseEntity.ok(oneCallForecast);
                } else {
                    System.out.println("OpenWeatherMap One Call API 3.0 returned null or empty");
                }
            } catch (Exception e) {
                System.err.println("Error calling OpenWeatherMap One Call API 3.0: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("OpenWeatherMap service not available (enabled=" + (openWeatherService != null) + ")");
        }
        
        // BƯỚC 2: Fallback - Open-Meteo API (miễn phí)
        if (openMeteoService != null && openMeteoService.isAvailable()) {
            System.out.println("Attempting Open-Meteo API forecast...");
            try {
                List<Map<String, Object>> apiForecast = openMeteoService.getHourlyForecast(lat, lng, hoursAhead);
                if (apiForecast != null && !apiForecast.isEmpty()) {
                    System.out.println("Using Open-Meteo API forecast: " + apiForecast.size() + " items");
                    return ResponseEntity.ok(apiForecast);
                } else {
                    System.out.println("Open-Meteo API returned null or empty");
                }
            } catch (Exception e) {
                System.err.println("Error calling Open-Meteo API: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("Open-Meteo service not available (enabled=" + (openMeteoService != null) + ")");
        }
        
        // BƯỚC 3: Fallback - Dùng ML service nếu API không có forecast
        System.out.println("API forecast not available, falling back to ML service");
        
        // Lấy thời tiết hiện tại để làm input cho ML
        WeatherDataDTO currentWeather = weatherDataService.getCurrentWeather(lat, lng);
        
        if (currentWeather == null && openMeteoService != null && openMeteoService.isAvailable()) {
            currentWeather = openMeteoService.getCurrentWeather(lat, lng, null, null, null);
        }
        
        if (currentWeather == null && openWeatherService != null && openWeatherService.isAvailable()) {
            currentWeather = openWeatherService.getCurrentWeather(lat, lng, null, null, null);
        }
        
        if (currentWeather == null) {
            currentWeather = mockWeatherService.generateWeatherData(lat, lng, null, null, null);
        }
        
        // Gửi vào ML service để dự đoán
        try {
            List<Map<String, Object>> predictions = predictionService.predictWeather(currentWeather, hoursAhead);
            if (predictions != null && !predictions.isEmpty()) {
                System.out.println("Using ML service forecast: " + predictions.size() + " items");
                return ResponseEntity.ok(predictions);
            } else {
                System.out.println("ML service returned null or empty predictions");
            }
        } catch (Exception e) {
            System.err.println("Error calling ML service: " + e.getMessage());
            e.printStackTrace();
        }
        
        // Nếu tất cả đều fail, trả về empty array thay vì 503
        System.out.println("All forecast sources failed, returning empty array");
        return ResponseEntity.ok(new java.util.ArrayList<>());
    }
    
    /**
     * Test endpoint để debug forecast API
     */
    @GetMapping("/forecast/test")
    public ResponseEntity<Map<String, Object>> testForecast(
            @RequestParam Double lat,
            @RequestParam Double lng,
            @RequestParam(defaultValue = "24") int hoursAhead) {
        
        Map<String, Object> result = new HashMap<>();
        result.put("lat", lat);
        result.put("lng", lng);
        result.put("hoursAhead", hoursAhead);
        
        // Test OpenWeatherMap One Call API 3.0
        if (openWeatherService != null && openWeatherService.isAvailable()) {
            List<Map<String, Object>> oneCallForecast = openWeatherService.getHourlyForecast(lat, lng, hoursAhead);
            result.put("openWeatherAvailable", true);
            result.put("openWeatherForecastCount", oneCallForecast != null ? oneCallForecast.size() : 0);
            result.put("openWeatherForecast", oneCallForecast);
        } else {
            result.put("openWeatherAvailable", false);
        }
        
        // Test Open-Meteo API
        if (openMeteoService != null && openMeteoService.isAvailable()) {
            List<Map<String, Object>> meteoForecast = openMeteoService.getHourlyForecast(lat, lng, hoursAhead);
            result.put("openMeteoAvailable", true);
            result.put("openMeteoForecastCount", meteoForecast != null ? meteoForecast.size() : 0);
            result.put("openMeteoForecast", meteoForecast);
        } else {
            result.put("openMeteoAvailable", false);
        }
        
        return ResponseEntity.ok(result);
    }
}

