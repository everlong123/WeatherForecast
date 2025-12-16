package com.example.weather.controller;

import com.example.weather.dto.DashboardStatsDTO;
import com.example.weather.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {
    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
}










