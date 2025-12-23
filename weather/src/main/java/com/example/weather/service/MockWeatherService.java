package com.example.weather.service;

import com.example.weather.dto.WeatherDataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

/**
 * Service để tạo dữ liệu thời tiết giả (mock data)
 * Thay thế cho việc gọi API bên ngoài
 */
@Service
public class MockWeatherService {
    
    @Autowired
    private WeatherDataService weatherDataService;
    
    private final Random random = new Random();
    
    // Dữ liệu thời tiết mẫu theo mùa ở Việt Nam
    private static class WeatherTemplate {
        double minTemp, maxTemp;
        double minHumidity, maxHumidity;
        double minWindSpeed, maxWindSpeed;
        String[] weatherTypes;
        String[] descriptions;
        
        WeatherTemplate(double minTemp, double maxTemp, double minHumidity, double maxHumidity,
                       double minWindSpeed, double maxWindSpeed, String[] weatherTypes, String[] descriptions) {
            this.minTemp = minTemp;
            this.maxTemp = maxTemp;
            this.minHumidity = minHumidity;
            this.maxHumidity = maxHumidity;
            this.minWindSpeed = minWindSpeed;
            this.maxWindSpeed = maxWindSpeed;
            this.weatherTypes = weatherTypes;
            this.descriptions = descriptions;
        }
    }
    
    // Template theo mùa (mùa khô: tháng 11-4, mùa mưa: tháng 5-10)
    private WeatherTemplate getWeatherTemplate(int month) {
        if (month >= 5 && month <= 10) {
            // Mùa mưa
            return new WeatherTemplate(
                25.0, 32.0,  // Nhiệt độ
                70.0, 95.0,  // Độ ẩm
                2.0, 8.0,    // Gió
                new String[]{"Rain", "Clouds", "Drizzle"},
                new String[]{"Mưa rào", "Có mây", "Mưa phùn", "Mưa dông"}
            );
        } else {
            // Mùa khô
            return new WeatherTemplate(
                20.0, 35.0,  // Nhiệt độ
                50.0, 80.0,  // Độ ẩm
                1.0, 5.0,    // Gió
                new String[]{"Clear", "Clouds", "Sunny"},
                new String[]{"Trời quang", "Có mây", "Nắng", "Nắng nóng"}
            );
        }
    }
    
    /**
     * Tạo dữ liệu thời tiết giả cho một vị trí
     */
    public WeatherDataDTO generateWeatherData(Double lat, Double lng, String city, 
                                              String district, String ward) {
        WeatherDataDTO dto = new WeatherDataDTO();
        dto.setLatitude(lat);
        dto.setLongitude(lng);
        dto.setCity(city != null ? city : getCityName(lat, lng));
        dto.setDistrict(district);
        dto.setWard(ward);
        
        int month = LocalDateTime.now().getMonthValue();
        WeatherTemplate template = getWeatherTemplate(month);
        
        // Tạo nhiệt độ với biến thiên nhẹ
        double temperature = template.minTemp + (template.maxTemp - template.minTemp) * random.nextDouble();
        temperature = Math.round(temperature * 10.0) / 10.0;
        dto.setTemperature(temperature);
        
        // Cảm giác như (thường thấp hơn hoặc cao hơn 1-3 độ)
        double feelsLike = temperature + (random.nextDouble() * 3 - 1.5);
        feelsLike = Math.round(feelsLike * 10.0) / 10.0;
        dto.setFeelsLike(feelsLike);
        
        // Độ ẩm
        double humidity = template.minHumidity + (template.maxHumidity - template.minHumidity) * random.nextDouble();
        humidity = Math.round(humidity);
        dto.setHumidity(humidity);
        
        // Áp suất (1013-1020 hPa cho Việt Nam)
        double pressure = 1013 + random.nextDouble() * 7;
        pressure = Math.round(pressure * 10.0) / 10.0;
        dto.setPressure(pressure);
        
        // Tốc độ gió
        double windSpeed = template.minWindSpeed + (template.maxWindSpeed - template.minWindSpeed) * random.nextDouble();
        windSpeed = Math.round(windSpeed * 10.0) / 10.0;
        dto.setWindSpeed(windSpeed);
        
        // Hướng gió (0-360 độ)
        double windDirection = random.nextDouble() * 360;
        dto.setWindDirection((double) Math.round(windDirection));
        
        // Tầm nhìn (5-15 km)
        double visibility = 5 + random.nextDouble() * 10;
        visibility = Math.round(visibility * 10.0) / 10.0;
        dto.setVisibility(visibility);
        
        // Mây (0-100%)
        double cloudiness = random.nextDouble() * 100;
        dto.setCloudiness((double) Math.round(cloudiness));
        
        // Mưa (0-20mm nếu là mùa mưa)
        double rainVolume = 0;
        if (month >= 5 && month <= 10) {
            rainVolume = random.nextDouble() * 20;
        }
        dto.setRainVolume(Math.round(rainVolume * 10.0) / 10.0);
        
        // Loại thời tiết và mô tả
        String weatherType = template.weatherTypes[random.nextInt(template.weatherTypes.length)];
        String description = template.descriptions[random.nextInt(template.descriptions.length)];
        dto.setMainWeather(weatherType);
        dto.setDescription(description);
        
        // Icon (đơn giản, có thể mở rộng sau)
        dto.setIcon(getWeatherIcon(weatherType));
        
        dto.setRecordedAt(LocalDateTime.now());
        
        // Lưu vào database
        return weatherDataService.saveWeatherData(dto);
    }
    
