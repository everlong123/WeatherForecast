package com.example.weather.dto;

import com.example.weather.entity.WeatherAlert;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WeatherAlertDTO {
    private Long id;
    private Long adminId;
    private String adminUsername;
    private String title;
    private String message;
    private WeatherAlert.AlertLevel level;
    private String city;
    private String district;
    private String ward;
    private Double latitude;
    private Double longitude;
    private Double radius;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static WeatherAlertDTO fromEntity(WeatherAlert alert) {
        if (alert == null) {
            return null;
        }
        WeatherAlertDTO dto = new WeatherAlertDTO();
        dto.setId(alert.getId());
        if (alert.getAdmin() != null) {
            dto.setAdminId(alert.getAdmin().getId());
            dto.setAdminUsername(alert.getAdmin().getUsername());
        }
        dto.setTitle(alert.getTitle());
        dto.setMessage(alert.getMessage());
        dto.setLevel(alert.getLevel());
        dto.setCity(alert.getCity());
        dto.setDistrict(alert.getDistrict());
        dto.setWard(alert.getWard());
        dto.setLatitude(alert.getLatitude());
        dto.setLongitude(alert.getLongitude());
        dto.setRadius(alert.getRadius());
        dto.setStartTime(alert.getStartTime());
        dto.setEndTime(alert.getEndTime());
        dto.setActive(alert.getActive());
        dto.setCreatedAt(alert.getCreatedAt());
        dto.setUpdatedAt(alert.getUpdatedAt());
        return dto;
    }
}
