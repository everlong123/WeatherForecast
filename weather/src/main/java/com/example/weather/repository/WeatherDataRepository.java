package com.example.weather.repository;

import com.example.weather.entity.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeatherDataRepository extends JpaRepository<WeatherData, Long> {
    @Query("SELECT w FROM WeatherData w WHERE w.latitude = :lat AND w.longitude = :lng " +
           "ORDER BY w.recordedAt DESC")
    List<WeatherData> findByLocation(@Param("lat") Double lat, @Param("lng") Double lng);
    
    Optional<WeatherData> findFirstByLatitudeAndLongitudeOrderByRecordedAtDesc(
        Double latitude, Double longitude);
    
    @Query("SELECT w FROM WeatherData w WHERE w.district = :district " +
           "AND w.recordedAt BETWEEN :start AND :end ORDER BY w.recordedAt DESC")
    List<WeatherData> findByDistrictAndDateRange(@Param("district") String district,
                                                   @Param("start") LocalDateTime start,
                                                   @Param("end") LocalDateTime end);
}























