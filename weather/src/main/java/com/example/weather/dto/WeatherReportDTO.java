package com.example.weather.dto;

import com.example.weather.entity.WeatherReport;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class WeatherReportDTO {
    private Long id;
    private Long userId;
    private String username;
    private Long incidentTypeId;
    private String incidentTypeName;
    private String title;
    private String description;
    private Double latitude;
    private Double longitude;
    private String address;
    private String district;
    private String ward;
    private String city;
    private WeatherReport.ReportStatus status;
    private WeatherReport.SeverityLevel severity;
    private List<String> images;
    private LocalDateTime incidentTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}










