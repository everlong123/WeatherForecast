package com.example.weather.service;

import com.example.weather.dto.WeatherDataDTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Service
public class WeatherApiService {
    @Value("${weatherapi.api.key:}")
    private String apiKey;

    @Value("${weatherapi.api.url:https://api.weatherapi.com/v1}")
    private String apiUrl;

    @Autowired
    private WeatherDataService weatherDataService;

    private final WebClient webClient;
    private final List<CityLocation> vietnamCities = Arrays.asList(
        new CityLocation(21.0285, 105.8542, "Hà Nội", "Hoàn Kiếm", "Tràng Tiền"),
        new CityLocation(10.8231, 106.6297, "Hồ Chí Minh", "Quận 1", "Bến Nghé"),
        new CityLocation(16.0544, 108.2022, "Đà Nẵng", "Hải Châu", "Hải Châu"),
        new CityLocation(20.8449, 106.6881, "Hải Phòng", "Hồng Bàng", "Máy Chai"),
        new CityLocation(10.3460, 107.0843, "Vũng Tàu", "Thành phố Vũng Tàu", "Thắng Tam")
    );

    public WeatherApiService() {
        this.webClient = WebClient.builder().build();
    }

    @Scheduled(fixedRate = 3600000) // Every hour
    public void fetchWeatherData() {
        // Skip if API key is not configured
        if (apiKey == null || apiKey.isEmpty()) {
            System.out.println("WeatherAPI.com key not configured. Skipping scheduled fetch.");
            return;
        }

        for (CityLocation city : vietnamCities) {
            try {
                fetchAndSaveWeather(city.lat, city.lng, city.city, city.district, city.ward);
                Thread.sleep(1000); // Rate limiting
            } catch (Exception e) {
                String errorMsg = e.getMessage();
                if (errorMsg == null || !errorMsg.contains("401") && !errorMsg.contains("403")) {
                    System.err.println("Error fetching weather for " + city.city + ": " + errorMsg);
                }
            }
        }
    }

    public WeatherDataDTO fetchAndSaveWeather(Double lat, Double lng, String city, 
                                              String district, String ward) {
        // Check if API key is configured
        if (apiKey == null || apiKey.isEmpty()) {
            System.out.println("WeatherAPI.com key not configured. Please set weatherapi.api.key in application.properties");
            return null;
        }

        try {
            // WeatherAPI.com format: /current.json?key={key}&q={lat},{lon}&lang=vi
            String url = String.format("%s/current.json?key=%s&q=%.4f,%.4f&lang=vi&aqi=yes",
                    apiUrl, apiKey, lat, lng);

            WeatherApiResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .onStatus(status -> status.value() == 401 || status.value() == 403, clientResponse -> {
                        System.err.println("WeatherAPI.com: Invalid API key. Please check your API key in application.properties");
                        return clientResponse.createException();
                    })
                    .onStatus(status -> status.value() == 429, clientResponse -> {
                        System.err.println("WeatherAPI.com: Rate limit exceeded. Please wait.");
                        return clientResponse.createException();
                    })
                    .bodyToMono(WeatherApiResponse.class)
                    .block();

            if (response != null && response.current != null && response.location != null) {
                WeatherDataDTO dto = new WeatherDataDTO();
                dto.setLatitude(lat);
                dto.setLongitude(lng);
                dto.setCity(city != null ? city : response.location.name);
                dto.setDistrict(district);
                dto.setWard(ward);
                dto.setTemperature(response.current.tempC);
                dto.setFeelsLike(response.current.feelslikeC);
                dto.setHumidity(response.current.humidity);
                dto.setPressure(response.current.pressureMb);
                dto.setWindSpeed(response.current.windKph != null ? response.current.windKph / 3.6 : null); // Convert km/h to m/s
                dto.setWindDirection(response.current.windDegree);
                dto.setVisibility(response.current.visKm);
                dto.setCloudiness(response.current.cloud);
                dto.setRainVolume(response.current.precipMm);
                dto.setMainWeather(response.current.condition != null ? response.current.condition.text : "N/A");
                dto.setDescription(response.current.condition != null ? response.current.condition.text : "N/A");
                dto.setIcon(response.current.condition != null ? response.current.condition.icon : null);
                dto.setRecordedAt(LocalDateTime.now());

                return weatherDataService.saveWeatherData(dto);
            }
        } catch (WebClientResponseException e) {
            if (e.getStatusCode().value() == 401 || e.getStatusCode().value() == 403) {
                System.err.println("WeatherAPI.com: Invalid API key. Please update weatherapi.api.key in application.properties");
            } else if (e.getStatusCode().value() == 429) {
                System.err.println("WeatherAPI.com: Rate limit exceeded. Please wait.");
            } else {
                System.err.println("Error fetching weather data: " + e.getMessage());
            }
        } catch (Exception e) {
            String errorMsg = e.getMessage();
            if (errorMsg != null && (errorMsg.contains("401") || errorMsg.contains("403"))) {
                System.err.println("WeatherAPI.com: Invalid API key. Please update weatherapi.api.key in application.properties");
            } else {
                System.err.println("Error fetching weather data: " + errorMsg);
            }
        }
        return null;
    }

    private static class CityLocation {
        double lat, lng;
        String city, district, ward;
        CityLocation(double lat, double lng, String city, String district, String ward) {
            this.lat = lat; this.lng = lng; this.city = city; this.district = district; this.ward = ward;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class WeatherApiResponse {
        Location location;
        Current current;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Location {
        String name;
        String region;
        String country;
        Double lat;
        Double lon;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Current {
        @JsonProperty("temp_c")
        Double tempC;
        
        @JsonProperty("feelslike_c")
        Double feelslikeC;
        
        @JsonProperty("humidity")
        Double humidity;
        
        @JsonProperty("pressure_mb")
        Double pressureMb;
        
        @JsonProperty("wind_kph")
        Double windKph;
        
        @JsonProperty("wind_degree")
        Double windDegree;
        
        @JsonProperty("vis_km")
        Double visKm;
        
        @JsonProperty("cloud")
        Double cloud;
        
        @JsonProperty("precip_mm")
        Double precipMm;
        
        Condition condition;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class Condition {
        String text;
        String icon;
    }
}













