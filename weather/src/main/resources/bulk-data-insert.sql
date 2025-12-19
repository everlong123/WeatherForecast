-- Script SQL để thêm hàng loạt dữ liệu mẫu vào database
-- Lưu ý: Password đã được hash bằng BCrypt với cost factor 10
-- Tất cả passwords mặc định: "123456" (đã hash)

USE weather_db;

SET FOREIGN_KEY_CHECKS = 0;

-- ========================================
-- 1. INSERT USERS (50 users bao gồm admin và user thường)
-- ========================================
-- Password hash cho "123456" (BCrypt): $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S
-- Password hash cho "admin123": $2a$10$KvYhNzJgJH2zXlF4Y7ZqOeU7f8Z1h3pE5qN2rT8vY9wX0cB1dC4e

INSERT INTO users (username, email, password, role, full_name, phone, address, district, ward, enabled, created_at, updated_at) VALUES
-- Admin users
('admin', 'admin@weather.vn', '$2a$10$KvYhNzJgJH2zXlF4Y7ZqOeU7f8Z1h3pE5qN2rT8vY9wX0cB1dC4e', 'ADMIN', 'Quản trị viên hệ thống', '0901000001', '123 Đường Lý Thường Kiệt', 'Hoàn Kiếm', 'Tràng Tiền', TRUE, NOW(), NOW()),
('admin1', 'admin1@weather.vn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'ADMIN', 'Nguyễn Văn Admin', '0901000002', '456 Đường Trần Hưng Đạo', 'Quận 1', 'Bến Nghé', TRUE, NOW(), NOW()),

-- Regular users - Hà Nội
('user_hanoi_001', 'nguyenvan.a@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Nguyễn Văn A', '0912345678', '12 Phố Hàng Bông', 'Hoàn Kiếm', 'Hàng Gai', TRUE, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
('user_hanoi_002', 'tranthi.b@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Trần Thị B', '0912345679', '25 Phố Lý Quốc Sư', 'Hoàn Kiếm', 'Lý Thái Tổ', TRUE, DATE_SUB(NOW(), INTERVAL 25 DAY), NOW()),
('user_hanoi_003', 'levan.c@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Lê Văn C', '0912345680', '89 Đường Bà Triệu', 'Hai Bà Trưng', 'Lê Đại Hành', TRUE, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
('user_hanoi_004', 'phamthi.d@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Phạm Thị D', '0912345681', '156 Phố Tôn Đức Thắng', 'Đống Đa', 'Quốc Tử Giám', TRUE, DATE_SUB(NOW(), INTERVAL 18 DAY), NOW()),
('user_hanoi_005', 'hoangvan.e@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Hoàng Văn E', '0912345682', '78 Đường Giải Phóng', 'Hoàng Mai', 'Giáp Bát', TRUE, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW()),

-- Regular users - Hồ Chí Minh
('user_hcm_001', 'nguyenviet.f@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Nguyễn Việt F', '0987654321', '123 Nguyễn Huệ', 'Quận 1', 'Bến Nghé', TRUE, DATE_SUB(NOW(), INTERVAL 28 DAY), NOW()),
('user_hcm_002', 'trantien.g@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Trần Tiến G', '0987654322', '456 Đường Lê Lợi', 'Quận 1', 'Đa Kao', TRUE, DATE_SUB(NOW(), INTERVAL 22 DAY), NOW()),
('user_hcm_003', 'levan.h@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Lê Văn H', '0987654323', '789 Phố Tôn Đức Thắng', 'Quận 1', 'Nguyễn Thái Bình', TRUE, DATE_SUB(NOW(), INTERVAL 19 DAY), NOW()),
('user_hcm_004', 'phamthu.i@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Phạm Thu I', '0987654324', '321 Đường Võ Thị Sáu', 'Quận 3', 'Võ Thị Sáu', TRUE, DATE_SUB(NOW(), INTERVAL 16 DAY), NOW()),
('user_hcm_005', 'hoangminh.j@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Hoàng Minh J', '0987654325', '654 Đường Nguyễn Văn Cừ', 'Quận 5', 'Phường 14', TRUE, DATE_SUB(NOW(), INTERVAL 14 DAY), NOW()),
('user_hcm_006', 'dangthanh.k@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Đặng Thanh K', '0987654326', '987 Đường Cách Mạng Tháng 8', 'Quận 10', 'Phường 1', TRUE, DATE_SUB(NOW(), INTERVAL 12 DAY), NOW()),
('user_hcm_007', 'buithi.l@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Bùi Thị L', '0987654327', '147 Đường Hồng Bàng', 'Quận 5', 'Phường 13', TRUE, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),

-- Regular users - Đà Nẵng
('user_danang_001', 'nguyenduc.m@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Nguyễn Đức M', '0923456789', '123 Đường Bạch Đằng', 'Hải Châu', 'Hải Châu', TRUE, DATE_SUB(NOW(), INTERVAL 24 DAY), NOW()),
('user_danang_002', 'tranhoa.n@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Trần Hoa N', '0923456790', '456 Đường Trần Phú', 'Hải Châu', 'Phước Ninh', TRUE, DATE_SUB(NOW(), INTERVAL 17 DAY), NOW()),
('user_danang_003', 'leminh.o@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Lê Minh O', '0923456791', '789 Đường Nguyễn Văn Linh', 'Thanh Khê', 'Thanh Khê Tây', TRUE, DATE_SUB(NOW(), INTERVAL 13 DAY), NOW()),

-- Regular users - Hải Phòng
('user_haiphong_001', 'phamtu.p@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Phạm Tú P', '0934567890', '123 Đường Lạch Tray', 'Ngô Quyền', 'Máy Chai', TRUE, DATE_SUB(NOW(), INTERVAL 21 DAY), NOW()),
('user_haiphong_002', 'hoanglan.q@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Hoàng Lan Q', '0934567891', '456 Đường Trần Nguyên Hãn', 'Hồng Bàng', 'Hoàng Văn Thụ', TRUE, DATE_SUB(NOW(), INTERVAL 11 DAY), NOW()),

-- Regular users - Vũng Tàu
('user_vungtau_001', 'danghai.r@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Đặng Hải R', '0945678901', '123 Đường Trần Phú', 'Thành phố Vũng Tàu', 'Thắng Tam', TRUE, DATE_SUB(NOW(), INTERVAL 9 DAY), NOW()),
('user_vungtau_002', 'vuongngoc.s@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Vương Ngọc S', '0945678902', '456 Đường Nguyễn Thái Học', 'Thành phố Vũng Tàu', 'Rạch Dừa', TRUE, DATE_SUB(NOW(), INTERVAL 8 DAY), NOW()),

-- More users from other cities
('user_cantho_001', 'nguyenhuong.t@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Nguyễn Hương T', '0956789012', '123 Đường Hòa Bình', 'Ninh Kiều', 'Cái Khế', TRUE, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
('user_hue_001', 'tranbinh.u@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Trần Bình U', '0967890123', '123 Đường Lê Lợi', 'Huế', 'Phú Hội', TRUE, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
('user_nhatrang_001', 'lethuy.v@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Lê Thủy V', '0978901234', '123 Đường Trần Phú', 'Nha Trang', 'Vĩnh Hải', TRUE, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
('user_dalat_001', 'phamhong.w@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Phạm Hồng W', '0989012345', '123 Đường Trần Hưng Đạo', 'Đà Lạt', 'Phường 1', TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY), NOW()),
('user_buonmathuot_001', 'hoangnam.x@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Hoàng Nam X', '0990123456', '123 Đường Y Wang', 'Buôn Ma Thuột', 'Tân An', TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
('user_quynhon_001', 'dangphuong.y@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Đặng Phương Y', '0911123456', '123 Đường Trần Hưng Đạo', 'Quy Nhơn', 'Lê Lợi', TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
('user_pleiku_001', 'vuongduy.z@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Vương Duy Z', '0912123456', '123 Đường Nguyễn Du', 'Pleiku', 'Diên Hồng', TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Thêm 25 users nữa với thông tin đa dạng
INSERT INTO users (username, email, password, role, full_name, phone, address, district, ward, enabled, created_at, updated_at) VALUES
('user_hanoi_006', 'user006@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Nguyễn Thị Anh', '0913000001', '45 Phố Hàng Đào', 'Hoàn Kiếm', 'Hàng Đào', TRUE, DATE_SUB(NOW(), INTERVAL 27 DAY), NOW()),
('user_hanoi_007', 'user007@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Trần Văn Bình', '0913000002', '67 Đường Kim Mã', 'Ba Đình', 'Kim Mã', TRUE, DATE_SUB(NOW(), INTERVAL 26 DAY), NOW()),
('user_hanoi_008', 'user008@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Lê Thị Chi', '0913000003', '89 Phố Lý Thường Kiệt', 'Hoàn Kiếm', 'Phan Chu Trinh', TRUE, DATE_SUB(NOW(), INTERVAL 23 DAY), NOW()),
('user_hcm_008', 'user008_hcm@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Nguyễn Văn Đức', '0989000001', '234 Đường Pasteur', 'Quận 3', 'Võ Thị Sáu', TRUE, DATE_SUB(NOW(), INTERVAL 26 DAY), NOW()),
('user_hcm_009', 'user009_hcm@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Trần Thị Em', '0989000002', '567 Đường Nguyễn Đình Chiểu', 'Quận 3', 'Võ Thị Sáu', TRUE, DATE_SUB(NOW(), INTERVAL 23 DAY), NOW()),
('user_hcm_010', 'user010_hcm@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Lê Văn Phú', '0989000003', '890 Đường Lê Văn Sỹ', 'Quận 3', 'Phường 14', TRUE, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
('user_hcm_011', 'user011_hcm@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Phạm Thị Giang', '0989000004', '123 Đường Nguyễn Thị Minh Khai', 'Quận 3', 'Đa Kao', TRUE, DATE_SUB(NOW(), INTERVAL 18 DAY), NOW()),
('user_hcm_012', 'user012_hcm@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Hoàng Văn Hải', '0989000005', '456 Đường Điện Biên Phủ', 'Quận Bình Thạnh', 'Phường 25', TRUE, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW()),
('user_hcm_013', 'user013_hcm@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Đặng Thị Hoa', '0989000006', '789 Đường Xô Viết Nghệ Tĩnh', 'Quận Bình Thạnh', 'Phường 21', TRUE, DATE_SUB(NOW(), INTERVAL 12 DAY), NOW()),
('user_hcm_014', 'user014_hcm@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Vương Văn Khang', '0989000007', '321 Đường Tân Hương', 'Quận Tân Phú', 'Tân Sơn Nhì', TRUE, DATE_SUB(NOW(), INTERVAL 9 DAY), NOW()),
('user_danang_004', 'user004_dn@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Nguyễn Thị Linh', '0924000001', '234 Đường Lê Duẩn', 'Hải Châu', 'Thạch Thang', TRUE, DATE_SUB(NOW(), INTERVAL 22 DAY), NOW()),
('user_danang_005', 'user005_dn@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Trần Văn Mạnh', '0924000002', '567 Đường Phan Đăng Lưu', 'Hải Châu', 'Nam Dương', TRUE, DATE_SUB(NOW(), INTERVAL 19 DAY), NOW()),
('user_haiphong_003', 'user003_hp@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Lê Thị Nga', '0935000001', '234 Đường Điện Biên Phủ', 'Ngô Quyền', 'Cầu Đất', TRUE, DATE_SUB(NOW(), INTERVAL 17 DAY), NOW()),
('user_haiphong_004', 'user004_hp@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Phạm Văn Oanh', '0935000002', '567 Đường Nguyễn Bỉnh Khiêm', 'Ngô Quyền', 'Máy Chai', TRUE, DATE_SUB(NOW(), INTERVAL 14 DAY), NOW()),
('user_vungtau_003', 'user003_vt@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Hoàng Thị Phượng', '0946000001', '234 Đường Hoàng Hoa Thám', 'Thành phố Vũng Tàu', 'Thắng Tam', TRUE, DATE_SUB(NOW(), INTERVAL 11 DAY), NOW()),
('user_cantho_002', 'user002_ct@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Đặng Văn Quang', '0957000001', '234 Đường 3 Tháng 2', 'Ninh Kiều', 'An Hòa', TRUE, DATE_SUB(NOW(), INTERVAL 8 DAY), NOW()),
('user_hue_002', 'user002_hue@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Vương Thị Quyên', '0968000001', '234 Đường Nguyễn Huệ', 'Huế', 'Phú Hội', TRUE, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
('user_nhatrang_002', 'user002_nt@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Nguyễn Văn Rạng', '0979000001', '234 Đường Thống Nhất', 'Nha Trang', 'Vĩnh Phước', TRUE, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
('user_dalat_002', 'user002_dl@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Trần Thị Sương', '0980000001', '234 Đường Phan Đình Phùng', 'Đà Lạt', 'Phường 1', TRUE, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
('user_buonmathuot_002', 'user002_bmt@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Lê Văn Tấn', '0991000001', '234 Đường Nguyễn Tất Thành', 'Buôn Ma Thuột', 'Tân An', TRUE, DATE_SUB(NOW(), INTERVAL 4 DAY), NOW()),
('user_quynhon_002', 'user002_qn@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Phạm Thị Uyên', '0912000001', '234 Đường Ngô Mây', 'Quy Nhơn', 'Lê Lợi', TRUE, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
('user_pleiku_002', 'user002_pk@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Hoàng Văn Việt', '0913000004', '234 Đường Phạm Văn Đồng', 'Pleiku', 'Diên Hồng', TRUE, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
('user_hanoi_009', 'user009_hn@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Đặng Thị Xuân', '0913000005', '123 Phố Hàng Mã', 'Hoàn Kiếm', 'Hàng Mã', TRUE, DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
('user_hcm_015', 'user015_hcm@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Vương Văn Yến', '0989000008', '567 Đường Trường Chinh', 'Quận Tân Bình', 'Phường 4', TRUE, NOW(), NOW()),
('user_danang_006', 'user006_dn@email.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', 'USER', 'Nguyễn Văn Zũ', '0924000003', '890 Đường Võ Văn Tần', 'Thanh Khê', 'Thanh Khê Đông', TRUE, NOW(), NOW());

-- ========================================
-- 2. INSERT INCIDENT TYPES (21 loại sự cố)
-- ========================================
INSERT INTO incident_types (name, description, icon, color, created_at, updated_at) VALUES
('Mưa lớn', 'Mưa với cường độ cao, lượng mưa trên 50mm/giờ', '🌧️', '#4A90E2', NOW(), NOW()),
('Mưa dông', 'Mưa kèm theo sấm sét và gió mạnh', '⛈️', '#2C3E50', NOW(), NOW()),
('Lũ lụt', 'Nước dâng cao gây ngập lụt đường phố, nhà cửa', '🌊', '#3498DB', NOW(), NOW()),
('Ngập úng', 'Nước đọng không thoát được gây ngập cục bộ', '💧', '#5DADE2', NOW(), NOW()),
('Sạt lở đất', 'Đất đá sạt lở do mưa lớn kéo dài', '⛰️', '#8B4513', NOW(), NOW()),
('Gió mạnh', 'Gió tốc độ trên 40km/h', '💨', '#AED6F1', NOW(), NOW()),
('Gió giật', 'Gió giật mạnh đột ngột, có thể gây nguy hiểm', '🌪️', '#85C1E2', NOW(), NOW()),
('Bão', 'Bão nhiệt đới với gió mạnh và mưa lớn', '🌀', '#1B4F72', NOW(), NOW()),
('Áp thấp nhiệt đới', 'Hệ thống thời tiết xấu với mưa và gió mạnh', '🌬️', '#2874A6', NOW(), NOW()),
('Lốc xoáy', 'Xoáy gió mạnh, có thể gây thiệt hại nghiêm trọng', '🌪️', '#1A5276', NOW(), NOW()),
('Nắng nóng cực đoan', 'Nhiệt độ trên 40°C, có thể gây say nắng', '☀️', '#E74C3C', NOW(), NOW()),
('Hạn hán', 'Thiếu mưa kéo dài, ảnh hưởng đến nguồn nước', '🏜️', '#DC7633', NOW(), NOW()),
('Cháy rừng', 'Cháy rừng do thời tiết khô hanh', '🔥', '#C0392B', NOW(), NOW()),
('Khô hạn', 'Độ ẩm thấp, thiếu nước tưới tiêu', '🌵', '#D35400', NOW(), NOW()),
('Sương mù dày đặc', 'Sương mù làm giảm tầm nhìn dưới 100m', '🌫️', '#BDC3C7', NOW(), NOW()),
('Mưa phùn kéo dài', 'Mưa phùn gây ẩm ướt và tầm nhìn kém', '🌦️', '#95A5A6', NOW(), NOW()),
('Bụi mù', 'Bụi bẩn trong không khí làm giảm tầm nhìn', '💨', '#7F8C8D', NOW(), NOW()),
('Sấm sét', 'Sấm sét nguy hiểm, có thể gây cháy nổ', '⚡', '#F39C12', NOW(), NOW()),
('Mưa đá', 'Mưa đá có thể gây thiệt hại về tài sản', '🧊', '#ECF0F1', NOW(), NOW()),
('Rét đậm rét hại', 'Nhiệt độ xuống thấp dưới 10°C', '🧣', '#3498DB', NOW(), NOW()),
('Cây đổ', 'Cây cối bị đổ do gió mạnh hoặc mưa lớn', '🌳', '#27AE60', NOW(), NOW())
ON DUPLICATE KEY UPDATE description=VALUES(description), icon=VALUES(icon), color=VALUES(color), updated_at=NOW();

-- ========================================
-- 3. INSERT WEATHER DATA (300+ records cho nhiều địa điểm và thời điểm)
-- ========================================
-- Hà Nội - Nhiều thời điểm khác nhau
INSERT INTO weather_data (latitude, longitude, city, district, ward, temperature, feels_like, humidity, pressure, wind_speed, wind_direction, visibility, cloudiness, rain_volume, snow_volume, main_weather, description, icon, recorded_at, created_at) VALUES
(21.0285, 105.8542, 'Hà Nội', 'Hoàn Kiếm', 'Tràng Tiền', 28.5, 30.2, 75, 1013.25, 5.2, 180, 10000, 40, 0, 0, 'Clouds', 'Mây rải rác', '03d', DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
(21.0285, 105.8542, 'Hà Nội', 'Hoàn Kiếm', 'Tràng Tiền', 26.8, 28.5, 80, 1014.50, 4.8, 165, 9500, 60, 2.5, 0, 'Rain', 'Mưa nhẹ', '10d', DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW()),
(21.0285, 105.8542, 'Hà Nội', 'Hoàn Kiếm', 'Tràng Tiền', 32.0, 35.0, 65, 1011.75, 6.5, 200, 12000, 20, 0, 0, 'Clear', 'Trời quang', '01d', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
(21.0285, 105.8542, 'Hà Nội', 'Hoàn Kiếm', 'Tràng Tiền', 24.3, 26.0, 85, 1015.00, 3.2, 150, 8000, 90, 8.5, 0, 'Rain', 'Mưa vừa', '09d', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
(21.0285, 105.8542, 'Hà Nội', 'Hoàn Kiếm', 'Tràng Tiền', 22.5, 24.0, 88, 1016.25, 4.0, 140, 7000, 95, 15.2, 0, 'Rain', 'Mưa to', '09n', DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

-- Hồ Chí Minh
(10.8231, 106.6297, 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé', 32.5, 36.0, 70, 1010.50, 7.2, 220, 12000, 30, 0, 0, 'Clear', 'Trời quang', '01d', DATE_SUB(NOW(), INTERVAL 1 HOUR), NOW()),
(10.8231, 106.6297, 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé', 30.8, 33.5, 78, 1011.25, 6.8, 210, 11000, 50, 1.5, 0, 'Clouds', 'Mây rải rác', '03d', DATE_SUB(NOW(), INTERVAL 4 HOUR), NOW()),
(10.8231, 106.6297, 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé', 35.2, 39.0, 65, 1009.75, 8.5, 230, 13000, 15, 0, 0, 'Clear', 'Nắng nóng', '01d', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
(10.8231, 106.6297, 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé', 28.5, 31.0, 82, 1012.50, 5.5, 180, 9000, 70, 5.8, 0, 'Rain', 'Mưa rào', '10d', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
(10.8231, 106.6297, 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé', 27.0, 29.5, 85, 1013.00, 4.2, 170, 8500, 85, 12.3, 0, 'Rain', 'Mưa to', '09d', DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

-- Đà Nẵng
(16.0544, 108.2022, 'Đà Nẵng', 'Hải Châu', 'Hải Châu', 31.0, 33.5, 72, 1012.00, 6.0, 200, 11500, 35, 0, 0, 'Clear', 'Trời quang', '01d', DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
(16.0544, 108.2022, 'Đà Nẵng', 'Hải Châu', 'Hải Châu', 29.5, 32.0, 75, 1013.25, 5.8, 190, 10500, 45, 1.2, 0, 'Clouds', 'Mây rải rác', '03d', DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW()),
(16.0544, 108.2022, 'Đà Nẵng', 'Hải Châu', 'Hải Châu', 33.8, 37.0, 68, 1010.75, 7.5, 210, 12500, 25, 0, 0, 'Clear', 'Nắng nóng', '01d', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),
(16.0544, 108.2022, 'Đà Nẵng', 'Hải Châu', 'Hải Châu', 26.2, 28.5, 83, 1014.50, 4.5, 160, 8500, 75, 7.5, 0, 'Rain', 'Mưa vừa', '10d', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),

-- Hải Phòng
(20.8449, 106.6881, 'Hải Phòng', 'Hồng Bàng', 'Máy Chai', 29.5, 31.8, 74, 1013.75, 5.5, 185, 11000, 40, 0, 0, 'Clouds', 'Mây rải rác', '03d', DATE_SUB(NOW(), INTERVAL 3 HOUR), NOW()),
(20.8449, 106.6881, 'Hải Phòng', 'Hồng Bàng', 'Máy Chai', 27.8, 30.0, 79, 1014.25, 5.0, 175, 10000, 55, 3.2, 0, 'Rain', 'Mưa nhẹ', '10d', DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW()),
(20.8449, 106.6881, 'Hải Phòng', 'Hồng Bàng', 'Máy Chai', 31.2, 34.0, 70, 1012.50, 6.2, 195, 12000, 30, 0, 0, 'Clear', 'Trời quang', '01d', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW()),

-- Vũng Tàu
(10.3460, 107.0843, 'Vũng Tàu', 'Thành phố Vũng Tàu', 'Thắng Tam', 30.5, 33.0, 73, 1011.50, 7.0, 215, 12000, 32, 0, 0, 'Clear', 'Trời quang', '01d', DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),
(10.3460, 107.0843, 'Vũng Tàu', 'Thành phố Vũng Tàu', 'Thắng Tam', 28.8, 31.2, 77, 1012.25, 6.5, 205, 11000, 48, 2.0, 0, 'Clouds', 'Mây rải rác', '03d', DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW()),
(10.3460, 107.0843, 'Vũng Tàu', 'Thành phố Vũng Tàu', 'Thắng Tam', 32.5, 35.5, 69, 1010.00, 8.0, 225, 13000, 20, 0, 0, 'Clear', 'Nắng nóng', '01d', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW());

-- Thêm nhiều weather data hơn cho các địa điểm khác (tạo 200+ records nữa)
INSERT INTO weather_data (latitude, longitude, city, district, ward, temperature, feels_like, humidity, pressure, wind_speed, wind_direction, visibility, cloudiness, rain_volume, snow_volume, main_weather, description, icon, recorded_at, created_at)
SELECT 
    lat, lng, city_name, dist, ward_name,
    20 + RAND() * 15 as temp,
    22 + RAND() * 16 as feels,
    60 + RAND() * 30 as hum,
    1008 + RAND() * 10 as press,
    3 + RAND() * 8 as wind_s,
    RAND() * 360 as wind_d,
    5000 + RAND() * 8000 as vis,
    RAND() * 100 as cloud,
    CASE WHEN RAND() > 0.7 THEN RAND() * 20 ELSE 0 END as rain,
    0 as snow,
    CASE 
        WHEN RAND() > 0.7 THEN 'Rain'
        WHEN RAND() > 0.5 THEN 'Clouds'
        ELSE 'Clear'
    END as main,
    CASE 
        WHEN RAND() > 0.7 THEN 'Mưa nhẹ'
        WHEN RAND() > 0.5 THEN 'Mây rải rác'
        ELSE 'Trời quang'
    END as desc,
    CASE 
        WHEN RAND() > 0.7 THEN '10d'
        WHEN RAND() > 0.5 THEN '03d'
        ELSE '01d'
    END as icon_val,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 168) HOUR) as rec_at,
    NOW() as created
FROM (
    SELECT 21.0285 as lat, 105.8542 as lng, 'Hà Nội' as city_name, 'Hoàn Kiếm' as dist, 'Tràng Tiền' as ward_name UNION ALL
    SELECT 21.0333, 105.8333, 'Hà Nội', 'Hai Bà Trưng', 'Lê Đại Hành' UNION ALL
    SELECT 21.0198, 105.8360, 'Hà Nội', 'Đống Đa', 'Quốc Tử Giám' UNION ALL
    SELECT 10.8231, 106.6297, 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé' UNION ALL
    SELECT 10.7795, 106.6995, 'Hồ Chí Minh', 'Quận 3', 'Võ Thị Sáu' UNION ALL
    SELECT 10.7626, 106.6602, 'Hồ Chí Minh', 'Quận 5', 'Phường 14' UNION ALL
    SELECT 16.0544, 108.2022, 'Đà Nẵng', 'Hải Châu', 'Hải Châu' UNION ALL
    SELECT 20.8449, 106.6881, 'Hải Phòng', 'Ngô Quyền', 'Máy Chai' UNION ALL
    SELECT 10.3460, 107.0843, 'Vũng Tàu', 'Thành phố Vũng Tàu', 'Thắng Tam' UNION ALL
    SELECT 10.0452, 105.7469, 'Cần Thơ', 'Ninh Kiều', 'Cái Khế' UNION ALL
    SELECT 16.4637, 107.5909, 'Huế', 'Huế', 'Phú Hội' UNION ALL
    SELECT 12.2388, 109.1967, 'Nha Trang', 'Nha Trang', 'Vĩnh Hải' UNION ALL
    SELECT 11.9404, 108.4583, 'Đà Lạt', 'Đà Lạt', 'Phường 1' UNION ALL
    SELECT 12.6662, 108.0383, 'Buôn Ma Thuột', 'Buôn Ma Thuột', 'Tân An' UNION ALL
    SELECT 13.7824, 109.2197, 'Quy Nhơn', 'Quy Nhơn', 'Lê Lợi' UNION ALL
    SELECT 13.9832, 108.0012, 'Pleiku', 'Pleiku', 'Diên Hồng' UNION ALL
    SELECT 21.0062, 105.8431, 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng' UNION ALL
    SELECT 21.0084, 105.7784, 'Hà Nội', 'Thanh Xuân', 'Khương Trung' UNION ALL
    SELECT 10.8014, 106.6527, 'Hồ Chí Minh', 'Quận 10', 'Phường 1' UNION ALL
    SELECT 10.8027, 106.6928, 'Hồ Chí Minh', 'Quận Bình Thạnh', 'Phường 25'
) as locations
CROSS JOIN (
    SELECT 1 as n UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION
    SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10
) as multipliers;

-- ========================================
-- 4. INSERT WEATHER REPORTS (150+ báo cáo)
-- ========================================
-- Lấy ID của users và incident_types để insert reports
INSERT INTO weather_reports (user_id, incident_type_id, title, description, address, district, ward, city, latitude, longitude, status, severity, incident_time, created_at, updated_at)
SELECT 
    u.id as user_id,
    it.id as incident_type_id,
    CASE it.name
        WHEN 'Mưa lớn' THEN CONCAT('Mưa lớn tại ', u.district, ', ', u.city)
        WHEN 'Lũ lụt' THEN CONCAT('Lũ lụt tại ', u.district, ', ', u.city)
        WHEN 'Gió mạnh' THEN CONCAT('Gió mạnh tại ', u.district, ', ', u.city)
        WHEN 'Sạt lở đất' THEN CONCAT('Sạt lở đất tại ', u.district, ', ', u.city)
        WHEN 'Nắng nóng cực đoan' THEN CONCAT('Nắng nóng tại ', u.district, ', ', u.city)
        ELSE CONCAT('Sự cố thời tiết tại ', u.district, ', ', u.city)
    END as title,
    CONCAT('Báo cáo về sự cố ', LOWER(it.name), ' tại khu vực ', u.address, '. ', 
           CASE it.name
               WHEN 'Mưa lớn' THEN 'Mưa với cường độ cao, lượng mưa trên 50mm/giờ, gây ngập úng cục bộ.'
               WHEN 'Lũ lụt' THEN 'Nước dâng cao gây ngập lụt đường phố và nhà cửa, giao thông bị ảnh hưởng.'
               WHEN 'Gió mạnh' THEN 'Gió tốc độ cao, có thể gây nguy hiểm cho người và tài sản.'
               WHEN 'Sạt lở đất' THEN 'Đất đá sạt lở do mưa lớn kéo dài, gây nguy hiểm.'
               WHEN 'Nắng nóng cực đoan' THEN 'Nhiệt độ cao, có thể gây say nắng, cần đề phòng.'
               ELSE 'Sự cố thời tiết ảnh hưởng đến khu vực này.'
           END) as description,
    u.address,
    u.district,
    u.ward,
    u.city,
    CASE 
        WHEN u.city = 'Hà Nội' THEN 21.0285 + (RAND() - 0.5) * 0.1
        WHEN u.city = 'Hồ Chí Minh' THEN 10.8231 + (RAND() - 0.5) * 0.1
        WHEN u.city = 'Đà Nẵng' THEN 16.0544 + (RAND() - 0.5) * 0.1
        WHEN u.city = 'Hải Phòng' THEN 20.8449 + (RAND() - 0.5) * 0.1
        WHEN u.city = 'Vũng Tàu' THEN 10.3460 + (RAND() - 0.5) * 0.1
        ELSE 10.8231 + (RAND() - 0.5) * 0.5
    END as latitude,
    CASE 
        WHEN u.city = 'Hà Nội' THEN 105.8542 + (RAND() - 0.5) * 0.1
        WHEN u.city = 'Hồ Chí Minh' THEN 106.6297 + (RAND() - 0.5) * 0.1
        WHEN u.city = 'Đà Nẵng' THEN 108.2022 + (RAND() - 0.5) * 0.1
        WHEN u.city = 'Hải Phòng' THEN 106.6881 + (RAND() - 0.5) * 0.1
        WHEN u.city = 'Vũng Tàu' THEN 107.0843 + (RAND() - 0.5) * 0.1
        ELSE 106.6297 + (RAND() - 0.5) * 0.5
    END as longitude,
    CASE 
        WHEN RAND() > 0.4 THEN 'APPROVED'
        WHEN RAND() > 0.2 THEN 'PENDING'
        ELSE 'REJECTED'
    END as status,
    CASE 
        WHEN RAND() > 0.7 THEN 'HIGH'
        WHEN RAND() > 0.4 THEN 'MEDIUM'
        ELSE 'LOW'
    END as severity,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 720) HOUR) as incident_time,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 720) HOUR) as created_at,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 720) HOUR) as updated_at
FROM users u
CROSS JOIN incident_types it
WHERE u.role = 'USER'
ORDER BY RAND()
LIMIT 150;

-- Thêm một số báo cáo cụ thể hơn
INSERT INTO weather_reports (user_id, incident_type_id, title, description, address, district, ward, city, latitude, longitude, status, severity, incident_time, created_at, updated_at) VALUES
((SELECT id FROM users WHERE username = 'user_hanoi_001' LIMIT 1), (SELECT id FROM incident_types WHERE name = 'Mưa lớn' LIMIT 1), 
 'Mưa lớn gây ngập tại Phố Hàng Bông', 
 'Mưa lớn kéo dài từ sáng đến chiều, lượng mưa ước tính trên 80mm, gây ngập úng tại khu vực phố Hàng Bông và các phố xung quanh. Nhiều phương tiện bị kẹt, giao thông tê liệt.', 
 '12 Phố Hàng Bông', 'Hoàn Kiếm', 'Hàng Gai', 'Hà Nội', 21.0285, 105.8542, 'APPROVED', 'HIGH', DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_SUB(NOW(), INTERVAL 11 HOUR)),

((SELECT id FROM users WHERE username = 'user_hcm_001' LIMIT 1), (SELECT id FROM incident_types WHERE name = 'Lũ lụt' LIMIT 1), 
 'Lũ lụt tại khu vực Quận 1', 
 'Nước dâng cao trên 50cm tại nhiều tuyến đường trong Quận 1, nhiều cửa hàng và nhà dân bị ngập. Cần hỗ trợ khẩn cấp.', 
 '123 Nguyễn Huệ', 'Quận 1', 'Bến Nghé', 'Hồ Chí Minh', 10.8231, 106.6297, 'APPROVED', 'HIGH', DATE_SUB(NOW(), INTERVAL 24 HOUR), DATE_SUB(NOW(), INTERVAL 23 HOUR), DATE_SUB(NOW(), INTERVAL 22 HOUR)),

((SELECT id FROM users WHERE username = 'user_danang_001' LIMIT 1), (SELECT id FROM incident_types WHERE name = 'Gió mạnh' LIMIT 1), 
 'Gió mạnh làm đổ cây tại Đà Nẵng', 
 'Gió giật mạnh với tốc độ trên 60km/h đã làm đổ nhiều cây xanh trên đường Bạch Đằng. Một số phương tiện bị hư hỏng nhẹ.', 
 '123 Đường Bạch Đằng', 'Hải Châu', 'Hải Châu', 'Đà Nẵng', 16.0544, 108.2022, 'APPROVED', 'MEDIUM', DATE_SUB(NOW(), INTERVAL 36 HOUR), DATE_SUB(NOW(), INTERVAL 35 HOUR), DATE_SUB(NOW(), INTERVAL 34 HOUR)),

((SELECT id FROM users WHERE username = 'user_hcm_002' LIMIT 1), (SELECT id FROM incident_types WHERE name = 'Nắng nóng cực đoan' LIMIT 1), 
 'Nắng nóng cực đoan tại Hồ Chí Minh', 
 'Nhiệt độ lên đến 38°C, cảm giác như 42°C do độ ẩm cao. Nhiều người có dấu hiệu say nắng khi làm việc ngoài trời.', 
 '456 Đường Lê Lợi', 'Quận 1', 'Đa Kao', 'Hồ Chí Minh', 10.8231, 106.6297, 'PENDING', 'MEDIUM', DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR), NOW()),

((SELECT id FROM users WHERE username = 'user_hanoi_003' LIMIT 1), (SELECT id FROM incident_types WHERE name = 'Sạt lở đất' LIMIT 1), 
 'Sạt lở đất tại khu vực Hai Bà Trưng', 
 'Sau nhiều ngày mưa lớn, một đoạn đường tại phường Lê Đại Hành bị sạt lở, đất đá đổ xuống đường gây cản trở giao thông.', 
 '89 Đường Bà Triệu', 'Hai Bà Trưng', 'Lê Đại Hành', 'Hà Nội', 21.0333, 105.8333, 'APPROVED', 'HIGH', DATE_SUB(NOW(), INTERVAL 48 HOUR), DATE_SUB(NOW(), INTERVAL 47 HOUR), DATE_SUB(NOW(), INTERVAL 46 HOUR)),

((SELECT id FROM users WHERE username = 'user_haiphong_001' LIMIT 1), (SELECT id FROM incident_types WHERE name = 'Mưa dông' LIMIT 1), 
 'Mưa dông kèm sấm sét tại Hải Phòng', 
 'Mưa dông lớn với sấm sét kéo dài hơn 2 giờ, lượng mưa đạt 60mm. Nhiều khu vực bị mất điện tạm thời.', 
 '123 Đường Lạch Tray', 'Ngô Quyền', 'Máy Chai', 'Hải Phòng', 20.8449, 106.6881, 'APPROVED', 'MEDIUM', DATE_SUB(NOW(), INTERVAL 72 HOUR), DATE_SUB(NOW(), INTERVAL 71 HOUR), DATE_SUB(NOW(), INTERVAL 70 HOUR));

-- ========================================
-- 5. INSERT WEATHER ALERTS (30+ cảnh báo)
-- ========================================
INSERT INTO weather_alerts (admin_id, title, message, level, city, district, ward, latitude, longitude, radius, start_time, end_time, active, created_at, updated_at)
SELECT 
    u.id as admin_id,
    CASE 
        WHEN RAND() > 0.7 THEN CONCAT('Cảnh báo: Mưa lớn tại ', city_name)
        WHEN RAND() > 0.5 THEN CONCAT('Cảnh báo: Gió mạnh tại ', city_name)
        WHEN RAND() > 0.3 THEN CONCAT('Cảnh báo: Nắng nóng tại ', city_name)
        ELSE CONCAT('Cảnh báo thời tiết: ', city_name)
    END as title,
    CONCAT('Cảnh báo thời tiết cho khu vực ', city_name, '. ', 
           CASE 
               WHEN RAND() > 0.7 THEN 'Dự báo có mưa lớn với lượng mưa trên 50mm trong vòng 24 giờ tới. Người dân cần đề phòng ngập úng và lũ lụt.'
               WHEN RAND() > 0.5 THEN 'Dự báo gió mạnh với tốc độ trên 40km/h. Cần cẩn thận khi tham gia giao thông và làm việc ngoài trời.'
               WHEN RAND() > 0.3 THEN 'Dự báo nắng nóng với nhiệt độ có thể lên đến 38-40°C. Người dân cần tránh làm việc ngoài trời vào giữa trưa.'
               ELSE 'Cảnh báo về điều kiện thời tiết bất lợi. Người dân cần theo dõi thông tin và chuẩn bị ứng phó.'
           END) as message,
    CASE 
        WHEN RAND() > 0.7 THEN 'DANGER'
        WHEN RAND() > 0.5 THEN 'WARNING'
        WHEN RAND() > 0.3 THEN 'INFO'
        ELSE 'WARNING'
    END as level,
    city_name,
    NULL as district,
    NULL as ward,
    lat as latitude,
    lng as longitude,
    10000 + RAND() * 20000 as radius,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 168) HOUR) as start_time,
    DATE_ADD(NOW(), INTERVAL FLOOR(24 + RAND() * 72) HOUR) as end_time,
    CASE WHEN RAND() > 0.3 THEN TRUE ELSE FALSE END as active,
    DATE_SUB(NOW(), INTERVAL FLOOR(RAND() * 168) HOUR) as created_at,
    NOW() as updated_at
FROM (
    SELECT 21.0285 as lat, 105.8542 as lng, 'Hà Nội' as city_name UNION ALL
    SELECT 10.8231, 106.6297, 'Hồ Chí Minh' UNION ALL
    SELECT 16.0544, 108.2022, 'Đà Nẵng' UNION ALL
    SELECT 20.8449, 106.6881, 'Hải Phòng' UNION ALL
    SELECT 10.3460, 107.0843, 'Vũng Tàu' UNION ALL
    SELECT 10.0452, 105.7469, 'Cần Thơ' UNION ALL
    SELECT 16.4637, 107.5909, 'Huế' UNION ALL
    SELECT 12.2388, 109.1967, 'Nha Trang' UNION ALL
    SELECT 11.9404, 108.4583, 'Đà Lạt' UNION ALL
    SELECT 12.6662, 108.0383, 'Buôn Ma Thuột'
) as cities
CROSS JOIN (SELECT id FROM users WHERE role = 'ADMIN' LIMIT 2) as u
ORDER BY RAND()
LIMIT 30;

-- Thêm một số cảnh báo cụ thể
INSERT INTO weather_alerts (admin_id, title, message, level, city, district, ward, latitude, longitude, radius, start_time, end_time, active, created_at, updated_at) VALUES
((SELECT id FROM users WHERE username = 'admin' LIMIT 1), 
 'Cảnh báo: Mưa lớn và ngập úng tại Hà Nội', 
 'Dự báo có mưa lớn với lượng mưa trên 80mm trong vòng 12 giờ tới tại Hà Nội. Nguy cơ ngập úng cao tại các khu vực trũng thấp. Người dân cần di chuyển phương tiện lên cao, chuẩn bị vật dụng cần thiết và tránh di chuyển khi không cần thiết.', 
 'DANGER', 'Hà Nội', 'Hoàn Kiếm', 'Tràng Tiền', 21.0285, 105.8542, 15000, 
 DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 12 HOUR), TRUE, 
 DATE_SUB(NOW(), INTERVAL 2 HOUR), NOW()),

((SELECT id FROM users WHERE username = 'admin' LIMIT 1), 
 'Cảnh báo: Nắng nóng cực đoan tại Hồ Chí Minh', 
 'Nhiệt độ dự báo có thể lên đến 38-40°C tại Hồ Chí Minh trong 3 ngày tới. Chỉ số UV rất cao. Người dân cần tránh làm việc ngoài trời vào giữa trưa, uống đủ nước, mặc quần áo che nắng và sử dụng kem chống nắng.', 
 'WARNING', 'Hồ Chí Minh', 'Quận 1', 'Bến Nghé', 10.8231, 106.6297, 20000, 
 NOW(), DATE_ADD(NOW(), INTERVAL 72 HOUR), TRUE, 
 NOW(), NOW()),

((SELECT id FROM users WHERE username = 'admin1' LIMIT 1), 
 'Cảnh báo: Gió mạnh tại Đà Nẵng', 
 'Dự báo có gió mạnh với tốc độ 50-60km/h tại Đà Nẵng trong 24 giờ tới. Gió giật có thể đạt 80km/h. Người dân cần cẩn thận khi tham gia giao thông, đặc biệt là trên cầu và đường cao tốc. Cần cố định các vật dụng ngoài trời.', 
 'WARNING', 'Đà Nẵng', 'Hải Châu', 'Hải Châu', 16.0544, 108.2022, 18000, 
 DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_ADD(NOW(), INTERVAL 18 HOUR), TRUE, 
 DATE_SUB(NOW(), INTERVAL 6 HOUR), NOW());

-- ========================================
-- 6. INSERT REPORT IMAGES
-- ========================================
-- LƯU Ý: Ứng dụng hiện tại CHƯA có chức năng upload ảnh thực sự.
-- Bảng report_images có thể lưu URLs, nhưng cần implement chức năng upload trước.
-- Để trống phần này cho đến khi có chức năng upload ảnh.

-- Nếu muốn thêm URLs ảnh mẫu (từ các dịch vụ như Imgur, Cloudinary, etc.), 
-- có thể uncomment phần dưới và cung cấp URLs thật:

-- INSERT INTO report_images (weather_reports_id, image_url)
-- SELECT 
--     wr.id as weather_reports_id,
--     CONCAT('https://example.com/images/report_', wr.id, '_1.jpg') as image_url
-- FROM weather_reports wr
-- WHERE wr.status = 'APPROVED'
-- ORDER BY RAND()
-- LIMIT 50;

SET FOREIGN_KEY_CHECKS = 1;

-- ========================================
-- Tổng kết dữ liệu đã insert
-- ========================================
SELECT 
    'Users' as TableName, COUNT(*) as RecordCount FROM users
UNION ALL
SELECT 'Incident Types', COUNT(*) FROM incident_types
UNION ALL
SELECT 'Weather Data', COUNT(*) FROM weather_data
UNION ALL
SELECT 'Weather Reports', COUNT(*) FROM weather_reports
UNION ALL
SELECT 'Weather Alerts', COUNT(*) FROM weather_alerts
UNION ALL
SELECT 'Report Images', COUNT(*) FROM report_images;

