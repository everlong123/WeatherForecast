package com.example.weather.service;

import com.example.weather.entity.ReportVote;
import com.example.weather.entity.User;
import com.example.weather.entity.WeatherReport;
import com.example.weather.repository.ReportVoteRepository;
import com.example.weather.repository.UserRepository;
import com.example.weather.repository.WeatherReportRepository;
import com.example.weather.util.DistanceCalculator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportVoteService {
    @Autowired
    private ReportVoteRepository voteRepository;
    
    @Autowired
    private WeatherReportRepository reportRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Bán kính tối đa để vote (km) - mặc định 10km
    @Value("${vote.max-distance-km:10}")
    private double maxVoteDistanceKm;
    
    @Transactional
    public void voteReport(Long reportId, String username, ReportVote.VoteType voteType, 
                          Double userLatitude, Double userLongitude) {
        WeatherReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found"));
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Không cho phép owner vote báo cáo của chính mình
        if (report.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You cannot vote on your own report");
        }
        
        // Kiểm tra khoảng cách: chỉ cho phép vote nếu báo cáo trong bán kính cho phép
        if (userLatitude != null && userLongitude != null && 
            report.getLatitude() != null && report.getLongitude() != null) {
            double distance = DistanceCalculator.calculateDistance(
                userLatitude, userLongitude,
                report.getLatitude(), report.getLongitude()
            );
            
            if (distance > maxVoteDistanceKm) {
                throw new RuntimeException(
                    String.format("Báo cáo này quá xa vị trí của bạn (%.1f km). Bạn chỉ có thể vote các báo cáo trong bán kính %.0f km.", 
                        distance, maxVoteDistanceKm)
                );
            }
        } else {
            // Nếu không có tọa độ, không cho phép vote (yêu cầu vị trí)
            throw new RuntimeException("Vui lòng cung cấp vị trí của bạn để vote báo cáo này");
        }
        
        // Tìm vote hiện tại (nếu có)
        ReportVote existingVote = voteRepository.findByReportAndUser(report, user).orElse(null);
        
        if (existingVote != null) {
            // Nếu vote cùng loại, xóa vote (toggle off)
            if (existingVote.getVoteType() == voteType) {
                voteRepository.delete(existingVote);
            } else {
                // Nếu vote khác loại, cập nhật
                existingVote.setVoteType(voteType);
                voteRepository.save(existingVote);
            }
        } else {
            // Tạo vote mới
            ReportVote vote = new ReportVote();
            vote.setReport(report);
            vote.setUser(user);
            vote.setVoteType(voteType);
            voteRepository.save(vote);
        }
    }
    
    public Long getConfirmCount(WeatherReport report) {
        return voteRepository.countConfirmsByReport(report);
    }
    
    public Long getRejectCount(WeatherReport report) {
        return voteRepository.countRejectsByReport(report);
    }
    
    public ReportVote.VoteType getUserVote(WeatherReport report, String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) return null;
        
        return voteRepository.findByReportAndUser(report, user)
                .map(ReportVote::getVoteType)
                .orElse(null);
    }
}

