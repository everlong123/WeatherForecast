package com.example.weather.service;

import com.example.weather.entity.User;
import com.example.weather.entity.WeatherReport;
import com.example.weather.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrustScoreService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Points khi report được approve
    private static final int APPROVE_POINTS = 5;
    
    // Points bị trừ khi report bị reject
    private static final int REJECT_POINTS = -3;
    
    // Min trust score (không có max, có thể tăng không giới hạn)
    private static final int MIN_TRUST_SCORE = 0;
    
    /**
     * Cập nhật trust score khi admin approve report
     * Trust score có thể tăng không giới hạn
     */
    @Transactional
    public void onReportApproved(WeatherReport report) {
        if (report == null || report.getUser() == null) {
            return;
        }
        
        User user = report.getUser();
        int newScore = user.getTrustScore() + APPROVE_POINTS; // Không giới hạn trên
        user.setTrustScore(newScore);
        userRepository.save(user);
    }
    
    /**
     * Cập nhật trust score khi admin reject report
     */
    @Transactional
    public void onReportRejected(WeatherReport report) {
        if (report == null || report.getUser() == null) {
            return;
        }
        
        User user = report.getUser();
        int newScore = Math.max(MIN_TRUST_SCORE, user.getTrustScore() + REJECT_POINTS);
        user.setTrustScore(newScore);
        userRepository.save(user);
    }
    
    /**
     * Lấy trust level dựa trên score
     * Trust score không giới hạn, nhưng level vẫn dựa trên các mốc chuẩn
     * Đã giảm ngưỡng để thăng hạng dễ hơn
     */
    public String getTrustLevel(int trustScore) {
        if (trustScore >= 100) {
            return "EXPERT"; // Chuyên gia
        } else if (trustScore >= 50) {
            return "ADVANCED"; // Cao cấp
        } else if (trustScore >= 30) {
            return "INTERMEDIATE"; // Trung cấp
        } else {
            return "BEGINNER"; // Sơ cấp (bao gồm cả người mới)
        }
    }
    
    /**
     * Lấy màu sắc cho trust level
     * Đã giảm ngưỡng để thăng hạng dễ hơn
     */
    public String getTrustLevelColor(int trustScore) {
        if (trustScore >= 100) {
            return "#9333ea"; // Purple - Chuyên gia
        } else if (trustScore >= 50) {
            return "#10b981"; // Green - Cao cấp
        } else if (trustScore >= 30) {
            return "#3b82f6"; // Blue - Trung cấp
        } else {
            return "#f59e0b"; // Yellow/Orange - Sơ cấp
        }
    }
}

