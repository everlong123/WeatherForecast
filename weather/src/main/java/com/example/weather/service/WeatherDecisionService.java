package com.example.weather.service;

import com.example.weather.dto.WeatherDataDTO;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WeatherDecisionService {
    
    /**
     * Phân tích thời tiết và đưa ra gợi ý hành động
     * @param weatherData Dữ liệu thời tiết hiện tại
     * @return Map chứa suggestedAction và suggestedIncidentType (nếu có)
     */
    public Map<String, Object> analyzeWeatherAndSuggestAction(WeatherDataDTO weatherData) {
        Map<String, Object> result = new HashMap<>();
        
        if (weatherData == null) {
            return result;
        }
        
        Double temperature = weatherData.getTemperature();
        Double rainVolume = weatherData.getRainVolume();
        Double windSpeed = weatherData.getWindSpeed();
        String mainWeather = weatherData.getMainWeather();
        Double humidity = weatherData.getHumidity();
        
        // Rule 1: Mưa lớn (> 10mm) → Gợi ý báo cáo ngập lụt
        if (rainVolume != null && rainVolume > 10.0) {
            result.put("suggestedAction", "Có mưa lớn đang xảy ra. Bạn có gặp tình trạng ngập lụt không?");
            result.put("suggestedIncidentType", "Lũ lụt");
            result.put("priority", "HIGH");
            return result;
        }
        
        // Rule 2: Gió mạnh (> 15 m/s) → Gợi ý báo cáo bão/lốc xoáy
        if (windSpeed != null && windSpeed > 15.0) {
            result.put("suggestedAction", "Gió rất mạnh đang thổi. Bạn có thấy dấu hiệu bão hoặc lốc xoáy không?");
            result.put("suggestedIncidentType", "Bão");
            result.put("priority", "HIGH");
            return result;
        }
        
        // Rule 3: Nhiệt độ cực cao (> 38°C) → Gợi ý báo cáo nhiệt độ cực đoan
        if (temperature != null && temperature > 38.0) {
            result.put("suggestedAction", "Nhiệt độ rất cao. Bạn có gặp vấn đề sức khỏe hoặc thiết bị quá nóng không?");
            result.put("suggestedIncidentType", "Nhiệt độ cực đoan");
            result.put("priority", "MEDIUM");
            return result;
        }
        
        // Rule 4: Nhiệt độ cực thấp (< 5°C) → Gợi ý báo cáo lạnh giá
        if (temperature != null && temperature < 5.0) {
            result.put("suggestedAction", "Nhiệt độ rất thấp. Bạn có gặp vấn đề về sương giá hoặc đóng băng không?");
            result.put("suggestedIncidentType", "Nhiệt độ cực đoan");
            result.put("priority", "MEDIUM");
            return result;
        }
        
        // Rule 5: Mưa vừa (5-10mm) → Gợi ý báo cáo mưa
        if (rainVolume != null && rainVolume >= 5.0 && rainVolume <= 10.0) {
            result.put("suggestedAction", "Có mưa đang xảy ra. Bạn có gặp vấn đề gì liên quan đến mưa không?");
            result.put("suggestedIncidentType", "Mưa");
            result.put("priority", "LOW");
            return result;
        }
        
        // Rule 6: Độ ẩm rất cao (> 90%) + Mưa nhẹ → Gợi ý báo cáo sương mù
        if (humidity != null && humidity > 90.0 && rainVolume != null && rainVolume > 0 && rainVolume < 5.0) {
            result.put("suggestedAction", "Độ ẩm rất cao và có mưa nhẹ. Bạn có thấy sương mù hoặc tầm nhìn kém không?");
            result.put("suggestedIncidentType", "Sương mù");
            result.put("priority", "LOW");
            return result;
        }
        
        // Rule 7: Gió mạnh vừa (10-15 m/s) → Gợi ý báo cáo gió mạnh
        if (windSpeed != null && windSpeed >= 10.0 && windSpeed <= 15.0) {
            result.put("suggestedAction", "Gió khá mạnh. Bạn có thấy cây cối bị đổ hoặc vật dụng bay không?");
            result.put("suggestedIncidentType", "Gió mạnh");
            result.put("priority", "MEDIUM");
            return result;
        }
        
        // Rule 8: Thời tiết có sét (thunderstorm)
        if (mainWeather != null && (mainWeather.toLowerCase().contains("thunder") || 
            mainWeather.toLowerCase().contains("storm"))) {
            result.put("suggestedAction", "Có dông sét. Bạn có thấy sét đánh hoặc nghe tiếng sấm không?");
            result.put("suggestedIncidentType", "Sét");
            result.put("priority", "HIGH");
            return result;
        }
        
        // Không có gợi ý
        return result;
    }
}

