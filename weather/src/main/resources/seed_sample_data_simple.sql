-- Script thêm dữ liệu mẫu phong phú vào database
-- Chạy script này SAU KHI DataInitializer đã chạy (để có incident_types)
-- Password cho tất cả users: "password123"

USE weather_db;

-- 1. Thêm Users (bỏ qua nếu đã tồn tại)
INSERT IGNORE INTO users (username, email, password, role, full_name, phone, address, district, ward, latitude, longitude, enabled, trust_score, created_at, updated_at) VALUES
-- Admin user thứ 2
('admin2', 'admin2@weather.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', 'Nguyễn Văn Admin', '0901234568', '456 Đường Nguyễn Huệ', 'Quận 1', 'Bến Nghé', 10.8231, 106.6297, TRUE, 95, NOW(), NOW()),

-- Regular users - Miền Bắc
('nguyenvana', 'nguyenvana@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Nguyễn Văn A', '0912345678', '789 Đường Trần Hưng Đạo', 'Hoàn Kiếm', 'Hàng Bông', 21.0300, 105.8500, TRUE, 85, NOW(), NOW()),
('tranthib', 'tranthib@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Trần Thị B', '0923456789', '321 Đường Lý Thường Kiệt', 'Ba Đình', 'Điện Biên', 21.0350, 105.8400, TRUE, 72, NOW(), NOW()),
('vuongvanf', 'vuongvanf@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Vương Văn F', '0967890123', '258 Đường Nguyễn Trãi', 'Thanh Xuân', 'Khương Trung', 20.9950, 105.8000, TRUE, 55, NOW(), NOW()),
('dangthig', 'dangthig@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Đặng Thị G', '0978901234', '369 Đường Cầu Giấy', 'Cầu Giấy', 'Dịch Vọng', 21.0300, 105.7900, TRUE, 88, NOW(), NOW()),
('buitranh', 'buitranh@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Bùi Trần H', '0989012345', '741 Đường Láng', 'Đống Đa', 'Láng Thượng', 21.0200, 105.8100, TRUE, 70, NOW(), NOW()),
('ngothii', 'ngothii@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Ngô Thị I', '0990123456', '852 Đường Giải Phóng', 'Hai Bà Trưng', 'Bạch Mai', 21.0100, 105.8500, TRUE, 82, NOW(), NOW()),
('doanvanj', 'doanvanj@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Đoàn Văn J', '0901234569', '963 Đường Minh Khai', 'Bắc Từ Liêm', 'Minh Khai', 21.0500, 105.7500, TRUE, 60, NOW(), NOW()),
('phamvand', 'phamvand@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Phạm Văn D', '0945678901', '987 Đường Lạch Tray', 'Hồng Bàng', 'Máy Chai', 20.8449, 106.6881, TRUE, 65, NOW(), NOW()),
-- Users miền Bắc khác
('nguyenvank', 'nguyenvank@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Nguyễn Văn K', '0911123456', '123 Đường Bạch Đằng', 'Hạ Long', 'Hồng Gai', 20.9101, 107.1839, TRUE, 80, NOW(), NOW()),
('tranthil', 'tranthil@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Trần Thị L', '0912234567', '456 Đường Hoàng Văn Thụ', 'Thái Nguyên', 'Tân Thịnh', 21.5672, 105.8252, TRUE, 75, NOW(), NOW()),
('levanm', 'levanm@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Lê Văn M', '0913345678', '789 Đường Lào Cai', 'Lào Cai', 'Bắc Lệnh', 22.4908, 103.9720, TRUE, 68, NOW(), NOW()),
('hoangthio', 'hoangthio@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Hoàng Thị O', '0914456789', '321 Đường Điện Biên Phủ', 'Sơn La', 'Chiềng Lề', 21.3225, 103.9150, TRUE, 77, NOW(), NOW()),
('phamvanp', 'phamvanp@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Phạm Văn P', '0915567890', '654 Đường Yên Bái', 'Yên Bái', 'Yên Ninh', 21.7059, 104.8719, TRUE, 83, NOW(), NOW()),
-- Users miền Trung
('lethic', 'lethic@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Lê Thị C', '0934567890', '654 Đường Hoàng Diệu', 'Hải Châu', 'Hải Châu', 16.0544, 108.2022, TRUE, 90, NOW(), NOW()),
('nguyenthq', 'nguyenthq@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Nguyễn Thị Q', '0916678901', '987 Đường Lê Lợi', 'Huế', 'Phú Hội', 16.4637, 107.5909, TRUE, 79, NOW(), NOW()),
('tranvanr', 'tranvanr@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Trần Văn R', '0917789012', '147 Đường Trần Hưng Đạo', 'Quy Nhon', 'Ngô Mây', 13.7765, 109.2233, TRUE, 71, NOW(), NOW()),
('dangthis', 'dangthis@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Đặng Thị S', '0918890123', '258 Đường Phan Rang', 'Phan Rang', 'Phước Mỹ', 11.5643, 108.9886, TRUE, 86, NOW(), NOW()),
('buitthit', 'buitthit@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Bùi Thị T', '0919901234', '369 Đường Yersin', 'Đà Lạt', 'Phường 1', 11.9404, 108.4583, TRUE, 92, NOW(), NOW()),
('ngovantu', 'ngovantu@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Ngô Văn U', '0910012345', '741 Đường Y Wang', 'Buôn Ma Thuột', 'Tân An', 12.6662, 108.0500, TRUE, 74, NOW(), NOW()),
('doanthiv', 'doanthiv@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Đoàn Thị V', '0911123457', '852 Đường Trần Hưng Đạo', 'Kon Tum', 'Quyết Thắng', 14.3545, 108.0075, TRUE, 69, NOW(), NOW()),
('lethiw', 'lethiw@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Lê Thị W', '0912234568', '963 Đường Hùng Vương', 'Pleiku', 'Ia Kring', 13.9718, 108.0146, TRUE, 81, NOW(), NOW()),
-- Users miền Nam
('hoangthie', 'hoangthie@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Hoàng Thị E', '0956789012', '147 Đường Trần Phú', 'Thành phố Vũng Tàu', 'Thắng Tam', 10.3460, 107.0843, TRUE, 78, NOW(), NOW()),
('nguyenvanx', 'nguyenvanx@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Nguyễn Văn X', '0913345679', '159 Đường Nguyễn Trãi', 'Quận 1', 'Bến Nghé', 10.7769, 106.7009, TRUE, 87, NOW(), NOW()),
('tranthiy', 'tranthiy@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Trần Thị Y', '0914456780', '357 Đường Trần Hưng Đạo', 'Quận 5', 'Phường 4', 10.7540, 106.6677, TRUE, 76, NOW(), NOW()),
('phamvanz', 'phamvanz@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Phạm Văn Z', '0915567891', '468 Đường Hùng Vương', 'Ninh Kiều', 'Cái Khế', 10.0452, 105.7469, TRUE, 84, NOW(), NOW()),
('vuongthiaa', 'vuongthiaa@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Vương Thị AA', '0916678902', '579 Đường 30/4', 'Mỹ Tho', 'Phường 1', 10.3600, 106.3600, TRUE, 73, NOW(), NOW()),
('dangvanbb', 'dangvanbb@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Đặng Văn BB', '0917789013', '680 Đường Nguyễn Văn Cừ', 'Long Xuyên', 'Mỹ Bình', 10.3750, 105.4197, TRUE, 89, NOW(), NOW()),
('buithicc', 'buithicc@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Bùi Thị CC', '0918890124', '791 Đường Trần Hưng Đạo', 'Châu Đốc', 'Châu Phú A', 10.7020, 105.1170, TRUE, 66, NOW(), NOW()),
('ngovanee', 'ngovanee@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Ngô Văn EE', '0919901235', '802 Đường Phạm Ngũ Lão', 'Cà Mau', 'Phường 6', 9.1769, 105.1500, TRUE, 91, NOW(), NOW()),
('doanthiff', 'doanthiff@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Đoàn Thị FF', '0910012346', '913 Đường Nguyễn Trung Trực', 'Rạch Giá', 'Vĩnh Thanh Vân', 10.0125, 105.0809, TRUE, 67, NOW(), NOW()),
('levangg', 'levangg@gmail.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Lê Văn GG', '0911123458', '124 Đường Trần Hưng Đạo', 'Phú Quốc', 'Dương Đông', 10.2899, 103.9840, TRUE, 93, NOW(), NOW());

