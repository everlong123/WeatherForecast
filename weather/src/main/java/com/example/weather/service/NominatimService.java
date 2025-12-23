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
    // Phải có email để tránh bị block
    private static final String USER_AGENT = "WeatherForecastApp/1.0 (contact@example.com)";
    
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
            // Ví dụ: Console hiển thị "Ba Bß╗â" nhưng URL encode đúng là "Ba%20B%E1%BB%83"
            // => API call vẫn hoạt động đúng, chỉ là console hiển thị sai
            // System.out.println("Trying Nominatim query: " + query); // Comment để tránh spam log
            
            // Xây dựng URL với UTF-8 encoding đảm bảo
            // UriComponentsBuilder tự động encode query parameters với UTF-8
            // Thử không có countrycodes trước (giống web UI), nếu không có kết quả mới thêm countrycodes
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(NOMINATIM_API_URL)
                    .queryParam("q", query)  // Tự động encode với UTF-8
                    .queryParam("format", "json")
                    .queryParam("limit", 10)  // Tăng limit để có nhiều kết quả hơn
                    .queryParam("addressdetails", "1")
                    .queryParam("accept-language", "vi"); // Ưu tiên kết quả tiếng Việt
            // KHÔNG thêm countrycodes=vn ngay từ đầu (có thể quá hạn chế)
            // Sẽ filter sau trong code
            
            // Build URL và đảm bảo encoding là UTF-8
            // URL sẽ được encode đúng (ví dụ: "Xã Bàng Trang" -> "X%C3%A3%20B%C3%A0ng%20Trang")
            String url = builder.encode(StandardCharsets.UTF_8).build().toUriString();
            
            // Log URL đã được encode để debug
            System.out.println("Nominatim API URL (UTF-8 encoded): " + url);
            
            // Gọi API với User-Agent header (bắt buộc theo policy của Nominatim)
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent", USER_AGENT);
            // Thêm Referer header (một số API yêu cầu)
            headers.set("Referer", "https://nominatim.openstreetmap.org/");
            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);
            
            ResponseEntity<String> response;
            try {
                response = restTemplate.exchange(
                url, 
                org.springframework.http.HttpMethod.GET, 
                entity, 
                String.class
            );
                System.out.println("Nominatim response status: " + response.getStatusCode());
            } catch (org.springframework.web.client.ResourceAccessException e) {
                System.err.println("Nominatim connection error (timeout/network): " + e.getMessage());
                return null;
            } catch (org.springframework.web.client.HttpClientErrorException e) {
                System.err.println("Nominatim HTTP error: " + e.getStatusCode() + " - " + e.getMessage());
                return null;
            } catch (org.springframework.web.client.RestClientException e) {
                System.err.println("Nominatim REST client error: " + e.getMessage());
                return null;
            }
            
            // Kiểm tra rate limit headers
            String rateLimitRemaining = response.getHeaders().getFirst("X-RateLimit-Remaining");
            if (rateLimitRemaining != null) {
                System.out.println("Nominatim rate limit remaining: " + rateLimitRemaining);
            }
            String retryAfter = response.getHeaders().getFirst("Retry-After");
            if (retryAfter != null) {
                System.out.println("WARNING: Nominatim rate limited! Retry after: " + retryAfter + " seconds");
            }
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String responseBody = response.getBody().trim();
                System.out.println("Nominatim response body length: " + responseBody.length());
                
                // Log một phần response body để debug (nếu không rỗng)
                if (responseBody.length() > 2 && !responseBody.equals("[]")) {
                    System.out.println("Nominatim response preview: " + responseBody.substring(0, Math.min(200, responseBody.length())));
                }
                
                // Kiểm tra nếu response là mảng rỗng
                if (responseBody.equals("[]") || responseBody.isEmpty()) {
                    System.out.println("Nominatim returned empty array for query: " + query);
                    // Có thể là rate limit hoặc địa điểm không tồn tại
                    return null;
                }
                
                JsonNode jsonNode = objectMapper.readTree(responseBody);
                
                // Nominatim API trả về array
                if (jsonNode.isArray() && jsonNode.size() > 0) {
                    System.out.println("Nominatim found " + jsonNode.size() + " result(s)");
                    
                    // Ưu tiên kết quả có country code = "vn"
                    JsonNode bestResult = null;
                    
                    for (int i = 0; i < jsonNode.size(); i++) {
                        JsonNode result = jsonNode.get(i);
                        // Ưu tiên kết quả có addressdetails và country code = "vn"
                        if (result.has("address")) {
                            JsonNode address = result.get("address");
                            if (address.has("country_code") && "vn".equalsIgnoreCase(address.get("country_code").asText())) {
                                bestResult = result;
                                System.out.println("Found Vietnam result at index " + i);
                                break;
                            }
                        }
                    }
                    
                    // Nếu không tìm thấy kết quả có country_code=vn, dùng kết quả đầu tiên
                    if (bestResult == null) {
                        bestResult = jsonNode.get(0);
                        System.out.println("No Vietnam result found, using first result");
                    }
                    
                    Map<String, Double> coords = new HashMap<>();
                    if (bestResult.has("lat")) {
                        coords.put("lat", bestResult.get("lat").asDouble());
                    }
                    if (bestResult.has("lon")) {
                        coords.put("lng", bestResult.get("lon").asDouble());
                    }
                    
                    if (coords.containsKey("lat") && coords.containsKey("lng")) {
                        // Log coordinates (chỉ log số, không log Vietnamese text)
                        System.out.println("Nominatim found coordinates: lat=" + coords.get("lat") + ", lng=" + coords.get("lng"));
                        return coords;
                    } else {
                        System.out.println("Result found but missing lat/lon");
                    }
                } else {
                    System.out.println("Nominatim returned empty or invalid response");
                }
            } else {
                System.out.println("Nominatim API call failed: status=" + response.getStatusCode() + ", body=" + (response.getBody() != null ? response.getBody().substring(0, Math.min(200, response.getBody().length())) : "null"));
            }
            
            return null;
        } catch (org.springframework.web.client.ResourceAccessException e) {
            // Wraps SocketTimeoutException, ConnectTimeoutException, UnknownHostException, etc.
            Throwable cause = e.getCause();
            if (cause instanceof java.net.SocketTimeoutException) {
                System.err.println("Nominatim timeout error for query '" + query + "': " + e.getMessage());
            } else if (cause instanceof java.net.UnknownHostException) {
                System.err.println("Nominatim DNS error (cannot resolve host): " + e.getMessage());
            } else {
                System.err.println("Nominatim connection error for query '" + query + "': " + e.getMessage());
            }
            return null;
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.err.println("Nominatim HTTP error for query '" + query + "': " + e.getStatusCode() + " - " + e.getMessage());
            return null;
        } catch (org.springframework.web.client.RestClientException e) {
            System.err.println("Nominatim REST client error for query '" + query + "': " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.err.println("Unexpected error calling Nominatim with query '" + query + "': " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
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
        
        // Danh sách các query format để thử (tối đa 8 queries)
        // Ưu tiên query đơn giản trước (giống web UI), sau đó mới query phức tạp
        java.util.List<String> queries = new java.util.ArrayList<>();
        int maxQueries = 8; // Tăng lên 8 để có nhiều format hơn
        
        // Nếu có ward, thử query đơn giản trước (giống web UI: "xã đồng lạc")
        if (ward != null && !ward.trim().isEmpty()) {
            // Format 1: Ward với tiền tố gốc (giống web UI nhất) - ưu tiên cao nhất
            queries.add(ward.trim());
            
            // Format 2: Ward chuẩn hóa (bỏ tiền tố)
            if (normalizedWard != null && !normalizedWard.isEmpty() && !normalizedWard.equals(ward.trim())) {
                queries.add(normalizedWard);
            }
            
            // Format 3: Ward không dấu
            if (unaccentedWard != null && !unaccentedWard.isEmpty()) {
                queries.add(unaccentedWard);
            }
        }
        
        // Nếu có đầy đủ ward, district, city
        if (normalizedWard != null && !normalizedWard.isEmpty() && 
            normalizedDistrict != null && !normalizedDistrict.isEmpty() && 
            normalizedCity != null && !normalizedCity.isEmpty()) {
            
            // Format 4: Ward chuẩn hóa, District chuẩn hóa, City chuẩn hóa, Vietnam
            if (queries.size() < maxQueries) {
                queries.add(normalizedWard + ", " + normalizedDistrict + ", " + normalizedCity + ", Vietnam");
            }
            
            // Format 5: Không dấu (phổ biến trên Nominatim)
            if (queries.size() < maxQueries && unaccentedWard != null && unaccentedDistrict != null && unaccentedCity != null) {
                queries.add(unaccentedWard + ", " + unaccentedDistrict + ", " + unaccentedCity + ", Vietnam");
            }
        }
        
        // Nếu có district và city (fallback nếu không có ward hoặc ward không tìm thấy)
        if (queries.size() < maxQueries && 
            normalizedDistrict != null && !normalizedDistrict.isEmpty() && 
            normalizedCity != null && !normalizedCity.isEmpty()) {
            
            // Format 6: District, City, Vietnam (chuẩn hóa)
            queries.add(normalizedDistrict + ", " + normalizedCity + ", Vietnam");
            
            // Format 7: District, City, Vietnam (không dấu)
            if (queries.size() < maxQueries && unaccentedDistrict != null && unaccentedCity != null) {
                queries.add(unaccentedDistrict + ", " + unaccentedCity + ", Vietnam");
            }
        }
        
        // Nếu chỉ có city (fallback cuối cùng)
        if (queries.size() < maxQueries && normalizedCity != null && !normalizedCity.isEmpty()) {
            // Format 8: City, Vietnam (chuẩn hóa)
            queries.add(normalizedCity + ", Vietnam");
            
            // Format 9: City, Vietnam (không dấu) - chỉ thêm nếu còn chỗ
            if (queries.size() < maxQueries && unaccentedCity != null) {
                queries.add(unaccentedCity + ", Vietnam");
            }
        }
        
        // Thử từng query cho đến khi tìm thấy (tối đa maxQueries queries)
        int attemptCount = 0;
        for (String query : queries) {
            attemptCount++;
            if (attemptCount > maxQueries) {
                break; // Giới hạn số lần thử
            }
            Map<String, Double> coords = callNominatimAPI(query);
            if (coords != null && !coords.isEmpty()) {
                return coords;
            }
            
            // Delay giữa các request để tránh rate limit (Nominatim: 1 request/second)
            // QUAN TRỌNG: Nominatim yêu cầu tối thiểu 1 giây giữa các requests
            // Chỉ delay nếu chưa phải query cuối cùng
            if (attemptCount < queries.size() && attemptCount < maxQueries) {
                try {
                    // Tăng delay lên 1.5 giây để đảm bảo không bị rate limit
                    Thread.sleep(1500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    return null;
                }
            }
        }
        
        // Đã thử tối đa các query formats nhưng không tìm thấy kết quả
        System.out.println("Nominatim: No coordinates found after trying " + attemptCount + " query format(s)");
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
    
    /**
     * Test method để test trực tiếp với query đơn giản (giống web UI)
     * Không thử nhiều format, chỉ test với query chính xác như user nhập
     */
    public Map<String, Double> testNominatimQuery(String query) {
        if (!enabled) {
            return null;
        }
        
        System.out.println("Testing Nominatim with direct query: " + query);
        return callNominatimAPI(query);
    }
}


