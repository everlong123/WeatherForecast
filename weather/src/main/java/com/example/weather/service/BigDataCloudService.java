package com.example.weather.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

/**
 * Service để gọi BigDataCloud Reverse Geocoding API
 * Miễn phí, không cần API key
 * Free tier: Không giới hạn requests/month cho Reverse Geocoding API
 * Rate limit: Không có giới hạn nghiêm ngặt (reasonable use policy)
 * Documentation: https://www.bigdatacloud.com/docs/api/reverse-geocoding
 * 
 * Lưu ý: Nếu có vấn đề, hệ thống sẽ tự động fallback về Nominatim
 */
@Service
public class BigDataCloudService {
    
    @Value("${bigdatacloud.api.enabled:true}")
    private boolean enabled;
    
    @Autowired
    private RestTemplate restTemplate;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static final String REVERSE_GEOCODING_API_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";
    
    /**
     * Reverse geocoding: Lấy tên địa điểm từ tọa độ
     * @param lat Latitude
     * @param lng Longitude
     * @return Map chứa city, district, ward, display_name
     */
    public Map<String, String> getLocationFromCoordinates(Double lat, Double lng) {
        if (!enabled) {
            return null;
        }
        
        try {
            // Xây dựng URL
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(REVERSE_GEOCODING_API_URL)
                    .queryParam("latitude", lat)
                    .queryParam("longitude", lng)
                    .queryParam("localityLanguage", "vi"); // Ưu tiên tiếng Việt
            
            String url = builder.build().toUriString();
            
            // Gọi API
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                Map<String, String> location = new HashMap<>();
                
                // BigDataCloud trả về các field:
                // - locality: thành phố/thị trấn
                // - principalSubdivision: tỉnh/thành phố
                // - city: thành phố lớn
                // - countryName: tên quốc gia
                // - localityInfo.administrative: mảng các cấp hành chính
                
                // Lấy city từ locality hoặc city
                if (jsonNode.has("locality") && !jsonNode.get("locality").isNull()) {
                    location.put("city", jsonNode.get("locality").asText());
                } else if (jsonNode.has("city") && !jsonNode.get("city").isNull()) {
                    location.put("city", jsonNode.get("city").asText());
                } else if (jsonNode.has("principalSubdivision") && !jsonNode.get("principalSubdivision").isNull()) {
                    location.put("city", jsonNode.get("principalSubdivision").asText());
                }
                
                // Lấy district từ principalSubdivision hoặc localityInfo
                if (jsonNode.has("principalSubdivision") && !jsonNode.get("principalSubdivision").isNull()) {
                    String subdivision = jsonNode.get("principalSubdivision").asText();
                    // Nếu subdivision không trùng với city, thì đó là district
                    if (!subdivision.equals(location.get("city"))) {
                        location.put("district", subdivision);
                    }
                }
                
                // Lấy ward từ localityInfo.administrative
                if (jsonNode.has("localityInfo") && jsonNode.get("localityInfo").has("administrative")) {
                    JsonNode administrative = jsonNode.get("localityInfo").get("administrative");
                    if (administrative.isArray() && administrative.size() > 0) {
                        // Tìm cấp nhỏ nhất (thường là ward/xã)
                        for (int i = administrative.size() - 1; i >= 0; i--) {
                            JsonNode admin = administrative.get(i);
                            if (admin.has("name") && !admin.get("name").isNull()) {
                                String name = admin.get("name").asText();
                                // Nếu chưa có ward và name không trùng với city/district
                                if (!location.containsKey("ward") && 
                                    !name.equals(location.get("city")) && 
                                    !name.equals(location.get("district"))) {
                                    location.put("ward", name);
                                    break;
                                }
                            }
                        }
                    }
                }
                
                // Tạo display_name từ các thành phần
                StringBuilder displayName = new StringBuilder();
                if (location.containsKey("ward")) {
                    displayName.append(location.get("ward"));
                }
                if (location.containsKey("district")) {
                    if (displayName.length() > 0) displayName.append(", ");
                    displayName.append(location.get("district"));
                }
                if (location.containsKey("city")) {
                    if (displayName.length() > 0) displayName.append(", ");
                    displayName.append(location.get("city"));
                }
                if (jsonNode.has("countryName") && !jsonNode.get("countryName").isNull()) {
                    if (displayName.length() > 0) displayName.append(", ");
                    displayName.append(jsonNode.get("countryName").asText());
                }
                
                if (displayName.length() > 0) {
                    location.put("display_name", displayName.toString());
                }
                
                return location.isEmpty() ? null : location;
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi BigDataCloud Reverse Geocoding API: " + e.getMessage());
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

