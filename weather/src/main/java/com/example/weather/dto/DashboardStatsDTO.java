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
    private Map<String, Long> reportsBySeverity;
    private Double weekOverWeekChange;
    
    // Constructor cũ để backward compatibility
    public DashboardStatsDTO(Long totalReports, Long pendingReports, Long approvedReports, 
                            Long totalUsers, Long activeAlerts,
                            Map<String, Long> reportsByType, Map<String, Long> reportsByDistrict,
                            List<Map<String, Object>> recentReports, List<Map<String, Object>> weatherTrends) {
        this.totalReports = totalReports;
        this.pendingReports = pendingReports;
        this.approvedReports = approvedReports;
        this.totalUsers = totalUsers;
        this.activeAlerts = activeAlerts;
        this.reportsByType = reportsByType;
        this.reportsByDistrict = reportsByDistrict;
        this.recentReports = recentReports;
        this.weatherTrends = weatherTrends;
        this.reportsBySeverity = null;
        this.weekOverWeekChange = null;
    }
}




























