package com.example.weather.controller;

import com.example.weather.dto.AdminActionDTO;
import com.example.weather.dto.UserDTO;
import com.example.weather.dto.WeatherAlertDTO;
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
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

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PersistenceContext
    private EntityManager entityManager;

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

    @PutMapping("/reports/{id}")
    public ResponseEntity<WeatherReport> updateReport(@PathVariable Long id, @RequestBody Map<String, Object> reportData) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        if (reportData.get("title") != null) report.setTitle((String) reportData.get("title"));
        if (reportData.get("description") != null) report.setDescription((String) reportData.get("description"));
        if (reportData.get("address") != null) report.setAddress((String) reportData.get("address"));
        if (reportData.get("district") != null) report.setDistrict((String) reportData.get("district"));
        if (reportData.get("ward") != null) report.setWard((String) reportData.get("ward"));
        if (reportData.get("city") != null) report.setCity((String) reportData.get("city"));
        if (reportData.get("severity") != null) report.setSeverity(WeatherReport.SeverityLevel.valueOf((String) reportData.get("severity")));
        if (reportData.get("status") != null) report.setStatus(WeatherReport.ReportStatus.valueOf((String) reportData.get("status")));
        if (reportData.get("incidentTypeId") != null) {
            var incidentType = incidentTypeRepository.findById(Long.valueOf(reportData.get("incidentTypeId").toString()))
                    .orElseThrow(() -> new RuntimeException("Incident type not found"));
            report.setIncidentType(incidentType);
        }
        if (reportData.get("incidentTime") != null && !reportData.get("incidentTime").toString().isEmpty()) {
            try {
                String timeStr = reportData.get("incidentTime").toString();
                // Handle both ISO format and datetime-local format
                if (timeStr.contains("T")) {
                    report.setIncidentTime(LocalDateTime.parse(timeStr.replace("Z", "")));
                } else {
                    report.setIncidentTime(LocalDateTime.parse(timeStr));
                }
            } catch (Exception e) {
                // If parsing fails, keep the existing incidentTime
            }
        }

        return ResponseEntity.ok(reportRepository.save(report));
    }

    @DeleteMapping("/reports/{id}")
    @Transactional
    public ResponseEntity<Void> deleteReport(@PathVariable Long id, Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        User admin = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Lưu reportId trước khi xóa
        Long reportId = report.getId();
        
        // Tạo AdminAction với report = null để tránh constraint violation khi xóa
        // Chỉ lưu reportIdBackup để có thể truy vết sau này
        AdminAction action = new AdminAction();
        action.setReport(null); // Set null để tránh reference đến entity sẽ bị xóa
        action.setAdmin(admin);
        action.setActionType(AdminAction.ActionType.DELETE);
        action.setComment("Report deleted by admin");
        action.setReportIdBackup(reportId); // Lưu ID để truy vết
        
        // Lưu AdminAction trước khi xóa report
        adminActionRepository.saveAndFlush(action);

        // Xóa report sau khi đã lưu action
        reportRepository.delete(report);
        reportRepository.flush(); // Force flush để xử lý ngay
        
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
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
    public ResponseEntity<List<WeatherAlertDTO>> getAllAlerts() {
        List<WeatherAlert> alerts = alertRepository.findAll();
        List<WeatherAlertDTO> alertDTOs = alerts.stream()
                .map(WeatherAlertDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(alertDTOs);
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

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@RequestBody Map<String, Object> userData) {
        if (userRepository.existsByUsername((String) userData.get("username"))) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail((String) userData.get("email"))) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername((String) userData.get("username"));
        user.setEmail((String) userData.get("email"));
        String password = (String) userData.get("password");
        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        } else {
            throw new RuntimeException("Password is required");
        }
        user.setFullName((String) userData.get("fullName"));
        user.setPhone((String) userData.get("phone"));
        user.setAddress((String) userData.get("address"));
        user.setDistrict((String) userData.get("district"));
        user.setWard((String) userData.get("ward"));
        if (userData.get("role") != null) {
            user.setRole(User.Role.valueOf((String) userData.get("role")));
        } else {
            user.setRole(User.Role.USER);
        }
        user.setEnabled(userData.get("enabled") != null ? (Boolean) userData.get("enabled") : true);

        return ResponseEntity.ok(userRepository.save(user));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> userData) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (userData.get("username") != null) user.setUsername((String) userData.get("username"));
        if (userData.get("email") != null) user.setEmail((String) userData.get("email"));
        if (userData.get("password") != null && !((String) userData.get("password")).isEmpty()) {
            user.setPassword(passwordEncoder.encode((String) userData.get("password")));
        }
        if (userData.get("fullName") != null) user.setFullName((String) userData.get("fullName"));
        if (userData.get("phone") != null) user.setPhone((String) userData.get("phone"));
        if (userData.get("address") != null) user.setAddress((String) userData.get("address"));
        if (userData.get("district") != null) user.setDistrict((String) userData.get("district"));
        if (userData.get("ward") != null) user.setWard((String) userData.get("ward"));
        if (userData.get("role") != null) user.setRole(User.Role.valueOf((String) userData.get("role")));
        if (userData.get("enabled") != null) user.setEnabled((Boolean) userData.get("enabled"));

        return ResponseEntity.ok(userRepository.save(user));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
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
    public ResponseEntity<List<AdminActionDTO>> getAdminActions() {
        List<AdminAction> actions = adminActionRepository.findAll();
        List<AdminActionDTO> actionDTOs = actions.stream()
                .map(AdminActionDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(actionDTOs);
    }

    // Incident Types
    @GetMapping("/incident-types")
    public ResponseEntity<List<IncidentType>> getIncidentTypes() {
        return ResponseEntity.ok(incidentTypeRepository.findAll());
    }

    @PostMapping("/incident-types")
    public ResponseEntity<IncidentType> createIncidentType(@RequestBody Map<String, Object> typeData) {
        String name = (String) typeData.get("name");
        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("TÃªn loáº¡i sá»± cá»‘ khÃ´ng Ä‘Æ°á»£c Ä‘á»ƒ trá»‘ng");
        }
        if (incidentTypeRepository.existsByName(name)) {
            throw new RuntimeException("Loáº¡i sá»± cá»‘ '" + name + "' Ä‘Ã£ tá»“n táº¡i");
        }
        
        IncidentType type = new IncidentType();
        type.setName(name);
        type.setDescription((String) typeData.get("description"));
        type.setIcon((String) typeData.get("icon"));
        type.setColor((String) typeData.getOrDefault("color", "#001f3f"));
        return ResponseEntity.ok(incidentTypeRepository.save(type));
    }

    @PutMapping("/incident-types/{id}")
    public ResponseEntity<IncidentType> updateIncidentType(@PathVariable Long id, @RequestBody Map<String, Object> typeData) {
        IncidentType type = incidentTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loáº¡i sá»± cá»‘ khÃ´ng tá»“n táº¡i"));
        
        if (typeData.get("name") != null) {
            String newName = (String) typeData.get("name");
            // Kiá»ƒm tra náº¿u tÃªn má»›i khÃ¡c tÃªn cÅ© vÃ  Ä‘Ã£ tá»“n táº¡i
            if (!newName.equals(type.getName()) && incidentTypeRepository.existsByName(newName)) {
                throw new RuntimeException("Loáº¡i sá»± cá»‘ '" + newName + "' Ä‘Ã£ tá»“n táº¡i");
            }
            type.setName(newName);
        }
        if (typeData.get("description") != null) type.setDescription((String) typeData.get("description"));
        if (typeData.get("icon") != null) type.setIcon((String) typeData.get("icon"));
        if (typeData.get("color") != null) type.setColor((String) typeData.get("color"));
        return ResponseEntity.ok(incidentTypeRepository.save(type));
    }

}