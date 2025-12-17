package com.example.weather.service;

import com.example.weather.dto.WeatherDataDTO;
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

import java.time.LocalDateTime;

/**
 * Service để gọi Google Maps Platform Weather API
 * API này đang ở giai đoạn preview
 * Tài liệu: https://developers.google.com/maps/documentation/weather
 */
@Service
public class GoogleWeatherService {
    
    @Value("${google.weather.api.key:}")
    private String apiKey;
    
    @Value("${google.weather.api.enabled:false}")
    private boolean enabled;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private WeatherDataService weatherDataService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static final String GOOGLE_WEATHER_API_URL = "https://maps.googleapis.com/maps/api/weather/v1/current";
    
    /**
     * Lấy thời tiết hiện tại từ Google Weather API
     */
    public WeatherDataDTO getCurrentWeather(Double lat, Double lng, String city, String district, String ward) {
        if (!enabled || apiKey == null || apiKey.isEmpty()) {
            return null; // Fallback về mock service
        }
        
        try {
            // Xây dựng URL với query parameters
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(GOOGLE_WEATHER_API_URL)
                    .queryParam("location", lat + "," + lng)
                    .queryParam("key", apiKey);
            
            String url = builder.build().toUriString();
            
            // Gọi API
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Parse JSON response
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                // Kiểm tra lỗi từ API
                if (jsonNode.has("error")) {
                    System.err.println("Google Weather API Error: " + jsonNode.get("error").toString());
                    return null;
                }
                
                // Chuyển đổi sang WeatherDataDTO
                WeatherDataDTO dto = convertToWeatherDataDTO(jsonNode, lat, lng, city, district, ward);
                
                // Lưu vào database
                return weatherDataService.saveWeatherData(dto);
            }
            
            return null;
        } catch (ResourceAccessException e) {
            System.err.println("Không thể kết nối đến Google Weather API: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi Google Weather API: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Chuyển đổi JSON response từ Google API sang WeatherDataDTO
     */
    private WeatherDataDTO convertToWeatherDataDTO(JsonNode jsonNode, Double lat, Double lng, 
                                                   String city, String district, String ward) {
        WeatherDataDTO dto = new WeatherDataDTO();
        
        dto.setLatitude(lat);
        dto.setLongitude(lng);
        dto.setCity(city);
        dto.setDistrict(district);
        dto.setWard(ward);
        dto.setRecordedAt(LocalDateTime.now());
        
        // Parse dữ liệu từ response
        // Cấu trúc response có thể khác nhau, cần điều chỉnh theo tài liệu chính thức
        if (jsonNode.has("temperature")) {
            dto.setTemperature(jsonNode.get("temperature").asDouble());
        }
        
        if (jsonNode.has("feelsLike")) {
            dto.setFeelsLike(jsonNode.get("feelsLike").asDouble());
        }
        
        if (jsonNode.has("humidity")) {
            dto.setHumidity(jsonNode.get("humidity").asDouble());
        }
        
        if (jsonNode.has("pressure")) {
            dto.setPressure(jsonNode.get("pressure").asDouble());
        }
        
        if (jsonNode.has("windSpeed")) {
            dto.setWindSpeed(jsonNode.get("windSpeed").asDouble());
        }
        
        if (jsonNode.has("windDirection")) {
            dto.setWindDirection(jsonNode.get("windDirection").asDouble());
        }
        
        if (jsonNode.has("visibility")) {
            dto.setVisibility(jsonNode.get("visibility").asDouble());
        }
        
        if (jsonNode.has("cloudiness")) {
            dto.setCloudiness(jsonNode.get("cloudiness").asDouble());
        }
        
        if (jsonNode.has("rainVolume")) {
            dto.setRainVolume(jsonNode.get("rainVolume").asDouble());
        }
        
        if (jsonNode.has("condition")) {
            JsonNode condition = jsonNode.get("condition");
            if (condition.has("main")) {
                dto.setMainWeather(condition.get("main").asText());
            }
            if (condition.has("description")) {
                dto.setDescription(condition.get("description").asText());
            }
            if (condition.has("icon")) {
                dto.setIcon(condition.get("icon").asText());
            }
        }
        
        return dto;
    }
    
    /**
     * Kiểm tra xem service có sẵn sàng không
     */
    public boolean isAvailable() {
        return enabled && apiKey != null && !apiKey.isEmpty();
    }
}

