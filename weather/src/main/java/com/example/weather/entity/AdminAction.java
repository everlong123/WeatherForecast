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
    @JoinColumn(name = "report_id", nullable = false)
    private WeatherReport report;

    @ManyToOne
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ActionType actionType;

    private String comment;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ActionType {
        APPROVE, REJECT, RESOLVE, UPDATE, DELETE
    }
}