    /**
     * Lấy tên thành phố dựa trên tọa độ (xấp xỉ)
     */
    private String getCityName(Double lat, Double lng) {
        // Hà Nội
        if (lat >= 20.5 && lat <= 21.5 && lng >= 105.5 && lng <= 106.0) {
            return "Hà Nội";
        }
        // Hồ Chí Minh
        if (lat >= 10.5 && lat <= 11.0 && lng >= 106.5 && lng <= 106.8) {
            return "Hồ Chí Minh";
        }
        // Đà Nẵng
        if (lat >= 15.8 && lat <= 16.2 && lng >= 108.0 && lng <= 108.4) {
            return "Đà Nẵng";
        }
        // Hải Phòng
        if (lat >= 20.5 && lat <= 21.0 && lng >= 106.5 && lng <= 107.0) {
            return "Hải Phòng";
        }
        // Vũng Tàu
        if (lat >= 10.2 && lat <= 10.5 && lng >= 107.0 && lng <= 107.3) {
            return "Vũng Tàu";
        }
        return "Việt Nam";
    }
    
    /**
     * Lấy icon dựa trên loại thời tiết
     */
    private String getWeatherIcon(String weatherType) {
        switch (weatherType.toLowerCase()) {
            case "rain":
            case "drizzle":
                return "🌧️";
            case "clear":
            case "sunny":
                return "☀️";
            case "clouds":
                return "☁️";
            default:
                return "🌤️";
        }
    }
    
    /**
     * Tạo nhiều bản ghi lịch sử thời tiết với các thời điểm khác nhau
     * @param lat Latitude
     * @param lng Longitude
     * @param city Tên thành phố
     * @param district Tên quận/huyện
     * @param ward Tên phường/xã
     * @param days Số ngày trong quá khứ để tạo dữ liệu
     * @param recordsPerDay Số bản ghi mỗi ngày (ví dụ: 24 = mỗi giờ)
     * @return Số lượng bản ghi đã tạo
     */
    public int generateHistoryData(Double lat, Double lng, String city, String district, String ward, 
                                   int days, int recordsPerDay) {
        LocalDateTime now = LocalDateTime.now();
        int totalRecords = 0;
        
        for (int day = days; day >= 1; day--) {
            LocalDateTime baseTime = now.minusDays(day);
            
            for (int record = 0; record < recordsPerDay; record++) {
                // Tính thời gian cho bản ghi này (phân bố đều trong ngày)
                int hoursOffset = (24 / recordsPerDay) * record;
                LocalDateTime recordTime = baseTime.plusHours(hoursOffset);
                
                // Tạo dữ liệu thời tiết với thời điểm cụ thể
                WeatherDataDTO dto = generateWeatherDataForTime(lat, lng, city, district, ward, recordTime);
                weatherDataService.saveWeatherData(dto);
                totalRecords++;
            }
        }
        
        return totalRecords;
    }
    
