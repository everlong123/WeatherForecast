package com.example.weather.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admin_actions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminAction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "report_id", nullable = true, foreignKey = @ForeignKey(name = "fk_admin_action_report"))
    private WeatherReport report;
    
    // Lưu report ID để có thể truy vết ngay cả khi report đã bị xóa
    @Column(name = "report_id_backup")
    private Long reportIdBackup;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Column(nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        // Lưu report ID để có thể truy vết ngay cả khi report đã bị xóa
        if (report != null && report.getId() != null) {
            reportIdBackup = report.getId();
        }
        // Nếu reportIdBackup đã được set trực tiếp (như khi xóa report), giữ nguyên
    }

    public enum ActionType {
        APPROVE, REJECT, RESOLVE, DELETE
    }
}
