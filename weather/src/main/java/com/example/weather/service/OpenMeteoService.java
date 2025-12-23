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
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service để gọi Open-Meteo API
 * Miễn phí, không cần API key
 * Cung cấp cả Geocoding và Weather Forecast API
 * Documentation: https://open-meteo.com/
 */
@Service
public class OpenMeteoService {
    
    @Value("${openmeteo.api.enabled:true}")
    private boolean enabled;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired(required = false)
    private WeatherDataService weatherDataService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static final String GEOCODING_API_URL = "https://geocoding-api.open-meteo.com/v1/search";
    private static final String FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast";
    
    /**
     * Lấy tọa độ (lat/lng) từ tên địa điểm bằng Open-Meteo Geocoding API
     * Thử query với tiếng Việt có dấu trước, nếu không có kết quả thì thử không dấu
     */
    public Map<String, Double> getCoordinatesFromLocation(String city, String district, String ward) {
        if (!enabled) {
            return null;
        }
        
        // Thử query với tiếng Việt có dấu trước
        Map<String, Double> coords = tryGetCoordinates(city, district, ward, false);
        if (coords != null && coords.containsKey("lat") && coords.containsKey("lng")) {
            return coords;
        }
        
        // Fallback: Thử query với tiếng Việt không dấu
        coords = tryGetCoordinates(city, district, ward, true);
        if (coords != null && coords.containsKey("lat") && coords.containsKey("lng")) {
            return coords;
        }
        
        return null;
    }
    
