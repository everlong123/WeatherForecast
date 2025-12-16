package com.example.weather.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InputStream;
import java.util.*;

@RestController
@RequestMapping("/locations")
public class LocationController {
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
}
