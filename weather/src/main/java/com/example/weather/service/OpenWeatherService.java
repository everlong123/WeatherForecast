package com.example.weather.service;

import com.example.weather.dto.WeatherDataDTO;
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
public class OpenWeatherService {
    @Value("${openweather.api.key}")
    private String apiKey;

    @Value("${openweather.api.url}")
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

    public OpenWeatherService() {
        this.webClient = WebClient.builder().build();
    }

    @Scheduled(fixedRate = 3600000) // Every hour
    public void fetchWeatherData() {
        // Skip if API key is not configured
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-openweather-api-key")) {
            System.out.println("OpenWeather API key not configured. Skipping scheduled fetch.");
            return;
        }

        for (CityLocation city : vietnamCities) {
            try {
                fetchAndSaveWeather(city.lat, city.lng, city.city, city.district, city.ward);
                Thread.sleep(1000); // Rate limiting
            } catch (Exception e) {
                // Only log if it's not a 401 error (API key issue)
                if (!e.getMessage().contains("401")) {
                    System.err.println("Error fetching weather for " + city.city + ": " + e.getMessage());
                }
            }
        }
    }

    public WeatherDataDTO fetchAndSaveWeather(Double lat, Double lng, String city, 
                                              String district, String ward) {
        // Check if API key is configured
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("your-openweather-api-key")) {
            System.out.println("OpenWeather API key not configured. Please set openweather.api.key in application.properties");
            return null;
        }

        try {
            String url = String.format("%s/weather?lat=%.4f&lon=%.4f&appid=%s&units=metric&lang=vi",
                    apiUrl, lat, lng, apiKey);

            WeatherResponse response = webClient.get()
                    .uri(url)
                    .retrieve()
                    .onStatus(status -> status.value() == 401, clientResponse -> {
                        System.err.println("OpenWeather API: Invalid API key. Please check your API key in application.properties");
                        return clientResponse.createException();
                    })
                    .onStatus(status -> status.value() == 429, clientResponse -> {
                        System.err.println("OpenWeather API: Rate limit exceeded. Please wait.");
                        return clientResponse.createException();
                    })
                    .bodyToMono(WeatherResponse.class)
                    .block();

            if (response != null && response.main != null && response.weather != null && response.weather.length > 0) {
                WeatherDataDTO dto = new WeatherDataDTO();
                dto.setLatitude(lat);
                dto.setLongitude(lng);
                dto.setCity(city);
                dto.setDistrict(district);
                dto.setWard(ward);
                dto.setTemperature(response.main.temp);
                dto.setFeelsLike(response.main.feelsLike);
                dto.setHumidity(response.main.humidity);
                dto.setPressure(response.main.pressure);
                dto.setWindSpeed(response.wind != null ? response.wind.speed : null);
                dto.setWindDirection(response.wind != null ? response.wind.deg : null);
                dto.setVisibility(response.visibility != null ? response.visibility / 1000.0 : null);
                dto.setCloudiness(response.clouds != null ? response.clouds.all : null);
                dto.setRainVolume(response.rain != null ? response.rain.oneHour : null);
                dto.setMainWeather(response.weather[0].main);
                dto.setDescription(response.weather[0].description);
                dto.setIcon(response.weather[0].icon);
                dto.setRecordedAt(LocalDateTime.now());

                return weatherDataService.saveWeatherData(dto);
            }
        } catch (WebClientResponseException e) {
            if (e.getStatusCode().value() == 401) {
                System.err.println("OpenWeather API: Invalid API key. Please update openweather.api.key in application.properties");
            } else if (e.getStatusCode().value() == 429) {
                System.err.println("OpenWeather API: Rate limit exceeded. Please wait.");
            } else {
                System.err.println("Error fetching weather data: " + e.getMessage());
            }
        } catch (Exception e) {
            String errorMsg = e.getMessage();
            if (errorMsg != null && errorMsg.contains("401")) {
                System.err.println("OpenWeather API: Invalid API key. Please update openweather.api.key in application.properties");
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

    private static class WeatherResponse {
        Main main;
        Wind wind;
        Clouds clouds;
        Weather[] weather;
        Double visibility;
        Rain rain;
    }

    private static class Main {
        Double temp;
        Double feelsLike;
        Double humidity;
        Double pressure;
    }

    private static class Wind {
        Double speed;
        Double deg;
    }

    private static class Clouds {
        Double all;
    }

    private static class Weather {
        String main;
        String description;
        String icon;
    }

    private static class Rain {
        Double oneHour;
    }
}