-- 2. Thêm Weather Data (bỏ qua nếu đã tồn tại - dựa vào location và time)
-- Miền Bắc
INSERT IGNORE INTO weather_data (latitude, longitude, city, district, ward, temperature, feels_like, humidity, pressure, wind_speed, wind_direction, visibility, cloudiness, rain_volume, snow_volume, main_weather, description, icon, recorded_at, created_at) VALUES
(21.0300, 105.8500, 'Hà Nội', 'Hoàn Kiếm', 'Hàng Bông', 30.2, 35.0, 68.0, 1012.50, 12.0, 200.0, 12.0, 20.0, 0.0, 0.0, 'Clear', 'Trời quang đãng', '01d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(21.0350, 105.8400, 'Hà Nội', 'Ba Đình', 'Điện Biên', 26.8, 30.5, 82.0, 1014.00, 18.0, 160.0, 8.0, 60.0, 5.2, 0.0, 'Rain', 'Mưa vừa', '10d', NOW(), NOW()),
(20.8500, 106.7000, 'Hải Phòng', 'Ngô Quyền', 'Máy Chai', 26.0, 29.5, 85.0, 1015.00, 25.0, 130.0, 7.0, 85.0, 15.0, 0.0, 'Rain', 'Mưa to', '10d', NOW(), NOW()),
(20.9101, 107.1839, 'Hạ Long', 'Hạ Long', 'Hồng Gai', 27.5, 32.0, 75.0, 1013.25, 15.0, 180.0, 10.0, 40.0, 3.0, 0.0, 'Clouds', 'Mây thưa', '02d', DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
(21.5672, 105.8252, 'Thái Nguyên', 'Thái Nguyên', 'Tân Thịnh', 29.0, 33.5, 70.0, 1012.00, 10.0, 190.0, 13.0, 25.0, 0.0, 0.0, 'Clear', 'Trời nắng', '01d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(22.4908, 103.9720, 'Lào Cai', 'Lào Cai', 'Bắc Lệnh', 24.5, 28.0, 80.0, 1014.50, 12.0, 160.0, 9.0, 55.0, 4.5, 0.0, 'Rain', 'Mưa nhỏ', '09d', NOW(), NOW()),
(21.3225, 103.9150, 'Sơn La', 'Sơn La', 'Chiềng Lề', 26.3, 30.0, 78.0, 1013.75, 11.0, 170.0, 11.0, 45.0, 2.0, 0.0, 'Clouds', 'Mây rải rác', '03d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(21.7059, 104.8719, 'Yên Bái', 'Yên Bái', 'Yên Ninh', 28.2, 32.8, 72.0, 1012.25, 9.0, 200.0, 14.0, 30.0, 0.0, 0.0, 'Clear', 'Trời quang', '01d', NOW(), NOW()),
-- Miền Trung
(16.0600, 108.2100, 'Đà Nẵng', 'Thanh Khê', 'Thanh Khê Tây', 28.0, 32.5, 78.0, 1013.50, 20.0, 170.0, 10.0, 50.0, 8.0, 0.0, 'Rain', 'Mưa lớn', '10d', NOW(), NOW()),
(16.4637, 107.5909, 'Huế', 'Huế', 'Phú Hội', 28.5, 33.0, 75.0, 1012.75, 12.0, 180.0, 11.0, 40.0, 3.5, 0.0, 'Rain', 'Mưa phùn', '09d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(13.7765, 109.2233, 'Quy Nhon', 'Quy Nhon', 'Ngô Mây', 32.0, 37.5, 68.0, 1010.50, 16.0, 220.0, 15.0, 20.0, 0.0, 0.0, 'Clear', 'Trời nắng', '01d', NOW(), NOW()),
(11.5643, 108.9886, 'Phan Rang', 'Phan Rang', 'Phước Mỹ', 33.5, 39.0, 62.0, 1009.75, 18.0, 200.0, 16.0, 15.0, 0.0, 0.0, 'Clear', 'Nắng nóng', '01d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(11.9404, 108.4583, 'Đà Lạt', 'Đà Lạt', 'Phường 1', 18.5, 20.0, 85.0, 1015.25, 8.0, 150.0, 8.0, 70.0, 0.0, 0.0, 'Clouds', 'Mây nhiều', '04d', NOW(), NOW()),
(12.2388, 109.1967, 'Nha Trang', 'Nha Trang', 'Vĩnh Hải', 31.0, 36.0, 70.0, 1010.50, 14.0, 210.0, 17.0, 20.0, 0.0, 0.0, 'Clear', 'Trời quang', '01d', NOW(), NOW()),
(12.6662, 108.0500, 'Buôn Ma Thuột', 'Buôn Ma Thuột', 'Tân An', 26.8, 31.0, 76.0, 1011.50, 12.0, 180.0, 12.0, 35.0, 1.5, 0.0, 'Clouds', 'Mây rải rác', '03d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(14.3545, 108.0075, 'Kon Tum', 'Kon Tum', 'Quyết Thắng', 25.5, 29.5, 79.0, 1012.75, 10.0, 170.0, 10.0, 50.0, 3.0, 0.0, 'Rain', 'Mưa phùn', '09d', NOW(), NOW()),
(13.9718, 108.0146, 'Pleiku', 'Pleiku', 'Ia Kring', 27.2, 31.5, 74.0, 1011.25, 13.0, 190.0, 11.0, 40.0, 2.0, 0.0, 'Clouds', 'Mây thưa', '02d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
-- Miền Nam
(10.8300, 106.6400, 'Hồ Chí Minh', 'Quận 3', 'Võ Thị Sáu', 31.8, 36.5, 72.0, 1011.00, 14.0, 200.0, 12.0, 45.0, 2.5, 0.0, 'Rain', 'Mưa nhỏ', '09d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(10.8100, 106.6200, 'Hồ Chí Minh', 'Quận 5', 'Phường 4', 33.0, 39.0, 65.0, 1009.75, 8.0, 180.0, 18.0, 15.0, 0.0, 0.0, 'Clear', 'Trời nắng', '01d', NOW(), NOW()),
(10.7769, 106.7009, 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé', 32.5, 38.0, 68.0, 1010.00, 12.0, 190.0, 15.0, 25.0, 0.0, 0.0, 'Clear', 'Nắng', '01d', DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
(10.0452, 105.7469, 'Cần Thơ', 'Ninh Kiều', 'Cái Khế', 31.2, 36.0, 73.0, 1010.75, 11.0, 200.0, 13.0, 30.0, 1.0, 0.0, 'Clouds', 'Mây rải rác', '03d', NOW(), NOW()),
(10.3600, 106.3600, 'Mỹ Tho', 'Mỹ Tho', 'Phường 1', 32.0, 37.5, 70.0, 1010.25, 13.0, 180.0, 14.0, 20.0, 0.0, 0.0, 'Clear', 'Trời nắng', '01d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(10.3750, 105.4197, 'Long Xuyên', 'Long Xuyên', 'Mỹ Bình', 31.5, 37.0, 71.0, 1010.50, 10.0, 190.0, 12.0, 28.0, 0.5, 0.0, 'Clouds', 'Mây thưa', '02d', NOW(), NOW()),
(10.7020, 105.1170, 'Châu Đốc', 'Châu Đốc', 'Châu Phú A', 32.8, 38.5, 69.0, 1009.50, 15.0, 210.0, 16.0, 22.0, 0.0, 0.0, 'Clear', 'Nắng nóng', '01d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(9.1769, 105.1500, 'Cà Mau', 'Cà Mau', 'Phường 6', 30.5, 35.5, 75.0, 1011.25, 14.0, 200.0, 11.0, 40.0, 2.0, 0.0, 'Rain', 'Mưa nhỏ', '09d', NOW(), NOW()),
(10.0125, 105.0809, 'Rạch Giá', 'Rạch Giá', 'Vĩnh Thanh Vân', 31.0, 36.2, 72.0, 1010.75, 12.0, 190.0, 13.0, 35.0, 1.5, 0.0, 'Clouds', 'Mây rải rác', '03d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(10.3460, 107.0843, 'Vũng Tàu', 'Thành phố Vũng Tàu', 'Thắng Tam', 29.5, 34.0, 70.0, 1012.00, 15.0, 200.0, 14.0, 30.0, 1.0, 0.0, 'Clouds', 'Mây rải rác', '03d', NOW(), NOW()),
(10.3500, 107.0900, 'Vũng Tàu', 'Thành phố Vũng Tàu', 'Rạch Dừa', 29.8, 34.5, 71.0, 1011.75, 16.0, 210.0, 15.0, 25.0, 0.0, 0.0, 'Clear', 'Trời đẹp', '01d', DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
(10.2899, 103.9840, 'Phú Quốc', 'Phú Quốc', 'Dương Đông', 30.2, 35.0, 74.0, 1011.50, 18.0, 220.0, 16.0, 20.0, 0.0, 0.0, 'Clear', 'Trời quang', '01d', NOW(), NOW());

-- 3. Thêm Weather Reports (chỉ thêm nếu có users và incident_types)
-- Lưu ý: Đảm bảo DataInitializer đã chạy để có incident_types

-- Report 1: Mưa lớn
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Mưa lớn tại khu vực Hoàn Kiếm', 
       'Mưa lớn kéo dài từ sáng đến trưa, lượng mưa khoảng 80mm. Nhiều tuyến đường bị ngập nước, giao thông bị ảnh hưởng nghiêm trọng.',
       'Hoàn Kiếm', 'Hàng Bông', 'Hà Nội', 21.0300, 105.8500, 'APPROVED', 'HIGH', FALSE,
       DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR)
FROM users u, incident_types it
WHERE u.username = 'nguyenvana' AND it.name = 'Mưa lớn'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Mưa lớn tại khu vực Hoàn Kiếm')
LIMIT 1;

-- Report 2: Lũ lụt
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Ngập lụt nghiêm trọng tại Ba Đình',
       'Nước dâng cao đến 50cm tại khu vực Điện Biên. Nhiều nhà dân bị ngập, cần hỗ trợ khẩn cấp.',
       'Ba Đình', 'Điện Biên', 'Hà Nội', 21.0350, 105.8400, 'APPROVED', 'CRITICAL', FALSE,
       DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)
FROM users u, incident_types it
WHERE u.username = 'tranthib' AND it.name = 'Lũ lụt'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Ngập lụt nghiêm trọng tại Ba Đình')
LIMIT 1;

-- Report 3: Gió mạnh
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Gió mạnh tại Đà Nẵng',
       'Gió mạnh với tốc độ 45km/h, nhiều cây cối bị đổ, biển động mạnh. Người dân nên tránh ra biển.',
       'Hải Châu', 'Hải Châu', 'Đà Nẵng', 16.0544, 108.2022, 'APPROVED', 'MEDIUM', FALSE,
       DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR)
FROM users u, incident_types it
WHERE u.username = 'lethic' AND it.name = 'Gió mạnh'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Gió mạnh tại Đà Nẵng')
LIMIT 1;

-- Report 4: Cây đổ
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Cây đổ chặn đường tại Hải Phòng',
       'Cây lớn bị đổ do gió mạnh, chặn đường Lạch Tray. Đội cứu hộ đang xử lý.',
       'Hồng Bàng', 'Máy Chai', 'Hải Phòng', 20.8449, 106.6881, 'APPROVED', 'MEDIUM', FALSE,
       DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)
FROM users u, incident_types it
WHERE u.username = 'phamvand' AND it.name = 'Cây đổ'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Cây đổ chặn đường tại Hải Phòng')
LIMIT 1;

-- Report 5: Nắng nóng
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Nắng nóng 40 độ tại Vũng Tàu',
       'Nhiệt độ lên đến 40°C, cảnh báo nguy cơ say nắng. Người dân nên hạn chế ra ngoài trời.',
       'Thành phố Vũng Tàu', 'Thắng Tam', 'Vũng Tàu', 10.3460, 107.0843, 'APPROVED', 'HIGH', FALSE,
       DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_SUB(NOW(), INTERVAL 7 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR)
FROM users u, incident_types it
WHERE u.username = 'hoangthie' AND it.name = 'Nắng nóng cực đoan'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Nắng nóng 40 độ tại Vũng Tàu')
LIMIT 1;

-- Report 6: Mưa dông (PENDING)
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Mưa dông kèm sấm sét tại Thanh Xuân',
       'Mưa dông lớn kèm theo sấm sét, gió giật mạnh. Cần cảnh báo người dân.',
       'Thanh Xuân', 'Khương Trung', 'Hà Nội', 20.9950, 105.8000, 'PENDING', 'MEDIUM', FALSE,
       DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 30 MINUTE), NOW()
FROM users u, incident_types it
WHERE u.username = 'vuongvanf' AND it.name = 'Mưa dông'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Mưa dông kèm sấm sét tại Thanh Xuân')
LIMIT 1;

-- Report 7: Ngập úng (PENDING)
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Ngập úng cục bộ tại Cầu Giấy',
       'Nước đọng không thoát được tại khu vực Dịch Vọng, gây cản trở giao thông.',
       'Cầu Giấy', 'Dịch Vọng', 'Hà Nội', 21.0300, 105.7900, 'PENDING', 'LOW', FALSE,
       DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()
FROM users u, incident_types it
WHERE u.username = 'dangthig' AND it.name = 'Ngập úng'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Ngập úng cục bộ tại Cầu Giấy')
LIMIT 1;

-- Report 8: Sương mù (PENDING)
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Sương mù dày đặc tại Đống Đa',
       'Sương mù làm giảm tầm nhìn xuống dưới 50m, nguy hiểm cho giao thông.',
       'Đống Đa', 'Láng Thượng', 'Hà Nội', 21.0200, 105.8100, 'PENDING', 'MEDIUM', FALSE,
       DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()
FROM users u, incident_types it
WHERE u.username = 'buitranh' AND it.name = 'Sương mù dày đặc'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Sương mù dày đặc tại Đống Đa')
LIMIT 1;

-- Report 9: Điện bị cắt (RESOLVED)
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Mất điện do mưa lớn tại Hai Bà Trưng',
       'Mất điện tại khu vực Bạch Mai do mưa lớn. Đã được khắc phục.',
       'Hai Bà Trưng', 'Bạch Mai', 'Hà Nội', 21.0100, 105.8500, 'RESOLVED', 'LOW', FALSE,
       DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_SUB(NOW(), INTERVAL 11 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)
FROM users u, incident_types it
WHERE u.username = 'ngothii' AND it.name = 'Điện bị cắt'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Mất điện do mưa lớn tại Hai Bà Trưng')
LIMIT 1;

-- Report 10: Đường sá hư hỏng (RESOLVED)
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Đường bị sụt lún tại Bắc Từ Liêm',
       'Đường Minh Khai bị sụt lún do mưa lớn. Đã được sửa chữa xong.',
       'Bắc Từ Liêm', 'Minh Khai', 'Hà Nội', 21.0500, 105.7500, 'RESOLVED', 'MEDIUM', FALSE,
       DATE_SUB(NOW(), INTERVAL 24 HOUR), DATE_SUB(NOW(), INTERVAL 23 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)
FROM users u, incident_types it
WHERE u.username = 'doanvanj' AND it.name = 'Đường sá hư hỏng'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Đường bị sụt lún tại Bắc Từ Liêm')
LIMIT 1;

-- Report 11: Bão
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Bão đổ bộ vào Hà Nội',
       'Bão với gió mạnh và mưa lớn, cảnh báo nguy hiểm.',
       'Hoàn Kiếm', 'Hàng Bông', 'Hà Nội', 21.0300, 105.8500, 'APPROVED', 'CRITICAL', FALSE,
       DATE_SUB(NOW(), INTERVAL 10 HOUR), DATE_SUB(NOW(), INTERVAL 9 HOUR), DATE_SUB(NOW(), INTERVAL 8 HOUR)
FROM users u, incident_types it
WHERE u.username = 'nguyenvana' AND it.name = 'Bão'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Bão đổ bộ vào Hà Nội')
LIMIT 1;

-- Report 12: Sấm sét
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Sấm sét nguy hiểm tại Ba Đình',
       'Sấm sét liên tục, nguy cơ cháy nổ cao.',
       'Ba Đình', 'Điện Biên', 'Hà Nội', 21.0350, 105.8400, 'APPROVED', 'HIGH', FALSE,
       DATE_SUB(NOW(), INTERVAL 7 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR)
FROM users u, incident_types it
WHERE u.username = 'tranthib' AND it.name = 'Sấm sét'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Sấm sét nguy hiểm tại Ba Đình')
LIMIT 1;

-- Report 13: Lốc xoáy
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Lốc xoáy tại Đà Nẵng',
       'Lốc xoáy nhỏ xuất hiện, gây thiệt hại nhẹ.',
       'Thanh Khê', 'Thanh Khê Tây', 'Đà Nẵng', 16.0600, 108.2100, 'APPROVED', 'MEDIUM', FALSE,
       DATE_SUB(NOW(), INTERVAL 9 HOUR), DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_SUB(NOW(), INTERVAL 7 HOUR)
FROM users u, incident_types it
WHERE u.username = 'lethic' AND it.name = 'Lốc xoáy'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Lốc xoáy tại Đà Nẵng')
LIMIT 1;

-- Report 14: Rét đậm
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Rét đậm tại Hải Phòng',
       'Nhiệt độ xuống 8°C, cảnh báo rét đậm rét hại.',
       'Ngô Quyền', 'Máy Chai', 'Hải Phòng', 20.8500, 106.7000, 'APPROVED', 'MEDIUM', FALSE,
       DATE_SUB(NOW(), INTERVAL 15 HOUR), DATE_SUB(NOW(), INTERVAL 14 HOUR), DATE_SUB(NOW(), INTERVAL 13 HOUR)
FROM users u, incident_types it
WHERE u.username = 'phamvand' AND it.name = 'Rét đậm rét hại'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Rét đậm tại Hải Phòng')
LIMIT 1;

-- Report 15: Hạn hán
INSERT INTO weather_reports (user_id, incident_type_id, title, description, district, ward, city, latitude, longitude, status, severity, hidden, incident_time, created_at, updated_at)
SELECT u.id, it.id, 'Hạn hán kéo dài tại Vũng Tàu',
       'Thiếu mưa trong 2 tháng, ảnh hưởng đến nguồn nước.',
       'Thành phố Vũng Tàu', 'Rạch Dừa', 'Vũng Tàu', 10.3500, 107.0900, 'APPROVED', 'HIGH', FALSE,
       DATE_SUB(NOW(), INTERVAL 20 HOUR), DATE_SUB(NOW(), INTERVAL 19 HOUR), DATE_SUB(NOW(), INTERVAL 18 HOUR)
FROM users u, incident_types it
WHERE u.username = 'hoangthie' AND it.name = 'Hạn hán'
AND NOT EXISTS (SELECT 1 FROM weather_reports WHERE title = 'Hạn hán kéo dài tại Vũng Tàu')
LIMIT 1;

-- 4. Thêm Report Images
INSERT IGNORE INTO report_images (weather_reports_id, image_url)
SELECT id, '/uploads/sample_rain_1.jpg' FROM weather_reports WHERE title = 'Mưa lớn tại khu vực Hoàn Kiếm' LIMIT 1;

INSERT IGNORE INTO report_images (weather_reports_id, image_url)
SELECT id, '/uploads/sample_flood_1.jpg' FROM weather_reports WHERE title = 'Ngập lụt nghiêm trọng tại Ba Đình' LIMIT 1;

INSERT IGNORE INTO report_images (weather_reports_id, image_url)
SELECT id, '/uploads/sample_wind_1.jpg' FROM weather_reports WHERE title = 'Gió mạnh tại Đà Nẵng' LIMIT 1;

INSERT IGNORE INTO report_images (weather_reports_id, image_url)
SELECT id, '/uploads/sample_tree_1.jpg' FROM weather_reports WHERE title = 'Cây đổ chặn đường tại Hải Phòng' LIMIT 1;

INSERT IGNORE INTO report_images (weather_reports_id, image_url)
SELECT id, '/uploads/sample_storm_1.jpg' FROM weather_reports WHERE title = 'Bão đổ bộ vào Hà Nội' LIMIT 1;

-- 5. Thêm Report Votes
INSERT IGNORE INTO report_votes (report_id, user_id, vote_type, created_at, updated_at)
SELECT r.id, u.id, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 3 HOUR)
FROM weather_reports r, users u
WHERE r.title = 'Mưa lớn tại khu vực Hoàn Kiếm' AND u.username = 'tranthib'
LIMIT 1;

INSERT IGNORE INTO report_votes (report_id, user_id, vote_type, created_at, updated_at)
SELECT r.id, u.id, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)
FROM weather_reports r, users u
WHERE r.title = 'Mưa lớn tại khu vực Hoàn Kiếm' AND u.username = 'lethic'
LIMIT 1;

INSERT IGNORE INTO report_votes (report_id, user_id, vote_type, created_at, updated_at)
SELECT r.id, u.id, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)
FROM weather_reports r, users u
WHERE r.title = 'Ngập lụt nghiêm trọng tại Ba Đình' AND u.username = 'nguyenvana'
LIMIT 1;

INSERT IGNORE INTO report_votes (report_id, user_id, vote_type, created_at, updated_at)
SELECT r.id, u.id, 'CONFIRM', NOW(), NOW()
FROM weather_reports r, users u
WHERE r.title = 'Ngập lụt nghiêm trọng tại Ba Đình' AND u.username = 'hoangthie'
LIMIT 1;

INSERT IGNORE INTO report_votes (report_id, user_id, vote_type, created_at, updated_at)
SELECT r.id, u.id, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR)
FROM weather_reports r, users u
WHERE r.title = 'Gió mạnh tại Đà Nẵng' AND u.username = 'phamvand'
LIMIT 1;

INSERT IGNORE INTO report_votes (report_id, user_id, vote_type, created_at, updated_at)
SELECT r.id, u.id, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 7 HOUR), DATE_SUB(NOW(), INTERVAL 7 HOUR)
FROM weather_reports r, users u
WHERE r.title = 'Bão đổ bộ vào Hà Nội' AND u.username = 'tranthib'
LIMIT 1;

INSERT IGNORE INTO report_votes (report_id, user_id, vote_type, created_at, updated_at)
SELECT r.id, u.id, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR)
FROM weather_reports r, users u
WHERE r.title = 'Bão đổ bộ vào Hà Nội' AND u.username = 'lethic'
LIMIT 1;

INSERT IGNORE INTO report_votes (report_id, user_id, vote_type, created_at, updated_at)
SELECT r.id, u.id, 'REJECT', DATE_SUB(NOW(), INTERVAL 20 MINUTE), DATE_SUB(NOW(), INTERVAL 20 MINUTE)
FROM weather_reports r, users u
WHERE r.title = 'Mưa dông kèm sấm sét tại Thanh Xuân' AND u.username = 'nguyenvana'
LIMIT 1;

-- 6. Thêm Weather Alerts
INSERT IGNORE INTO weather_alerts (admin_id, title, message, level, city, district, ward, created_at, updated_at)
SELECT u.id, 'Cảnh báo mưa lớn tại Hà Nội',
       'Dự báo mưa lớn kéo dài trong 24h tới. Người dân nên chuẩn bị và tránh di chuyển khi không cần thiết.',
       'WARNING', 'Hà Nội', 'Toàn thành phố', NULL, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR)
FROM users u WHERE u.username = 'admin' LIMIT 1;

INSERT IGNORE INTO weather_alerts (admin_id, title, message, level, city, district, ward, created_at, updated_at)
SELECT u.id, 'Cảnh báo bão số 5',
       'Bão số 5 đang tiến vào đất liền, dự kiến đổ bộ vào đêm nay. Cảnh báo nguy hiểm cao.',
       'CRITICAL', 'Miền Trung', 'Toàn khu vực', NULL, DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_SUB(NOW(), INTERVAL 12 HOUR)
FROM users u WHERE u.username = 'admin' LIMIT 1;

INSERT IGNORE INTO weather_alerts (admin_id, title, message, level, city, district, ward, created_at, updated_at)
SELECT u.id, 'Thông tin thời tiết ngày mai',
       'Dự báo thời tiết ngày mai: Nắng nóng, nhiệt độ cao nhất 35°C. Người dân nên uống đủ nước.',
       'INFO', 'Hồ Chí Minh', 'Toàn thành phố', NULL, DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)
FROM users u WHERE u.username = 'admin2' LIMIT 1;

INSERT IGNORE INTO weather_alerts (admin_id, title, message, level, city, district, ward, created_at, updated_at)
SELECT u.id, 'Cảnh báo gió mạnh tại Đà Nẵng',
       'Gió mạnh với tốc độ 50-60km/h dự kiến trong 6h tới. Người dân nên cẩn thận khi ra ngoài.',
       'WARNING', 'Đà Nẵng', 'Toàn thành phố', NULL, DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR)
