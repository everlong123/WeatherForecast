package com.example.weather.repository;

import com.example.weather.entity.WeatherReport;
import com.example.weather.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WeatherReportRepository extends JpaRepository<WeatherReport, Long> {
    List<WeatherReport> findByUser(User user);
    List<WeatherReport> findByStatus(WeatherReport.ReportStatus status);
    
    @Query("SELECT r FROM WeatherReport r WHERE r.district = :district")
    List<WeatherReport> findByDistrict(@Param("district") String district);
    
    @Query("SELECT r FROM WeatherReport r WHERE r.createdAt BETWEEN :start AND :end")
    List<WeatherReport> findByDateRange(@Param("start") LocalDateTime start, 
                                        @Param("end") LocalDateTime end);
}
