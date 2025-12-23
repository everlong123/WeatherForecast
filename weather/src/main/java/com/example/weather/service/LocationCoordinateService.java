package com.example.weather.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * Service để lấy tọa độ (lat/lng) từ địa điểm (province, district, ward)
 * Chỉ dùng API thực (Open-Meteo, OpenWeather), không dùng JSON preload
 */
@Service
public class LocationCoordinateService {
    
    @Autowired(required = false)
    private OpenMeteoService openMeteoService;
    
    @Autowired(required = false)
    private com.example.weather.service.OpenWeatherService openWeatherService;
    
    /**
     * Lấy tọa độ từ province name - dùng API thực
     */
    public Map<String, Double> getProvinceCoordinates(String provinceName) {
        return getCoordinatesFromAPI(provinceName, null, null);
    }
    
    /**
     * Lấy tọa độ từ province và district - dùng API thực
     */
    public Map<String, Double> getDistrictCoordinates(String provinceName, String districtName) {
        return getCoordinatesFromAPI(provinceName, districtName, null);
    }
    
    /**
     * Lấy tọa độ từ province, district và ward - dùng API thực
     */
    public Map<String, Double> getWardCoordinates(String provinceName, String districtName, String wardName) {
        return getCoordinatesFromAPI(provinceName, districtName, wardName);
    }
    
    /**
     * Gọi API thực để lấy tọa độ (Open-Meteo ưu tiên, fallback OpenWeather)
     */
    private Map<String, Double> getCoordinatesFromAPI(String city, String district, String ward) {
        Map<String, Double> coords = null;
        
        // Ưu tiên 1: Open-Meteo (miễn phí, không cần API key, tốt cho tiếng Việt)
        if (openMeteoService != null && openMeteoService.isAvailable()) {
            coords = openMeteoService.getCoordinatesFromLocation(city, district, ward);
            if (coords != null) {
                System.out.println("Found coordinates via Open-Meteo: " + coords);
                return coords;
            }
        }
        
        // Ưu tiên 2: OpenWeather (nếu có API key)
        if (openWeatherService != null && openWeatherService.isAvailable()) {
            coords = openWeatherService.getCoordinatesFromLocation(city, district, ward);
            if (coords != null) {
                System.out.println("Found coordinates via OpenWeather: " + coords);
                return coords;
            }
        }
        
        // Fallback: tọa độ mặc định (trung tâm Việt Nam)
        System.out.println("No coordinates found via API, using default coordinates");
        return getDefaultCoordinates();
    }
    
    /**
     * Tọa độ mặc định (trung tâm Việt Nam)
     */
    private Map<String, Double> getDefaultCoordinates() {
        Map<String, Double> coords = new HashMap<>();
        coords.put("lat", 16.0583);
        coords.put("lng", 108.2772);
        return coords;
    }
}

