package com.example.weather.util;

/**
 * Utility class để tính khoảng cách giữa 2 điểm trên Trái Đất
 * Sử dụng công thức Haversine
 */
public class DistanceCalculator {
    private static final double EARTH_RADIUS_KM = 6371.0; // Bán kính Trái Đất tính bằng km
    
    /**
     * Tính khoảng cách giữa 2 điểm (lat, lng) tính bằng km
     * @param lat1 Vĩ độ điểm 1
     * @param lng1 Kinh độ điểm 1
     * @param lat2 Vĩ độ điểm 2
     * @param lng2 Kinh độ điểm 2
     * @return Khoảng cách tính bằng km
     */
    public static double calculateDistance(double lat1, double lng1, double lat2, double lng2) {
        // Chuyển đổi độ sang radian
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double deltaLatRad = Math.toRadians(lat2 - lat1);
        double deltaLngRad = Math.toRadians(lng2 - lng1);
        
        // Công thức Haversine
        double a = Math.sin(deltaLatRad / 2) * Math.sin(deltaLatRad / 2) +
                   Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                   Math.sin(deltaLngRad / 2) * Math.sin(deltaLngRad / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return EARTH_RADIUS_KM * c;
    }
}

