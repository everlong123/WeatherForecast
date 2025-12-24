package com.example.weather.controller;

import com.example.weather.dto.IncidentTypeDTO;
import com.example.weather.dto.PageResponse;
import com.example.weather.dto.UserDTO;
import com.example.weather.dto.WeatherAlertDTO;
import com.example.weather.dto.WeatherReportDTO;
import com.example.weather.entity.IncidentType;
import com.example.weather.entity.User;
import com.example.weather.entity.WeatherAlert;
import com.example.weather.entity.WeatherReport;
import com.example.weather.repository.IncidentTypeRepository;
import com.example.weather.repository.UserRepository;
import com.example.weather.repository.WeatherAlertRepository;
import com.example.weather.repository.WeatherReportRepository;
import com.example.weather.service.WeatherReportService;
import com.example.weather.service.AdminSuggestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

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
    private IncidentTypeRepository incidentTypeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private WeatherReportService weatherReportService;
    
    @Autowired(required = false)
    private AdminSuggestionService adminSuggestionService;
    
    @Autowired
    private com.example.weather.service.TrustScoreService trustScoreService;

    @PutMapping("/reports/{id}/approve")
    public ResponseEntity<WeatherReport> approveReport(
            @PathVariable Long id,
            @RequestParam(required = false) String comment,
            Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Chỉ update trust score nếu report chưa được approve trước đó
        boolean wasPending = report.getStatus() == WeatherReport.ReportStatus.PENDING;
        
        report.setStatus(WeatherReport.ReportStatus.APPROVED);
        report = reportRepository.save(report);
        
        // Update trust score nếu đây là lần đầu approve
        if (wasPending && trustScoreService != null) {
            trustScoreService.onReportApproved(report);
        }

        return ResponseEntity.ok(report);
    }

    @PutMapping("/reports/{id}/reject")
    public ResponseEntity<WeatherReport> rejectReport(
            @PathVariable Long id,
            @RequestParam(required = false) String comment,
            Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Chỉ update trust score nếu report chưa được reject trước đó
        boolean wasPending = report.getStatus() == WeatherReport.ReportStatus.PENDING;
        
        report.setStatus(WeatherReport.ReportStatus.REJECTED);
        report = reportRepository.save(report);
        
        // Update trust score nếu đây là lần đầu reject
        if (wasPending && trustScoreService != null) {
            trustScoreService.onReportRejected(report);
        }

        return ResponseEntity.ok(report);
    }

    @PutMapping("/reports/{id}/resolve")
    public ResponseEntity<WeatherReport> resolveReport(
            @PathVariable Long id,
            @RequestParam(required = false) String comment,
            Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        report.setStatus(WeatherReport.ReportStatus.RESOLVED);
        report = reportRepository.save(report);

        return ResponseEntity.ok(report);
    }

    @PutMapping("/reports/{id}/hide")
    public ResponseEntity<WeatherReport> hideReport(@PathVariable Long id, Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setHidden(true);
        return ResponseEntity.ok(reportRepository.save(report));
    }

    @PutMapping("/reports/{id}/unhide")
    public ResponseEntity<WeatherReport> unhideReport(@PathVariable Long id, Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        report.setHidden(false);
        return ResponseEntity.ok(reportRepository.save(report));
    }

    @DeleteMapping("/reports/{id}")
    @Transactional
    public ResponseEntity<Void> deleteReport(@PathVariable Long id, Authentication authentication) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        reportRepository.delete(report);
        
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/reports")
    public ResponseEntity<?> getAllReports(
            Authentication authentication,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {
        String username = authentication != null ? authentication.getName() : null;
        
        // Nếu có page và size, trả về paginated response
        if (page >= 0 && size > 0) {
            org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(
                page, size, 
                org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "createdAt", "id")
            );
            org.springframework.data.domain.Page<WeatherReport> reportPage = reportRepository.findAll(pageable);
            
            List<WeatherReportDTO> content = reportPage.getContent().stream()
                    .map(r -> {
                        WeatherReportDTO dto = weatherReportService.convertToDTO(r, username);
                        // Thêm admin suggestions
                        if (adminSuggestionService != null) {
                            AdminSuggestionService.AdminSuggestion suggestion = adminSuggestionService.getSuggestion(r);
                            dto.setPriorityScore(suggestion.getPriorityScore());
                            dto.setSuggestedStatus(suggestion.getSuggestedAction());
                        }
                        return dto;
                    })
                    .collect(Collectors.toList());
            
            PageResponse<WeatherReportDTO> pageResponse = new PageResponse<>(
                content,
                reportPage.getNumber(),
                reportPage.getSize(),
                reportPage.getTotalElements(),
                reportPage.getTotalPages(),
                reportPage.isFirst(),
                reportPage.isLast()
            );
            
            return ResponseEntity.ok(pageResponse);
        }
        
        // Ngược lại, trả về list đầy đủ (backward compatibility)
        List<WeatherReportDTO> reports = reportRepository.findAll().stream()
                // Sắp xếp theo thời gian tạo giảm dần (mới nhất trước)
                .sorted((a, b) -> {
                    if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
                        return b.getCreatedAt().compareTo(a.getCreatedAt());
                    }
                    // Fallback: sắp xếp theo id giảm dần nếu createdAt null
                    return Long.compare(
                        b.getId() != null ? b.getId() : 0L,
                        a.getId() != null ? a.getId() : 0L
                    );
                })
                .map(r -> {
                    WeatherReportDTO dto = weatherReportService.convertToDTO(r, username);
                    // Thêm admin suggestions
                    if (adminSuggestionService != null) {
                        AdminSuggestionService.AdminSuggestion suggestion = adminSuggestionService.getSuggestion(r);
                        dto.setPriorityScore(suggestion.getPriorityScore());
                        dto.setSuggestedStatus(suggestion.getSuggestedAction());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(reports);
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

    // Incident Types
    @GetMapping("/incident-types")
    public ResponseEntity<List<IncidentTypeDTO>> getIncidentTypes() {
        List<IncidentTypeDTO> dtos = incidentTypeRepository.findAll().stream()
                .map(type -> {
                    IncidentTypeDTO dto = new IncidentTypeDTO();
                    dto.setId(type.getId());
                    dto.setName(type.getName());
                    dto.setDescription(type.getDescription());
                    dto.setIcon(type.getIcon());
                    dto.setColor(type.getColor());
                    dto.setCreatedAt(type.getCreatedAt());
                    dto.setUpdatedAt(type.getUpdatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/incident-types")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<IncidentType> createIncidentType(@RequestBody Map<String, Object> typeData) {
        System.out.println("Creating incident type with data: " + typeData);
        String name = (String) typeData.get("name");
        if (name == null || name.trim().isEmpty()) {
            System.err.println("Error: Name is null or empty");
            throw new RuntimeException("Tên loại sự cố không được để trống");
        }
        
        if (incidentTypeRepository.existsByName(name)) {
            System.err.println("Error: Incident type '" + name + "' already exists");
            throw new RuntimeException("Loại sự cố '" + name + "' đã tồn tại");
        }
        
        IncidentType type = new IncidentType();
        type.setName(name.trim());
        type.setDescription((String) typeData.get("description"));
        type.setIcon((String) typeData.get("icon"));
        type.setColor((String) typeData.getOrDefault("color", "#001f3f"));
        
        System.out.println("Saving incident type: " + type.getName());
        IncidentType saved = incidentTypeRepository.save(type);
        System.out.println("Saved incident type with ID: " + saved.getId());
        
        // Verify it was saved
        long count = incidentTypeRepository.count();
        System.out.println("Total incident types in DB after save: " + count);
        
        return ResponseEntity.ok(saved);
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

    @DeleteMapping("/incident-types/{id}")
    public ResponseEntity<Void> deleteIncidentType(@PathVariable Long id) {
        IncidentType type = incidentTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loại sự cố không tồn tại"));
        
        // Kiểm tra xem có báo cáo nào đang sử dụng loại sự cố này không
        if (type.getReports() != null && !type.getReports().isEmpty()) {
            throw new RuntimeException("Không thể xóa loại sự cố này vì đang có " + type.getReports().size() + " báo cáo đang sử dụng");
        }
        
        incidentTypeRepository.delete(type);
        return ResponseEntity.noContent().build();
    }

}