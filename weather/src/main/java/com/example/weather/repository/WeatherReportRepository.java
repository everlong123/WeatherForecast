package com.example.weather.repository;

import com.example.weather.entity.WeatherReport;
import com.example.weather.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WeatherReportRepository extends JpaRepository<WeatherReport, Long> {
    List<WeatherReport> findByUser(User user);
    Page<WeatherReport> findByUser(User user, Pageable pageable);
    List<WeatherReport> findByStatus(WeatherReport.ReportStatus status);
    
    @Query("SELECT r FROM WeatherReport r WHERE r.district = :district")
    List<WeatherReport> findByDistrict(@Param("district") String district);
    
    @Query("SELECT r FROM WeatherReport r WHERE r.createdAt BETWEEN :start AND :end")
    List<WeatherReport> findByDateRange(@Param("start") LocalDateTime start, 
                                        @Param("end") LocalDateTime end);
    
    // Query để lấy reports không bị ẩn (hidden = false hoặc null)
    @Query("SELECT r FROM WeatherReport r WHERE r.hidden IS NULL OR r.hidden = false")
    Page<WeatherReport> findByHiddenNotTrueOrHiddenIsNull(Pageable pageable);
    
    // Query để lấy tất cả reports (admin)
    Page<WeatherReport> findAll(Pageable pageable);
}
