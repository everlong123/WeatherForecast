package com.example.weather.controller;

import com.example.weather.dto.WeatherReportDTO;
import com.example.weather.service.WeatherReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/reports")
public class WeatherReportController {
    @Autowired
    private WeatherReportService reportService;

    @GetMapping
    public ResponseEntity<List<WeatherReportDTO>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<WeatherReportDTO>> getMyReports(Authentication authentication) {
        return ResponseEntity.ok(reportService.getUserReports(authentication.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeatherReportDTO> getReportById(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @PostMapping
    public ResponseEntity<WeatherReportDTO> createReport(@Valid @RequestBody WeatherReportDTO reportDTO, Authentication authentication) {
        return ResponseEntity.status(201).body(reportService.createReport(reportDTO, authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WeatherReportDTO> updateReport(@PathVariable Long id, @Valid @RequestBody WeatherReportDTO reportDTO, Authentication authentication) {
        return ResponseEntity.ok(reportService.updateReport(id, reportDTO, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id, Authentication authentication) {
        reportService.deleteReport(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
