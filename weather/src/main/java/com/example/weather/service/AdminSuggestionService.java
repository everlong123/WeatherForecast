package com.example.weather.service;

import com.example.weather.entity.WeatherReport;
import com.example.weather.repository.ReportVoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class AdminSuggestionService {
    
    @Autowired
    private ReportVoteRepository voteRepository;
    
    /**
     * Tính priority score cho báo cáo
     * Score cao = nên duyệt, Score thấp = nên từ chối
     */
    public double calculatePriorityScore(WeatherReport report) {
        double score = 0.0;
        
        // 1. Severity weight (40%)
        switch (report.getSeverity()) {
            case CRITICAL:
                score += 40.0;
                break;
            case HIGH:
                score += 30.0;
                break;
            case MEDIUM:
                score += 20.0;
                break;
            case LOW:
                score += 10.0;
                break;
        }
        
        // 2. Community confirmation (30%)
        Long confirmCount = voteRepository.countConfirmsByReport(report);
        Long rejectCount = voteRepository.countRejectsByReport(report);
        
        if (confirmCount > 0 || rejectCount > 0) {
            double totalVotes = confirmCount + rejectCount;
            double confirmRatio = confirmCount / totalVotes;
            score += confirmRatio * 30.0;
            
            // Bonus nếu có nhiều confirm
            if (confirmCount >= 5) {
                score += 10.0; // Bonus
            }
        }
        
        // 3. Time factor (20%) - Báo cáo mới hơn = priority cao hơn
        if (report.getCreatedAt() != null) {
            long hoursSinceCreation = ChronoUnit.HOURS.between(report.getCreatedAt(), LocalDateTime.now());
            if (hoursSinceCreation < 24) {
                score += 20.0; // Rất mới
            } else if (hoursSinceCreation < 72) {
                score += 15.0; // Mới
            } else if (hoursSinceCreation < 168) { // 1 tuần
                score += 10.0; // Vừa
            } else {
                score += 5.0; // Cũ
            }
        }
        
        // 4. Has images (10%) - Báo cáo có ảnh = đáng tin hơn
        if (report.getImages() != null && !report.getImages().isEmpty()) {
            score += 10.0;
        }
        
        // 5. Penalty nếu có nhiều reject
        if (rejectCount != null && rejectCount > 0) {
            if (rejectCount >= 3) {
                score -= 20.0; // Nhiều reject = giảm score
            } else if (rejectCount >= 2) {
                score -= 10.0;
            }
        }
        
        // Normalize score về 0-100
        return Math.max(0, Math.min(100, score));
    }
    
    /**
     * Đề xuất hành động cho admin dựa trên priority score
     */
    public String suggestAction(double priorityScore) {
        if (priorityScore >= 70) {
            return "APPROVE"; // Nên duyệt
        } else if (priorityScore >= 40) {
            return "REVIEW"; // Cần xem xét kỹ
        } else {
            return "REJECT"; // Nên từ chối
        }
    }
    
    /**
     * Tính priority score và trả về suggestion
     */
    public AdminSuggestion getSuggestion(WeatherReport report) {
        double score = calculatePriorityScore(report);
        String action = suggestAction(score);
        
        AdminSuggestion suggestion = new AdminSuggestion();
        suggestion.setPriorityScore(score);
        suggestion.setSuggestedAction(action);
        suggestion.setConfirmCount(voteRepository.countConfirmsByReport(report));
        suggestion.setRejectCount(voteRepository.countRejectsByReport(report));
        
        return suggestion;
    }
    
    public static class AdminSuggestion {
        private double priorityScore;
        private String suggestedAction; // "APPROVE", "REVIEW", "REJECT"
        private Long confirmCount;
        private Long rejectCount;
        
        // Getters and Setters
        public double getPriorityScore() {
            return priorityScore;
        }
        
        public void setPriorityScore(double priorityScore) {
            this.priorityScore = priorityScore;
        }
        
        public String getSuggestedAction() {
            return suggestedAction;
        }
        
        public void setSuggestedAction(String suggestedAction) {
            this.suggestedAction = suggestedAction;
        }
        
        public Long getConfirmCount() {
            return confirmCount;
        }
        
        public void setConfirmCount(Long confirmCount) {
            this.confirmCount = confirmCount;
        }
        
        public Long getRejectCount() {
            return rejectCount;
        }
        
        public void setRejectCount(Long rejectCount) {
            this.rejectCount = rejectCount;
        }
    }
}

