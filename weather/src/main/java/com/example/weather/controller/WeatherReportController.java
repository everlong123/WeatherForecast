package com.example.weather.controller;

import com.example.weather.dto.WeatherReportDTO;
import com.example.weather.entity.ReportVote;
import com.example.weather.service.WeatherReportService;
import com.example.weather.service.ReportVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/reports")
public class WeatherReportController {
    @Autowired
    private WeatherReportService reportService;
    
    @Autowired(required = false)
    private ReportVoteService voteService;

    @GetMapping
    public ResponseEntity<List<WeatherReportDTO>> getAllReports(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(reportService.getAllReports(username));
    }

    @GetMapping("/my-reports")
    public ResponseEntity<List<WeatherReportDTO>> getMyReports(Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(reportService.getUserReports(authentication.getName(), username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WeatherReportDTO> getReportById(@PathVariable Long id, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(reportService.getReportById(id, username));
    }

    @PostMapping
    public ResponseEntity<WeatherReportDTO> createReport(@Valid @RequestBody WeatherReportDTO reportDTO,
                                                        Authentication authentication) {
        // Không cho ADMIN tạo báo cáo
        if (authentication != null) {
            boolean isAdmin = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(role -> role.equals("ROLE_ADMIN"));
            if (isAdmin) {
                throw new RuntimeException("Administrators are not allowed to create reports");
            }
        }

        // Nếu không có authentication, sử dụng "guest" user (hoặc tạo mới nếu chưa có)
        String username = authentication != null ? authentication.getName() : "guest";
        return ResponseEntity.status(201).body(reportService.createReport(reportDTO, username));
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
    
    @PostMapping("/{id}/vote")
    public ResponseEntity<Map<String, Object>> voteReport(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload,
            Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("Authentication required");
        }
        
        String voteTypeStr = (String) payload.get("voteType");
        if (voteTypeStr == null) {
            throw new RuntimeException("voteType is required");
        }
        
        ReportVote.VoteType type = ReportVote.VoteType.valueOf(voteTypeStr.toUpperCase());
        
        // Lấy vị trí user từ request (có thể null nếu không có)
        Double userLatitude = null;
        Double userLongitude = null;
        if (payload.get("latitude") != null) {
            userLatitude = ((Number) payload.get("latitude")).doubleValue();
        }
        if (payload.get("longitude") != null) {
            userLongitude = ((Number) payload.get("longitude")).doubleValue();
        }
        
        voteService.voteReport(id, authentication.getName(), type, userLatitude, userLongitude);
        
        // Trả về vote counts mới
        WeatherReportDTO report = reportService.getReportById(id, authentication.getName());
        Map<String, Object> response = new HashMap<>();
        response.put("confirmCount", report.getConfirmCount());
        response.put("rejectCount", report.getRejectCount());
        response.put("userVote", report.getUserVote());
        response.put("message", "Vote submitted successfully");
        
        return ResponseEntity.ok(response);
    }
}
