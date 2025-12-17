package com.example.weather.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.InputStream;
import java.util.*;

/**
 * Utility class để generate tọa độ cho tất cả các địa điểm
 * Chạy một lần để tạo file location_coordinates.json đầy đủ
 */
public class CoordinateGenerator {
    
    // Tọa độ các tỉnh/thành phố (đã có)
    private static final Map<String, double[]> PROVINCE_COORDS = new HashMap<>();
    
    static {
        // Tất cả 63 tỉnh/thành phố
        PROVINCE_COORDS.put("Thành phố Hà Nội", new double[]{21.0285, 105.8542});
        PROVINCE_COORDS.put("Tỉnh Hà Giang", new double[]{22.8026, 104.9785});
        PROVINCE_COORDS.put("Tỉnh Cao Bằng", new double[]{22.6657, 106.2577});
        PROVINCE_COORDS.put("Tỉnh Bắc Kạn", new double[]{22.1470, 105.8348});
        PROVINCE_COORDS.put("Tỉnh Tuyên Quang", new double[]{21.8183, 105.2117});
        PROVINCE_COORDS.put("Tỉnh Lào Cai", new double[]{22.4866, 103.9750});
        PROVINCE_COORDS.put("Tỉnh Điện Biên", new double[]{21.3926, 103.0160});
        PROVINCE_COORDS.put("Tỉnh Lai Châu", new double[]{22.3867, 103.4567});
        PROVINCE_COORDS.put("Tỉnh Sơn La", new double[]{21.3257, 103.9160});
        PROVINCE_COORDS.put("Tỉnh Yên Bái", new double[]{21.7050, 104.8726});
        PROVINCE_COORDS.put("Tỉnh Hoà Bình", new double[]{20.8136, 105.3383});
        PROVINCE_COORDS.put("Tỉnh Thái Nguyên", new double[]{21.5942, 105.8432});
        PROVINCE_COORDS.put("Tỉnh Lạng Sơn", new double[]{21.8537, 106.7613});
        PROVINCE_COORDS.put("Tỉnh Quảng Ninh", new double[]{21.0064, 107.2925});
        PROVINCE_COORDS.put("Tỉnh Bắc Giang", new double[]{21.2731, 106.1946});
        PROVINCE_COORDS.put("Tỉnh Phú Thọ", new double[]{21.3087, 105.3131});
        PROVINCE_COORDS.put("Tỉnh Vĩnh Phúc", new double[]{21.3609, 105.5474});
        PROVINCE_COORDS.put("Tỉnh Bắc Ninh", new double[]{21.1861, 106.0763});
        PROVINCE_COORDS.put("Tỉnh Hải Dương", new double[]{20.9373, 106.3146});
        PROVINCE_COORDS.put("Tỉnh Hải Phòng", new double[]{20.8449, 106.6881});
        PROVINCE_COORDS.put("Tỉnh Hưng Yên", new double[]{20.6564, 106.0519});
        PROVINCE_COORDS.put("Tỉnh Thái Bình", new double[]{20.4463, 106.3366});
        PROVINCE_COORDS.put("Tỉnh Hà Nam", new double[]{20.5433, 105.9229});
        PROVINCE_COORDS.put("Tỉnh Nam Định", new double[]{20.4208, 106.1683});
        PROVINCE_COORDS.put("Tỉnh Ninh Bình", new double[]{20.2506, 105.9744});
        PROVINCE_COORDS.put("Tỉnh Thanh Hóa", new double[]{19.8067, 105.7852});
        PROVINCE_COORDS.put("Tỉnh Nghệ An", new double[]{18.6796, 105.6813});
        PROVINCE_COORDS.put("Tỉnh Hà Tĩnh", new double[]{18.3428, 105.9057});
        PROVINCE_COORDS.put("Tỉnh Quảng Bình", new double[]{17.4687, 106.6227});
        PROVINCE_COORDS.put("Tỉnh Quảng Trị", new double[]{16.7500, 107.2000});
        PROVINCE_COORDS.put("Tỉnh Thừa Thiên Huế", new double[]{16.4637, 107.5909});
        PROVINCE_COORDS.put("Tỉnh Đà Nẵng", new double[]{16.0544, 108.2022});
        PROVINCE_COORDS.put("Tỉnh Quảng Nam", new double[]{15.8801, 108.3380});
        PROVINCE_COORDS.put("Tỉnh Quảng Ngãi", new double[]{15.1167, 108.8000});
        PROVINCE_COORDS.put("Tỉnh Bình Định", new double[]{13.7750, 109.2233});
        PROVINCE_COORDS.put("Tỉnh Phú Yên", new double[]{13.0880, 109.3200});
        PROVINCE_COORDS.put("Tỉnh Khánh Hòa", new double[]{12.2388, 109.1967});
        PROVINCE_COORDS.put("Tỉnh Ninh Thuận", new double[]{11.5643, 108.9886});
        PROVINCE_COORDS.put("Tỉnh Bình Thuận", new double[]{10.9286, 108.0993});
        PROVINCE_COORDS.put("Tỉnh Kon Tum", new double[]{14.3545, 108.0076});
        PROVINCE_COORDS.put("Tỉnh Gia Lai", new double[]{13.9833, 108.0167});
        PROVINCE_COORDS.put("Tỉnh Đắk Lắk", new double[]{12.6675, 108.0377});
        PROVINCE_COORDS.put("Tỉnh Đắk Nông", new double[]{12.0047, 107.6877});
        PROVINCE_COORDS.put("Tỉnh Lâm Đồng", new double[]{11.9404, 108.4583});
        PROVINCE_COORDS.put("Tỉnh Bình Phước", new double[]{11.7510, 106.7234});
        PROVINCE_COORDS.put("Tỉnh Tây Ninh", new double[]{11.3130, 106.0987});
        PROVINCE_COORDS.put("Tỉnh Bình Dương", new double[]{11.3254, 106.4770});
        PROVINCE_COORDS.put("Tỉnh Đồng Nai", new double[]{10.9574, 106.8429});
        PROVINCE_COORDS.put("Tỉnh Bà Rịa - Vũng Tàu", new double[]{10.3460, 107.0843});
        PROVINCE_COORDS.put("Tỉnh Hồ Chí Minh", new double[]{10.8231, 106.6297});
        PROVINCE_COORDS.put("Tỉnh Long An", new double[]{10.6599, 106.2076});
        PROVINCE_COORDS.put("Tỉnh Tiền Giang", new double[]{10.3548, 106.3648});
        PROVINCE_COORDS.put("Tỉnh Bến Tre", new double[]{10.2405, 106.3753});
        PROVINCE_COORDS.put("Tỉnh Trà Vinh", new double[]{9.9346, 106.3457});
        PROVINCE_COORDS.put("Tỉnh Vĩnh Long", new double[]{10.2530, 105.9722});
        PROVINCE_COORDS.put("Tỉnh Đồng Tháp", new double[]{10.5177, 105.6323});
        PROVINCE_COORDS.put("Tỉnh An Giang", new double[]{10.5216, 105.1258});
        PROVINCE_COORDS.put("Tỉnh Kiên Giang", new double[]{9.9581, 105.1311});
        PROVINCE_COORDS.put("Thành phố Cần Thơ", new double[]{10.0452, 105.7469});
        PROVINCE_COORDS.put("Tỉnh Hậu Giang", new double[]{9.7840, 105.4710});
        PROVINCE_COORDS.put("Tỉnh Sóc Trăng", new double[]{9.6004, 105.9718});
        PROVINCE_COORDS.put("Tỉnh Bạc Liêu", new double[]{9.2942, 105.7271});
        PROVINCE_COORDS.put("Tỉnh Cà Mau", new double[]{9.1769, 105.1528});
    }
    
