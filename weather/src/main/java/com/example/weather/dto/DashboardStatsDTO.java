package com.example.weather.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@AllArgsConstructor
public class DashboardStatsDTO {
    private Long totalReports;
    private Long pendingReports;
    private Long approvedReports;
    private Long totalUsers;
    private Long activeAlerts;
    private Map<String, Long> reportsByType;
    private Map<String, Long> reportsByDistrict;
    private List<Map<String, Object>> recentReports;
    private List<Map<String, Object>> weatherTrends;
}






















