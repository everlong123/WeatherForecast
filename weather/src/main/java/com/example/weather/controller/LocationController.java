package com.example.weather.controller;

import com.example.weather.service.NominatimService;
import com.example.weather.service.OpenMeteoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/locations")
public class LocationController {
    @Autowired(required = false)
    private OpenMeteoService openMeteoService;
    
    @Autowired
    private NominatimService nominatimService;
    
    @Autowired(required = false)
    private com.example.weather.service.OpenWeatherService openWeatherService;
    
    @Autowired(required = false)
    private com.example.weather.service.BigDataCloudService bigDataCloudService;

    @GetMapping("/coordinates")
    public ResponseEntity<Map<String, Double>> getCoordinates(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) String ward) {
        Map<String, Double> coords = null;
        
        // Không log Vietnamese text trực tiếp để tránh console font issues
        // Chỉ log khi có kết quả thành công
        
        // Ưu tiên Open-Meteo (miễn phí, không cần API key, tốt hơn cho tiếng Việt)
        if (openMeteoService != null && openMeteoService.isAvailable()) {
            coords = openMeteoService.getCoordinatesFromLocation(city, district, ward);
            if (coords != null && coords.containsKey("lat") && coords.containsKey("lng")) {
                System.out.println("Open-Meteo coordinates found: lat=" + coords.get("lat") + ", lng=" + coords.get("lng"));
            }
        }
        
        // Fallback: Thử Nominatim nếu Open-Meteo không có kết quả
        if ((coords == null || coords.isEmpty()) && nominatimService != null && nominatimService.isAvailable()) {
            coords = nominatimService.getCoordinatesFromLocation(city, district, ward);
            if (coords != null && coords.containsKey("lat") && coords.containsKey("lng")) {
                System.out.println("Nominatim coordinates found: lat=" + coords.get("lat") + ", lng=" + coords.get("lng"));
            }
        }
        
        // Fallback: Thử OpenWeather (nếu có API key) - chỉ cho geocoding
        if ((coords == null || coords.isEmpty()) && openWeatherService != null && openWeatherService.isAvailable()) {
            coords = openWeatherService.getCoordinatesFromLocation(city, district, ward);
            if (coords != null && coords.containsKey("lat") && coords.containsKey("lng")) {
                System.out.println("OpenWeather coordinates found: lat=" + coords.get("lat") + ", lng=" + coords.get("lng"));
            }
        }
        
        // Nếu không có kết quả, trả về map rỗng (không có lat/lng)
        if (coords == null || coords.isEmpty()) {
            System.out.println("No coordinates found after trying all services, returning empty map");
            coords = new HashMap<>();
        }
        
        return ResponseEntity.ok(coords);
    }

    @GetMapping("/reverse")
    public ResponseEntity<Map<String, String>> getLocationFromCoordinates(
            @RequestParam Double lat,
            @RequestParam Double lng) {
        Map<String, String> location = null;
        
        // Ưu tiên 1: BigDataCloud (miễn phí, không cần API key, không có rate limit nghiêm ngặt)
        if (bigDataCloudService != null && bigDataCloudService.isAvailable()) {
            location = bigDataCloudService.getLocationFromCoordinates(lat, lng);
            if (location != null && !location.isEmpty()) {
                System.out.println("BigDataCloud reverse geocoding found location");
                return ResponseEntity.ok(location);
            }
        }
        
        // Fallback 2: Nominatim (nếu BigDataCloud không có kết quả)
        if (location == null && nominatimService != null && nominatimService.isAvailable()) {
            location = nominatimService.getLocationFromCoordinates(lat, lng);
            if (location != null && !location.isEmpty()) {
                System.out.println("Nominatim reverse geocoding found location");
                return ResponseEntity.ok(location);
            }
        }
        
        // Nếu không có kết quả, trả về map rỗng
        if (location == null) {
            location = new HashMap<>();
        }
        
        return ResponseEntity.ok(location);
    }
    
    /**
     * Test endpoint để test trực tiếp Nominatim API với query đơn giản
     * Ví dụ: /locations/test-nominatim?q=xã đồng lạc
     */
    @GetMapping("/test-nominatim")
    public ResponseEntity<Map<String, Object>> testNominatim(
            @RequestParam String q) {
        Map<String, Object> result = new HashMap<>();
        result.put("query", q);
        
        if (nominatimService != null && nominatimService.isAvailable()) {
            // Test với query đơn giản (giống web UI)
            Map<String, Double> coords = nominatimService.testNominatimQuery(q);
            result.put("coordinates", coords);
            result.put("success", coords != null && !coords.isEmpty());
        } else {
            result.put("error", "Nominatim service not available");
            result.put("success", false);
        }
        
        return ResponseEntity.ok(result);
    }
}
