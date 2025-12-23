package com.example.weather.service;

import com.example.weather.dto.WeatherDataDTO;
import com.example.weather.entity.WeatherData;
import com.example.weather.repository.WeatherDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeatherDataService {
    @Autowired
    private WeatherDataRepository weatherDataRepository;

    public WeatherDataDTO saveWeatherData(WeatherDataDTO dto) {
        WeatherData data = new WeatherData();
        data.setLatitude(dto.getLatitude());
        data.setLongitude(dto.getLongitude());
        data.setCity(dto.getCity());
        data.setDistrict(dto.getDistrict());
        data.setWard(dto.getWard());
        data.setTemperature(dto.getTemperature());
        data.setFeelsLike(dto.getFeelsLike());
        data.setHumidity(dto.getHumidity());
        data.setPressure(dto.getPressure());
        data.setWindSpeed(dto.getWindSpeed());
        data.setWindDirection(dto.getWindDirection());
        data.setVisibility(dto.getVisibility());
        data.setCloudiness(dto.getCloudiness());
        data.setRainVolume(dto.getRainVolume());
        data.setSnowVolume(dto.getSnowVolume());
        data.setMainWeather(dto.getMainWeather());
        data.setDescription(dto.getDescription());
        data.setIcon(dto.getIcon());
        data.setRecordedAt(dto.getRecordedAt() != null ? dto.getRecordedAt() : LocalDateTime.now());

        data = weatherDataRepository.save(data);
        return convertToDTO(data);
    }

    public WeatherDataDTO getCurrentWeather(Double lat, Double lng) {
        WeatherData data = weatherDataRepository
                .findFirstByLatitudeAndLongitudeOrderByRecordedAtDesc(lat, lng)
                .orElse(null);
        return data != null ? convertToDTO(data) : null;
    }

    public List<WeatherDataDTO> getWeatherHistory(Double lat, Double lng) {
        return weatherDataRepository.findByLocation(lat, lng).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private WeatherDataDTO convertToDTO(WeatherData data) {
        WeatherDataDTO dto = new WeatherDataDTO();
        dto.setId(data.getId());
        dto.setLatitude(data.getLatitude());
        dto.setLongitude(data.getLongitude());
        dto.setCity(data.getCity());
        dto.setDistrict(data.getDistrict());
        dto.setWard(data.getWard());
        dto.setTemperature(data.getTemperature());
        dto.setFeelsLike(data.getFeelsLike());
        dto.setHumidity(data.getHumidity());
        dto.setPressure(data.getPressure());
        dto.setWindSpeed(data.getWindSpeed());
        dto.setWindDirection(data.getWindDirection());
        dto.setVisibility(data.getVisibility());
        dto.setCloudiness(data.getCloudiness());
        dto.setRainVolume(data.getRainVolume());
        dto.setSnowVolume(data.getSnowVolume());
        dto.setMainWeather(data.getMainWeather());
        dto.setDescription(data.getDescription());
        dto.setIcon(data.getIcon());
        dto.setRecordedAt(data.getRecordedAt());
        return dto;
    }
}




























