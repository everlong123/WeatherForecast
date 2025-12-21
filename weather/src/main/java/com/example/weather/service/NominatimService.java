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

import java.nio.charset.StandardCharsets;
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
     * Chuyển đổi tiếng Việt có dấu sang không dấu
     * Ví dụ: "Thị trấn Phước Bửu" -> "thi tran phuoc buu"
     */
    private String removeVietnameseAccents(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }
        
        // Chuyển về chữ thường
        text = text.toLowerCase();
        
        // Thay thế các ký tự có dấu bằng không dấu
        text = text.replace("à", "a").replace("á", "a").replace("ạ", "a").replace("ả", "a").replace("ã", "a")
                   .replace("â", "a").replace("ầ", "a").replace("ấ", "a").replace("ậ", "a").replace("ẩ", "a").replace("ẫ", "a")
                   .replace("ă", "a").replace("ằ", "a").replace("ắ", "a").replace("ặ", "a").replace("ẳ", "a").replace("ẵ", "a")
                   .replace("è", "e").replace("é", "e").replace("ẹ", "e").replace("ẻ", "e").replace("ẽ", "e")
                   .replace("ê", "e").replace("ề", "e").replace("ế", "e").replace("ệ", "e").replace("ể", "e").replace("ễ", "e")
                   .replace("ì", "i").replace("í", "i").replace("ị", "i").replace("ỉ", "i").replace("ĩ", "i")
                   .replace("ò", "o").replace("ó", "o").replace("ọ", "o").replace("ỏ", "o").replace("õ", "o")
                   .replace("ô", "o").replace("ồ", "o").replace("ố", "o").replace("ộ", "o").replace("ổ", "o").replace("ỗ", "o")
                   .replace("ơ", "o").replace("ờ", "o").replace("ớ", "o").replace("ợ", "o").replace("ở", "o").replace("ỡ", "o")
                   .replace("ù", "u").replace("ú", "u").replace("ụ", "u").replace("ủ", "u").replace("ũ", "u")
                   .replace("ư", "u").replace("ừ", "u").replace("ứ", "u").replace("ự", "u").replace("ử", "u").replace("ữ", "u")
                   .replace("ỳ", "y").replace("ý", "y").replace("ỵ", "y").replace("ỷ", "y").replace("ỹ", "y")
                   .replace("đ", "d");
        
        return text.trim();
    }
    
    /**
     * Gọi Nominatim API với query cụ thể
     */
    private Map<String, Double> callNominatimAPI(String query) {
        try {
            // LƯU Ý: Console output có thể hiển thị sai ký tự tiếng Việt (do Windows console encoding)
            // nhưng URL thực tế đã được encode đúng UTF-8 bởi UriComponentsBuilder
            // System.out.println("Trying Nominatim query: " + query);
            
            // Xây dựng URL với UTF-8 encoding đảm bảo
            // UriComponentsBuilder tự động encode query parameters với UTF-8
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(NOMINATIM_API_URL)
                    .queryParam("q", query)  // Tự động encode với UTF-8
                    .queryParam("format", "json")
                    .queryParam("limit", 1)
                    .queryParam("addressdetails", "1")
                    .queryParam("countrycodes", "vn"); // Chỉ tìm trong Việt Nam
            
            // Build URL và đảm bảo encoding là UTF-8
            // URL sẽ được encode đúng (ví dụ: "Xã Bàng Trang" -> "X%C3%A3%20B%C3%A0ng%20Trang")
            String url = builder.encode(StandardCharsets.UTF_8).build().toUriString();
            
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
                        // Console có thể hiển thị sai ký tự tiếng Việt, nhưng query đã được encode đúng
                        System.out.println("Nominatim found coordinates: " + coords);
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
     * Ưu tiên format đầy đủ (có tiền tố) vì đó là format trong dữ liệu
     */
    public Map<String, Double> getCoordinatesFromLocation(String city, String district, String ward) {
        if (!enabled) {
            return null;
        }
        
        // Chuẩn hóa tên địa điểm (bỏ tiền tố)
        String normalizedCity = city != null ? normalizeLocation(city) : null;
        String normalizedDistrict = district != null ? normalizeLocation(district) : null;
        String normalizedWard = ward != null ? normalizeLocation(ward) : null;
        
        // Tạo version không dấu để thử (fallback nếu query có dấu không tìm thấy)
        String unaccentedWard = normalizedWard != null ? removeVietnameseAccents(normalizedWard) : null;
        String unaccentedDistrict = normalizedDistrict != null ? removeVietnameseAccents(normalizedDistrict) : null;
        String unaccentedCity = normalizedCity != null ? removeVietnameseAccents(normalizedCity) : null;
        String unaccentedWardFull = ward != null ? removeVietnameseAccents(ward) : null;
        
        // Danh sách các query format để thử (theo thứ tự ưu tiên - format đầy đủ trước, có dấu trước, không dấu sau)
        java.util.List<String> queries = new java.util.ArrayList<>();
        
        // Nếu có đầy đủ ward, district, city - ưu tiên format đầy đủ (có tiền tố)
        if (normalizedWard != null && !normalizedWard.isEmpty() && 
            normalizedDistrict != null && !normalizedDistrict.isEmpty() && 
            normalizedCity != null && !normalizedCity.isEmpty()) {
            
            // Format 1: Ward đầy đủ (có tiền tố), District đầy đủ, City đầy đủ, Vietnam (ưu tiên nhất)
            if (ward != null && !ward.isEmpty() && district != null && !district.isEmpty() && city != null && !city.isEmpty()) {
                queries.add(ward + ", " + district + ", " + city + ", Vietnam");
            }
            
            // Format 2: Ward đầy đủ, District đầy đủ, City chuẩn hóa, Vietnam
            if (ward != null && !ward.isEmpty() && district != null && !district.isEmpty()) {
                queries.add(ward + ", " + district + ", " + normalizedCity + ", Vietnam");
            }
            
            // Format 3: Ward chuẩn hóa, District đầy đủ, City đầy đủ, Vietnam
            if (district != null && !district.isEmpty() && city != null && !city.isEmpty()) {
                queries.add(normalizedWard + ", " + district + ", " + city + ", Vietnam");
            }
            
            // Format 4: Ward đầy đủ, District chuẩn hóa, City chuẩn hóa, Vietnam
            if (ward != null && !ward.isEmpty()) {
                queries.add(ward + ", " + normalizedDistrict + ", " + normalizedCity + ", Vietnam");
            }
            
            // Format 5: Ward chuẩn hóa, District chuẩn hóa, City chuẩn hóa, Vietnam
            queries.add(normalizedWard + ", " + normalizedDistrict + ", " + normalizedCity + ", Vietnam");
            
            // Format 6: Ward chuẩn hóa, District chuẩn hóa, City chuẩn hóa (không có Vietnam)
            queries.add(normalizedWard + ", " + normalizedDistrict + ", " + normalizedCity);
            
            // Format 7: Ward và District (không có City)
            queries.add(normalizedWard + ", " + normalizedDistrict + ", Vietnam");
            if (ward != null && !ward.isEmpty()) {
                queries.add(ward + ", " + normalizedDistrict + ", Vietnam");
            }
            
            // Format 8: Fallback về District, City nếu không tìm thấy với ward
            queries.add(normalizedDistrict + ", " + normalizedCity + ", Vietnam");
            if (district != null && !district.isEmpty() && city != null && !city.isEmpty()) {
                queries.add(district + ", " + city + ", Vietnam");
            }
        }
        
        // Nếu có district và city (không có ward hoặc ward không tìm thấy)
        if (normalizedDistrict != null && !normalizedDistrict.isEmpty() && 
            normalizedCity != null && !normalizedCity.isEmpty()) {
            
            // Ưu tiên format đầy đủ
            if (district != null && !district.isEmpty() && city != null && !city.isEmpty()) {
                String fullDistrictCityQuery = district + ", " + city + ", Vietnam";
                if (!queries.contains(fullDistrictCityQuery)) {
                    queries.add(fullDistrictCityQuery);
                }
            }
            
            // Format chuẩn hóa
            String districtCityQuery = normalizedDistrict + ", " + normalizedCity + ", Vietnam";
            if (!queries.contains(districtCityQuery)) {
                queries.add(districtCityQuery);
            }
            queries.add(normalizedDistrict + ", " + normalizedCity);
        }
        
        // Nếu chỉ có city (fallback cuối cùng)
        if (normalizedCity != null && !normalizedCity.isEmpty()) {
            // Ưu tiên format đầy đủ
            if (city != null && !city.isEmpty()) {
                String fullCityQuery = city + ", Vietnam";
                if (!queries.contains(fullCityQuery)) {
                    queries.add(fullCityQuery);
                }
            }
            
            // Format chuẩn hóa
            String cityQuery = normalizedCity + ", Vietnam";
            if (!queries.contains(cityQuery)) {
                queries.add(cityQuery);
            }
            queries.add(normalizedCity);
        }
        
        // Thêm các query không dấu (fallback) - chỉ thử nếu các query có dấu không tìm thấy
        // Đây là format phổ biến hơn trên Nominatim (ví dụ: "thi tran phuoc buu" thay vì "Thị trấn Phước Bửu")
        if (unaccentedWard != null && !unaccentedWard.isEmpty() && 
            unaccentedDistrict != null && !unaccentedDistrict.isEmpty() && 
            unaccentedCity != null && !unaccentedCity.isEmpty()) {
            
            // Format không dấu: Ward, District, City, Vietnam
            String unaccentedQuery = unaccentedWard + ", " + unaccentedDistrict + ", " + unaccentedCity + ", Vietnam";
            if (!queries.contains(unaccentedQuery)) {
                queries.add(unaccentedQuery);
            }
            
            // Format không dấu: Ward đầy đủ (có tiền tố nhưng không dấu)
            if (unaccentedWardFull != null && !unaccentedWardFull.isEmpty()) {
                String unaccentedFullQuery = unaccentedWardFull + ", " + unaccentedDistrict + ", " + unaccentedCity + ", Vietnam";
                if (!queries.contains(unaccentedFullQuery)) {
                    queries.add(unaccentedFullQuery);
                }
            }
            
            // Format đơn giản: chỉ ward không dấu
            if (!queries.contains(unaccentedWardFull != null && !unaccentedWardFull.isEmpty() ? unaccentedWardFull : unaccentedWard)) {
                queries.add(unaccentedWardFull != null && !unaccentedWardFull.isEmpty() ? unaccentedWardFull : unaccentedWard);
            }
        }
        
        // Nếu chỉ có district và city không dấu
        if (unaccentedDistrict != null && !unaccentedDistrict.isEmpty() && 
            unaccentedCity != null && !unaccentedCity.isEmpty()) {
            String unaccentedDistrictCityQuery = unaccentedDistrict + ", " + unaccentedCity + ", Vietnam";
            if (!queries.contains(unaccentedDistrictCityQuery)) {
                queries.add(unaccentedDistrictCityQuery);
            }
        }
        
        // Nếu chỉ có city không dấu
        if (unaccentedCity != null && !unaccentedCity.isEmpty()) {
            String unaccentedCityQuery = unaccentedCity + ", Vietnam";
            if (!queries.contains(unaccentedCityQuery)) {
                queries.add(unaccentedCityQuery);
            }
            if (!queries.contains(unaccentedCity)) {
                queries.add(unaccentedCity);
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
        
        // Console có thể hiển thị sai ký tự tiếng Việt, nhưng query đã được encode đúng UTF-8
        System.out.println("Nominatim could not find coordinates for the specified location");
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


