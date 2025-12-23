package com.example.weather.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

/**
 * Service để lấy tọa độ (lat/lng) từ địa điểm (province, district, ward)
 */
@Service
public class LocationCoordinateService {
    
    private Map<String, Object> coordinatesData;
    
    public LocationCoordinateService() {
        loadCoordinates();
    }
    
    private void loadCoordinates() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            ClassPathResource resource = new ClassPathResource("location_coordinates.json");
            InputStream is = resource.getInputStream();
            coordinatesData = mapper.readValue(is, Map.class);
        } catch (Exception e) {
            coordinatesData = new HashMap<>();
            System.err.println("Error loading location_coordinates.json: " + e.getMessage());
        }
    }
    
    /**
     * Lấy tọa độ từ province name
     */
    public Map<String, Double> getProvinceCoordinates(String provinceName) {
        if (coordinatesData == null || !coordinatesData.containsKey("provinces")) {
            return getDefaultCoordinates();
        }
        
        @SuppressWarnings("unchecked")
        Map<String, Object> provinces = (Map<String, Object>) coordinatesData.get("provinces");
        
        // Tìm exact match
        if (provinces.containsKey(provinceName)) {
            @SuppressWarnings("unchecked")
            Map<String, Double> coords = (Map<String, Double>) provinces.get(provinceName);
            return coords;
        }
        
        // Tìm partial match (bỏ "Tỉnh", "Thành phố")
        String shortName = provinceName.replace("Tỉnh ", "").replace("Thành phố ", "");
        for (String key : provinces.keySet()) {
            String keyShort = key.replace("Tỉnh ", "").replace("Thành phố ", "");
            if (keyShort.equals(shortName) || key.contains(provinceName) || provinceName.contains(keyShort)) {
                @SuppressWarnings("unchecked")
                Map<String, Double> coords = (Map<String, Double>) provinces.get(key);
                return coords;
            }
        }
        
        return getDefaultCoordinates();
    }
    
    /**
     * Lấy tọa độ từ province và district
     */
    public Map<String, Double> getDistrictCoordinates(String provinceName, String districtName) {
        if (coordinatesData == null || !coordinatesData.containsKey("districts")) {
            return getProvinceCoordinates(provinceName);
        }
        
        @SuppressWarnings("unchecked")
        Map<String, Object> districts = (Map<String, Object>) coordinatesData.get("districts");
        
        // Tìm province trong districts - thử exact match trước
        if (districts.containsKey(provinceName)) {
            @SuppressWarnings("unchecked")
            Map<String, Object> provinceDistricts = (Map<String, Object>) districts.get(provinceName);
            
            // Tìm exact match district
            if (provinceDistricts.containsKey(districtName)) {
                @SuppressWarnings("unchecked")
                Map<String, Double> coords = (Map<String, Double>) provinceDistricts.get(districtName);
                return coords;
            }
            
            // Tìm partial match district (bỏ "Quận", "Huyện", "Thành phố")
            String districtShort = districtName != null ? districtName
                .replace("Quận ", "")
                .replace("Huyện ", "")
                .replace("Thành phố ", "")
                .replace("Thị xã ", "")
                .replace("Thị trấn ", "") : "";
            
            for (String key : provinceDistricts.keySet()) {
                String keyShort = key
                    .replace("Quận ", "")
                    .replace("Huyện ", "")
                    .replace("Thành phố ", "")
                    .replace("Thị xã ", "")
                    .replace("Thị trấn ", "");
                
                if (keyShort.equals(districtShort) || key.equals(districtName) || 
                    districtName != null && (key.contains(districtName) || districtName.contains(key))) {
                    @SuppressWarnings("unchecked")
                    Map<String, Double> coords = (Map<String, Double>) provinceDistricts.get(key);
                    return coords;
                }
            }
        }
        
        // Tìm province với partial match
        String provinceShort = provinceName != null ? provinceName
            .replace("Tỉnh ", "")
            .replace("Thành phố ", "") : "";
        
        for (String provinceKey : districts.keySet()) {
            String provinceKeyShort = provinceKey
                .replace("Tỉnh ", "")
                .replace("Thành phố ", "");
            
            if (provinceKeyShort.equals(provinceShort) || provinceKey.equals(provinceName) ||
                (provinceName != null && (provinceKey.contains(provinceName) || provinceName.contains(provinceKeyShort)))) {
                
                @SuppressWarnings("unchecked")
                Map<String, Object> provinceDistricts = (Map<String, Object>) districts.get(provinceKey);
                
                if (districtName != null && provinceDistricts.containsKey(districtName)) {
                    @SuppressWarnings("unchecked")
                    Map<String, Double> coords = (Map<String, Double>) provinceDistricts.get(districtName);
                    return coords;
                }
                
                // Tìm district với partial match
                String districtShort = districtName != null ? districtName
                    .replace("Quận ", "")
                    .replace("Huyện ", "")
                    .replace("Thành phố ", "")
                    .replace("Thị xã ", "")
                    .replace("Thị trấn ", "") : "";
                
                for (String districtKey : provinceDistricts.keySet()) {
                    String districtKeyShort = districtKey
                        .replace("Quận ", "")
                        .replace("Huyện ", "")
                        .replace("Thành phố ", "")
                        .replace("Thị xã ", "")
                        .replace("Thị trấn ", "");
                    
                    if (districtKeyShort.equals(districtShort) || districtKey.equals(districtName) ||
                        (districtName != null && (districtKey.contains(districtName) || districtName.contains(districtKey)))) {
                        @SuppressWarnings("unchecked")
                        Map<String, Double> coords = (Map<String, Double>) provinceDistricts.get(districtKey);
                        return coords;
                    }
                }
            }
        }
        
        // Nếu không tìm thấy district, trả về province coordinates với offset nhỏ
        Map<String, Double> provinceCoords = getProvinceCoordinates(provinceName);
        if (districtName != null && !districtName.isEmpty()) {
            // Tạo offset nhỏ dựa trên hash của district name (giảm offset để không ra ngoài biển)
            int hash = districtName.hashCode();
            double offsetLat = (hash % 40 - 20) / 2000.0; // Giảm từ 1000 xuống 2000
            double offsetLng = ((hash * 7) % 40 - 20) / 2000.0;
            
            double newLat = provinceCoords.get("lat") + offsetLat;
            double newLng = provinceCoords.get("lng") + offsetLng;
            
            // Đảm bảo tọa độ trong phạm vi Việt Nam (lat: 8-23, lng: 102-110)
            newLat = Math.max(8.0, Math.min(23.0, newLat));
            newLng = Math.max(102.0, Math.min(110.0, newLng));
            
            Map<String, Double> coords = new HashMap<>();
            coords.put("lat", newLat);
            coords.put("lng", newLng);
            return coords;
        }
        
        return provinceCoords;
    }
    
    /**
     * Lấy tọa độ từ province, district và ward
     */
    public Map<String, Double> getWardCoordinates(String provinceName, String districtName, String wardName) {
        // Debug logging
        // Log location (URL encoding will be handled by NominatimService)
        System.out.println("Getting coordinates for location (query will be UTF-8 encoded)");
        
        if (coordinatesData == null || !coordinatesData.containsKey("wards")) {
            Map<String, Double> result = getDistrictCoordinates(provinceName, districtName);
            System.out.println("Using district coordinates: " + result);
            return result;
        }
        
        @SuppressWarnings("unchecked")
        Map<String, Object> wards = (Map<String, Object>) coordinatesData.get("wards");
        
        // Key format: "Province|District" - thử exact match trước
        String key = provinceName + "|" + districtName;
        
        if (wards.containsKey(key)) {
            @SuppressWarnings("unchecked")
            Map<String, Object> districtWards = (Map<String, Object>) wards.get(key);
            
            if (districtWards.containsKey(wardName)) {
                @SuppressWarnings("unchecked")
                Map<String, Double> coords = (Map<String, Double>) districtWards.get(wardName);
                System.out.println("Found exact ward match: " + coords);
                return coords;
            }
            
            // Tìm partial match ward
            if (wardName != null) {
                String wardShort = wardName
                    .replace("Phường ", "")
                    .replace("Xã ", "")
                    .replace("Thị trấn ", "");
                
                for (String wardKey : districtWards.keySet()) {
                    String wardKeyShort = wardKey
                        .replace("Phường ", "")
                        .replace("Xã ", "")
                        .replace("Thị trấn ", "");
                    
                    if (wardKeyShort.equals(wardShort) || wardKey.equals(wardName) ||
                        wardKey.contains(wardName) || wardName.contains(wardKey)) {
                        @SuppressWarnings("unchecked")
                        Map<String, Double> coords = (Map<String, Double>) districtWards.get(wardKey);
                        return coords;
                    }
                }
            }
        }
        
        // Tìm với partial match province và district
        String provinceShort = provinceName != null ? provinceName
            .replace("Tỉnh ", "")
            .replace("Thành phố ", "") : "";
        String districtShort = districtName != null ? districtName
            .replace("Quận ", "")
            .replace("Huyện ", "")
            .replace("Thành phố ", "")
            .replace("Thị xã ", "")
            .replace("Thị trấn ", "") : "";
        
        for (String wardKey : wards.keySet()) {
            String[] parts = wardKey.split("\\|");
            if (parts.length == 2) {
                String keyProvince = parts[0];
                String keyDistrict = parts[1];
                
                String keyProvinceShort = keyProvince.replace("Tỉnh ", "").replace("Thành phố ", "");
                String keyDistrictShort = keyDistrict
                    .replace("Quận ", "")
                    .replace("Huyện ", "")
                    .replace("Thành phố ", "")
                    .replace("Thị xã ", "")
                    .replace("Thị trấn ", "");
                
                if ((keyProvinceShort.equals(provinceShort) || keyProvince.equals(provinceName) ||
                     (provinceName != null && (keyProvince.contains(provinceName) || provinceName.contains(keyProvinceShort)))) &&
                    (keyDistrictShort.equals(districtShort) || keyDistrict.equals(districtName) ||
                     (districtName != null && (keyDistrict.contains(districtName) || districtName.contains(keyDistrictShort))))) {
                    
                    @SuppressWarnings("unchecked")
                    Map<String, Object> districtWards = (Map<String, Object>) wards.get(wardKey);
                    
                    if (wardName != null && districtWards.containsKey(wardName)) {
                        @SuppressWarnings("unchecked")
                        Map<String, Double> coords = (Map<String, Double>) districtWards.get(wardName);
                        return coords;
                    }
                }
            }
        }
        
        // Nếu không tìm thấy, lấy district coordinates với offset nhỏ
        Map<String, Double> districtCoords = getDistrictCoordinates(provinceName, districtName);
        System.out.println("Using district coordinates with ward offset: " + districtCoords);
        if (wardName != null && !wardName.isEmpty()) {
            int hash = wardName.hashCode();
            double offsetLat = (hash % 30 - 15) / 3000.0; // Giảm offset
            double offsetLng = ((hash * 3) % 30 - 15) / 3000.0;
            
            double newLat = districtCoords.get("lat") + offsetLat;
            double newLng = districtCoords.get("lng") + offsetLng;
            
            // Đảm bảo tọa độ trong phạm vi Việt Nam
            newLat = Math.max(8.0, Math.min(23.0, newLat));
            newLng = Math.max(102.0, Math.min(110.0, newLng));
            
            Map<String, Double> coords = new HashMap<>();
            coords.put("lat", newLat);
            coords.put("lng", newLng);
            return coords;
        }
        
        return districtCoords;
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

