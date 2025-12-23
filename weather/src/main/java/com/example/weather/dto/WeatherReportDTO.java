package com.example.weather.dto;

import com.example.weather.entity.WeatherReport;
import com.fasterxml.jackson.annotation.JsonFormat;
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
    private String district;
    private String ward;
    private String city;
    private Double latitude;
    private Double longitude;
    private WeatherReport.ReportStatus status;
    private WeatherReport.SeverityLevel severity;
    private Boolean hidden;
    private List<String> images;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime incidentTime;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Vote counts
    private Long confirmCount = 0L;
    private Long rejectCount = 0L;
    private String userVote; // "CONFIRM", "REJECT", or null
    
    // Admin suggestion
    private Double priorityScore;
    private String suggestedStatus; // "APPROVE", "REVIEW", "REJECT"
}
