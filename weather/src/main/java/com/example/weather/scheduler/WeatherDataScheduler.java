package com.example.weather.scheduler;

import com.example.weather.service.OpenWeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Scheduled Task để tự động lấy dữ liệu thời tiết từ API
 * Lưu vào database theo lịch trình
 */
@Component
public class WeatherDataScheduler {
    
    @Autowired(required = false)
    private OpenWeatherService openWeatherService;
    
    // Danh sách các thành phố lớn cần theo dõi
    private static final List<CityLocation> CITIES = Arrays.asList(
        new CityLocation(21.0285, 105.8542, "Hà Nội", "Hoàn Kiếm", "Tràng Tiền"),
        new CityLocation(10.8231, 106.6297, "Hồ Chí Minh", "Quận 1", "Bến Nghé"),
        new CityLocation(16.0544, 108.2022, "Đà Nẵng", "Hải Châu", "Hải Châu"),
        new CityLocation(20.8449, 106.6881, "Hải Phòng", "Hồng Bàng", "Máy Chai"),
        new CityLocation(10.3460, 107.0843, "Vũng Tàu", "Thành phố Vũng Tàu", "Thắng Tam")
    );
    
    /**
     * Tự động lấy dữ liệu thời tiết mỗi 30 phút
     */
    @Scheduled(cron = "0 */30 * * * *")
    public void fetchWeatherDataScheduled() {
        if (openWeatherService == null || !openWeatherService.isAvailable()) {
            System.out.println("OpenWeatherService không khả dụng, bỏ qua scheduled task");
            return;
        }
        
        System.out.println("Bắt đầu lấy dữ liệu thời tiết tự động...");
        
        for (CityLocation city : CITIES) {
            try {
                openWeatherService.getCurrentWeather(
                    city.lat, city.lng, 
                    city.city, city.district, city.ward
                );
                System.out.println("Đã lấy dữ liệu thời tiết cho: " + city.city);
            } catch (Exception e) {
                System.err.println("Lỗi khi lấy dữ liệu cho " + city.city + ": " + e.getMessage());
            }
        }
        
        System.out.println("Hoàn thành lấy dữ liệu thời tiết tự động");
    }
    
    /**
     * Tự động lấy dữ liệu thời tiết mỗi giờ (nếu muốn tần suất ít hơn)
     */
    // @Scheduled(cron = "0 0 * * * *") // Mỗi giờ
    public void fetchWeatherDataHourly() {
        // Tương tự như trên
    }
    
    private static class CityLocation {
        double lat, lng;
        String city, district, ward;
        CityLocation(double lat, double lng, String city, String district, String ward) {
            this.lat = lat;
            this.lng = lng;
            this.city = city;
            this.district = district;
            this.ward = ward;
        }
    }
}

