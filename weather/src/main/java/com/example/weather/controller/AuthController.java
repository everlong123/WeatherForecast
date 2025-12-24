package com.example.weather.controller;

import com.example.weather.dto.AuthRequest;
import com.example.weather.dto.AuthResponse;
import com.example.weather.dto.RegisterRequest;
import com.example.weather.dto.UserDTO;
import com.example.weather.entity.User;
import com.example.weather.entity.WeatherReport;
import com.example.weather.repository.UserRepository;
import com.example.weather.repository.WeatherReportRepository;
import com.example.weather.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeatherReportRepository reportRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }

    @GetMapping("/me/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getUserStats(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<WeatherReport> userReports = reportRepository.findByUser(user);
        long totalReports = userReports.size();
        long approvedReports = userReports.stream()
                .filter(r -> r.getStatus() == WeatherReport.ReportStatus.APPROVED)
                .count();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalReports", totalReports);
        stats.put("approvedReports", approvedReports);
        stats.put("pendingReports", userReports.stream()
                .filter(r -> r.getStatus() == WeatherReport.ReportStatus.PENDING)
                .count());
        stats.put("rejectedReports", userReports.stream()
                .filter(r -> r.getStatus() == WeatherReport.ReportStatus.REJECTED)
                .count());
        stats.put("resolvedReports", userReports.stream()
                .filter(r -> r.getStatus() == WeatherReport.ReportStatus.RESOLVED)
                .count());
        
        return ResponseEntity.ok(stats);
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> updateProfile(
            @RequestBody Map<String, Object> profileData,
            Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Cập nhật các trường được phép
        if (profileData.get("fullName") != null) {
            user.setFullName((String) profileData.get("fullName"));
        }
        if (profileData.get("phone") != null) {
            user.setPhone((String) profileData.get("phone"));
        }
        if (profileData.get("address") != null) {
            user.setAddress((String) profileData.get("address"));
        }
        if (profileData.get("district") != null) {
            user.setDistrict((String) profileData.get("district"));
        }
        if (profileData.get("ward") != null) {
            user.setWard((String) profileData.get("ward"));
        }
        if (profileData.get("latitude") != null) {
            user.setLatitude(((Number) profileData.get("latitude")).doubleValue());
        }
        if (profileData.get("longitude") != null) {
            user.setLongitude(((Number) profileData.get("longitude")).doubleValue());
        }

        user = userRepository.save(user);
        return ResponseEntity.ok(UserDTO.fromEntity(user));
    }
}