    /**
     * Generate tọa độ dựa trên hash của tên địa điểm
     * Đảm bảo tính nhất quán: cùng một tên sẽ cho cùng một tọa độ
     */
    private static double[] generateCoordinates(double[] baseCoords, String name, int level) {
        // Hash tên địa điểm
        int hash = name.hashCode();
        
        // Tạo offset dựa trên hash và level
        // Level 1: Province (offset = 0)
        // Level 2: District (offset nhỏ)
        // Level 3: Ward (offset rất nhỏ)
        double maxOffset = 0;
        if (level == 2) {
            maxOffset = 0.5; // District: ±0.5 độ (~55km)
        } else if (level == 3) {
            maxOffset = 0.1; // Ward: ±0.1 độ (~11km)
        }
        
        // Tạo offset từ hash
        double offsetLat = ((hash % 1000) / 1000.0 - 0.5) * maxOffset;
        double offsetLng = (((hash * 7) % 1000) / 1000.0 - 0.5) * maxOffset;
        
        return new double[]{
            baseCoords[0] + offsetLat,
            baseCoords[1] + offsetLng
        };
    }
    
    /**
     * Tìm province coordinates từ tên
     */
    private static double[] findProvinceCoords(String provinceName) {
        // Exact match
        if (PROVINCE_COORDS.containsKey(provinceName)) {
            return PROVINCE_COORDS.get(provinceName);
        }
        
        // Partial match
        String shortName = provinceName.replace("Tỉnh ", "").replace("Thành phố ", "");
        for (Map.Entry<String, double[]> entry : PROVINCE_COORDS.entrySet()) {
            String keyShort = entry.getKey().replace("Tỉnh ", "").replace("Thành phố ", "");
            if (keyShort.equals(shortName) || keyShort.contains(provinceName) || provinceName.contains(keyShort)) {
                return entry.getValue();
            }
        }
        
        // Default: trung tâm Việt Nam
        return new double[]{16.0583, 108.2772};
    }
    
