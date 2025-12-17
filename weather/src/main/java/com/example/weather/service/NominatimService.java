package com.example.weather.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

/**
 * Service để gọi Nominatim (OpenStreetMap) Geocoding API
 * Miễn phí, không cần API key
 * Rate limit: 1 request/second (cần cẩn thận khi gọi nhiều)
 * URL: https://nominatim.openstreetmap.org/search
 */
@Service
public class NominatimService {
    
    @Value("${nominatim.api.enabled:true}")
    private boolean enabled;
    
    @Autowired
    private RestTemplate restTemplate;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static final String NOMINATIM_API_URL = "https://nominatim.openstreetmap.org/search";
    
    // User-Agent bắt buộc cho Nominatim (theo policy của họ)
    private static final String USER_AGENT = "WeatherForecastApp/1.0";
    
    /**
     * Lấy tọa độ (lat/lng) từ tên địa điểm bằng Nominatim Geocoding API
     */
    public Map<String, Double> getCoordinatesFromLocation(String city, String district, String ward) {
        if (!enabled) {
            return null;
        }
        
        try {
            // Xây dựng query string từ địa điểm
            // Luôn bao gồm "Vietnam" để tăng độ chính xác
            String query = "";
            if (ward != null && !ward.isEmpty() && district != null && !district.isEmpty() && city != null && !city.isEmpty()) {
                // Format: "Ward, District, City, Vietnam"
                query = ward + ", " + district + ", " + city + ", Vietnam";
            } else if (district != null && !district.isEmpty() && city != null && !city.isEmpty()) {
                // Format: "District, City, Vietnam"
                query = district + ", " + city + ", Vietnam";
            } else if (city != null && !city.isEmpty()) {
                // Format: "City, Vietnam"
                query = city + ", Vietnam";
            } else {
                return null;
            }
            
            // Xây dựng URL
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(NOMINATIM_API_URL)
                    .queryParam("q", query)
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .queryParam("addressdetails", 1)
                    .queryParam("countrycodes", "vn"); // Chỉ tìm trong Việt Nam
            
            String url = builder.build().toUriString();
            
            // Gọi API với User-Agent header (bắt buộc theo policy của Nominatim)
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                // Nominatim API trả về array
                if (jsonNode.isArray() && jsonNode.size() > 0) {
                    JsonNode firstResult = jsonNode.get(0);
                    
                    Map<String, Double> coords = new HashMap<>();
                    if (firstResult.has("lat")) {
                        coords.put("lat", firstResult.get("lat").asDouble());
                    }
                    if (firstResult.has("lon")) {
                        coords.put("lng", firstResult.get("lon").asDouble());
                    }
                    
                    if (coords.containsKey("lat") && coords.containsKey("lng")) {
                        System.out.println("Nominatim geocoding result for '" + query + "': " + coords);
                        return coords;
                    }
                }
            }
            
            return null;
        } catch (ResourceAccessException e) {
            System.err.println("Không thể kết nối đến Nominatim API: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi Nominatim Geocoding API: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Reverse geocoding: Lấy tên địa điểm từ tọa độ
     */
    public Map<String, String> getLocationFromCoordinates(Double lat, Double lng) {
        if (!enabled) {
            return null;
        }
        
        try {
            String url = String.format("https://nominatim.openstreetmap.org/reverse?lat=%f&lon=%f&format=json&addressdetails=1", 
                lat, lng);
            
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            
            ResponseEntity<String> response = restTemplate.exchange(
                url, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                String.class
            );
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                Map<String, String> location = new HashMap<>();
                
                if (jsonNode.has("address")) {
                    JsonNode address = jsonNode.get("address");
                    
                    if (address.has("city")) {
                        location.put("city", address.get("city").asText());
                    } else if (address.has("town")) {
                        location.put("city", address.get("town").asText());
                    } else if (address.has("province")) {
                        location.put("city", address.get("province").asText());
                    }
                    
                    if (address.has("county")) {
                        location.put("district", address.get("county").asText());
                    } else if (address.has("district")) {
                        location.put("district", address.get("district").asText());
                    }
                    
                    if (address.has("suburb")) {
                        location.put("ward", address.get("suburb").asText());
                    } else if (address.has("village")) {
                        location.put("ward", address.get("village").asText());
                    }
                }
                
                if (jsonNode.has("display_name")) {
                    location.put("display_name", jsonNode.get("display_name").asText());
                }
                
                return location.isEmpty() ? null : location;
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi Nominatim Reverse Geocoding API: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Kiểm tra xem service có sẵn sàng không
     */
    public boolean isAvailable() {
        return enabled;
    }
}


