package com.example.weather.service;

import com.example.weather.dto.WeatherReportDTO;
import com.example.weather.entity.IncidentType;
import com.example.weather.entity.User;
import com.example.weather.entity.WeatherReport;
import com.example.weather.repository.IncidentTypeRepository;
import com.example.weather.repository.UserRepository;
import com.example.weather.repository.WeatherReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WeatherReportService {
    @Autowired
    private WeatherReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private IncidentTypeRepository incidentTypeRepository;

    public List<WeatherReportDTO> getAllReports() {
        return reportRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<WeatherReportDTO> getUserReports(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return reportRepository.findByUser(user).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public WeatherReportDTO getReportById(Long id) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        return convertToDTO(report);
    }

    public WeatherReportDTO createReport(WeatherReportDTO dto, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        IncidentType incidentType = incidentTypeRepository.findById(dto.getIncidentTypeId())
                .orElseThrow(() -> new RuntimeException("Incident type not found"));

        WeatherReport report = new WeatherReport();
        report.setUser(user);
        report.setIncidentType(incidentType);
        report.setTitle(dto.getTitle());
        report.setDescription(dto.getDescription());
        report.setAddress(dto.getAddress());
        report.setDistrict(dto.getDistrict());
        report.setWard(dto.getWard());
        report.setCity(dto.getCity());
        report.setStatus(dto.getStatus() != null ? dto.getStatus() : WeatherReport.ReportStatus.PENDING);
        report.setSeverity(dto.getSeverity() != null ? dto.getSeverity() : WeatherReport.SeverityLevel.LOW);
        report.setImages(dto.getImages());
        report.setIncidentTime(dto.getIncidentTime() != null ? dto.getIncidentTime() : LocalDateTime.now());

        report = reportRepository.save(report);
        return convertToDTO(report);
    }

    public WeatherReportDTO updateReport(Long id, WeatherReportDTO dto, String username) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Kiểm tra quyền sở hữu
        if (!report.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to update this report");
        }

        if (dto.getIncidentTypeId() != null) {
            IncidentType incidentType = incidentTypeRepository.findById(dto.getIncidentTypeId())
                    .orElseThrow(() -> new RuntimeException("Incident type not found"));
            report.setIncidentType(incidentType);
        }

        if (dto.getTitle() != null) report.setTitle(dto.getTitle());
        if (dto.getDescription() != null) report.setDescription(dto.getDescription());
        if (dto.getAddress() != null) report.setAddress(dto.getAddress());
        if (dto.getDistrict() != null) report.setDistrict(dto.getDistrict());
        if (dto.getWard() != null) report.setWard(dto.getWard());
        if (dto.getCity() != null) report.setCity(dto.getCity());
        if (dto.getSeverity() != null) report.setSeverity(dto.getSeverity());
        if (dto.getImages() != null) report.setImages(dto.getImages());
        if (dto.getIncidentTime() != null) report.setIncidentTime(dto.getIncidentTime());

        report = reportRepository.save(report);
        return convertToDTO(report);
    }

    public void deleteReport(Long id, String username) {
        WeatherReport report = reportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Report not found"));

        // Kiểm tra quyền sở hữu
        if (!report.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You don't have permission to delete this report");
        }

        reportRepository.delete(report);
    }

    private WeatherReportDTO convertToDTO(WeatherReport report) {
        WeatherReportDTO dto = new WeatherReportDTO();
        dto.setId(report.getId());
        dto.setUserId(report.getUser().getId());
        dto.setUsername(report.getUser().getUsername());
        dto.setIncidentTypeId(report.getIncidentType().getId());
        dto.setIncidentTypeName(report.getIncidentType().getName());
        dto.setTitle(report.getTitle());
        dto.setDescription(report.getDescription());
        dto.setAddress(report.getAddress());
        dto.setDistrict(report.getDistrict());
        dto.setWard(report.getWard());
        dto.setCity(report.getCity());
        dto.setStatus(report.getStatus());
        dto.setSeverity(report.getSeverity());
        dto.setImages(report.getImages());
        dto.setIncidentTime(report.getIncidentTime());
        dto.setCreatedAt(report.getCreatedAt());
        dto.setUpdatedAt(report.getUpdatedAt());
        return dto;
    }
}