    /**
     * Thử lấy tọa độ với một query cụ thể
     */
    private Map<String, Double> tryGetCoordinates(String city, String district, String ward, boolean useUnaccented) {
        try {
            // Xây dựng query string từ địa điểm
            String query = buildLocationQuery(city, district, ward, useUnaccented);
            if (query == null || query.isEmpty()) {
                return null;
            }
            
            // Xây dựng URL với UTF-8 encoding
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(GEOCODING_API_URL)
                    .queryParam("name", query)
                    .queryParam("count", 1)
                    .queryParam("language", "vi")
                    .queryParam("format", "json");
            
            String url = builder.encode(StandardCharsets.UTF_8).build().toUriString();
            
            // Log URL encoded (không log Vietnamese text trực tiếp để tránh lỗi font console)
            // System.out.println("Open-Meteo API URL: " + url);
            
            // Gọi API
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                // Open-Meteo Geocoding API trả về object với field "results" là array
                if (jsonNode.has("results") && jsonNode.get("results").isArray() && jsonNode.get("results").size() > 0) {
                    JsonNode firstResult = jsonNode.get("results").get(0);
                    
                    Map<String, Double> coords = new HashMap<>();
                    if (firstResult.has("latitude")) {
                        coords.put("lat", firstResult.get("latitude").asDouble());
                    }
                    if (firstResult.has("longitude")) {
                        coords.put("lng", firstResult.get("longitude").asDouble());
                    }
                    
                    if (coords.containsKey("lat") && coords.containsKey("lng")) {
                        // Log coordinates found (chỉ log số, không log Vietnamese text)
                        System.out.println("Open-Meteo coordinates found: lat=" + coords.get("lat") + ", lng=" + coords.get("lng"));
                        return coords;
                    }
                }
            }
            
            return null;
        } catch (Exception e) {
            // Chỉ log error message, không log Vietnamese text
            System.err.println("Error calling Open-Meteo Geocoding API: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Xây dựng query string từ city, district, ward
     * Ưu tiên format: "ward, district, city, Vietnam" hoặc đơn giản hơn
     * @param useUnaccented Nếu true, chuyển tiếng Việt sang không dấu
     */
    private String buildLocationQuery(String city, String district, String ward, boolean useUnaccented) {
        // Chuẩn hóa địa điểm (bỏ tiền tố)
        String normalizedCity = city != null ? normalizeLocation(city) : null;
        String normalizedDistrict = district != null ? normalizeLocation(district) : null;
        String normalizedWard = ward != null ? normalizeLocation(ward) : null;
        
        // Nếu cần, chuyển sang không dấu
        if (useUnaccented) {
            normalizedCity = normalizedCity != null ? removeVietnameseAccents(normalizedCity) : null;
            normalizedDistrict = normalizedDistrict != null ? removeVietnameseAccents(normalizedDistrict) : null;
            normalizedWard = normalizedWard != null ? removeVietnameseAccents(normalizedWard) : null;
        }
        
        StringBuilder query = new StringBuilder();
        
        // Ưu tiên ward, district, city
        if (normalizedWard != null && !normalizedWard.trim().isEmpty()) {
            query.append(normalizedWard.trim());
            if (normalizedDistrict != null && !normalizedDistrict.trim().isEmpty()) {
                query.append(", ").append(normalizedDistrict.trim());
            }
            if (normalizedCity != null && !normalizedCity.trim().isEmpty()) {
                query.append(", ").append(normalizedCity.trim());
            }
        } else if (normalizedDistrict != null && !normalizedDistrict.trim().isEmpty()) {
            query.append(normalizedDistrict.trim());
            if (normalizedCity != null && !normalizedCity.trim().isEmpty()) {
                query.append(", ").append(normalizedCity.trim());
            }
        } else if (normalizedCity != null && !normalizedCity.trim().isEmpty()) {
            query.append(normalizedCity.trim());
        } else {
            return null;
        }
        
        // Thêm "Vietnam" để tăng độ chính xác
        query.append(", Vietnam");
        
        return query.toString();
    }
    
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
     * Lấy thời tiết hiện tại từ Open-Meteo Forecast API
     * Trả về WeatherDataDTO với đầy đủ thông tin thời tiết
     */
    public WeatherDataDTO getCurrentWeather(Double lat, Double lng, String city, String district, String ward) {
        if (!enabled || lat == null || lng == null) {
            return null;
        }
        
        try {
            // Xây dựng URL với các parameters cần thiết
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(FORECAST_API_URL)
                    .queryParam("latitude", lat)
                    .queryParam("longitude", lng)
                    .queryParam("current", "temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code")
                    .queryParam("hourly", "temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code,visibility,rain,cloud_cover")
                    .queryParam("wind_speed_unit", "ms") // m/s để nhất quán với OpenWeatherMap
                    .queryParam("timezone", "Asia/Ho_Chi_Minh")
                    .queryParam("forecast_days", 1);
            
            String url = builder.build().toUriString();
            
            // Gọi API
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                // Chuyển đổi sang WeatherDataDTO
                WeatherDataDTO dto = convertToWeatherDataDTO(jsonNode, lat, lng, city, district, ward);
                
                // Lưu vào database nếu có WeatherDataService
                if (weatherDataService != null && dto != null) {
                    return weatherDataService.saveWeatherData(dto);
                }
                
                return dto;
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Error calling Open-Meteo Forecast API: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Lấy tọa độ và thời tiết cùng lúc từ địa chỉ
     * Đây là phương thức chính để sử dụng: nhập địa chỉ -> trả về tọa độ và thời tiết
     */
    public Map<String, Object> getCoordinatesAndWeather(String city, String district, String ward) {
        Map<String, Object> result = new HashMap<>();
        
        // Bước 1: Lấy tọa độ từ địa chỉ
        Map<String, Double> coords = getCoordinatesFromLocation(city, district, ward);
        if (coords == null || !coords.containsKey("lat") || !coords.containsKey("lng")) {
            return null;
        }
        
        result.put("latitude", coords.get("lat"));
        result.put("longitude", coords.get("lng"));
        
        // Bước 2: Lấy thời tiết từ tọa độ
        WeatherDataDTO weather = getCurrentWeather(coords.get("lat"), coords.get("lng"), city, district, ward);
        if (weather != null) {
            result.put("weather", weather);
        }
        
        return result;
    }
    
    /**
     * Chuyển đổi JSON response từ Open-Meteo API sang WeatherDataDTO
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
        
        // Parse current weather data
        if (jsonNode.has("current")) {
            JsonNode current = jsonNode.get("current");
            
            if (current.has("temperature_2m")) {
                dto.setTemperature(current.get("temperature_2m").asDouble());
            }
            
            // Open-Meteo không có "feels_like", có thể tính toán hoặc dùng temperature_2m
            if (dto.getTemperature() != null) {
                dto.setFeelsLike(dto.getTemperature());
            }
            
            if (current.has("relative_humidity_2m")) {
                dto.setHumidity((double) current.get("relative_humidity_2m").asInt());
            }
            
            if (current.has("pressure_msl")) {
                // Open-Meteo trả về pressure_msl (hPa), chuyển sang đơn vị tương tự
                dto.setPressure(current.get("pressure_msl").asDouble());
            }
            
            if (current.has("wind_speed_10m")) {
                // Open-Meteo trả về m/s (vì đã chỉ định wind_speed_unit=ms)
                dto.setWindSpeed(current.get("wind_speed_10m").asDouble());
            }
            
            if (current.has("wind_direction_10m")) {
                dto.setWindDirection((double) current.get("wind_direction_10m").asInt());
            }
            
            if (current.has("weather_code")) {
                // Open-Meteo sử dụng WMO Weather Interpretation Codes
                int code = current.get("weather_code").asInt();
                String[] weatherInfo = interpretWeatherCode(code);
                dto.setMainWeather(weatherInfo[0]);
                dto.setDescription(weatherInfo[1]);
            }
        }
        
        // Parse hourly data để lấy thêm thông tin (visibility, rain, snow, cloud_cover)
        if (jsonNode.has("hourly") && jsonNode.get("hourly").has("time")) {
            JsonNode hourly = jsonNode.get("hourly");
            
            // Lấy dữ liệu đầu tiên (hiện tại)
            if (hourly.has("visibility") && hourly.get("visibility").isArray() && hourly.get("visibility").size() > 0) {
                double visibility = hourly.get("visibility").get(0).asDouble();
                dto.setVisibility(visibility / 1000.0); // m -> km
            }
            
            if (hourly.has("rain") && hourly.get("rain").isArray() && hourly.get("rain").size() > 0) {
                dto.setRainVolume(hourly.get("rain").get(0).asDouble());
            }
            
            if (hourly.has("snow") && hourly.get("snow").isArray() && hourly.get("snow").size() > 0) {
                dto.setSnowVolume(hourly.get("snow").get(0).asDouble());
            }
            
            if (hourly.has("cloud_cover") && hourly.get("cloud_cover").isArray() && hourly.get("cloud_cover").size() > 0) {
                dto.setCloudiness((double) hourly.get("cloud_cover").get(0).asInt());
            }
        }
        
        // Set icon (có thể tạo URL icon dựa trên weather code)
        if (dto.getMainWeather() != null) {
            dto.setIcon(getWeatherIconUrl(dto.getMainWeather()));
        }
        
        return dto;
    }
    
    /**
     * Chuyển đổi WMO Weather Code sang mô tả thời tiết
     * Reference: https://open-meteo.com/en/docs#api_form
     */
    private String[] interpretWeatherCode(int code) {
        // WMO Weather Interpretation Codes (WW)
        switch (code) {
            case 0: return new String[]{"Clear", "Bầu trời quang đãng"};
            case 1: case 2: case 3: return new String[]{"Cloudy", "Có mây"};
            case 45: case 48: return new String[]{"Fog", "Sương mù"};
            case 51: case 53: case 55: return new String[]{"Drizzle", "Mưa phùn"};
            case 56: case 57: return new String[]{"Freezing Drizzle", "Mưa phùn đóng băng"};
            case 61: case 63: case 65: return new String[]{"Rain", "Mưa"};
            case 66: case 67: return new String[]{"Freezing Rain", "Mưa đóng băng"};
            case 71: case 73: case 75: return new String[]{"Snow", "Tuyết"};
            case 77: return new String[]{"Snow Grains", "Hạt tuyết"};
            case 80: case 81: case 82: return new String[]{"Rain Showers", "Mưa rào"};
            case 85: case 86: return new String[]{"Snow Showers", "Tuyết rơi"};
            case 95: return new String[]{"Thunderstorm", "Dông"};
            case 96: case 99: return new String[]{"Thunderstorm with Hail", "Dông có mưa đá"};
            default: return new String[]{"Unknown", "Không xác định"};
        }
    }
    
    /**
     * Tạo URL icon dựa trên loại thời tiết
     */
    private String getWeatherIconUrl(String mainWeather) {
        // Có thể sử dụng OpenWeatherMap icon hoặc icon khác
        // Hoặc tạo icon URL riêng
        String iconCode = "01d"; // default
        
        if (mainWeather != null) {
            switch (mainWeather.toLowerCase()) {
                case "clear": iconCode = "01d"; break;
                case "cloudy": iconCode = "02d"; break;
                case "fog": iconCode = "50d"; break;
                case "drizzle": case "rain": iconCode = "10d"; break;
                case "snow": iconCode = "13d"; break;
                case "thunderstorm": iconCode = "11d"; break;
            }
        }
        
        return "http://openweathermap.org/img/w/" + iconCode + ".png";
    }
    
    /**
     * Lấy forecast (dự báo) thời tiết theo giờ từ Open-Meteo API
     * @param lat Latitude
     * @param lng Longitude
     * @param hoursAhead Số giờ dự báo trước (tối đa 7 ngày = 168 giờ)
     * @return Danh sách forecast theo từng giờ
     */
    public List<Map<String, Object>> getHourlyForecast(Double lat, Double lng, int hoursAhead) {
        if (!enabled || lat == null || lng == null) {
            return null;
        }
        
        try {
            // Tính số ngày forecast cần thiết (tối đa 7 ngày)
            int forecastDays = Math.min((hoursAhead / 24) + 1, 7);
            
            // Xây dựng URL với hourly forecast
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(FORECAST_API_URL)
                    .queryParam("latitude", lat)
                    .queryParam("longitude", lng)
                    .queryParam("hourly", "temperature_2m,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code,visibility,rain,cloud_cover")
                    .queryParam("wind_speed_unit", "ms")
                    .queryParam("timezone", "Asia/Ho_Chi_Minh")
                    .queryParam("forecast_days", forecastDays);
            
            String url = builder.build().toUriString();
            
            // Gọi API
            System.out.println("Open-Meteo Forecast API URL: " + url);
            ResponseEntity<String> response;
            try {
                response = restTemplate.getForEntity(url, String.class);
            } catch (org.springframework.web.client.ResourceAccessException e) {
                System.err.println("Open-Meteo Forecast API connection error (timeout/network): " + e.getMessage());
                return null;
            } catch (org.springframework.web.client.HttpClientErrorException e) {
                System.err.println("Open-Meteo Forecast API HTTP error: " + e.getStatusCode() + " - " + e.getMessage());
                if (e.getResponseBodyAsString() != null && e.getResponseBodyAsString().length() < 500) {
                    System.err.println("Response body: " + e.getResponseBodyAsString());
                }
                return null;
            } catch (org.springframework.web.client.RestClientException e) {
                System.err.println("Open-Meteo Forecast API REST client error: " + e.getMessage());
                return null;
            }
            
            System.out.println("Open-Meteo Forecast API response status: " + response.getStatusCode());
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                String responseBody = response.getBody();
                System.out.println("Open-Meteo Forecast API response body length: " + responseBody.length());
                
                JsonNode jsonNode;
                try {
                    jsonNode = objectMapper.readTree(responseBody);
                } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
                    System.err.println("Error parsing Open-Meteo Forecast API JSON response: " + e.getMessage());
                    if (responseBody.length() < 500) {
                        System.err.println("Response body: " + responseBody);
                    }
                    return null;
                }
                
                if (jsonNode.has("hourly")) {
                    JsonNode hourly = jsonNode.get("hourly");
                    System.out.println("Open-Meteo hourly data found");
                    List<Map<String, Object>> forecasts = new ArrayList<>();
                    
                    // Lấy mảng time để biết số lượng forecast
                    if (hourly.has("time") && hourly.get("time").isArray()) {
                        JsonNode timeArray = hourly.get("time");
                        int count = Math.min(timeArray.size(), hoursAhead);
                        System.out.println("Open-Meteo forecast items to process: " + count);
                        
                        for (int i = 0; i < count; i++) {
                            Map<String, Object> forecast = new HashMap<>();
                            
                            // Time
                            if (timeArray.get(i) != null) {
                                forecast.put("datetime", timeArray.get(i).asText());
                            }
                            
                            // Temperature
                            if (hourly.has("temperature_2m") && hourly.get("temperature_2m").isArray() && 
                                hourly.get("temperature_2m").size() > i) {
                                forecast.put("temperature", hourly.get("temperature_2m").get(i).asDouble());
                            }
                            
                            // Humidity
                            if (hourly.has("relative_humidity_2m") && hourly.get("relative_humidity_2m").isArray() && 
                                hourly.get("relative_humidity_2m").size() > i) {
                                forecast.put("humidity", (double) hourly.get("relative_humidity_2m").get(i).asInt());
                            }
                            
                            // Pressure
                            if (hourly.has("pressure_msl") && hourly.get("pressure_msl").isArray() && 
                                hourly.get("pressure_msl").size() > i) {
                                forecast.put("pressure", hourly.get("pressure_msl").get(i).asDouble());
                            }
                            
                            // Wind Speed
                            if (hourly.has("wind_speed_10m") && hourly.get("wind_speed_10m").isArray() && 
                                hourly.get("wind_speed_10m").size() > i) {
                                forecast.put("windSpeed", hourly.get("wind_speed_10m").get(i).asDouble());
                            }
                            
                            // Wind Direction
                            if (hourly.has("wind_direction_10m") && hourly.get("wind_direction_10m").isArray() && 
                                hourly.get("wind_direction_10m").size() > i) {
                                forecast.put("windDirection", (double) hourly.get("wind_direction_10m").get(i).asInt());
                            }
                            
                            // Cloudiness
                            if (hourly.has("cloud_cover") && hourly.get("cloud_cover").isArray() && 
                                hourly.get("cloud_cover").size() > i) {
                                forecast.put("cloudiness", (double) hourly.get("cloud_cover").get(i).asInt());
                            }
                            
                            // Weather Code -> Main Weather & Description
                            if (hourly.has("weather_code") && hourly.get("weather_code").isArray() && 
                                hourly.get("weather_code").size() > i) {
                                int code = hourly.get("weather_code").get(i).asInt();
                                String[] weatherInfo = interpretWeatherCode(code);
                                forecast.put("mainWeather", weatherInfo[0]);
                                forecast.put("description", weatherInfo[1]);
                            }
                            
                            // Rain
                            if (hourly.has("rain") && hourly.get("rain").isArray() && 
                                hourly.get("rain").size() > i) {
                                forecast.put("rainVolume", hourly.get("rain").get(i).asDouble());
                            }
                            
                            // Snow - removed from API request due to conflict with pressure_msl
                            // Set to 0 for Vietnam (no snow)
                            forecast.put("snowVolume", 0.0);
                            
                            forecasts.add(forecast);
                        }
                    }
                    
                    System.out.println("Open-Meteo forecast processed: " + forecasts.size() + " items");
                    return forecasts.isEmpty() ? null : forecasts;
                } else {
                    System.out.println("Open-Meteo response does not have 'hourly' field");
                    // Log response để debug
                    if (response.getBody() != null && response.getBody().length() < 500) {
                        System.out.println("Response body: " + response.getBody());
                    }
                }
            } else {
                System.out.println("Open-Meteo Forecast API response is not OK or body is null. Status: " + 
                    (response != null ? response.getStatusCode() : "null"));
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Error calling Open-Meteo Forecast API: " + e.getMessage());
            e.printStackTrace();
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

