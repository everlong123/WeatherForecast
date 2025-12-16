package com.example.weather.config;

import com.example.weather.entity.IncidentType;
import com.example.weather.repository.IncidentTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private IncidentTypeRepository incidentTypeRepository;

    @Override
    public void run(String... args) {
        // Chỉ seed dữ liệu nếu database trống
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
    }

    private IncidentType createIncidentType(String name, String description, String icon, String color) {
        IncidentType type = new IncidentType();
        type.setName(name);
        type.setDescription(description);
        type.setIcon(icon);
        type.setColor(color);
        return type;
    }
}
