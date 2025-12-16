package com.example.weather.service;

import com.example.weather.dto.DashboardStatsDTO;
import com.example.weather.entity.WeatherReport;
import com.example.weather.repository.WeatherReportRepository;
import com.example.weather.repository.UserRepository;
import com.example.weather.repository.WeatherAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private WeatherReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeatherAlertRepository alertRepository;

    public DashboardStatsDTO getDashboardStats() {
        Long totalReports = reportRepository.count();
        Long pendingReports = (long) reportRepository.findByStatus(WeatherReport.ReportStatus.PENDING).size();
        Long approvedReports = (long) reportRepository.findByStatus(WeatherReport.ReportStatus.APPROVED).size();
        Long totalUsers = userRepository.count();
        Long activeAlerts = (long) alertRepository.findByActiveTrue().size();

        Map<String, Long> reportsByType = reportRepository.findAll().stream()
                .collect(Collectors.groupingBy(
                    r -> r.getIncidentType().getName(),
                    Collectors.counting()
                ));

        Map<String, Long> reportsByDistrict = reportRepository.findAll().stream()
                .filter(r -> r.getDistrict() != null)
                .collect(Collectors.groupingBy(
                    WeatherReport::getDistrict,
                    Collectors.counting()
                ));

        List<Map<String, Object>> recentReports = reportRepository.findAll().stream()
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .limit(10)
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getId());
                    map.put("title", r.getTitle());
                    map.put("type", r.getIncidentType().getName());
                    map.put("status", r.getStatus().name());
                    map.put("district", r.getDistrict());
                    map.put("createdAt", r.getCreatedAt());
                    return map;
                })
                .collect(Collectors.toList());

        List<Map<String, Object>> weatherTrends = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (int i = 6; i >= 0; i--) {
            LocalDateTime start = now.minusDays(i).withHour(0).withMinute(0);
            LocalDateTime end = start.plusDays(1);
            long count = reportRepository.findByDateRange(start, end).size();
            Map<String, Object> trend = new HashMap<>();
            trend.put("date", start.toLocalDate().toString());
            trend.put("count", count);
            weatherTrends.add(trend);
        }

        return new DashboardStatsDTO(
            totalReports, pendingReports, approvedReports, totalUsers, activeAlerts,
            reportsByType, reportsByDistrict, recentReports, weatherTrends
        );
    }
}

