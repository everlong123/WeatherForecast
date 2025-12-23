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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service để gọi OpenWeatherMap API (FREE)
 * Free tier: 1000 calls/day, 60 calls/minute
 * Đăng ký tại: https://openweathermap.org/api
 */
@Service
public class OpenWeatherService {
    
    @Value("${openweather.api.key:}")
    private String apiKey;
    
    @Value("${openweather.api.enabled:false}")
    private boolean enabled;
    
    @Autowired
    private RestTemplate restTemplate;
    
    @Autowired
    private WeatherDataService weatherDataService;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    private static final String OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";
    private static final String OPENWEATHER_GEOCODING_URL = "http://api.openweathermap.org/geo/1.0/direct";
    private static final String OPENWEATHER_ONECALL_API_URL = "https://api.openweathermap.org/data/3.0/onecall";
    
    /**
     * Lấy tọa độ (lat/lng) từ tên địa điểm bằng Geocoding API
     */
    public Map<String, Double> getCoordinatesFromLocation(String city, String district, String ward) {
        if (!enabled || apiKey == null || apiKey.isEmpty()) {
            return null;
        }
        
        try {
            // Xây dựng query string từ địa điểm
            // Luôn bao gồm tỉnh để tăng độ chính xác
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
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(OPENWEATHER_GEOCODING_URL)
                    .queryParam("q", query)
                    .queryParam("limit", 1)
                    .queryParam("appid", apiKey);
            
            String url = builder.build().toUriString();
            
            // Gọi API
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                // Geocoding API trả về array
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
                        System.out.println("Geocoding result for '" + query + "': " + coords);
                        return coords;
                    }
                }
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi OpenWeatherMap Geocoding API: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Lấy thời tiết hiện tại từ OpenWeatherMap API
     */
    public WeatherDataDTO getCurrentWeather(Double lat, Double lng, String city, String district, String ward) {
        if (!enabled || apiKey == null || apiKey.isEmpty()) {
            return null; // Fallback về mock service
        }
        
        try {
            // Xây dựng URL với query parameters
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(OPENWEATHER_API_URL)
                    .queryParam("lat", lat)
                    .queryParam("lon", lng)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric") // Nhiệt độ theo Celsius
                    .queryParam("lang", "vi"); // Tiếng Việt
            
            String url = builder.build().toUriString();
            
            // Gọi API
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Parse JSON response
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                // Kiểm tra lỗi từ API
                if (jsonNode.has("cod") && jsonNode.get("cod").asInt() != 200) {
                    System.err.println("OpenWeatherMap API Error: " + jsonNode.toString());
                    return null;
                }
                
                // Chuyển đổi sang WeatherDataDTO
                WeatherDataDTO dto = convertToWeatherDataDTO(jsonNode, lat, lng, city, district, ward);
                
                // Lưu vào database
                return weatherDataService.saveWeatherData(dto);
            }
            
            return null;
        } catch (ResourceAccessException e) {
            System.err.println("Không thể kết nối đến OpenWeatherMap API: " + e.getMessage());
            return null;
        } catch (Exception e) {
            System.err.println("Lỗi khi gọi OpenWeatherMap API: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * Chuyển đổi JSON response từ OpenWeatherMap API sang WeatherDataDTO
     */
    private WeatherDataDTO convertToWeatherDataDTO(JsonNode jsonNode, Double lat, Double lng, 
                                                   String city, String district, String ward) {
        WeatherDataDTO dto = new WeatherDataDTO();
        
        dto.setLatitude(lat);
        dto.setLongitude(lng);
        dto.setCity(city != null ? city : (jsonNode.has("name") ? jsonNode.get("name").asText() : null));
        dto.setDistrict(district);
        dto.setWard(ward);
        dto.setRecordedAt(LocalDateTime.now());
        
        // Parse main data
        if (jsonNode.has("main")) {
            JsonNode main = jsonNode.get("main");
            
            if (main.has("temp")) {
                dto.setTemperature(main.get("temp").asDouble());
            }
            
            if (main.has("feels_like")) {
                dto.setFeelsLike(main.get("feels_like").asDouble());
            }
            
            if (main.has("humidity")) {
                dto.setHumidity((double) main.get("humidity").asInt());
            }
            
            if (main.has("pressure")) {
                dto.setPressure((double) main.get("pressure").asInt());
            }
        }
        
        // Parse wind data
        if (jsonNode.has("wind")) {
            JsonNode wind = jsonNode.get("wind");
            
            if (wind.has("speed")) {
                dto.setWindSpeed(wind.get("speed").asDouble());
            }
            
            if (wind.has("deg")) {
                dto.setWindDirection((double) wind.get("deg").asInt());
            }
        }
        
        // Parse visibility
        if (jsonNode.has("visibility")) {
            // OpenWeatherMap trả về visibility theo mét, chuyển sang km
            dto.setVisibility(jsonNode.get("visibility").asDouble() / 1000.0);
        }
        
        // Parse clouds
        if (jsonNode.has("clouds")) {
            JsonNode clouds = jsonNode.get("clouds");
            if (clouds.has("all")) {
                dto.setCloudiness((double) clouds.get("all").asInt());
            }
        }
        
        // Parse rain
        if (jsonNode.has("rain")) {
            JsonNode rain = jsonNode.get("rain");
            if (rain.has("1h")) {
                dto.setRainVolume(rain.get("1h").asDouble());
            }
        }
        
        // Parse weather condition
        if (jsonNode.has("weather") && jsonNode.get("weather").isArray() && jsonNode.get("weather").size() > 0) {
            JsonNode weather = jsonNode.get("weather").get(0);
            
            if (weather.has("main")) {
                dto.setMainWeather(weather.get("main").asText());
            }
            
            if (weather.has("description")) {
                dto.setDescription(weather.get("description").asText());
            }
            
            if (weather.has("icon")) {
                // OpenWeatherMap icon URL: http://openweathermap.org/img/w/{icon}.png
                dto.setIcon("http://openweathermap.org/img/w/" + weather.get("icon").asText() + ".png");
            }
        }
        
        return dto;
    }
    
    /**
     * Lấy hourly forecast từ OpenWeatherMap One Call API 3.0
     * @param lat Latitude
     * @param lng Longitude
     * @param hoursAhead Số giờ dự báo trước (tối đa 48 giờ với free tier)
     * @return Danh sách forecast theo từng giờ
     */
    public List<Map<String, Object>> getHourlyForecast(Double lat, Double lng, int hoursAhead) {
        if (!enabled || apiKey == null || apiKey.isEmpty() || lat == null || lng == null) {
            return null;
        }
        
        try {
            // Xây dựng URL với One Call API 3.0
            UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(OPENWEATHER_ONECALL_API_URL)
                    .queryParam("lat", lat)
                    .queryParam("lon", lng)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .queryParam("lang", "vi")
                    .queryParam("exclude", "minutely,daily,alerts"); // Chỉ lấy hourly và current
            
            String url = builder.build().toUriString();
            
            // Gọi API
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode jsonNode = objectMapper.readTree(response.getBody());
                
                // Kiểm tra lỗi
                if (jsonNode.has("cod")) {
                    System.err.println("OpenWeatherMap One Call API Error: " + jsonNode.toString());
                    return null;
                }
                
                List<Map<String, Object>> forecasts = new ArrayList<>();
                
                // Parse hourly forecast
                if (jsonNode.has("hourly") && jsonNode.get("hourly").isArray()) {
                    JsonNode hourlyArray = jsonNode.get("hourly");
                    
                    // Lấy thời gian hiện tại để lọc bỏ các giờ đã qua
                    long nowTimestamp = System.currentTimeMillis() / 1000; // Convert to seconds
                    System.out.println("Current timestamp: " + nowTimestamp);
                    
                    int count = 0;
                    for (int i = 0; i < hourlyArray.size() && count < hoursAhead; i++) {
                        JsonNode hour = hourlyArray.get(i);
                        
                        // Kiểm tra timestamp để bỏ qua giờ đã qua
                        if (hour.has("dt")) {
                            long timestamp = hour.get("dt").asLong();
                            
                            // Chỉ lấy các giờ từ hiện tại trở đi (cho phép sai số 5 phút)
                            if (timestamp < nowTimestamp - 300) { // 300 giây = 5 phút
                                continue; // Bỏ qua giờ đã qua
                            }
                        }
                        
                        Map<String, Object> forecast = new HashMap<>();
                        
                        // DateTime (Unix timestamp)
                        if (hour.has("dt")) {
                            long timestamp = hour.get("dt").asLong();
                            forecast.put("datetime", java.time.Instant.ofEpochSecond(timestamp).toString());
                        }
                        
                        // Temperature
                        if (hour.has("temp")) {
                            forecast.put("temperature", hour.get("temp").asDouble());
                        }
                        
                        // Feels like
                        if (hour.has("feels_like")) {
                            forecast.put("feelsLike", hour.get("feels_like").asDouble());
                        }
                        
                        // Humidity
                        if (hour.has("humidity")) {
                            forecast.put("humidity", (double) hour.get("humidity").asInt());
                        }
                        
                        // Pressure
                        if (hour.has("pressure")) {
                            forecast.put("pressure", (double) hour.get("pressure").asInt());
                        }
                        
                        // Wind Speed
                        if (hour.has("wind_speed")) {
                            forecast.put("windSpeed", hour.get("wind_speed").asDouble());
                        }
                        
                        // Wind Direction
                        if (hour.has("wind_deg")) {
                            forecast.put("windDirection", (double) hour.get("wind_deg").asInt());
                        }
                        
                        // Cloudiness
                        if (hour.has("clouds")) {
                            forecast.put("cloudiness", (double) hour.get("clouds").asInt());
                        }
                        
                        // Visibility
                        if (hour.has("visibility")) {
                            forecast.put("visibility", hour.get("visibility").asDouble() / 1000.0); // m -> km
                        }
                        
                        // Rain
                        if (hour.has("rain") && hour.get("rain").has("1h")) {
                            forecast.put("rainVolume", hour.get("rain").get("1h").asDouble());
                        }
                        
                        // Snow
                        if (hour.has("snow") && hour.get("snow").has("1h")) {
                            forecast.put("snowVolume", hour.get("snow").get("1h").asDouble());
                        }
                        
                        // Weather condition
                        if (hour.has("weather") && hour.get("weather").isArray() && hour.get("weather").size() > 0) {
                            JsonNode weather = hour.get("weather").get(0);
                            if (weather.has("main")) {
                                forecast.put("mainWeather", weather.get("main").asText());
                            }
                            if (weather.has("description")) {
                                forecast.put("description", weather.get("description").asText());
                            }
                            if (weather.has("icon")) {
                                forecast.put("icon", "http://openweathermap.org/img/w/" + weather.get("icon").asText() + ".png");
                            }
                        }
                        
                        forecasts.add(forecast);
                        count++; // Tăng số lượng forecast đã thêm
                    }
                    
                    System.out.println("OpenWeatherMap forecast processed: " + forecasts.size() + " items (filtered from " + hourlyArray.size() + " total items, starting from current time)");
                }
                
                return forecasts.isEmpty() ? null : forecasts;
            }
            
            return null;
        } catch (Exception e) {
            System.err.println("Error calling OpenWeatherMap One Call API 3.0: " + e.getMessage());
            return null;
        }
    }
    
    /**
     * Kiểm tra xem service có sẵn sàng không
     */
    public boolean isAvailable() {
        return enabled && apiKey != null && !apiKey.isEmpty();
    }
}

