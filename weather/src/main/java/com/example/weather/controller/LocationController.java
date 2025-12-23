package com.example.weather.controller;

import com.example.weather.service.NominatimService;
import com.example.weather.service.OpenMeteoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
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
    
    private static Map<String, Map<String, List<String>>> locationsData;

    static {
        try {
            // Load locations from JSON file
            ObjectMapper mapper = new ObjectMapper();
            InputStream is = LocationController.class.getClassLoader()
                    .getResourceAsStream("locations.json");
            locationsData = mapper.readValue(is, Map.class);
        } catch (Exception e) {
            locationsData = new HashMap<>();
            System.err.println("Error loading locations.json: " + e.getMessage());
        }
    }

    @GetMapping("/provinces")
    public ResponseEntity<List<String>> getProvinces() {
        List<String> provinces = new ArrayList<>(locationsData.keySet());
        Collections.sort(provinces);
        return ResponseEntity.ok(provinces);
    }

    @GetMapping("/districts")
    public ResponseEntity<List<String>> getDistricts(
            @RequestParam String province) {
        if (!locationsData.containsKey(province)) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        List<String> districts = new ArrayList<>(locationsData.get(province).keySet());
        Collections.sort(districts);
        return ResponseEntity.ok(districts);
    }

    @GetMapping("/wards")
    public ResponseEntity<List<String>> getWards(
            @RequestParam String province,
            @RequestParam String district) {
        if (!locationsData.containsKey(province)) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        Map<String, List<String>> districtMap = locationsData.get(province);
        if (!districtMap.containsKey(district)) {
            return ResponseEntity.ok(new ArrayList<>());
        }
        return ResponseEntity.ok(districtMap.get(district));
    }

    @GetMapping("/all")
    public ResponseEntity<Map<String, Map<String, List<String>>>> getAllLocations() {
        return ResponseEntity.ok(locationsData);
    }

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
        
        // Sử dụng Nominatim để reverse geocoding
        if (nominatimService != null && nominatimService.isAvailable()) {
            location = nominatimService.getLocationFromCoordinates(lat, lng);
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