    /**
     * Tạo dữ liệu thời tiết cho một thời điểm cụ thể
     */
    private WeatherDataDTO generateWeatherDataForTime(Double lat, Double lng, String city, 
                                                      String district, String ward, LocalDateTime time) {
        WeatherDataDTO dto = new WeatherDataDTO();
        dto.setLatitude(lat);
        dto.setLongitude(lng);
        dto.setCity(city != null ? city : getCityName(lat, lng));
        dto.setDistrict(district);
        dto.setWard(ward);
        
        int month = time.getMonthValue();
        WeatherTemplate template = getWeatherTemplate(month);
        
        // Tạo nhiệt độ với biến thiên theo giờ trong ngày (nóng nhất vào giữa trưa)
        int hour = time.getHour();
        double hourFactor = Math.sin((hour - 6) * Math.PI / 12); // Peak at 12:00
        hourFactor = Math.max(0, hourFactor); // Không âm
        double temperature = template.minTemp + (template.maxTemp - template.minTemp) * hourFactor;
        temperature += (random.nextDouble() - 0.5) * 3; // Thêm biến thiên ngẫu nhiên
        temperature = Math.max(template.minTemp, Math.min(template.maxTemp, temperature));
        temperature = Math.round(temperature * 10.0) / 10.0;
        dto.setTemperature(temperature);
        
        // Cảm giác như
        double feelsLike = temperature + (random.nextDouble() * 3 - 1.5);
        feelsLike = Math.round(feelsLike * 10.0) / 10.0;
        dto.setFeelsLike(feelsLike);
        
        // Độ ẩm (cao hơn vào ban đêm)
        double humidityBase = template.minHumidity + (template.maxHumidity - template.minHumidity) * random.nextDouble();
        if (hour >= 20 || hour <= 6) {
            humidityBase += 10; // Tăng độ ẩm ban đêm
        }
        humidityBase = Math.min(100, humidityBase);
        dto.setHumidity((double) Math.round(humidityBase));
        
        // Áp suất
        double pressure = 1013 + random.nextDouble() * 7;
        pressure = Math.round(pressure * 10.0) / 10.0;
        dto.setPressure(pressure);
        
        // Tốc độ gió
        double windSpeed = template.minWindSpeed + (template.maxWindSpeed - template.minWindSpeed) * random.nextDouble();
        windSpeed = Math.round(windSpeed * 10.0) / 10.0;
        dto.setWindSpeed(windSpeed);
        
        // Hướng gió
        double windDirection = random.nextDouble() * 360;
        dto.setWindDirection((double) Math.round(windDirection));
        
        // Tầm nhìn
        double visibility = 5 + random.nextDouble() * 10;
        visibility = Math.round(visibility * 10.0) / 10.0;
        dto.setVisibility(visibility);
        
        // Mây
        double cloudiness = random.nextDouble() * 100;
        dto.setCloudiness((double) Math.round(cloudiness));
        
        // Mưa (nhiều hơn vào buổi chiều trong mùa mưa)
        double rainVolume = 0;
        if (month >= 5 && month <= 10) {
            if (hour >= 14 && hour <= 18) {
                rainVolume = random.nextDouble() * 20; // Mưa nhiều vào chiều
            } else {
                rainVolume = random.nextDouble() * 5; // Ít mưa vào các giờ khác
            }
        }
        dto.setRainVolume(Math.round(rainVolume * 10.0) / 10.0);
        
        // Loại thời tiết
        String weatherType = template.weatherTypes[random.nextInt(template.weatherTypes.length)];
        String description = template.descriptions[random.nextInt(template.descriptions.length)];
        dto.setMainWeather(weatherType);
        dto.setDescription(description);
        dto.setIcon(getWeatherIcon(weatherType));
        
        dto.setRecordedAt(time);
        
        return dto;
    }
}

