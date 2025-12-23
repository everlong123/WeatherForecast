package com.example.weather.repository;

import com.example.weather.entity.ReportVote;
import com.example.weather.entity.User;
import com.example.weather.entity.WeatherReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReportVoteRepository extends JpaRepository<ReportVote, Long> {
    Optional<ReportVote> findByReportAndUser(WeatherReport report, User user);
    
    @Query("SELECT COUNT(v) FROM ReportVote v WHERE v.report = :report AND v.voteType = 'CONFIRM'")
    Long countConfirmsByReport(@Param("report") WeatherReport report);
    
    @Query("SELECT COUNT(v) FROM ReportVote v WHERE v.report = :report AND v.voteType = 'REJECT'")
    Long countRejectsByReport(@Param("report") WeatherReport report);
    
    boolean existsByReportAndUser(WeatherReport report, User user);
}

