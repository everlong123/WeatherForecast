package com.example.weather.config;

import com.example.weather.entity.IncidentType;
import com.example.weather.entity.User;
import com.example.weather.repository.IncidentTypeRepository;
import com.example.weather.repository.UserRepository;
import com.example.weather.service.MockWeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private IncidentTypeRepository incidentTypeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MockWeatherService mockWeatherService;

    @Override
    public void run(String... args) {
        // Đợi Hibernate tạo xong các bảng với retry logic
        waitForTables();
        
        // Chỉ seed dữ liệu nếu database trống
        try {
            if (incidentTypeRepository.count() == 0) {
            List<IncidentType> defaultTypes = Arrays.asList(
                // Mưa và Lũ lụt
                createIncidentType("Mưa lớn", "Mưa với cường độ cao, lượng mưa trên 50mm/giờ", "🌧️", "#4A90E2"),
                createIncidentType("Mưa dông", "Mưa kèm theo sấm sét và gió mạnh", "⛈️", "#2C3E50"),
                createIncidentType("Lũ lụt", "Nước dâng cao gây ngập lụt đường phố, nhà cửa", "🌊", "#3498DB"),
                createIncidentType("Ngập úng", "Nước đọng không thoát được gây ngập cục bộ", "💧", "#5DADE2"),
                createIncidentType("Sạt lở đất", "Đất đá sạt lở do mưa lớn kéo dài", "⛰️", "#8B4513"),
                
                // Gió và Bão
                createIncidentType("Gió mạnh", "Gió tốc độ trên 40km/h", "💨", "#AED6F1"),
                createIncidentType("Gió giật", "Gió giật mạnh đột ngột, có thể gây nguy hiểm", "🌪️", "#85C1E2"),
                createIncidentType("Bão", "Bão nhiệt đới với gió mạnh và mưa lớn", "🌀", "#1B4F72"),
                createIncidentType("Áp thấp nhiệt đới", "Hệ thống thời tiết xấu với mưa và gió mạnh", "🌬️", "#2874A6"),
                createIncidentType("Lốc xoáy", "Xoáy gió mạnh, có thể gây thiệt hại nghiêm trọng", "🌪️", "#1A5276"),
                
                // Nắng nóng
                createIncidentType("Nắng nóng cực đoan", "Nhiệt độ trên 40°C, có thể gây say nắng", "☀️", "#E74C3C"),
                createIncidentType("Hạn hán", "Thiếu mưa kéo dài, ảnh hưởng đến nguồn nước", "🏜️", "#DC7633"),
                createIncidentType("Cháy rừng", "Cháy rừng do thời tiết khô hanh", "🔥", "#C0392B"),
                createIncidentType("Khô hạn", "Độ ẩm thấp, thiếu nước tưới tiêu", "🌵", "#D35400"),
                
                // Sương mù và Tầm nhìn
                createIncidentType("Sương mù dày đặc", "Sương mù làm giảm tầm nhìn dưới 100m", "🌫️", "#BDC3C7"),
                createIncidentType("Mưa phùn kéo dài", "Mưa phùn gây ẩm ướt và tầm nhìn kém", "🌦️", "#95A5A6"),
                createIncidentType("Bụi mù", "Bụi bẩn trong không khí làm giảm tầm nhìn", "💨", "#7F8C8D"),
                
                // Các sự cố khác
                createIncidentType("Sấm sét", "Sấm sét nguy hiểm, có thể gây cháy nổ", "⚡", "#F39C12"),
                createIncidentType("Mưa đá", "Mưa đá có thể gây thiệt hại về tài sản", "🧊", "#ECF0F1"),
                createIncidentType("Tuyết rơi", "Tuyết rơi (hiếm ở Việt Nam, chủ yếu vùng núi cao)", "❄️", "#FFFFFF"),
                createIncidentType("Rét đậm rét hại", "Nhiệt độ xuống thấp dưới 10°C", "🧣", "#3498DB"),
                createIncidentType("Đường sá hư hỏng", "Đường phố hư hỏng do thời tiết", "🛣️", "#7F8C8D"),
                createIncidentType("Cây đổ", "Cây cối bị đổ do gió mạnh hoặc mưa lớn", "🌳", "#27AE60"),
                createIncidentType("Điện bị cắt", "Mất điện do thời tiết xấu", "⚡", "#F1C40F"),
                createIncidentType("Nước sinh hoạt thiếu", "Thiếu nước do hạn hán hoặc lũ lụt", "🚰", "#3498DB")
            );
            
                incidentTypeRepository.saveAll(defaultTypes);
                System.out.println("Đã khởi tạo " + defaultTypes.size() + " loại sự cố mặc định vào database");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi kiểm tra/khởi tạo incident types: " + e.getMessage());
            // Nếu bảng chưa tồn tại, bỏ qua và chờ lần chạy sau
            return;
        }

        // Tạo admin user nếu chưa có
        try {
            if (!userRepository.findByUsername("admin").isPresent()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@weather.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFullName("Administrator");
            admin.setRole(User.Role.ADMIN);
                admin.setEnabled(true);
                userRepository.save(admin);
                System.out.println("Đã tạo admin user: username=admin, password=admin123");
            }
        } catch (Exception e) {
            System.err.println("Lỗi khi tạo admin user: " + e.getMessage());
            return;
        }

        // Seed dữ liệu thời tiết mẫu cho các thành phố lớn
        seedWeatherData();
    }

    private void seedWeatherData() {
        // Các thành phố lớn ở Việt Nam
        List<CityLocation> cities = Arrays.asList(
            new CityLocation(21.0285, 105.8542, "Hà Nội", "Hoàn Kiếm", "Tràng Tiền"),
            new CityLocation(10.8231, 106.6297, "Hồ Chí Minh", "Quận 1", "Bến Nghé"),
            new CityLocation(16.0544, 108.2022, "Đà Nẵng", "Hải Châu", "Hải Châu"),
            new CityLocation(20.8449, 106.6881, "Hải Phòng", "Hồng Bàng", "Máy Chai"),
            new CityLocation(10.3460, 107.0843, "Vũng Tàu", "Thành phố Vũng Tàu", "Thắng Tam")
        );

        try {
            for (CityLocation city : cities) {
                mockWeatherService.generateWeatherData(
                    city.lat, city.lng, city.city, city.district, city.ward
                );
            }
            System.out.println("Đã tạo dữ liệu thời tiết mẫu cho " + cities.size() + " thành phố");
        } catch (Exception e) {
            System.err.println("Lỗi khi tạo dữ liệu thời tiết: " + e.getMessage());
        }
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

    private IncidentType createIncidentType(String name, String description, String icon, String color) {
        IncidentType type = new IncidentType();
        type.setName(name);
        type.setDescription(description);
        type.setIcon(icon);
        type.setColor(color);
        return type;
    }
    
    /**
     * Đợi Hibernate tạo xong các bảng với retry logic
     */
    private void waitForTables() {
        int maxRetries = 30; // Tăng lên 30 lần
        int retryDelay = 2000; // Tăng lên 2 giây
        
        System.out.println("Waiting for Hibernate to create database tables...");
        
        for (int i = 0; i < maxRetries; i++) {
            try {
                // Thử query bảng users để kiểm tra xem đã tồn tại chưa
                userRepository.count();
                // Kiểm tra thêm bảng incident_types
                incidentTypeRepository.count();
                // Nếu không có exception, bảng đã tồn tại
                System.out.println("✓ Database tables are ready");
                return;
            } catch (Exception e) {
                if (i < maxRetries - 1) {
                    System.out.println("Waiting for database tables... (" + (i + 1) + "/" + maxRetries + ") - " + e.getMessage());
                    try {
                        Thread.sleep(retryDelay);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        return;
                    }
                } else {
                    System.err.println("✗ Failed to wait for database tables after " + maxRetries + " retries: " + e.getMessage());
                    System.err.println("Please ensure Hibernate has created all tables before DataInitializer runs.");
                }
            }
        }
    }
}
