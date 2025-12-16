package com.example.weather.controller;

import com.example.weather.entity.AdminAction;
import com.example.weather.entity.IncidentType;
import com.example.weather.entity.User;
import com.example.weather.entity.WeatherAlert;
import com.example.weather.entity.WeatherReport;
import com.example.weather.repository.AdminActionRepository;
import com.example.weather.repository.IncidentTypeRepository;
import com.example.weather.repository.UserRepository;
import com.example.weather.repository.WeatherAlertRepository;
import com.example.weather.repository.WeatherReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private WeatherReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeatherAlertRepository alertRepository;

    @Autowired
    private AdminActionRepository adminActionRepository;

    @Autowired
    private IncidentTypeRepository incidentTypeRepository;

    @PutMapping("/reports/{id}/approve")
    public ResponseEntity<WeatherReport> approveReport(
            @PathVariable Long id,
            @RequestParam(required = false) String comment,
            Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        User admin = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        report.setStatus(WeatherReport.ReportStatus.APPROVED);
        report = reportRepository.save(report);

        AdminAction action = new AdminAction();
        action.setReport(report);
        action.setAdmin(admin);
        action.setActionType(AdminAction.ActionType.APPROVE);
        action.setComment(comment);
        adminActionRepository.save(action);

        return ResponseEntity.ok(report);
    }

    @PutMapping("/reports/{id}/reject")
    public ResponseEntity<WeatherReport> rejectReport(
            @PathVariable Long id,
            @RequestParam(required = false) String comment,
            Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        User admin = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        report.setStatus(WeatherReport.ReportStatus.REJECTED);
        report = reportRepository.save(report);

        AdminAction action = new AdminAction();
        action.setReport(report);
        action.setAdmin(admin);
        action.setActionType(AdminAction.ActionType.REJECT);
        action.setComment(comment);
        adminActionRepository.save(action);

        return ResponseEntity.ok(report);
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<WeatherReport> resolveReport(
            @PathVariable Long id,
            @RequestParam(required = false) String comment,
            Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        User admin = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        report.setStatus(WeatherReport.ReportStatus.RESOLVED);
        report = reportRepository.save(report);

        AdminAction action = new AdminAction();
        action.setReport(report);
        action.setAdmin(admin);
        action.setActionType(AdminAction.ActionType.RESOLVE);
        action.setComment(comment);
        adminActionRepository.save(action);

        return ResponseEntity.ok(report);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/alerts")
    public ResponseEntity<WeatherAlert> createAlert(@RequestBody Map<String, Object> alertData,
                                                     Authentication authentication) {
        User admin = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        WeatherAlert alert = new WeatherAlert();
        alert.setAdmin(admin);
        alert.setTitle((String) alertData.get("title"));
        alert.setMessage((String) alertData.get("message"));
        alert.setLevel(WeatherAlert.AlertLevel.valueOf((String) alertData.getOrDefault("level", "INFO")));
        alert.setCity((String) alertData.get("city"));
        alert.setDistrict((String) alertData.get("district"));
        alert.setWard((String) alertData.get("ward"));
        if (alertData.get("latitude") != null) {
            alert.setLatitude(((Number) alertData.get("latitude")).doubleValue());
        }
        if (alertData.get("longitude") != null) {
            alert.setLongitude(((Number) alertData.get("longitude")).doubleValue());
        }
        if (alertData.get("radius") != null) {
            alert.setRadius(((Number) alertData.get("radius")).doubleValue());
        }
        alert.setStartTime(LocalDateTime.parse((String) alertData.get("startTime")));
        if (alertData.get("endTime") != null) {
            alert.setEndTime(LocalDateTime.parse((String) alertData.get("endTime")));
        }
        alert.setActive(true);

        return ResponseEntity.ok(alertRepository.save(alert));
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<WeatherAlert>> getAllAlerts() {
        return ResponseEntity.ok(alertRepository.findAll());
    }

    @PutMapping("/alerts/{id}")
    public ResponseEntity<WeatherAlert> updateAlert(@PathVariable Long id, @RequestBody Map<String, Object> alertData) {
        WeatherAlert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        if (alertData.get("title") != null) alert.setTitle((String) alertData.get("title"));
        if (alertData.get("message") != null) alert.setMessage((String) alertData.get("message"));
        if (alertData.get("level") != null) alert.setLevel(WeatherAlert.AlertLevel.valueOf((String) alertData.get("level")));
        if (alertData.get("active") != null) alert.setActive((Boolean) alertData.get("active"));
        return ResponseEntity.ok(alertRepository.save(alert));
    }

    @DeleteMapping("/alerts/{id}")
    public ResponseEntity<Void> deleteAlert(@PathVariable Long id) {
        alertRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/toggle")
    public ResponseEntity<User> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEnabled(!user.getEnabled());
        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> data) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setRole(User.Role.valueOf(data.get("role")));
        return ResponseEntity.ok(userRepository.save(user));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalUsers = userRepository.count();
        long totalReports = reportRepository.count();
        long pendingReports = reportRepository.findByStatus(WeatherReport.ReportStatus.PENDING).size();
        long activeAlerts = alertRepository.findByActiveTrue().size();
        long totalAlerts = alertRepository.count();

        Map<String, Object> stats = Map.of(
            "totalUsers", totalUsers,
            "totalReports", totalReports,
            "pendingReports", pendingReports,
            "activeAlerts", activeAlerts,
            "totalAlerts", totalAlerts
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/actions")
    public ResponseEntity<List<AdminAction>> getAdminActions() {
        return ResponseEntity.ok(adminActionRepository.findAll());
    }

    // Incident Types
    @GetMapping("/incident-types")
    public ResponseEntity<List<IncidentType>> getIncidentTypes() {
        return ResponseEntity.ok(incidentTypeRepository.findAll());
    }

    @PostMapping("/incident-types")
    public ResponseEntity<IncidentType> createIncidentType(@RequestBody Map<String, Object> typeData) {
        IncidentType type = new IncidentType();
        type.setName((String) typeData.get("name"));
        type.setDescription((String) typeData.get("description"));
        type.setIcon((String) typeData.get("icon"));
        type.setColor((String) typeData.getOrDefault("color", "#001f3f"));
        return ResponseEntity.ok(incidentTypeRepository.save(type));
    }

    @PutMapping("/incident-types/{id}")
    public ResponseEntity<IncidentType> updateIncidentType(@PathVariable Long id, @RequestBody Map<String, Object> typeData) {
        IncidentType type = incidentTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident type not found"));
        if (typeData.get("name") != null) type.setName((String) typeData.get("name"));
        if (typeData.get("description") != null) type.setDescription((String) typeData.get("description"));
        if (typeData.get("icon") != null) type.setIcon((String) typeData.get("icon"));
        if (typeData.get("color") != null) type.setColor((String) typeData.get("color"));
        return ResponseEntity.ok(incidentTypeRepository.save(type));
    }

    @DeleteMapping("/incident-types/{id}")
    public ResponseEntity<Void> deleteIncidentType(@PathVariable Long id) {
        incidentTypeRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

