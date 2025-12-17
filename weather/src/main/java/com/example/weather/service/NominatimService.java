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
     * Chuẩn hóa tên địa điểm (bỏ tiền tố "Tỉnh", "Thành phố", "Huyện", "Thị xã", "Thị trấn", "Xã", "Phường")
     */
    private String normalizeLocation(String location) {
        if (location == null || location.isEmpty()) {
            return location;
        }
        return location
            .replaceFirst("^Tỉnh\\s+", "")
            .replaceFirst("^Thành phố\\s+", "")
            .replaceFirst("^Huyện\\s+", "")
            .replaceFirst("^Thị xã\\s+", "")
            .replaceFirst("^Thị trấn\\s+", "")
            .replaceFirst("^Xã\\s+", "")
            .replaceFirst("^Phường\\s+", "")
            .trim();
    }
    
    /**
     * Gọi Nominatim API với query cụ thể
     */
    private Map<String, Double> callNominatimAPI(String query) {
        try {
            System.out.println("Trying Nominatim query: " + query);
            
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
                        System.out.println("Nominatim found coordinates for '" + query + "': " + coords);
                        return coords;
                    }
                }
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Error calling Nominatim with query '" + query + "': " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Lấy tọa độ (lat/lng) từ tên địa điểm bằng Nominatim Geocoding API
     * Thử nhiều format khác nhau để tăng khả năng tìm thấy
     */
    public Map<String, Double> getCoordinatesFromLocation(String city, String district, String ward) {
        if (!enabled) {
            return null;
        }
        
        // Chuẩn hóa tên địa điểm
        String normalizedCity = city != null ? normalizeLocation(city) : null;
        String normalizedDistrict = district != null ? normalizeLocation(district) : null;
        String normalizedWard = ward != null ? normalizeLocation(ward) : null;
        
        // Danh sách các query format để thử (theo thứ tự ưu tiên)
        java.util.List<String> queries = new java.util.ArrayList<>();
        
        // Nếu có đầy đủ ward, district, city - thử nhiều format cho ward
        if (normalizedWard != null && !normalizedWard.isEmpty() && 
            normalizedDistrict != null && !normalizedDistrict.isEmpty() && 
            normalizedCity != null && !normalizedCity.isEmpty()) {
            // Format 1: Ward, District, City, Vietnam (chuẩn hóa)
            queries.add(normalizedWard + ", " + normalizedDistrict + ", " + normalizedCity + ", Vietnam");
            // Format 2: Ward, District, City (không có Vietnam)
            queries.add(normalizedWard + ", " + normalizedDistrict + ", " + normalizedCity);
            // Format 3: Xã/Phường Ward, District, City, Vietnam (với tiền tố ward)
            if (ward != null && !ward.isEmpty()) {
                queries.add(ward + ", " + normalizedDistrict + ", " + normalizedCity + ", Vietnam");
                queries.add(ward + ", " + district + ", " + city + ", Vietnam");
            }
            // Format 4: Ward, Huyện District, Tỉnh City, Vietnam (đầy đủ tiền tố)
            if (district != null && !district.isEmpty() && city != null && !city.isEmpty()) {
                queries.add(normalizedWard + ", " + district + ", " + city + ", Vietnam");
            }
            // Format 5: Thử chỉ với Ward và District (không có City)
            queries.add(normalizedWard + ", " + normalizedDistrict + ", Vietnam");
            queries.add(normalizedWard + ", " + normalizedDistrict);
            // Format 6: Thử với ward có tiền tố và district
            if (ward != null && !ward.isEmpty()) {
                queries.add(ward + ", " + normalizedDistrict + ", Vietnam");
            }
            // Format 7: Fallback về District, City nếu không tìm thấy với ward
            queries.add(normalizedDistrict + ", " + normalizedCity + ", Vietnam");
        }
        
        // Nếu có district và city (không có ward hoặc ward không tìm thấy)
        if (normalizedDistrict != null && !normalizedDistrict.isEmpty() && 
            normalizedCity != null && !normalizedCity.isEmpty()) {
            // Chỉ thêm nếu chưa có trong list (tránh duplicate)
            String districtCityQuery = normalizedDistrict + ", " + normalizedCity + ", Vietnam";
            if (!queries.contains(districtCityQuery)) {
                queries.add(districtCityQuery);
            }
            queries.add(normalizedDistrict + ", " + normalizedCity);
            // Thử với tên đầy đủ (có tiền tố)
            if (district != null && !district.isEmpty() && city != null && !city.isEmpty()) {
                String fullDistrictCityQuery = district + ", " + city + ", Vietnam";
                if (!queries.contains(fullDistrictCityQuery)) {
                    queries.add(fullDistrictCityQuery);
                }
            }
        }
        
        // Nếu chỉ có city (fallback cuối cùng)
        if (normalizedCity != null && !normalizedCity.isEmpty()) {
            String cityQuery = normalizedCity + ", Vietnam";
            if (!queries.contains(cityQuery)) {
                queries.add(cityQuery);
            }
            queries.add(normalizedCity);
            // Thử với tên đầy đủ
            if (city != null && !city.isEmpty()) {
                String fullCityQuery = city + ", Vietnam";
                if (!queries.contains(fullCityQuery)) {
                    queries.add(fullCityQuery);
                }
            }
        }
        
        // Thử từng query cho đến khi tìm thấy
        for (String query : queries) {
            Map<String, Double> coords = callNominatimAPI(query);
            if (coords != null && !coords.isEmpty()) {
                return coords;
            }
            
            // Delay giữa các request để tránh rate limit (Nominatim: 1 request/second)
            // Tăng delay lên 1100ms để đảm bảo không vượt quá rate limit
            try {
                Thread.sleep(1100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                return null;
            }
        }
        
        System.out.println("Nominatim could not find coordinates for: city=" + city + ", district=" + district + ", ward=" + ward);
        return null;
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


