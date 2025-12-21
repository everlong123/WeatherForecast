package com.example.weather.service;

import com.example.weather.dto.WeatherDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service để gọi Python ML service để dự đoán thời tiết
 */
@Service
public class WeatherPredictionService {
    
    @Value("${python.ml.service.url:http://localhost:5000}")
    private String pythonServiceUrl;
    
    @Autowired
    private RestTemplate restTemplate;
    
    /**
     * Dự đoán thời tiết trong tương lai
     * 
     * LƯU Ý: currentWeather đã có đầy đủ thông số thời tiết (từ API/DB, KHÔNG từ user input).
     * User chỉ nhập địa điểm (lat/lng), backend tự động lấy weather data từ API.
     * 
     * @param currentWeather WeatherDataDTO có đầy đủ: temperature, humidity, pressure, windSpeed, cloudiness...
     *                      (Từ OpenWeatherMap API hoặc Database, KHÔNG từ user input)
     * @param hoursAhead Số giờ dự đoán trước
     * @return Danh sách predictions
     */
    public List<Map<String, Object>> predictWeather(WeatherDataDTO currentWeather, int hoursAhead) {
        try {
            // Chuẩn bị request body cho Python ML service
            // Tất cả thông số thời tiết này đã có trong currentWeather (từ API/DB)
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("temperature", currentWeather.getTemperature());  // ← Từ API/DB
            requestBody.put("humidity", currentWeather.getHumidity());        // ← Từ API/DB
            requestBody.put("pressure", currentWeather.getPressure());        // ← Từ API/DB
            requestBody.put("windSpeed", currentWeather.getWindSpeed());      // ← Từ API/DB
            requestBody.put("cloudiness", currentWeather.getCloudiness());    // ← Từ API/DB
            requestBody.put("latitude", currentWeather.getLatitude());        // ← Từ user
            requestBody.put("longitude", currentWeather.getLongitude());      // ← Từ user
            requestBody.put("hoursAhead", hoursAhead);
            
            // Gọi Python service
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            String url = pythonServiceUrl + "/predict";
            @SuppressWarnings("unchecked")
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            if (response.getBody() != null && Boolean.TRUE.equals(response.getBody().get("success"))) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> predictions = (List<Map<String, Object>>) response.getBody().get("predictions");
                return predictions;
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi Python prediction service: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Retrain model với dữ liệu lịch sử
     */
    public boolean retrainModel(List<WeatherDataDTO> historicalData) {
        try {
            // Convert WeatherDataDTO to map for Python service
            List<Map<String, Object>> dataList = historicalData.stream()
                .map(dto -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("temperature", dto.getTemperature());
                    data.put("humidity", dto.getHumidity());
                    data.put("pressure", dto.getPressure());
                    data.put("windSpeed", dto.getWindSpeed());
                    data.put("cloudiness", dto.getCloudiness());
                    data.put("recordedAt", dto.getRecordedAt() != null ? 
                        dto.getRecordedAt().toString() : null);
                    return data;
                })
                .toList();
            
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("historicalData", dataList);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            String url = pythonServiceUrl + "/retrain";
            @SuppressWarnings("unchecked")
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            
            return response.getBody() != null && Boolean.TRUE.equals(response.getBody().get("success"));
        } catch (Exception e) {
            System.err.println("Lỗi khi retrain model: " + e.getMessage());
            return false;
        }
    }
}