FROM users u WHERE u.username = 'admin' LIMIT 1;

INSERT IGNORE INTO weather_alerts (admin_id, title, message, level, city, district, ward, created_at, updated_at)
SELECT u.id, 'Cảnh báo nắng nóng cực đoan',
       'Nhiệt độ dự kiến lên đến 42°C tại Vũng Tàu. Cảnh báo nguy cơ say nắng và mất nước.',
       'CRITICAL', 'Vũng Tàu', 'Toàn thành phố', NULL, DATE_SUB(NOW(), INTERVAL 8 HOUR), DATE_SUB(NOW(), INTERVAL 8 HOUR)
FROM users u WHERE u.username = 'admin2' LIMIT 1;

INSERT IGNORE INTO weather_alerts (admin_id, title, message, level, city, district, ward, created_at, updated_at)
SELECT u.id, 'Thông tin về mưa phùn',
       'Mưa phùn kéo dài dự kiến trong 3 ngày tới. Độ ẩm cao, người dân nên giữ ấm.',
       'INFO', 'Hà Nội', 'Toàn thành phố', NULL, DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR)
FROM users u WHERE u.username = 'admin' LIMIT 1;

-- Hiển thị kết quả
SELECT 'Đã thêm dữ liệu mẫu thành công!' AS message;
SELECT CONCAT('Tổng số users: ', COUNT(*)) AS total_users FROM users;
SELECT CONCAT('Tổng số weather_data: ', COUNT(*)) AS total_weather_data FROM weather_data;
SELECT CONCAT('Tổng số weather_reports: ', COUNT(*)) AS total_reports FROM weather_reports;
SELECT CONCAT('Tổng số report_votes: ', COUNT(*)) AS total_votes FROM report_votes;
SELECT CONCAT('Tổng số weather_alerts: ', COUNT(*)) AS total_alerts FROM weather_alerts;