    public static void main(String[] args) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            
            // Load provinces
            ClassPathResource provincesResource = new ClassPathResource("provinces.json");
            JsonNode provinces = mapper.readTree(provincesResource.getInputStream());
            
            // Load districts
            ClassPathResource districtsResource = new ClassPathResource("districts.json");
            JsonNode districts = mapper.readTree(districtsResource.getInputStream());
            
            // Load wards
            ClassPathResource wardsResource = new ClassPathResource("wards.json");
            JsonNode wards = mapper.readTree(wardsResource.getInputStream());
            
            // Build coordinate map
            Map<String, Object> result = new LinkedHashMap<>();
            Map<String, Object> provincesMap = new LinkedHashMap<>();
            Map<String, Object> districtsMap = new LinkedHashMap<>();
            Map<String, Object> wardsMap = new LinkedHashMap<>();
            
            // Process provinces
            System.out.println("Processing provinces...");
            for (JsonNode province : provinces) {
                String provinceName = province.get("name").asText();
                double[] coords = findProvinceCoords(provinceName);
                Map<String, Double> coordMap = new LinkedHashMap<>();
                coordMap.put("lat", coords[0]);
                coordMap.put("lng", coords[1]);
                provincesMap.put(provinceName, coordMap);
            }
            
            // Process districts
            System.out.println("Processing districts...");
            Map<String, List<JsonNode>> districtsByProvince = new HashMap<>();
            for (JsonNode district : districts) {
                String provinceCode = district.get("provinceCode").asText();
                districtsByProvince.computeIfAbsent(provinceCode, k -> new ArrayList<>()).add(district);
            }
            
            for (JsonNode province : provinces) {
                String provinceCode = province.get("code").asText();
                String provinceName = province.get("name").asText();
                double[] provinceCoords = findProvinceCoords(provinceName);
                
                List<JsonNode> provinceDistricts = districtsByProvince.getOrDefault(provinceCode, new ArrayList<>());
                Map<String, Object> provinceDistrictsMap = new LinkedHashMap<>();
                
                for (JsonNode district : provinceDistricts) {
                    String districtName = district.get("name").asText();
                    double[] districtCoords = generateCoordinates(provinceCoords, districtName, 2);
                    Map<String, Double> coordMap = new LinkedHashMap<>();
                    coordMap.put("lat", districtCoords[0]);
                    coordMap.put("lng", districtCoords[1]);
                    provinceDistrictsMap.put(districtName, coordMap);
                }
                
                if (!provinceDistrictsMap.isEmpty()) {
                    districtsMap.put(provinceName, provinceDistrictsMap);
                }
            }
            
            // Process wards
            System.out.println("Processing wards...");
            Map<String, List<JsonNode>> wardsByDistrict = new HashMap<>();
            for (JsonNode ward : wards) {
                String districtCode = ward.get("districtCode").asText();
                wardsByDistrict.computeIfAbsent(districtCode, k -> new ArrayList<>()).add(ward);
            }
            
            for (JsonNode district : districts) {
                String districtCode = district.get("code").asText();
                String districtName = district.get("name").asText();
                String provinceName = district.get("provinceName").asText();
                double[] provinceCoords = findProvinceCoords(provinceName);
                double[] districtCoords = generateCoordinates(provinceCoords, districtName, 2);
                
                List<JsonNode> districtWards = wardsByDistrict.getOrDefault(districtCode, new ArrayList<>());
                Map<String, Object> districtWardsMap = new LinkedHashMap<>();
                
                for (JsonNode ward : districtWards) {
                    String wardName = ward.get("name").asText();
                    double[] wardCoords = generateCoordinates(districtCoords, wardName, 3);
                    Map<String, Double> coordMap = new LinkedHashMap<>();
                    coordMap.put("lat", wardCoords[0]);
                    coordMap.put("lng", wardCoords[1]);
                    districtWardsMap.put(wardName, coordMap);
                }
                
                if (!districtWardsMap.isEmpty()) {
                    String key = provinceName + "|" + districtName;
                    wardsMap.put(key, districtWardsMap);
                }
            }
            
            // Build final result
            result.put("provinces", provincesMap);
            result.put("districts", districtsMap);
            result.put("wards", wardsMap);
            
            // Write to file
            File outputFile = new File("weather/src/main/resources/location_coordinates.json");
            outputFile.getParentFile().mkdirs();
            mapper.writerWithDefaultPrettyPrinter().writeValue(outputFile, result);
            
            System.out.println("Generated location_coordinates.json successfully!");
            System.out.println("Provinces: " + provincesMap.size());
            System.out.println("Districts: " + districtsMap.size());
            System.out.println("Wards: " + wardsMap.size());
            
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

