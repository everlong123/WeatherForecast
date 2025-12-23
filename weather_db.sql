-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 23, 2025 at 09:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `weather_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `incident_types`
--

CREATE TABLE `incident_types` (
  `id` bigint(20) NOT NULL,
  `color` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `incident_types`
--

INSERT INTO `incident_types` (`id`, `color`, `created_at`, `description`, `icon`, `name`, `updated_at`) VALUES
(1, '#4A90E2', '2025-12-23 15:35:28.000000', 'Mưa với cường độ cao, lượng mưa trên 50mm/giờ', '🌧️', 'Mưa lớn', '2025-12-23 15:35:28.000000'),
(2, '#2C3E50', '2025-12-23 15:35:28.000000', 'Mưa kèm theo sấm sét và gió mạnh', '⛈️', 'Mưa dông', '2025-12-23 15:35:28.000000'),
(3, '#3498DB', '2025-12-23 15:35:28.000000', 'Nước dâng cao gây ngập lụt đường phố, nhà cửa', '🌊', 'Lũ lụt', '2025-12-23 15:35:28.000000'),
(4, '#5DADE2', '2025-12-23 15:35:28.000000', 'Nước đọng không thoát được gây ngập cục bộ', '💧', 'Ngập úng', '2025-12-23 15:35:28.000000'),
(5, '#8B4513', '2025-12-23 15:35:28.000000', 'Đất đá sạt lở do mưa lớn kéo dài', '⛰️', 'Sạt lở đất', '2025-12-23 15:35:28.000000'),
(6, '#AED6F1', '2025-12-23 15:35:28.000000', 'Gió tốc độ trên 40km/h', '💨', 'Gió mạnh', '2025-12-23 15:35:28.000000'),
(7, '#85C1E2', '2025-12-23 15:35:28.000000', 'Gió giật mạnh đột ngột, có thể gây nguy hiểm', '🌪️', 'Gió giật', '2025-12-23 15:35:28.000000'),
(8, '#1B4F72', '2025-12-23 15:35:28.000000', 'Bão nhiệt đới với gió mạnh và mưa lớn', '🌀', 'Bão', '2025-12-23 15:35:28.000000'),
(9, '#2874A6', '2025-12-23 15:35:28.000000', 'Hệ thống thời tiết xấu với mưa và gió mạnh', '🌬️', 'Áp thấp nhiệt đới', '2025-12-23 15:35:28.000000'),
(10, '#1A5276', '2025-12-23 15:35:28.000000', 'Xoáy gió mạnh, có thể gây thiệt hại nghiêm trọng', '🌪️', 'Lốc xoáy', '2025-12-23 15:35:28.000000'),
(11, '#E74C3C', '2025-12-23 15:35:28.000000', 'Nhiệt độ trên 40°C, có thể gây say nắng', '☀️', 'Nắng nóng cực đoan', '2025-12-23 15:35:28.000000'),
(12, '#DC7633', '2025-12-23 15:35:28.000000', 'Thiếu mưa kéo dài, ảnh hưởng đến nguồn nước', '🏜️', 'Hạn hán', '2025-12-23 15:35:28.000000'),
(13, '#C0392B', '2025-12-23 15:35:28.000000', 'Cháy rừng do thời tiết khô hanh', '🔥', 'Cháy rừng', '2025-12-23 15:35:28.000000'),
(14, '#D35400', '2025-12-23 15:35:28.000000', 'Độ ẩm thấp, thiếu nước tưới tiêu', '🌵', 'Khô hạn', '2025-12-23 15:35:28.000000'),
(15, '#BDC3C7', '2025-12-23 15:35:28.000000', 'Sương mù làm giảm tầm nhìn dưới 100m', '🌫️', 'Sương mù dày đặc', '2025-12-23 15:35:28.000000'),
(16, '#95A5A6', '2025-12-23 15:35:28.000000', 'Mưa phùn gây ẩm ướt và tầm nhìn kém', '🌦️', 'Mưa phùn kéo dài', '2025-12-23 15:35:28.000000'),
(17, '#7F8C8D', '2025-12-23 15:35:28.000000', 'Bụi bẩn trong không khí làm giảm tầm nhìn', '💨', 'Bụi mù', '2025-12-23 15:35:28.000000'),
(18, '#F39C12', '2025-12-23 15:35:28.000000', 'Sấm sét nguy hiểm, có thể gây cháy nổ', '⚡', 'Sấm sét', '2025-12-23 15:35:28.000000'),
(19, '#ECF0F1', '2025-12-23 15:35:28.000000', 'Mưa đá có thể gây thiệt hại về tài sản', '🧊', 'Mưa đá', '2025-12-23 15:35:28.000000'),
(20, '#FFFFFF', '2025-12-23 15:35:28.000000', 'Tuyết rơi (hiếm ở Việt Nam, chủ yếu vùng núi cao)', '❄️', 'Tuyết rơi', '2025-12-23 15:35:28.000000'),
(21, '#3498DB', '2025-12-23 15:35:28.000000', 'Nhiệt độ xuống thấp dưới 10°C', '🧣', 'Rét đậm rét hại', '2025-12-23 15:35:28.000000'),
(22, '#7F8C8D', '2025-12-23 15:35:28.000000', 'Đường phố hư hỏng do thời tiết', '🛣️', 'Đường sá hư hỏng', '2025-12-23 15:35:28.000000'),
(23, '#27AE60', '2025-12-23 15:35:28.000000', 'Cây cối bị đổ do gió mạnh hoặc mưa lớn', '🌳', 'Cây đổ', '2025-12-23 15:35:28.000000'),
(24, '#F1C40F', '2025-12-23 15:35:28.000000', 'Mất điện do thời tiết xấu', '⚡', 'Điện bị cắt', '2025-12-23 15:35:28.000000'),
(25, '#3498DB', '2025-12-23 15:35:28.000000', 'Thiếu nước do hạn hán hoặc lũ lụt', '🚰', 'Nước sinh hoạt thiếu', '2025-12-23 15:35:28.000000');

-- --------------------------------------------------------

--
-- Table structure for table `report_images`
--

CREATE TABLE `report_images` (
  `weather_reports_id` bigint(20) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `report_images`
--

INSERT INTO `report_images` (`weather_reports_id`, `image_url`) VALUES
(1, '/uploads/20251223225840076_b7e71bc417503b5aef520862cca2a18c.jpg'),
(2, 'https://picsum.photos/seed/20/800/600'),
(2, 'https://picsum.photos/seed/21/800/600'),
(3, 'https://picsum.photos/seed/30/800/600'),
(3, 'https://picsum.photos/seed/31/800/600'),
(3, 'https://picsum.photos/seed/32/800/600'),
(4, 'https://picsum.photos/seed/40/800/600'),
(4, 'https://picsum.photos/seed/41/800/600'),
(5, 'https://picsum.photos/seed/50/800/600'),
(6, 'https://picsum.photos/seed/60/800/600'),
(6, 'https://picsum.photos/seed/61/800/600'),
(7, 'https://picsum.photos/seed/70/800/600'),
(8, 'https://picsum.photos/seed/80/800/600'),
(8, 'https://picsum.photos/seed/81/800/600'),
(9, 'https://picsum.photos/seed/90/800/600'),
(9, 'https://picsum.photos/seed/91/800/600'),
(9, 'https://picsum.photos/seed/92/800/600'),
(10, 'https://picsum.photos/seed/100/800/600'),
(11, 'https://picsum.photos/seed/110/800/600'),
(12, 'https://picsum.photos/seed/120/800/600'),
(12, 'https://picsum.photos/seed/121/800/600'),
(13, 'https://picsum.photos/seed/130/800/600'),
(14, 'https://picsum.photos/seed/140/800/600'),
(14, 'https://picsum.photos/seed/141/800/600'),
(15, 'https://picsum.photos/seed/150/800/600'),
(16, 'https://picsum.photos/seed/160/800/600'),
(17, 'https://picsum.photos/seed/170/800/600'),
(18, 'https://picsum.photos/seed/180/800/600'),
(19, 'https://picsum.photos/seed/190/800/600'),
(19, 'https://picsum.photos/seed/191/800/600'),
(20, 'https://picsum.photos/seed/200/800/600'),
(21, 'https://picsum.photos/seed/210/800/600'),
(22, 'https://picsum.photos/seed/220/800/600'),
(23, 'https://picsum.photos/seed/230/800/600'),
(23, 'https://picsum.photos/seed/231/800/600'),
(24, 'https://picsum.photos/seed/240/800/600'),
(24, 'https://picsum.photos/seed/241/800/600'),
(24, 'https://picsum.photos/seed/242/800/600'),
(25, 'https://picsum.photos/seed/250/800/600'),
(26, 'https://picsum.photos/seed/260/800/600'),
(27, 'https://picsum.photos/seed/270/800/600'),
(28, 'https://picsum.photos/seed/280/800/600'),
(28, 'https://picsum.photos/seed/281/800/600'),
(29, 'https://picsum.photos/seed/290/800/600'),
(30, 'https://picsum.photos/seed/300/800/600'),
(30, 'https://picsum.photos/seed/301/800/600'),
(30, 'https://picsum.photos/seed/302/800/600'),
(31, 'https://picsum.photos/seed/310/800/600'),
(32, 'https://picsum.photos/seed/320/800/600'),
(33, 'https://picsum.photos/seed/330/800/600'),
(34, 'https://picsum.photos/seed/340/800/600'),
(35, 'https://picsum.photos/seed/350/800/600'),
(36, 'https://picsum.photos/seed/360/800/600'),
(37, 'https://picsum.photos/seed/370/800/600'),
(37, 'https://picsum.photos/seed/371/800/600'),
(38, 'https://picsum.photos/seed/380/800/600'),
(39, 'https://picsum.photos/seed/390/800/600'),
(40, 'https://picsum.photos/seed/400/800/600'),
(40, 'https://picsum.photos/seed/401/800/600'),
(41, 'https://picsum.photos/seed/410/800/600'),
(42, 'https://picsum.photos/seed/420/800/600'),
(43, 'https://picsum.photos/seed/430/800/600'),
(44, 'https://picsum.photos/seed/440/800/600'),
(44, 'https://picsum.photos/seed/441/800/600'),
(45, 'https://picsum.photos/seed/450/800/600'),
(46, 'https://picsum.photos/seed/460/800/600'),
(46, 'https://picsum.photos/seed/461/800/600'),
(47, 'https://picsum.photos/seed/470/800/600'),
(48, 'https://picsum.photos/seed/480/800/600'),
(49, 'https://picsum.photos/seed/490/800/600'),
(49, 'https://picsum.photos/seed/491/800/600'),
(50, 'https://picsum.photos/seed/500/800/600');

-- --------------------------------------------------------

--
-- Table structure for table `report_votes`
--

CREATE TABLE `report_votes` (
  `id` bigint(20) NOT NULL,
  `report_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `vote_type` enum('CONFIRM','REJECT') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `report_votes`
--

INSERT INTO `report_votes` (`id`, `report_id`, `user_id`, `vote_type`, `created_at`, `updated_at`) VALUES
(1, 2, 5, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 11 HOUR), DATE_SUB(NOW(), INTERVAL 11 HOUR)),
(2, 2, 6, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 10 HOUR), DATE_SUB(NOW(), INTERVAL 10 HOUR)),
(3, 2, 7, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 9 HOUR), DATE_SUB(NOW(), INTERVAL 9 HOUR)),
(4, 3, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 23 HOUR), DATE_SUB(NOW(), INTERVAL 23 HOUR)),
(5, 3, 13, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 22 HOUR), DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(6, 3, 14, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 21 HOUR), DATE_SUB(NOW(), INTERVAL 21 HOUR)),
(7, 3, 15, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 20 HOUR), DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(8, 3, 16, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 19 HOUR), DATE_SUB(NOW(), INTERVAL 19 HOUR)),
(9, 4, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 35 HOUR), DATE_SUB(NOW(), INTERVAL 35 HOUR)),
(10, 4, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 34 HOUR), DATE_SUB(NOW(), INTERVAL 34 HOUR)),
(11, 4, 13, 'REJECT', DATE_SUB(NOW(), INTERVAL 33 HOUR), DATE_SUB(NOW(), INTERVAL 33 HOUR)),
(12, 6, 4, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 47 HOUR), DATE_SUB(NOW(), INTERVAL 47 HOUR)),
(13, 6, 5, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 46 HOUR), DATE_SUB(NOW(), INTERVAL 46 HOUR)),
(14, 6, 7, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 45 HOUR), DATE_SUB(NOW(), INTERVAL 45 HOUR)),
(15, 6, 8, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 44 HOUR), DATE_SUB(NOW(), INTERVAL 44 HOUR)),
(16, 8, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 17 HOUR), DATE_SUB(NOW(), INTERVAL 17 HOUR)),
(17, 8, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 16 HOUR), DATE_SUB(NOW(), INTERVAL 16 HOUR)),
(18, 8, 13, 'REJECT', DATE_SUB(NOW(), INTERVAL 15 HOUR), DATE_SUB(NOW(), INTERVAL 15 HOUR)),
(19, 9, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 95 HOUR), DATE_SUB(NOW(), INTERVAL 95 HOUR)),
(20, 9, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 94 HOUR), DATE_SUB(NOW(), INTERVAL 94 HOUR)),
(21, 9, 13, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 93 HOUR), DATE_SUB(NOW(), INTERVAL 93 HOUR)),
(22, 9, 14, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 92 HOUR), DATE_SUB(NOW(), INTERVAL 92 HOUR)),
(23, 9, 15, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 91 HOUR), DATE_SUB(NOW(), INTERVAL 91 HOUR)),
(24, 12, 5, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 7 HOUR), DATE_SUB(NOW(), INTERVAL 7 HOUR)),
(25, 12, 6, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(26, 12, 7, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(27, 13, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 14 HOUR), DATE_SUB(NOW(), INTERVAL 14 HOUR)),
(28, 13, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 13 HOUR), DATE_SUB(NOW(), INTERVAL 13 HOUR)),
(29, 14, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 19 HOUR), DATE_SUB(NOW(), INTERVAL 19 HOUR)),
(30, 14, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 18 HOUR), DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(31, 15, 5, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 29 HOUR), DATE_SUB(NOW(), INTERVAL 29 HOUR)),
(32, 19, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 13 HOUR), DATE_SUB(NOW(), INTERVAL 13 HOUR)),
(33, 19, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 12 HOUR), DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(34, 19, 13, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 11 HOUR), DATE_SUB(NOW(), INTERVAL 11 HOUR)),
(35, 24, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 39 HOUR), DATE_SUB(NOW(), INTERVAL 39 HOUR)),
(36, 24, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 38 HOUR), DATE_SUB(NOW(), INTERVAL 38 HOUR)),
(37, 24, 13, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 37 HOUR), DATE_SUB(NOW(), INTERVAL 37 HOUR)),
(38, 24, 14, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 36 HOUR), DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(39, 24, 15, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 35 HOUR), DATE_SUB(NOW(), INTERVAL 35 HOUR)),
(40, 30, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 64 HOUR), DATE_SUB(NOW(), INTERVAL 64 HOUR)),
(41, 30, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 63 HOUR), DATE_SUB(NOW(), INTERVAL 63 HOUR)),
(42, 30, 13, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 62 HOUR), DATE_SUB(NOW(), INTERVAL 62 HOUR)),
(43, 30, 14, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 61 HOUR), DATE_SUB(NOW(), INTERVAL 61 HOUR)),
(44, 30, 15, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 60 HOUR), DATE_SUB(NOW(), INTERVAL 60 HOUR)),
(45, 40, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 79 HOUR), DATE_SUB(NOW(), INTERVAL 79 HOUR)),
(46, 40, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 78 HOUR), DATE_SUB(NOW(), INTERVAL 78 HOUR)),
(47, 40, 13, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 77 HOUR), DATE_SUB(NOW(), INTERVAL 77 HOUR)),
(48, 44, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 99 HOUR), DATE_SUB(NOW(), INTERVAL 99 HOUR)),
(49, 44, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 98 HOUR), DATE_SUB(NOW(), INTERVAL 98 HOUR)),
(50, 44, 13, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 97 HOUR), DATE_SUB(NOW(), INTERVAL 97 HOUR)),
(51, 44, 14, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 96 HOUR), DATE_SUB(NOW(), INTERVAL 96 HOUR)),
(52, 44, 15, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 95 HOUR), DATE_SUB(NOW(), INTERVAL 95 HOUR)),
(53, 49, 11, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 124 HOUR), DATE_SUB(NOW(), INTERVAL 124 HOUR)),
(54, 49, 12, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 123 HOUR), DATE_SUB(NOW(), INTERVAL 123 HOUR)),
(55, 49, 13, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 122 HOUR), DATE_SUB(NOW(), INTERVAL 122 HOUR)),
(56, 49, 14, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 121 HOUR), DATE_SUB(NOW(), INTERVAL 121 HOUR)),
(57, 49, 15, 'CONFIRM', DATE_SUB(NOW(), INTERVAL 120 HOUR), DATE_SUB(NOW(), INTERVAL 120 HOUR)),
(58, 5, 11, 'REJECT', DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(59, 11, 12, 'REJECT', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 2 HOUR)),
(60, 16, 11, 'REJECT', DATE_SUB(NOW(), INTERVAL 9 HOUR), DATE_SUB(NOW(), INTERVAL 9 HOUR)),
(61, 18, 12, 'REJECT', DATE_SUB(NOW(), INTERVAL 4 HOUR), DATE_SUB(NOW(), INTERVAL 4 HOUR)),
(62, 27, 11, 'REJECT', DATE_SUB(NOW(), INTERVAL 1 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','USER') NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `ward` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `address`, `created_at`, `district`, `email`, `enabled`, `full_name`, `password`, `phone`, `role`, `updated_at`, `username`, `ward`) VALUES
(1, NULL, '2025-12-23 15:35:28.000000', NULL, 'admin@weather.com', b'1', 'Administrator', '$2a$10$0oNcUixUWbAWPMiTGbrhl.W5RXRaMsWVtJXPN4Iu.Ltb2Z2eZ4Gby', NULL, 'ADMIN', '2025-12-23 15:35:28.000000', 'admin', NULL),
(2, 'Lat: 10.762942, Lng: 106.701292', '2025-12-23 15:42:39.000000', NULL, '22110095@student.hcmute.edu.vn', b'1', 'Phan Hoàng An', '$2a$10$bbkCD46Pneh8KjxLiQJVPOS6Pgg6xiqLSad5yQtmKE2BafCitx4pO', '0913869208', 'USER', '2025-12-23 15:42:39.000000', 'bob', NULL),
(3, '456 Đường Trần Hưng Đạo', '2025-12-24 03:40:25.000000', 'Quận 1', 'admin1@weather.vn', b'1', 'Nguyễn Văn Admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0901000002', 'ADMIN', '2025-12-24 03:40:25.000000', 'admin1', 'Bến Nghé'),
(4, '12 Phố Hàng Bông', '2025-11-24 03:40:25.000000', 'Hoàn Kiếm', 'nguyenvana@email.com', b'1', 'Nguyễn Văn A', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0912345678', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_001', 'Hàng Gai'),
(5, '25 Phố Lý Quốc Sư', '2025-11-26 03:40:25.000000', 'Hoàn Kiếm', 'tranthib@email.com', b'1', 'Trần Thị B', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0912345679', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_002', 'Lý Thái Tổ'),
(6, '89 Đường Bà Triệu', '2025-11-29 03:40:25.000000', 'Hai Bà Trưng', 'levanc@email.com', b'1', 'Lê Văn C', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0912345680', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_003', 'Lê Đại Hành'),
(7, '156 Phố Tôn Đức Thắng', '2025-12-02 03:40:25.000000', 'Đống Đa', 'phamthid@email.com', b'1', 'Phạm Thị D', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0912345681', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_004', 'Quốc Tử Giám'),
(8, '78 Đường Giải Phóng', '2025-12-04 03:40:25.000000', 'Hoàng Mai', 'hoangvane@email.com', b'1', 'Hoàng Văn E', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0912345682', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_005', 'Giáp Bát'),
(9, '45 Phố Hàng Đào', '2025-12-06 03:40:25.000000', 'Hoàn Kiếm', 'dangthif@email.com', b'1', 'Đặng Thị F', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0912345683', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_006', 'Hàng Đào'),
(10, '67 Đường Kim Mã', '2025-12-09 03:40:25.000000', 'Ba Đình', 'vuongvang@email.com', b'1', 'Vương Văn G', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0912345684', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_007', 'Kim Mã'),
(11, '123 Nguyễn Huệ', '2025-11-27 03:40:25.000000', 'Quận 1', 'nguyenvietf@email.com', b'1', 'Nguyễn Việt F', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654321', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_001', 'Bến Nghé'),
(12, '456 Đường Lê Lợi', '2025-11-30 03:40:25.000000', 'Quận 1', 'trantieng@email.com', b'1', 'Trần Tiến G', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654322', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_002', 'Đa Kao'),
(13, '789 Phố Tôn Đức Thắng', '2025-12-03 03:40:25.000000', 'Quận 1', 'levanh@email.com', b'1', 'Lê Văn H', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654323', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_003', 'Nguyễn Thái Bình'),
(14, '321 Đường Võ Thị Sáu', '2025-12-05 03:40:25.000000', 'Quận 3', 'phamthui@email.com', b'1', 'Phạm Thu I', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654324', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_004', 'Võ Thị Sáu'),
(15, '654 Đường Nguyễn Văn Cừ', '2025-12-07 03:40:25.000000', 'Quận 5', 'hoangminhj@email.com', b'1', 'Hoàng Minh J', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654325', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_005', 'Phường 14'),
(16, '987 Đường Cách Mạng Tháng 8', '2025-12-10 03:40:25.000000', 'Quận 10', 'dangthank@email.com', b'1', 'Đặng Thanh K', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654326', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_006', 'Phường 1'),
(17, '147 Đường Hồng Bàng', '2025-12-12 03:40:25.000000', 'Quận 5', 'buithil@email.com', b'1', 'Bùi Thị L', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654327', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_007', 'Phường 13'),
(18, '234 Đường Pasteur', '2025-12-14 03:40:25.000000', 'Quận 3', 'nguyenvanduc@email.com', b'1', 'Nguyễn Văn Đức', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654328', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_008', 'Võ Thị Sáu'),
(19, '567 Đường Nguyễn Đình Chiểu', '2025-12-16 03:40:25.000000', 'Quận 3', 'tranthiem@email.com', b'1', 'Trần Thị Em', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654329', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_009', 'Võ Thị Sáu'),
(20, '890 Đường Lê Văn Sỹ', '2025-12-18 03:40:25.000000', 'Quận 3', 'levanphu@email.com', b'1', 'Lê Văn Phú', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0987654330', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_010', 'Phường 14'),
(21, '123 Đường Bạch Đằng', '2025-12-01 03:40:25.000000', 'Hải Châu', 'nguyenducm@email.com', b'1', 'Nguyễn Đức M', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0923456789', 'USER', '2025-12-24 03:40:25.000000', 'user_dn_001', 'Hải Châu'),
(22, '456 Đường Trần Phú', '2025-12-08 03:40:25.000000', 'Hải Châu', 'tranhoan@email.com', b'1', 'Trần Hoa N', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0923456790', 'USER', '2025-12-24 03:40:25.000000', 'user_dn_002', 'Phước Ninh'),
(23, '789 Đường Nguyễn Văn Linh', '2025-12-11 03:40:25.000000', 'Thanh Khê', 'leminho@email.com', b'1', 'Lê Minh O', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0923456791', 'USER', '2025-12-24 03:40:25.000000', 'user_dn_003', 'Thanh Khê Tây'),
(24, '123 Đường Lạch Tray', '2025-12-13 03:40:25.000000', 'Ngô Quyền', 'phamtup@email.com', b'1', 'Phạm Tú P', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0934567890', 'USER', '2025-12-24 03:40:25.000000', 'user_hp_001', 'Máy Chai'),
(25, '123 Đường Trần Phú', '2025-12-15 03:40:25.000000', 'Thành phố Vũng Tàu', 'danghair@email.com', b'1', 'Đặng Hải R', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0945678901', 'USER', '2025-12-24 03:40:25.000000', 'user_vt_001', 'Thắng Tam'),
(26, '123 Đường Hòa Bình', '2025-12-17 03:40:25.000000', 'Ninh Kiều', 'nguyenhuongt@email.com', b'1', 'Nguyễn Hương T', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0956789012', 'USER', '2025-12-24 03:40:25.000000', 'user_ct_001', 'Cái Khế'),
(27, '123 Đường Lê Lợi', '2025-12-19 03:40:25.000000', 'Huế', 'tranbinhu@email.com', b'1', 'Trần Bình U', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0967890123', 'USER', '2025-12-24 03:40:25.000000', 'user_hue_001', 'Phú Hội'),
(28, '123 Đường Trần Phú', '2025-12-20 03:40:25.000000', 'Nha Trang', 'lethuyv@email.com', b'1', 'Lê Thủy V', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0978901234', 'USER', '2025-12-24 03:40:25.000000', 'user_nt_001', 'Vĩnh Hải'),
(29, '123 Đường Trần Hưng Đạo', '2025-12-21 03:40:25.000000', 'Đà Lạt', 'phamhongw@email.com', b'1', 'Phạm Hồng W', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0989012345', 'USER', '2025-12-24 03:40:25.000000', 'user_dl_001', 'Phường 1'),
(31, '45 Phố Hàng Đào', '2025-11-28 03:40:25.000000', 'Hoàn Kiếm', 'user008_hn@email.com', b'1', 'Nguyễn Thị Anh', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0913000001', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_008', 'Hàng Đào'),
(32, '67 Đường Kim Mã', '2025-11-30 03:40:25.000000', 'Ba Đình', 'user009_hn@email.com', b'1', 'Trần Văn Bình', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0913000002', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_009', 'Kim Mã'),
(33, '123 Đường Nguyễn Thị Minh Khai', '2025-12-02 03:40:25.000000', 'Quận 3', 'user011_hcm@email.com', b'1', 'Phạm Thị Giang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0989000001', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_011', 'Đa Kao'),
(34, '456 Đường Điện Biên Phủ', '2025-12-04 03:40:25.000000', 'Quận Bình Thạnh', 'user012_hcm@email.com', b'1', 'Hoàng Văn Hải', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0989000002', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_012', 'Phường 25'),
(35, '789 Đường Xô Viết Nghệ Tĩnh', '2025-12-06 03:40:25.000000', 'Quận Bình Thạnh', 'user013_hcm@email.com', b'1', 'Đặng Thị Hoa', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0989000003', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_013', 'Phường 21'),
(36, '321 Đường Tân Hương', '2025-12-08 03:40:25.000000', 'Quận Tân Phú', 'user014_hcm@email.com', b'1', 'Vương Văn Khang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0989000004', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_014', 'Tân Sơn Nhì'),
(37, '654 Đường Trường Chinh', '2025-12-10 03:40:25.000000', 'Quận Tân Bình', 'user015_hcm@email.com', b'1', 'Nguyễn Văn Lâm', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0989000005', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_015', 'Phường 4'),
(38, '234 Đường Lê Duẩn', '2025-12-12 03:40:25.000000', 'Hải Châu', 'user004_dn@email.com', b'1', 'Nguyễn Thị Linh', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0924000001', 'USER', '2025-12-24 03:40:25.000000', 'user_dn_004', 'Thạch Thang'),
(39, '567 Đường Phan Đăng Lưu', '2025-12-14 03:40:25.000000', 'Hải Châu', 'user005_dn@email.com', b'1', 'Trần Văn Mạnh', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0924000002', 'USER', '2025-12-24 03:40:25.000000', 'user_dn_005', 'Nam Dương'),
(40, '234 Đường Điện Biên Phủ', '2025-12-16 03:40:25.000000', 'Ngô Quyền', 'user002_hp@email.com', b'1', 'Lê Thị Nga', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0935000001', 'USER', '2025-12-24 03:40:25.000000', 'user_hp_002', 'Cầu Đất'),
(41, '234 Đường Hoàng Hoa Thám', '2025-12-18 03:40:25.000000', 'Thành phố Vũng Tàu', 'user002_vt@email.com', b'1', 'Hoàng Thị Phượng', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0946000001', 'USER', '2025-12-24 03:40:25.000000', 'user_vt_002', 'Thắng Tam'),
(42, '234 Đường 3 Tháng 2', '2025-12-20 03:40:25.000000', 'Ninh Kiều', 'user002_ct@email.com', b'1', 'Đặng Văn Quang', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0957000001', 'USER', '2025-12-24 03:40:25.000000', 'user_ct_002', 'An Hòa'),
(43, '234 Đường Nguyễn Huệ', '2025-12-22 03:40:25.000000', 'Huế', 'user002_hue@email.com', b'1', 'Vương Thị Quyên', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0968000001', 'USER', '2025-12-24 03:40:25.000000', 'user_hue_002', 'Phú Hội'),
(44, '234 Đường Thống Nhất', '2025-12-23 03:40:25.000000', 'Nha Trang', 'user002_nt@email.com', b'1', 'Nguyễn Văn Rạng', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0979000001', 'USER', '2025-12-24 03:40:25.000000', 'user_nt_002', 'Vĩnh Phước'),
(45, '234 Đường Phan Đình Phùng', '2025-12-24 03:40:25.000000', 'Đà Lạt', 'user002_dl@email.com', b'1', 'Trần Thị Sương', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0980000001', 'USER', '2025-12-24 03:40:25.000000', 'user_dl_002', 'Phường 1'),
(46, '234 Đường Nguyễn Tất Thành', '2025-12-24 03:40:25.000000', 'Buôn Ma Thuột', 'user001_bmt@email.com', b'1', 'Lê Văn Tấn', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0991000001', 'USER', '2025-12-24 03:40:25.000000', 'user_bmt_001', 'Tân An'),
(47, '234 Đường Ngô Mây', '2025-12-24 03:40:25.000000', 'Quy Nhơn', 'user001_qn@email.com', b'1', 'Phạm Thị Uyên', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0912000001', 'USER', '2025-12-24 03:40:25.000000', 'user_qn_001', 'Lê Lợi'),
(48, '234 Đường Phạm Văn Đồng', '2025-12-24 03:40:25.000000', 'Pleiku', 'user001_pk@email.com', b'1', 'Hoàng Văn Việt', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0913000003', 'USER', '2025-12-24 03:40:25.000000', 'user_pk_001', 'Diên Hồng'),
(49, '123 Phố Hàng Mã', '2025-12-24 03:40:25.000000', 'Hoàn Kiếm', 'user010_hn@email.com', b'1', 'Đặng Thị Xuân', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0913000004', 'USER', '2025-12-24 03:40:25.000000', 'user_hn_010', 'Hàng Mã'),
(50, '567 Đường Trường Chinh', '2025-12-24 03:40:25.000000', 'Quận Tân Bình', 'user016_hcm@email.com', b'1', 'Vương Văn Yến', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7itYdLB9S', '0989000006', 'USER', '2025-12-24 03:40:25.000000', 'user_hcm_016', 'Phường 4');

-- --------------------------------------------------------

--
-- Table structure for table `weather_alerts`
--

CREATE TABLE `weather_alerts` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `level` enum('CRITICAL','DANGER','INFO','WARNING') DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `message` text NOT NULL,
  `radius` double DEFAULT NULL,
  `start_time` datetime(6) NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `admin_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `weather_data`
--

CREATE TABLE `weather_data` (
  `id` bigint(20) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `cloudiness` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `feels_like` double DEFAULT NULL,
  `humidity` double DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `main_weather` varchar(255) DEFAULT NULL,
  `pressure` double DEFAULT NULL,
  `rain_volume` double DEFAULT NULL,
  `recorded_at` datetime(6) NOT NULL,
  `snow_volume` double DEFAULT NULL,
  `temperature` double NOT NULL,
  `visibility` double DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `wind_direction` double DEFAULT NULL,
  `wind_speed` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `weather_data`
--

INSERT INTO `weather_data` (`id`, `city`, `cloudiness`, `created_at`, `description`, `district`, `feels_like`, `humidity`, `icon`, `latitude`, `longitude`, `main_weather`, `pressure`, `rain_volume`, `recorded_at`, `snow_volume`, `temperature`, `visibility`, `ward`, `wind_direction`, `wind_speed`) VALUES
(1, 'Hà Nội', 49, '2025-12-23 15:35:28.000000', 'Có mây', 'Hoàn Kiếm', 20.5, 53, '☀️', 21.0285, 105.8542, 'Sunny', 1016.8, 0, '2025-12-23 15:35:28.000000', NULL, 21.3, 7.5, 'Tràng Tiền', 353, 2.6),
(2, 'Hồ Chí Minh', 94, '2025-12-23 15:35:28.000000', 'Có mây', 'Quận 1', 25.8, 64, '☀️', 10.8231, 106.6297, 'Sunny', 1018.6, 0, '2025-12-23 15:35:28.000000', NULL, 26.3, 6.3, 'Bến Nghé', 312, 4.3),
(3, 'Đà Nẵng', 28, '2025-12-23 15:35:28.000000', 'Có mây', 'Hải Châu', 33.4, 67, '☀️', 16.0544, 108.2022, 'Sunny', 1013.9, 0, '2025-12-23 15:35:28.000000', NULL, 34, 8.1, 'Hải Châu', 121, 5),
(4, 'Hải Phòng', 75, '2025-12-23 15:35:28.000000', 'Có mây', 'Hồng Bàng', 26.1, 76, '☁️', 20.8449, 106.6881, 'Clouds', 1014.8, 0, '2025-12-23 15:35:28.000000', NULL, 27.5, 7.8, 'Máy Chai', 301, 2.3),
(5, 'Vũng Tàu', 71, '2025-12-23 15:35:28.000000', 'Nắng nóng', 'Thành phố Vũng Tàu', 29.7, 70, '☀️', 10.346, 107.0843, 'Clear', 1019.1, 0, '2025-12-23 15:35:28.000000', NULL, 28.3, 8.7, 'Thắng Tam', 340, 4.5),
(6, NULL, 70, '2025-12-23 15:35:40.000000', 'Nhiều mây ☁️', NULL, 24.8, 95, 'http://openweathermap.org/img/w/04n.png', 10.929317618914864, 108.11117497163362, 'Overcast', 1009.1, 0, '2025-12-23 15:35:40.000000', NULL, 24.8, 24.14, NULL, 320, 0.78),
(7, 'Việt Nam', 35, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 21.4, 86, '☁️', 10.929317618914864, 108.11117497163362, 'Clouds', 1018.1, 0, '2025-12-16 15:35:40.000000', NULL, 20.7, 11, NULL, 69, 4.4),
(8, 'Việt Nam', 37, '2025-12-23 15:35:40.000000', 'Nắng', NULL, 18.9, 61, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1014.2, 0, '2025-12-16 21:35:40.000000', NULL, 20, 12.5, NULL, 323, 4.5),
(9, 'Việt Nam', 0, '2025-12-23 15:35:40.000000', 'Nắng', NULL, 33.2, 70, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1019.7, 0, '2025-12-17 03:35:40.000000', NULL, 32.8, 6.2, NULL, 341, 2),
(10, 'Việt Nam', 80, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 28.6, 64, '☀️', 10.929317618914864, 108.11117497163362, 'Clear', 1014.3, 0, '2025-12-17 09:35:40.000000', NULL, 27.5, 12.3, NULL, 105, 3.8),
(11, 'Việt Nam', 70, '2025-12-23 15:35:40.000000', 'Trời quang', NULL, 19.4, 62, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1013.1, 0, '2025-12-17 15:35:40.000000', NULL, 20, 10.8, NULL, 224, 4),
(12, 'Việt Nam', 26, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 18.5, 68, '☁️', 10.929317618914864, 108.11117497163362, 'Clouds', 1017.8, 0, '2025-12-17 21:35:40.000000', NULL, 20, 10.6, NULL, 228, 4.6),
(13, 'Việt Nam', 16, '2025-12-23 15:35:40.000000', 'Nắng nóng', NULL, 32.7, 75, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1016.1, 0, '2025-12-18 03:35:40.000000', NULL, 32.6, 6.7, NULL, 228, 4.5),
(14, 'Việt Nam', 65, '2025-12-23 15:35:40.000000', 'Nắng nóng', NULL, 27, 51, '☁️', 10.929317618914864, 108.11117497163362, 'Clouds', 1013.9, 0, '2025-12-18 09:35:40.000000', NULL, 26.7, 8.4, NULL, 196, 4.2),
(15, 'Việt Nam', 55, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 19.9, 74, '☁️', 10.929317618914864, 108.11117497163362, 'Clouds', 1016.3, 0, '2025-12-18 15:35:40.000000', NULL, 21.3, 9.5, NULL, 342, 1.2),
(16, 'Việt Nam', 62, '2025-12-23 15:35:40.000000', 'Trời quang', NULL, 22.4, 82, '☁️', 10.929317618914864, 108.11117497163362, 'Clouds', 1018.4, 0, '2025-12-18 21:35:40.000000', NULL, 21.2, 14.7, NULL, 7, 1.8),
(17, 'Việt Nam', 71, '2025-12-23 15:35:40.000000', 'Nắng', NULL, 32.4, 66, '☀️', 10.929317618914864, 108.11117497163362, 'Clear', 1015.9, 0, '2025-12-19 03:35:40.000000', NULL, 33, 12.2, NULL, 110, 2.3),
(18, 'Việt Nam', 33, '2025-12-23 15:35:40.000000', 'Nắng', NULL, 27.2, 69, '☀️', 10.929317618914864, 108.11117497163362, 'Clear', 1018.4, 0, '2025-12-19 09:35:40.000000', NULL, 27.2, 11.9, NULL, 139, 2.5),
(19, 'Việt Nam', 69, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 20, 69, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1017.5, 0, '2025-12-19 15:35:40.000000', NULL, 20.3, 6.6, NULL, 37, 3.7),
(20, 'Việt Nam', 21, '2025-12-23 15:35:40.000000', 'Nắng nóng', NULL, 19.1, 61, '☁️', 10.929317618914864, 108.11117497163362, 'Clouds', 1017.8, 0, '2025-12-19 21:35:40.000000', NULL, 20, 14.8, NULL, 337, 1.5),
(21, 'Việt Nam', 30, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 33.6, 73, '☀️', 10.929317618914864, 108.11117497163362, 'Clear', 1018.3, 0, '2025-12-20 03:35:40.000000', NULL, 32.4, 14.2, NULL, 326, 5),
(22, 'Việt Nam', 71, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 28.1, 58, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1014.1, 0, '2025-12-20 09:35:40.000000', NULL, 28.6, 9.2, NULL, 223, 2.1),
(23, 'Việt Nam', 43, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 21.3, 78, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1013.3, 0, '2025-12-20 15:35:40.000000', NULL, 20.7, 6.6, NULL, 20, 3.7),
(24, 'Việt Nam', 41, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 20.2, 71, '☁️', 10.929317618914864, 108.11117497163362, 'Clouds', 1015.1, 0, '2025-12-20 21:35:40.000000', NULL, 20, 7.2, NULL, 114, 3.8),
(25, 'Việt Nam', 32, '2025-12-23 15:35:40.000000', 'Nắng nóng', NULL, 32, 67, '☁️', 10.929317618914864, 108.11117497163362, 'Clouds', 1019.9, 0, '2025-12-21 03:35:40.000000', NULL, 31.6, 9.6, NULL, 76, 4.3),
(26, 'Việt Nam', 27, '2025-12-23 15:35:40.000000', 'Nắng', NULL, 25.7, 55, '☁️', 10.929317618914864, 108.11117497163362, 'Clouds', 1017.9, 0, '2025-12-21 09:35:40.000000', NULL, 26.6, 7.2, NULL, 100, 3.2),
(27, 'Việt Nam', 33, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 19.3, 88, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1017.8, 0, '2025-12-21 15:35:40.000000', NULL, 20.7, 6.7, NULL, 344, 3.9),
(28, 'Việt Nam', 15, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 20.2, 84, '☀️', 10.929317618914864, 108.11117497163362, 'Clear', 1017.5, 0, '2025-12-21 21:35:40.000000', NULL, 21.5, 5.1, NULL, 288, 3.4),
(29, 'Việt Nam', 27, '2025-12-23 15:35:40.000000', 'Nắng', NULL, 30.7, 52, '☀️', 10.929317618914864, 108.11117497163362, 'Clear', 1019.1, 0, '2025-12-22 03:35:40.000000', NULL, 31.8, 11.7, NULL, 352, 3.4),
(30, 'Việt Nam', 78, '2025-12-23 15:35:40.000000', 'Có mây', NULL, 26.9, 77, '☀️', 10.929317618914864, 108.11117497163362, 'Clear', 1013.2, 0, '2025-12-22 09:35:40.000000', NULL, 27.4, 7.9, NULL, 11, 1.4),
(31, 'Việt Nam', 72, '2025-12-23 15:35:40.000000', 'Nắng', NULL, 20.7, 68, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1015.1, 0, '2025-12-22 15:35:40.000000', NULL, 21.4, 10.5, NULL, 145, 3.7),
(32, 'Việt Nam', 72, '2025-12-23 15:35:40.000000', 'Nắng nóng', NULL, 19.6, 88, '☀️', 10.929317618914864, 108.11117497163362, 'Sunny', 1018.1, 0, '2025-12-22 21:35:40.000000', NULL, 20.6, 10.7, NULL, 327, 1.9),
(33, 'Việt Nam', 70, '2025-12-23 15:35:40.000000', 'Trời quang', NULL, 32, 65, '☀️', 10.929317618914864, 108.11117497163362, 'Clear', 1013.2, 0, '2025-12-23 03:35:40.000000', NULL, 32.2, 14.8, NULL, 332, 3.1),
(34, 'Việt Nam', 82, '2025-12-23 15:35:40.000000', 'Nắng', NULL, 27.1, 75, '☀️', 10.929317618914864, 108.11117497163362, 'Clear', 1014, 0, '2025-12-23 09:35:40.000000', NULL, 27.4, 5.7, NULL, 48, 4.6),
(35, NULL, 0, '2025-12-23 15:43:07.000000', 'Có mây ⛅', NULL, 20.1, 92, 'http://openweathermap.org/img/w/02n.png', 16.0583, 106.2772, 'Partly Cloudy', 1012.6, 0, '2025-12-23 15:43:07.000000', NULL, 20.1, 24.14, NULL, 355, 1.1),
(36, 'Hà Nội', 84, '2025-12-23 15:51:17.000000', 'Nắng', 'Hoàn Kiếm', 26.8, 66, '☀️', 21.0285, 105.8542, 'Sunny', 1015.7, 0, '2025-12-23 15:51:17.000000', NULL, 25.9, 5.3, 'Tràng Tiền', 290, 1.8),
(37, 'Hồ Chí Minh', 64, '2025-12-23 15:51:17.000000', 'Có mây', 'Quận 1', 19.8, 65, '☀️', 10.8231, 106.6297, 'Sunny', 1018.2, 0, '2025-12-23 15:51:17.000000', NULL, 20.1, 10.3, 'Bến Nghé', 223, 3.1),
(38, 'Đà Nẵng', 26, '2025-12-23 15:51:17.000000', 'Có mây', 'Hải Châu', 31, 63, '☀️', 16.0544, 108.2022, 'Clear', 1016.8, 0, '2025-12-23 15:51:17.000000', NULL, 31.8, 7.2, 'Hải Châu', 173, 1.7),
(39, 'Hải Phòng', 92, '2025-12-23 15:51:17.000000', 'Nắng nóng', 'Hồng Bàng', 30.5, 55, '☀️', 20.8449, 106.6881, 'Sunny', 1017.7, 0, '2025-12-23 15:51:17.000000', NULL, 31.1, 8.2, 'Máy Chai', 82, 4.7),
(40, 'Vũng Tàu', 15, '2025-12-23 15:51:17.000000', 'Nắng nóng', 'Thành phố Vũng Tàu', 22.3, 59, '☀️', 10.346, 107.0843, 'Clear', 1018.9, 0, '2025-12-23 15:51:17.000000', NULL, 22.7, 12, 'Thắng Tam', 85, 3),
(41, 'Hà Nội', 2, '2025-12-23 15:54:29.000000', 'Trời quang', 'Hoàn Kiếm', 33.2, 53, '☁️', 21.0285, 105.8542, 'Clouds', 1019.6, 0, '2025-12-23 15:54:29.000000', NULL, 32.7, 14.8, 'Tràng Tiền', 316, 3),
(42, 'Hồ Chí Minh', 24, '2025-12-23 15:54:29.000000', 'Có mây', 'Quận 1', 28.5, 58, '☁️', 10.8231, 106.6297, 'Clouds', 1015.8, 0, '2025-12-23 15:54:29.000000', NULL, 29.8, 9.1, 'Bến Nghé', 316, 3.1),
(43, 'Đà Nẵng', 52, '2025-12-23 15:54:29.000000', 'Nắng', 'Hải Châu', 22.2, 62, '☀️', 16.0544, 108.2022, 'Clear', 1019.5, 0, '2025-12-23 15:54:29.000000', NULL, 23.7, 9.1, 'Hải Châu', 148, 3.6),
(44, 'Hải Phòng', 9, '2025-12-23 15:54:29.000000', 'Nắng', 'Hồng Bàng', 34, 57, '☀️', 20.8449, 106.6881, 'Sunny', 1018.7, 0, '2025-12-23 15:54:29.000000', NULL, 34, 12.2, 'Máy Chai', 127, 1.3),
(45, 'Vũng Tàu', 97, '2025-12-23 15:54:29.000000', 'Trời quang', 'Thành phố Vũng Tàu', 28.5, 65, '☀️', 10.346, 107.0843, 'Sunny', 1019.5, 0, '2025-12-23 15:54:29.000000', NULL, 28.1, 12.7, 'Thắng Tam', 107, 2.4),
(46, 'Hà Nội', 44, '2025-12-23 15:56:11.000000', 'Nắng nóng', 'Hoàn Kiếm', 35, 67, '☀️', 21.0285, 105.8542, 'Clear', 1013.7, 0, '2025-12-23 15:56:11.000000', NULL, 33.9, 13.4, 'Tràng Tiền', 43, 2.3),
(47, 'Hồ Chí Minh', 88, '2025-12-23 15:56:11.000000', 'Nắng', 'Quận 1', 30.3, 54, '☀️', 10.8231, 106.6297, 'Sunny', 1018.3, 0, '2025-12-23 15:56:11.000000', NULL, 30.9, 6.4, 'Bến Nghé', 293, 5),
(48, 'Đà Nẵng', 91, '2025-12-23 15:56:11.000000', 'Có mây', 'Hải Châu', 33.8, 69, '☀️', 16.0544, 108.2022, 'Sunny', 1013.3, 0, '2025-12-23 15:56:11.000000', NULL, 34.3, 14.3, 'Hải Châu', 303, 2.2),
(49, 'Hải Phòng', 19, '2025-12-23 15:56:11.000000', 'Nắng', 'Hồng Bàng', 35.2, 64, '☀️', 20.8449, 106.6881, 'Clear', 1013.9, 0, '2025-12-23 15:56:11.000000', NULL, 34.5, 8, 'Máy Chai', 8, 4.7),
(50, 'Vũng Tàu', 54, '2025-12-23 15:56:11.000000', 'Trời quang', 'Thành phố Vũng Tàu', 28.2, 57, '☀️', 10.346, 107.0843, 'Clear', 1017.3, 0, '2025-12-23 15:56:11.000000', NULL, 26.8, 14.7, 'Thắng Tam', 192, 4.7),
(51, 'Hà Nội', 89, '2025-12-23 18:03:07.000000', 'Có mây', 'Hoàn Kiếm', 31.2, 53, '☀️', 21.0285, 105.8542, 'Sunny', 1015.7, 0, '2025-12-23 18:03:07.000000', NULL, 29.7, 8, 'Tràng Tiền', 89, 3.7),
(52, 'Hồ Chí Minh', 99, '2025-12-23 18:03:07.000000', 'Trời quang', 'Quận 1', 28.5, 68, '☁️', 10.8231, 106.6297, 'Clouds', 1019.3, 0, '2025-12-23 18:03:07.000000', NULL, 28.5, 13, 'Bến Nghé', 152, 5),
(53, 'Đà Nẵng', 63, '2025-12-23 18:03:07.000000', 'Nắng', 'Hải Châu', 31.9, 51, '☀️', 16.0544, 108.2022, 'Clear', 1018.9, 0, '2025-12-23 18:03:07.000000', NULL, 33.1, 11.7, 'Hải Châu', 150, 4.3),
(54, 'Hải Phòng', 99, '2025-12-23 18:03:07.000000', 'Nắng', 'Hồng Bàng', 25.3, 70, '☀️', 20.8449, 106.6881, 'Sunny', 1015.3, 0, '2025-12-23 18:03:07.000000', NULL, 23.8, 6.4, 'Máy Chai', 28, 2),
(55, 'Vũng Tàu', 41, '2025-12-23 18:03:07.000000', 'Nắng', 'Thành phố Vũng Tàu', 31.4, 54, '☀️', 10.346, 107.0843, 'Sunny', 1015.8, 0, '2025-12-23 18:03:07.000000', NULL, 32.4, 5.4, 'Thắng Tam', 119, 3.7),
(56, NULL, 100, '2025-12-23 18:53:37.000000', 'Nhiều mây ☁️', NULL, 18.9, 94, 'http://openweathermap.org/img/w/04n.png', 12.239405831840646, 108.46091678752846, 'Overcast', 1012.3, 0, '2025-12-23 18:53:37.000000', NULL, 18.9, 0.24, NULL, 90, 1.9),
(57, 'Việt Nam', 99, '2025-12-23 18:53:37.000000', 'Nắng nóng', NULL, 20.6, 70, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1015.1, 0, '2025-12-16 18:53:37.000000', NULL, 20.4, 6.2, NULL, 136, 3.9),
(58, 'Việt Nam', 42, '2025-12-23 18:53:37.000000', 'Có mây', NULL, 25.1, 58, '☀️', 12.239405831840646, 108.46091678752846, 'Clear', 1013.4, 0, '2025-12-17 00:53:37.000000', NULL, 24.2, 7.3, NULL, 166, 3),
(59, 'Việt Nam', 86, '2025-12-23 18:53:37.000000', 'Nắng nóng', NULL, 34.2, 79, '☁️', 12.239405831840646, 108.46091678752846, 'Clouds', 1014.7, 0, '2025-12-17 06:53:37.000000', NULL, 33, 14.1, NULL, 257, 4.3),
(60, 'Việt Nam', 70, '2025-12-23 18:53:37.000000', 'Nắng nóng', NULL, 19.9, 78, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1017.5, 0, '2025-12-17 12:53:37.000000', NULL, 21.4, 5, NULL, 235, 3.3),
(61, 'Việt Nam', 65, '2025-12-23 18:53:37.000000', 'Nắng nóng', NULL, 20.1, 81, '☀️', 12.239405831840646, 108.46091678752846, 'Clear', 1013.6, 0, '2025-12-17 18:53:37.000000', NULL, 20, 13.1, NULL, 277, 1.5),
(62, 'Việt Nam', 79, '2025-12-23 18:53:37.000000', 'Nắng nóng', NULL, 25.8, 61, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1013, 0, '2025-12-18 00:53:37.000000', NULL, 24.6, 7.5, NULL, 54, 1.4),
(63, 'Việt Nam', 39, '2025-12-23 18:53:37.000000', 'Nắng nóng', NULL, 36.2, 77, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1018.1, 0, '2025-12-18 06:53:37.000000', NULL, 34.9, 8.5, NULL, 69, 2.9),
(64, 'Việt Nam', 28, '2025-12-23 18:53:37.000000', 'Có mây', NULL, 19.6, 76, '☀️', 12.239405831840646, 108.46091678752846, 'Clear', 1018.5, 0, '2025-12-18 12:53:37.000000', NULL, 20.9, 5.7, NULL, 341, 2.4),
(65, 'Việt Nam', 27, '2025-12-23 18:53:37.000000', 'Trời quang', NULL, 21.4, 74, '☁️', 12.239405831840646, 108.46091678752846, 'Clouds', 1013.8, 0, '2025-12-18 18:53:37.000000', NULL, 21.3, 7.5, NULL, 291, 1.4),
(66, 'Việt Nam', 78, '2025-12-23 18:53:37.000000', 'Có mây', NULL, 26.2, 73, '☀️', 12.239405831840646, 108.46091678752846, 'Clear', 1019.6, 0, '2025-12-19 00:53:37.000000', NULL, 25.1, 14.5, NULL, 196, 3.2),
(67, 'Việt Nam', 16, '2025-12-23 18:53:37.000000', 'Có mây', NULL, 33.2, 63, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1015.6, 0, '2025-12-19 06:53:37.000000', NULL, 33.7, 11, NULL, 253, 4.3),
(68, 'Việt Nam', 66, '2025-12-23 18:53:37.000000', 'Nắng', NULL, 20.9, 70, '☁️', 12.239405831840646, 108.46091678752846, 'Clouds', 1016.5, 0, '2025-12-19 12:53:37.000000', NULL, 20, 6.2, NULL, 0, 3.6),
(69, 'Việt Nam', 44, '2025-12-23 18:53:37.000000', 'Nắng', NULL, 19.9, 77, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1018, 0, '2025-12-19 18:53:37.000000', NULL, 20, 12.1, NULL, 131, 1.3),
(70, 'Việt Nam', 71, '2025-12-23 18:53:37.000000', 'Nắng nóng', NULL, 22.3, 65, '☁️', 12.239405831840646, 108.46091678752846, 'Clouds', 1016.5, 0, '2025-12-20 00:53:37.000000', NULL, 22.9, 6, NULL, 264, 2.2),
(71, 'Việt Nam', 91, '2025-12-23 18:53:37.000000', 'Có mây', NULL, 34.2, 63, '☁️', 12.239405831840646, 108.46091678752846, 'Clouds', 1017.9, 0, '2025-12-20 06:53:37.000000', NULL, 35, 11.6, NULL, 253, 3.5),
(72, 'Việt Nam', 24, '2025-12-23 18:53:37.000000', 'Trời quang', NULL, 19.5, 74, '☁️', 12.239405831840646, 108.46091678752846, 'Clouds', 1016.5, 0, '2025-12-20 12:53:37.000000', NULL, 20.7, 14.7, NULL, 323, 3),
(73, 'Việt Nam', 13, '2025-12-23 18:53:37.000000', 'Trời quang', NULL, 20.1, 79, '☁️', 12.239405831840646, 108.46091678752846, 'Clouds', 1017.2, 0, '2025-12-20 18:53:37.000000', NULL, 20, 10.5, NULL, 150, 1.2),
(74, 'Việt Nam', 23, '2025-12-23 18:53:37.000000', 'Nắng nóng', NULL, 22.1, 57, '☀️', 12.239405831840646, 108.46091678752846, 'Clear', 1013.7, 0, '2025-12-21 00:53:37.000000', NULL, 22.9, 5.6, NULL, 155, 4.4),
(75, 'Việt Nam', 31, '2025-12-23 18:53:37.000000', 'Nắng', NULL, 34.6, 73, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1017.7, 0, '2025-12-21 06:53:37.000000', NULL, 34.3, 8, NULL, 140, 2.7),
(76, 'Việt Nam', 41, '2025-12-23 18:53:37.000000', 'Nắng', NULL, 18.5, 59, '☀️', 12.239405831840646, 108.46091678752846, 'Clear', 1013.1, 0, '2025-12-21 12:53:37.000000', NULL, 20, 14.3, NULL, 136, 2.2),
(77, 'Việt Nam', 86, '2025-12-23 18:53:37.000000', 'Nắng', NULL, 19.1, 78, '☀️', 12.239405831840646, 108.46091678752846, 'Clear', 1014.5, 0, '2025-12-21 18:53:37.000000', NULL, 20, 13.7, NULL, 85, 3.2),
(78, 'Việt Nam', 7, '2025-12-23 18:53:37.000000', 'Nắng', NULL, 25.4, 70, '☁️', 12.239405831840646, 108.46091678752846, 'Clouds', 1014.7, 0, '2025-12-22 00:53:37.000000', NULL, 24.1, 7.3, NULL, 262, 3.6),
(79, 'Việt Nam', 99, '2025-12-23 18:53:37.000000', 'Trời quang', NULL, 34.1, 69, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1016.4, 0, '2025-12-22 06:53:37.000000', NULL, 33.5, 7.3, NULL, 138, 3.1),
(80, 'Việt Nam', 24, '2025-12-23 18:53:37.000000', 'Nắng', NULL, 19.7, 56, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1014.8, 0, '2025-12-22 12:53:37.000000', NULL, 20.5, 12.2, NULL, 127, 1.4),
(81, 'Việt Nam', 46, '2025-12-23 18:53:37.000000', 'Trời quang', NULL, 20.7, 83, '☁️', 12.239405831840646, 108.46091678752846, 'Clouds', 1013.2, 0, '2025-12-22 18:53:37.000000', NULL, 20, 7.7, NULL, 189, 2.4),
(82, 'Việt Nam', 35, '2025-12-23 18:53:37.000000', 'Có mây', NULL, 24.6, 64, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1015.5, 0, '2025-12-23 00:53:37.000000', NULL, 23.5, 7.4, NULL, 165, 3.7),
(83, 'Việt Nam', 15, '2025-12-23 18:53:37.000000', 'Trời quang', NULL, 33.3, 75, '☀️', 12.239405831840646, 108.46091678752846, 'Clear', 1019.1, 0, '2025-12-23 06:53:37.000000', NULL, 33.5, 11.1, NULL, 119, 4.1),
(84, 'Việt Nam', 60, '2025-12-23 18:53:37.000000', 'Có mây', NULL, 19.2, 62, '☀️', 12.239405831840646, 108.46091678752846, 'Sunny', 1019.1, 0, '2025-12-23 12:53:37.000000', NULL, 20, 13.4, NULL, 346, 3.6),
(85, NULL, 100, '2025-12-23 18:58:03.000000', 'Nhiều mây ☁️', NULL, 24.9, 92, 'http://openweathermap.org/img/w/04n.png', 10.856364093308388, 106.76334032515908, 'Overcast', 1007.8, 0, '2025-12-23 18:58:03.000000', NULL, 24.9, 24.14, NULL, 270, 0.2),
(86, 'Hồ Chí Minh', 85, '2025-12-23 18:58:03.000000', 'Có mây', NULL, 22.3, 66, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1014, 0, '2025-12-16 18:58:03.000000', NULL, 20.9, 7.4, NULL, 335, 3),
(87, 'Hồ Chí Minh', 97, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 26.6, 70, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1019.9, 0, '2025-12-17 00:58:03.000000', NULL, 25.1, 7.6, NULL, 58, 1.7),
(88, 'Hồ Chí Minh', 22, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 34.7, 56, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1019, 0, '2025-12-17 06:58:03.000000', NULL, 33.6, 13.8, NULL, 111, 2.6),
(89, 'Hồ Chí Minh', 34, '2025-12-23 18:58:03.000000', 'Nắng', NULL, 19.1, 52, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1013.7, 0, '2025-12-17 12:58:03.000000', NULL, 20.4, 13.9, NULL, 237, 1.6),
(90, 'Hồ Chí Minh', 34, '2025-12-23 18:58:03.000000', 'Trời quang', NULL, 19.8, 75, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1019.1, 0, '2025-12-17 18:58:03.000000', NULL, 20, 6.1, NULL, 13, 4.8),
(91, 'Hồ Chí Minh', 80, '2025-12-23 18:58:03.000000', 'Trời quang', NULL, 22, 56, '☀️', 10.856364093308388, 106.76334032515908, 'Sunny', 1013.2, 0, '2025-12-18 00:58:03.000000', NULL, 22.5, 12.5, NULL, 220, 4.8),
(92, 'Hồ Chí Minh', 65, '2025-12-23 18:58:03.000000', 'Có mây', NULL, 32.2, 53, '☀️', 10.856364093308388, 106.76334032515908, 'Sunny', 1013.9, 0, '2025-12-18 06:58:03.000000', NULL, 33.6, 13.6, NULL, 322, 3.4),
(93, 'Hồ Chí Minh', 15, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 22, 65, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1015.1, 0, '2025-12-18 12:58:03.000000', NULL, 20.6, 11.4, NULL, 273, 2),
(94, 'Hồ Chí Minh', 91, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 20.1, 73, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1015.3, 0, '2025-12-18 18:58:03.000000', NULL, 20, 8.3, NULL, 98, 3.5),
(95, 'Hồ Chí Minh', 70, '2025-12-23 18:58:03.000000', 'Trời quang', NULL, 23.8, 66, '☀️', 10.856364093308388, 106.76334032515908, 'Sunny', 1017.9, 0, '2025-12-19 00:58:03.000000', NULL, 24.1, 7.1, NULL, 347, 2.7),
(96, 'Hồ Chí Minh', 10, '2025-12-23 18:58:03.000000', 'Có mây', NULL, 33.5, 50, '☀️', 10.856364093308388, 106.76334032515908, 'Sunny', 1015.8, 0, '2025-12-19 06:58:03.000000', NULL, 34.5, 11.4, NULL, 28, 4),
(97, 'Hồ Chí Minh', 2, '2025-12-23 18:58:03.000000', 'Có mây', NULL, 19, 69, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1013.8, 0, '2025-12-19 12:58:03.000000', NULL, 20, 10.5, NULL, 181, 1.3),
(98, 'Hồ Chí Minh', 3, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 20.4, 60, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1013, 0, '2025-12-19 18:58:03.000000', NULL, 20.7, 6.2, NULL, 290, 4.9),
(99, 'Hồ Chí Minh', 72, '2025-12-23 18:58:03.000000', 'Trời quang', NULL, 24.4, 66, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1019.4, 0, '2025-12-20 00:58:03.000000', NULL, 23.2, 9.6, NULL, 16, 3.2),
(100, 'Hồ Chí Minh', 2, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 36.3, 63, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1013.6, 0, '2025-12-20 06:58:03.000000', NULL, 35, 6.6, NULL, 61, 3.5),
(101, 'Hồ Chí Minh', 92, '2025-12-23 18:58:03.000000', 'Trời quang', NULL, 20.8, 78, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1016, 0, '2025-12-20 12:58:03.000000', NULL, 20, 6.9, NULL, 70, 1.2),
(102, 'Hồ Chí Minh', 65, '2025-12-23 18:58:03.000000', 'Nắng', NULL, 22.6, 67, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1013.2, 0, '2025-12-20 18:58:03.000000', NULL, 21.2, 10.7, NULL, 13, 4.3),
(103, 'Hồ Chí Minh', 11, '2025-12-23 18:58:03.000000', 'Có mây', NULL, 25, 67, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1014.6, 0, '2025-12-21 00:58:03.000000', NULL, 24.4, 5.9, NULL, 26, 3.5),
(104, 'Hồ Chí Minh', 70, '2025-12-23 18:58:03.000000', 'Có mây', NULL, 35, 73, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1014.1, 0, '2025-12-21 06:58:03.000000', NULL, 35, 10.4, NULL, 99, 3.1),
(105, 'Hồ Chí Minh', 20, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 19.9, 75, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1014, 0, '2025-12-21 12:58:03.000000', NULL, 20, 9.8, NULL, 71, 3.1),
(106, 'Hồ Chí Minh', 96, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 19.2, 64, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1018.3, 0, '2025-12-21 18:58:03.000000', NULL, 20.6, 11.9, NULL, 307, 4.5),
(107, 'Hồ Chí Minh', 44, '2025-12-23 18:58:03.000000', 'Nắng', NULL, 23.6, 78, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1019, 0, '2025-12-22 00:58:03.000000', NULL, 24.5, 7.5, NULL, 9, 2.2),
(108, 'Hồ Chí Minh', 71, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 35.1, 79, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1017.3, 0, '2025-12-22 06:58:03.000000', NULL, 34.6, 8.6, NULL, 320, 3.9),
(109, 'Hồ Chí Minh', 12, '2025-12-23 18:58:03.000000', 'Nắng nóng', NULL, 21.6, 66, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1018.3, 0, '2025-12-22 12:58:03.000000', NULL, 21.1, 8.4, NULL, 219, 4.8),
(110, 'Hồ Chí Minh', 0, '2025-12-23 18:58:03.000000', 'Nắng', NULL, 21.9, 86, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1019.7, 0, '2025-12-22 18:58:03.000000', NULL, 20.9, 13, NULL, 178, 3.4),
(111, 'Hồ Chí Minh', 17, '2025-12-23 18:58:03.000000', 'Trời quang', NULL, 25.1, 70, '☀️', 10.856364093308388, 106.76334032515908, 'Sunny', 1016.7, 0, '2025-12-23 00:58:03.000000', NULL, 24.3, 9.5, NULL, 97, 3.9),
(112, 'Hồ Chí Minh', 4, '2025-12-23 18:58:03.000000', 'Có mây', NULL, 35.9, 78, '☀️', 10.856364093308388, 106.76334032515908, 'Clear', 1015.2, 0, '2025-12-23 06:58:03.000000', NULL, 35, 9.6, NULL, 260, 4.6),
(113, 'Hồ Chí Minh', 85, '2025-12-23 18:58:03.000000', 'Có mây', NULL, 19, 71, '☁️', 10.856364093308388, 106.76334032515908, 'Clouds', 1014.4, 0, '2025-12-23 12:58:03.000000', NULL, 20, 10.6, NULL, 77, 2.9),
(114, NULL, 100, '2025-12-23 19:01:26.000000', 'Nhiều mây ☁️', NULL, 25, 93, 'http://openweathermap.org/img/w/04n.png', 10.52624263220554, 107.40549957918512, 'Overcast', 1007.6, 0, '2025-12-23 19:01:26.000000', NULL, 25, 24.14, NULL, 42, 1.2),
(115, 'Việt Nam', 89, '2025-12-23 19:01:27.000000', 'Có mây', NULL, 20.3, 76, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1013.2, 0, '2025-12-16 19:01:27.000000', NULL, 20, 8.8, NULL, 184, 1.5),
(116, 'Việt Nam', 96, '2025-12-23 19:01:27.000000', 'Nắng', NULL, 28.1, 57, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1017.6, 0, '2025-12-17 01:01:27.000000', NULL, 26.7, 7, NULL, 188, 4.5),
(117, 'Việt Nam', 76, '2025-12-23 19:01:27.000000', 'Trời quang', NULL, 33.2, 53, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1018.5, 0, '2025-12-17 07:01:27.000000', NULL, 33.9, 14, NULL, 323, 1.3),
(118, 'Việt Nam', 50, '2025-12-23 19:01:27.000000', 'Trời quang', NULL, 20.3, 66, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1015.9, 0, '2025-12-17 13:01:27.000000', NULL, 20, 5.3, NULL, 337, 2.2),
(119, 'Việt Nam', 17, '2025-12-23 19:01:27.000000', 'Trời quang', NULL, 19.6, 80, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1016.1, 0, '2025-12-17 19:01:27.000000', NULL, 20.8, 5.8, NULL, 350, 2.2),
(120, 'Việt Nam', 78, '2025-12-23 19:01:27.000000', 'Có mây', NULL, 26, 56, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1015.6, 0, '2025-12-18 01:01:27.000000', NULL, 26.7, 10.9, NULL, 55, 3.9),
(121, 'Việt Nam', 78, '2025-12-23 19:01:27.000000', 'Nắng', NULL, 34, 54, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1016.2, 0, '2025-12-18 07:01:27.000000', NULL, 32.7, 8.3, NULL, 67, 1.3),
(122, 'Việt Nam', 6, '2025-12-23 19:01:27.000000', 'Nắng', NULL, 20.4, 77, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1015.2, 0, '2025-12-18 13:01:27.000000', NULL, 20.9, 7.6, NULL, 134, 2.6),
(123, 'Việt Nam', 55, '2025-12-23 19:01:27.000000', 'Nắng nóng', NULL, 21.9, 82, '☀️', 10.52624263220554, 107.40549957918512, 'Sunny', 1016.7, 0, '2025-12-18 19:01:27.000000', NULL, 20.9, 15, NULL, 292, 2.6),
(124, 'Việt Nam', 51, '2025-12-23 19:01:27.000000', 'Trời quang', NULL, 25.8, 57, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1013.2, 0, '2025-12-19 01:01:27.000000', NULL, 26.4, 6.5, NULL, 340, 2),
(125, 'Việt Nam', 67, '2025-12-23 19:01:27.000000', 'Nắng', NULL, 33.3, 74, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1019, 0, '2025-12-19 07:01:27.000000', NULL, 32.3, 14.2, NULL, 57, 2.3),
(126, 'Việt Nam', 39, '2025-12-23 19:01:27.000000', 'Trời quang', NULL, 20.7, 66, '☀️', 10.52624263220554, 107.40549957918512, 'Sunny', 1014.3, 0, '2025-12-19 13:01:27.000000', NULL, 20, 11.4, NULL, 33, 1.3),
(127, 'Việt Nam', 93, '2025-12-23 19:01:27.000000', 'Nắng nóng', NULL, 21.5, 64, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1019.4, 0, '2025-12-19 19:01:27.000000', NULL, 20.8, 6.4, NULL, 343, 4.1),
(128, 'Việt Nam', 78, '2025-12-23 19:01:27.000000', 'Có mây', NULL, 29.3, 52, '☀️', 10.52624263220554, 107.40549957918512, 'Sunny', 1016.4, 0, '2025-12-20 01:01:27.000000', NULL, 28.6, 14.1, NULL, 288, 3.8),
(129, 'Việt Nam', 50, '2025-12-23 19:01:27.000000', 'Nắng', NULL, 30.6, 59, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1015.8, 0, '2025-12-20 07:01:27.000000', NULL, 31.6, 5.3, NULL, 238, 2.2),
(130, 'Việt Nam', 81, '2025-12-23 19:01:27.000000', 'Có mây', NULL, 20.6, 67, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1019.7, 0, '2025-12-20 13:01:27.000000', NULL, 20, 13.2, NULL, 141, 1.8),
(131, 'Việt Nam', 56, '2025-12-23 19:01:27.000000', 'Trời quang', NULL, 21.9, 81, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1018, 0, '2025-12-20 19:01:27.000000', NULL, 20.8, 8.5, NULL, 238, 3.8),
(132, 'Việt Nam', 25, '2025-12-23 19:01:27.000000', 'Nắng nóng', NULL, 27.9, 51, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1013.4, 0, '2025-12-21 01:01:27.000000', NULL, 26.9, 9.5, NULL, 250, 3.1),
(133, 'Việt Nam', 89, '2025-12-23 19:01:27.000000', 'Nắng nóng', NULL, 32.3, 76, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1016.8, 0, '2025-12-21 07:01:27.000000', NULL, 33.6, 6.2, NULL, 119, 2),
(134, 'Việt Nam', 88, '2025-12-23 19:01:27.000000', 'Trời quang', NULL, 20.2, 82, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1016.5, 0, '2025-12-21 13:01:27.000000', NULL, 21.2, 6.8, NULL, 313, 2.2),
(135, 'Việt Nam', 2, '2025-12-23 19:01:27.000000', 'Nắng nóng', NULL, 21.4, 61, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1017.1, 0, '2025-12-21 19:01:27.000000', NULL, 20, 5.6, NULL, 109, 3.4),
(136, 'Việt Nam', 84, '2025-12-23 19:01:27.000000', 'Nắng nóng', NULL, 28.7, 55, '☀️', 10.52624263220554, 107.40549957918512, 'Sunny', 1016.5, 0, '2025-12-22 01:01:27.000000', NULL, 28.8, 12.2, NULL, 351, 4.2),
(137, 'Việt Nam', 72, '2025-12-23 19:01:27.000000', 'Trời quang', NULL, 32.3, 52, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1017.9, 0, '2025-12-22 07:01:27.000000', NULL, 33.6, 10.8, NULL, 136, 4.3),
(138, 'Việt Nam', 97, '2025-12-23 19:01:27.000000', 'Nắng', NULL, 20.3, 73, '☀️', 10.52624263220554, 107.40549957918512, 'Clear', 1016.7, 0, '2025-12-22 13:01:27.000000', NULL, 20, 8.2, NULL, 232, 4),
(139, 'Việt Nam', 30, '2025-12-23 19:01:27.000000', 'Có mây', NULL, 21.4, 71, '☀️', 10.52624263220554, 107.40549957918512, 'Sunny', 1015.2, 0, '2025-12-22 19:01:27.000000', NULL, 20.7, 8.2, NULL, 236, 1.8),
(140, 'Việt Nam', 87, '2025-12-23 19:01:27.000000', 'Trời quang', NULL, 26.9, 57, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1014.8, 0, '2025-12-23 01:01:27.000000', NULL, 26.8, 7.6, NULL, 204, 1.5),
(141, 'Việt Nam', 24, '2025-12-23 19:01:27.000000', 'Có mây', NULL, 32.8, 53, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1016.3, 0, '2025-12-23 07:01:27.000000', NULL, 31.8, 5.8, NULL, 127, 4.1),
(142, 'Việt Nam', 72, '2025-12-23 19:01:27.000000', 'Nắng nóng', NULL, 21.7, 66, '☁️', 10.52624263220554, 107.40549957918512, 'Clouds', 1018.8, 0, '2025-12-23 13:01:27.000000', NULL, 21.5, 14.1, NULL, 140, 2.8),
(143, NULL, 66, '2025-12-23 19:01:43.000000', 'Sương mù dày đặc 🌫️', NULL, 15.1, 96, 'http://openweathermap.org/img/w/50n.png', 19.851888717559646, 101.38512651210803, 'Fog', 1013.3, 0, '2025-12-23 19:01:43.000000', NULL, 15.1, 24.14, NULL, 45, 0.99),
(144, 'Việt Nam', 59, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 21.4, 64, '☀️', 19.851888717559646, 101.38512651210803, 'Sunny', 1019.2, 0, '2025-12-16 19:01:43.000000', NULL, 21.1, 5.3, NULL, 241, 5),
(145, 'Việt Nam', 60, '2025-12-23 19:01:43.000000', 'Có mây', NULL, 26.8, 77, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1014.4, 0, '2025-12-17 01:01:43.000000', NULL, 26, 9.6, NULL, 359, 2.1),
(146, 'Việt Nam', 29, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 32.2, 59, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1016.8, 0, '2025-12-17 07:01:43.000000', NULL, 33.6, 12.2, NULL, 36, 2.6),
(147, 'Việt Nam', 13, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 21.8, 76, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1014.2, 0, '2025-12-17 13:01:43.000000', NULL, 20.6, 13.2, NULL, 124, 3.7),
(148, 'Việt Nam', 93, '2025-12-23 19:01:43.000000', 'Có mây', NULL, 19, 61, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1013.8, 0, '2025-12-17 19:01:43.000000', NULL, 20.3, 7.8, NULL, 208, 3),
(149, 'Việt Nam', 66, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 28.7, 73, '☀️', 19.851888717559646, 101.38512651210803, 'Sunny', 1013.9, 0, '2025-12-18 01:01:43.000000', NULL, 27.8, 9.3, NULL, 56, 3.9),
(150, 'Việt Nam', 24, '2025-12-23 19:01:43.000000', 'Nắng nóng', NULL, 34.2, 59, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1019.6, 0, '2025-12-18 07:01:43.000000', NULL, 34.4, 7.5, NULL, 234, 1.3),
(151, 'Việt Nam', 94, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 20.5, 88, '☀️', 19.851888717559646, 101.38512651210803, 'Sunny', 1015.6, 0, '2025-12-18 13:01:43.000000', NULL, 20, 8.6, NULL, 124, 2),
(152, 'Việt Nam', 96, '2025-12-23 19:01:43.000000', 'Nắng', NULL, 21.7, 74, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1013.7, 0, '2025-12-18 19:01:43.000000', NULL, 20.8, 7.8, NULL, 58, 1.4),
(153, 'Việt Nam', 22, '2025-12-23 19:01:43.000000', 'Có mây', NULL, 27.8, 65, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1018.7, 0, '2025-12-19 01:01:43.000000', NULL, 28.2, 5.5, NULL, 216, 4.9),
(154, 'Việt Nam', 95, '2025-12-23 19:01:43.000000', 'Có mây', NULL, 33.2, 64, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1014.7, 0, '2025-12-19 07:01:43.000000', NULL, 32.2, 13.3, NULL, 162, 4.7),
(155, 'Việt Nam', 43, '2025-12-23 19:01:43.000000', 'Nắng nóng', NULL, 18.8, 67, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1014, 0, '2025-12-19 13:01:43.000000', NULL, 20.1, 8.7, NULL, 184, 2),
(156, 'Việt Nam', 9, '2025-12-23 19:01:43.000000', 'Nắng nóng', NULL, 19.6, 78, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1018.2, 0, '2025-12-19 19:01:43.000000', NULL, 21, 7.1, NULL, 321, 3.1),
(157, 'Việt Nam', 18, '2025-12-23 19:01:43.000000', 'Nắng nóng', NULL, 28, 61, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1013.1, 0, '2025-12-20 01:01:43.000000', NULL, 28.6, 14.5, NULL, 296, 2.7),
(158, 'Việt Nam', 97, '2025-12-23 19:01:43.000000', 'Nắng', NULL, 33.2, 57, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1014.5, 0, '2025-12-20 07:01:43.000000', NULL, 33.5, 12.3, NULL, 293, 2.4),
(159, 'Việt Nam', 7, '2025-12-23 19:01:43.000000', 'Nắng', NULL, 20, 81, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1018.3, 0, '2025-12-20 13:01:43.000000', NULL, 20.7, 14.6, NULL, 225, 3.5),
(160, 'Việt Nam', 26, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 20.2, 75, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1016, 0, '2025-12-20 19:01:43.000000', NULL, 20.4, 10.7, NULL, 288, 3),
(161, 'Việt Nam', 33, '2025-12-23 19:01:43.000000', 'Có mây', NULL, 26.7, 66, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1015.8, 0, '2025-12-21 01:01:43.000000', NULL, 26.4, 5.4, NULL, 137, 4.7),
(162, 'Việt Nam', 20, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 33.8, 74, '☀️', 19.851888717559646, 101.38512651210803, 'Sunny', 1019.1, 0, '2025-12-21 07:01:43.000000', NULL, 32.3, 11.9, NULL, 93, 4.4),
(163, 'Việt Nam', 37, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 20.5, 77, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1016.9, 0, '2025-12-21 13:01:43.000000', NULL, 20.5, 8.4, NULL, 157, 1.4),
(164, 'Việt Nam', 65, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 21.7, 68, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1015.4, 0, '2025-12-21 19:01:43.000000', NULL, 21.2, 11.6, NULL, 291, 4.5),
(165, 'Việt Nam', 90, '2025-12-23 19:01:43.000000', 'Có mây', NULL, 27.8, 60, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1015.9, 0, '2025-12-22 01:01:43.000000', NULL, 28.4, 10.5, NULL, 307, 1.3),
(166, 'Việt Nam', 96, '2025-12-23 19:01:43.000000', 'Có mây', NULL, 31.9, 74, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1019.4, 0, '2025-12-22 07:01:43.000000', NULL, 32.1, 9.6, NULL, 336, 2),
(167, 'Việt Nam', 50, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 21.1, 87, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1014.4, 0, '2025-12-22 13:01:43.000000', NULL, 20, 12.1, NULL, 29, 3.9),
(168, 'Việt Nam', 64, '2025-12-23 19:01:43.000000', 'Có mây', NULL, 21.5, 78, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1013.4, 0, '2025-12-22 19:01:43.000000', NULL, 20.8, 12.8, NULL, 152, 3.7),
(169, 'Việt Nam', 87, '2025-12-23 19:01:43.000000', 'Nắng nóng', NULL, 26.2, 70, '☁️', 19.851888717559646, 101.38512651210803, 'Clouds', 1018.2, 0, '2025-12-23 01:01:43.000000', NULL, 27, 10.2, NULL, 256, 1.8),
(170, 'Việt Nam', 70, '2025-12-23 19:01:43.000000', 'Có mây', NULL, 33.1, 76, '☀️', 19.851888717559646, 101.38512651210803, 'Sunny', 1017.4, 0, '2025-12-23 07:01:43.000000', NULL, 34.1, 13.1, NULL, 71, 3.5),
(171, 'Việt Nam', 29, '2025-12-23 19:01:43.000000', 'Trời quang', NULL, 20.4, 70, '☀️', 19.851888717559646, 101.38512651210803, 'Clear', 1013.1, 0, '2025-12-23 13:01:43.000000', NULL, 21.2, 10.7, NULL, 186, 3);

-- --------------------------------------------------------

--
-- Table structure for table `weather_reports`
--

CREATE TABLE `weather_reports` (
  `id` bigint(20) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text NOT NULL,
  `district` varchar(255) DEFAULT NULL,
  `hidden` bit(1) NOT NULL,
  `incident_time` datetime(6) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `severity` enum('CRITICAL','HIGH','LOW','MEDIUM') NOT NULL,
  `status` enum('APPROVED','PENDING','REJECTED','RESOLVED') NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `ward` varchar(255) DEFAULT NULL,
  `incident_type_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `weather_reports`
--

INSERT INTO `weather_reports` (`id`, `city`, `created_at`, `description`, `district`, `hidden`, `incident_time`, `latitude`, `longitude`, `severity`, `status`, `title`, `updated_at`, `ward`, `incident_type_id`, `user_id`) VALUES
(1, 'Hồ Tràm', '2025-12-23 15:58:40.000000', 'a', 'Bà Rịa - Vũng Tàu', b'0', '2025-12-23 08:54:00.000000', 10.533083722466058, 107.39970758314224, 'LOW', 'RESOLVED', 'a', '2025-12-23 20:26:27.000000', 'Thành phố Hồ Chí Minh', 17, 2),
-- Thêm nhiều reports với nhiều loại sự cố và địa điểm
(2, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 12 HOUR), 'Mưa lớn kéo dài từ sáng đến chiều, lượng mưa ước tính trên 80mm, gây ngập úng tại khu vực phố Hàng Bông và các phố xung quanh. Nhiều phương tiện bị kẹt, giao thông tê liệt. Nước ngập sâu đến 30-40cm tại một số điểm.', 'Hoàn Kiếm', b'0', DATE_SUB(NOW(), INTERVAL 12 HOUR), 21.0285, 105.8542, 'HIGH', 'APPROVED', 'Mưa lớn gây ngập tại Phố Hàng Bông', DATE_SUB(NOW(), INTERVAL 11 HOUR), 'Hàng Gai', 1, 4),
(3, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 24 HOUR), 'Nước dâng cao trên 50cm tại nhiều tuyến đường trong Quận 1, nhiều cửa hàng và nhà dân bị ngập. Cần hỗ trợ khẩn cấp. Giao thông hoàn toàn tê liệt, nhiều phương tiện bị chết máy.', 'Quận 1', b'0', DATE_SUB(NOW(), INTERVAL 24 HOUR), 10.8231, 106.6297, 'CRITICAL', 'APPROVED', 'Lũ lụt tại khu vực Quận 1', DATE_SUB(NOW(), INTERVAL 22 HOUR), 'Bến Nghé', 3, 11),
(4, 'Đà Nẵng', DATE_SUB(NOW(), INTERVAL 36 HOUR), 'Gió giật mạnh với tốc độ trên 60km/h đã làm đổ nhiều cây xanh trên đường Bạch Đằng. Một số phương tiện bị hư hỏng nhẹ. Cần xử lý gấp để đảm bảo an toàn giao thông.', 'Hải Châu', b'0', DATE_SUB(NOW(), INTERVAL 36 HOUR), 16.0544, 108.2022, 'MEDIUM', 'APPROVED', 'Gió mạnh làm đổ cây tại Đà Nẵng', DATE_SUB(NOW(), INTERVAL 34 HOUR), 'Hải Châu', 6, 21),
(5, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 6 HOUR), 'Nhiệt độ lên đến 38°C, cảm giác như 42°C do độ ẩm cao. Nhiều người có dấu hiệu say nắng khi làm việc ngoài trời. Cần uống đủ nước và tránh làm việc ngoài trời vào giữa trưa.', 'Quận 1', b'0', DATE_SUB(NOW(), INTERVAL 6 HOUR), 10.8231, 106.6297, 'MEDIUM', 'PENDING', 'Nắng nóng cực đoan tại Hồ Chí Minh', NOW(), 'Đa Kao', 11, 12),
(6, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 48 HOUR), 'Sau nhiều ngày mưa lớn, một đoạn đường tại phường Lê Đại Hành bị sạt lở, đất đá đổ xuống đường gây cản trở giao thông. Cần xử lý khẩn cấp để đảm bảo an toàn.', 'Hai Bà Trưng', b'0', DATE_SUB(NOW(), INTERVAL 48 HOUR), 21.0333, 105.8333, 'HIGH', 'APPROVED', 'Sạt lở đất tại khu vực Hai Bà Trưng', DATE_SUB(NOW(), INTERVAL 46 HOUR), 'Lê Đại Hành', 5, 6),
(7, 'Hải Phòng', DATE_SUB(NOW(), INTERVAL 72 HOUR), 'Mưa dông lớn với sấm sét kéo dài hơn 2 giờ, lượng mưa đạt 60mm. Nhiều khu vực bị mất điện tạm thời. Giao thông bị ảnh hưởng nghiêm trọng.', 'Ngô Quyền', b'0', DATE_SUB(NOW(), INTERVAL 72 HOUR), 20.8449, 106.6881, 'MEDIUM', 'APPROVED', 'Mưa dông kèm sấm sét tại Hải Phòng', DATE_SUB(NOW(), INTERVAL 70 HOUR), 'Máy Chai', 2, 24),
(8, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 18 HOUR), 'Nước đọng không thoát được gây ngập cục bộ tại nhiều tuyến đường trong Quận 5. Nhiều cửa hàng bị ảnh hưởng, giao thông bị cản trở.', 'Quận 5', b'0', DATE_SUB(NOW(), INTERVAL 18 HOUR), 10.7626, 106.6602, 'MEDIUM', 'APPROVED', 'Ngập úng tại Quận 5', DATE_SUB(NOW(), INTERVAL 16 HOUR), 'Phường 14', 4, 15),
(9, 'Đà Nẵng', DATE_SUB(NOW(), INTERVAL 96 HOUR), 'Bão nhiệt đới với gió mạnh và mưa lớn đã đổ bộ vào Đà Nẵng. Giao thông tê liệt, nhiều nhà cửa bị hư hỏng. Cần đề phòng và di chuyển đến nơi an toàn.', 'Hải Châu', b'0', DATE_SUB(NOW(), INTERVAL 96 HOUR), 16.0544, 108.2022, 'CRITICAL', 'APPROVED', 'Bão đổ bộ vào Đà Nẵng', DATE_SUB(NOW(), INTERVAL 94 HOUR), 'Phước Ninh', 8, 22),
(10, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 120 HOUR), 'Gió mạnh đã làm đổ một cây lớn trên đường Tôn Đức Thắng, cản trở giao thông. Cần xử lý gấp để đảm bảo an toàn.', 'Đống Đa', b'0', DATE_SUB(NOW(), INTERVAL 120 HOUR), 21.0198, 105.8360, 'LOW', 'RESOLVED', 'Cây đổ do gió mạnh tại Đống Đa', DATE_SUB(NOW(), INTERVAL 1 HOUR), 'Quốc Tử Giám', 23, 7),
(11, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 3 HOUR), 'Sấm sét đánh liên tục trong khu vực Quận 3, có nguy cơ gây cháy nổ. Người dân cần cẩn thận, tránh ở ngoài trời khi có sấm sét.', 'Quận 3', b'0', DATE_SUB(NOW(), INTERVAL 3 HOUR), 10.7795, 106.6995, 'MEDIUM', 'PENDING', 'Sấm sét nguy hiểm tại Quận 3', NOW(), 'Võ Thị Sáu', 18, 14),
(12, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 8 HOUR), 'Mưa lớn kéo dài gây ngập úng tại nhiều tuyến đường trong quận Hoàn Kiếm. Nhiều phương tiện bị kẹt, giao thông tê liệt.', 'Hoàn Kiếm', b'0', DATE_SUB(NOW(), INTERVAL 8 HOUR), 21.0285, 105.8542, 'HIGH', 'APPROVED', 'Mưa lớn gây ngập tại Hoàn Kiếm', DATE_SUB(NOW(), INTERVAL 7 HOUR), 'Tràng Tiền', 1, 5),
(13, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 15 HOUR), 'Gió mạnh với tốc độ trên 50km/h đã làm đổ nhiều biển quảng cáo và cây cối. Một số nhà cửa bị hư hỏng nhẹ.', 'Quận 1', b'0', DATE_SUB(NOW(), INTERVAL 15 HOUR), 10.8231, 106.6297, 'MEDIUM', 'APPROVED', 'Gió mạnh tại Quận 1', DATE_SUB(NOW(), INTERVAL 14 HOUR), 'Bến Nghé', 6, 13),
(14, 'Đà Nẵng', DATE_SUB(NOW(), INTERVAL 20 HOUR), 'Mưa lớn kéo dài gây ngập úng tại nhiều khu vực trong thành phố. Giao thông bị ảnh hưởng nghiêm trọng.', 'Hải Châu', b'0', DATE_SUB(NOW(), INTERVAL 20 HOUR), 16.0544, 108.2022, 'HIGH', 'APPROVED', 'Mưa lớn tại Đà Nẵng', DATE_SUB(NOW(), INTERVAL 19 HOUR), 'Hải Châu', 1, 23),
(15, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 30 HOUR), 'Sương mù dày đặc làm giảm tầm nhìn xuống dưới 50m. Giao thông bị ảnh hưởng, nhiều phương tiện phải di chuyển chậm.', 'Hoàn Kiếm', b'0', DATE_SUB(NOW(), INTERVAL 30 HOUR), 21.0285, 105.8542, 'LOW', 'APPROVED', 'Sương mù dày đặc tại Hà Nội', DATE_SUB(NOW(), INTERVAL 29 HOUR), 'Hàng Gai', 15, 4),
(16, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 10 HOUR), 'Mưa dông lớn với sấm sét kéo dài. Nhiều khu vực bị mất điện tạm thời, cây cối bị đổ.', 'Quận 3', b'0', DATE_SUB(NOW(), INTERVAL 10 HOUR), 10.7795, 106.6995, 'MEDIUM', 'PENDING', 'Mưa dông tại Quận 3', NOW(), 'Võ Thị Sáu', 2, 18),
(17, 'Hải Phòng', DATE_SUB(NOW(), INTERVAL 25 HOUR), 'Gió mạnh với tốc độ cao đã làm đổ nhiều cây cối và biển quảng cáo. Cần xử lý gấp để đảm bảo an toàn.', 'Ngô Quyền', b'0', DATE_SUB(NOW(), INTERVAL 25 HOUR), 20.8449, 106.6881, 'MEDIUM', 'APPROVED', 'Gió mạnh tại Hải Phòng', DATE_SUB(NOW(), INTERVAL 24 HOUR), 'Máy Chai', 6, 40),
(18, 'Vũng Tàu', DATE_SUB(NOW(), INTERVAL 5 HOUR), 'Nắng nóng với nhiệt độ lên đến 36°C. Nhiều người có dấu hiệu say nắng khi làm việc ngoài trời.', 'Thành phố Vũng Tàu', b'0', DATE_SUB(NOW(), INTERVAL 5 HOUR), 10.3460, 107.0843, 'LOW', 'PENDING', 'Nắng nóng tại Vũng Tàu', NOW(), 'Thắng Tam', 11, 25),
(19, 'Cần Thơ', DATE_SUB(NOW(), INTERVAL 14 HOUR), 'Mưa lớn gây ngập úng tại nhiều tuyến đường. Nhiều phương tiện bị kẹt, giao thông tê liệt.', 'Ninh Kiều', b'0', DATE_SUB(NOW(), INTERVAL 14 HOUR), 10.0452, 105.7469, 'HIGH', 'APPROVED', 'Mưa lớn tại Cần Thơ', DATE_SUB(NOW(), INTERVAL 13 HOUR), 'Cái Khế', 1, 26),
(20, 'Huế', DATE_SUB(NOW(), INTERVAL 22 HOUR), 'Mưa lớn kéo dài gây ngập úng. Nhiều khu vực bị ảnh hưởng, giao thông bị cản trở.', 'Huế', b'0', DATE_SUB(NOW(), INTERVAL 22 HOUR), 16.4637, 107.5909, 'MEDIUM', 'APPROVED', 'Mưa lớn tại Huế', DATE_SUB(NOW(), INTERVAL 21 HOUR), 'Phú Hội', 1, 27),
(21, 'Nha Trang', DATE_SUB(NOW(), INTERVAL 16 HOUR), 'Gió mạnh với tốc độ trên 45km/h. Nhiều cây cối bị đổ, biển quảng cáo bị hư hỏng.', 'Nha Trang', b'0', DATE_SUB(NOW(), INTERVAL 16 HOUR), 12.2388, 109.1967, 'MEDIUM', 'APPROVED', 'Gió mạnh tại Nha Trang', DATE_SUB(NOW(), INTERVAL 15 HOUR), 'Vĩnh Hải', 6, 28),
(22, 'Đà Lạt', DATE_SUB(NOW(), INTERVAL 28 HOUR), 'Sương mù dày đặc làm giảm tầm nhìn xuống dưới 30m. Giao thông bị ảnh hưởng nghiêm trọng.', 'Đà Lạt', b'0', DATE_SUB(NOW(), INTERVAL 28 HOUR), 11.9404, 108.4583, 'LOW', 'APPROVED', 'Sương mù dày đặc tại Đà Lạt', DATE_SUB(NOW(), INTERVAL 27 HOUR), 'Phường 1', 15, 29),
(23, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 35 HOUR), 'Mưa đá với kích thước lớn đã gây thiệt hại về tài sản. Nhiều xe máy và ô tô bị hư hỏng.', 'Hoàn Kiếm', b'0', DATE_SUB(NOW(), INTERVAL 35 HOUR), 21.0285, 105.8542, 'HIGH', 'APPROVED', 'Mưa đá tại Hà Nội', DATE_SUB(NOW(), INTERVAL 34 HOUR), 'Tràng Tiền', 19, 8),
(24, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 40 HOUR), 'Lốc xoáy với gió mạnh đã gây thiệt hại nghiêm trọng. Nhiều nhà cửa và tài sản bị hư hỏng.', 'Quận 5', b'0', DATE_SUB(NOW(), INTERVAL 40 HOUR), 10.7626, 106.6602, 'CRITICAL', 'APPROVED', 'Lốc xoáy tại Quận 5', DATE_SUB(NOW(), INTERVAL 39 HOUR), 'Phường 14', 10, 16),
(25, 'Đà Nẵng', DATE_SUB(NOW(), INTERVAL 50 HOUR), 'Mưa phùn kéo dài gây ẩm ướt và tầm nhìn kém. Giao thông bị ảnh hưởng nhẹ.', 'Hải Châu', b'0', DATE_SUB(NOW(), INTERVAL 50 HOUR), 16.0544, 108.2022, 'LOW', 'APPROVED', 'Mưa phùn kéo dài tại Đà Nẵng', DATE_SUB(NOW(), INTERVAL 49 HOUR), 'Hải Châu', 16, 38),
(26, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 60 HOUR), 'Rét đậm với nhiệt độ xuống dưới 10°C. Nhiều người già và trẻ em bị ảnh hưởng.', 'Hoàn Kiếm', b'0', DATE_SUB(NOW(), INTERVAL 60 HOUR), 21.0285, 105.8542, 'MEDIUM', 'APPROVED', 'Rét đậm rét hại tại Hà Nội', DATE_SUB(NOW(), INTERVAL 59 HOUR), 'Tràng Tiền', 21, 9),
(27, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Bụi mù làm giảm tầm nhìn. Giao thông bị ảnh hưởng, nhiều người gặp vấn đề về hô hấp.', 'Quận 1', b'0', DATE_SUB(NOW(), INTERVAL 2 HOUR), 10.8231, 106.6297, 'LOW', 'PENDING', 'Bụi mù tại Quận 1', NOW(), 'Bến Nghé', 17, 11),
(28, 'Hải Phòng', DATE_SUB(NOW(), INTERVAL 45 HOUR), 'Mưa lớn kéo dài gây ngập úng. Nhiều tuyến đường bị ngập, giao thông tê liệt.', 'Ngô Quyền', b'0', DATE_SUB(NOW(), INTERVAL 45 HOUR), 20.8449, 106.6881, 'HIGH', 'APPROVED', 'Mưa lớn tại Hải Phòng', DATE_SUB(NOW(), INTERVAL 44 HOUR), 'Máy Chai', 1, 24),
(29, 'Vũng Tàu', DATE_SUB(NOW(), INTERVAL 55 HOUR), 'Gió giật mạnh đột ngột đã làm đổ nhiều cây cối. Cần xử lý gấp để đảm bảo an toàn.', 'Thành phố Vũng Tàu', b'0', DATE_SUB(NOW(), INTERVAL 55 HOUR), 10.3460, 107.0843, 'MEDIUM', 'APPROVED', 'Gió giật tại Vũng Tàu', DATE_SUB(NOW(), INTERVAL 54 HOUR), 'Thắng Tam', 7, 41),
(30, 'Cần Thơ', DATE_SUB(NOW(), INTERVAL 65 HOUR), 'Lũ lụt với nước dâng cao trên 40cm. Nhiều nhà cửa bị ngập, cần hỗ trợ khẩn cấp.', 'Ninh Kiều', b'0', DATE_SUB(NOW(), INTERVAL 65 HOUR), 10.0452, 105.7469, 'CRITICAL', 'APPROVED', 'Lũ lụt tại Cần Thơ', DATE_SUB(NOW(), INTERVAL 64 HOUR), 'Cái Khế', 3, 42),
(31, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 70 HOUR), 'Sạt lở đất tại một đoạn đường do mưa lớn kéo dài. Giao thông bị cản trở, cần xử lý khẩn cấp.', 'Hai Bà Trưng', b'0', DATE_SUB(NOW(), INTERVAL 70 HOUR), 21.0333, 105.8333, 'HIGH', 'APPROVED', 'Sạt lở đất tại Hai Bà Trưng', DATE_SUB(NOW(), INTERVAL 69 HOUR), 'Lê Đại Hành', 5, 6),
(32, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 4 HOUR), 'Mưa lớn gây ngập úng tại Quận 10. Nhiều phương tiện bị kẹt, giao thông tê liệt.', 'Quận 10', b'0', DATE_SUB(NOW(), INTERVAL 4 HOUR), 10.7730, 106.6664, 'HIGH', 'PENDING', 'Mưa lớn tại Quận 10', NOW(), 'Phường 1', 1, 16),
(33, 'Đà Nẵng', DATE_SUB(NOW(), INTERVAL 32 HOUR), 'Cây đổ do gió mạnh đã cản trở giao thông. Cần xử lý gấp để đảm bảo an toàn.', 'Hải Châu', b'0', DATE_SUB(NOW(), INTERVAL 32 HOUR), 16.0544, 108.2022, 'LOW', 'APPROVED', 'Cây đổ tại Đà Nẵng', DATE_SUB(NOW(), INTERVAL 31 HOUR), 'Hải Châu', 23, 21),
(34, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 38 HOUR), 'Mất điện do thời tiết xấu. Nhiều khu vực bị mất điện tạm thời, ảnh hưởng đến sinh hoạt.', 'Hoàn Kiếm', b'0', DATE_SUB(NOW(), INTERVAL 38 HOUR), 21.0285, 105.8542, 'MEDIUM', 'APPROVED', 'Điện bị cắt tại Hoàn Kiếm', DATE_SUB(NOW(), INTERVAL 37 HOUR), 'Tràng Tiền', 24, 4),
(35, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 42 HOUR), 'Thiếu nước sinh hoạt do hạn hán kéo dài. Nhiều khu vực bị ảnh hưởng, cần hỗ trợ.', 'Quận 3', b'0', DATE_SUB(NOW(), INTERVAL 42 HOUR), 10.7795, 106.6995, 'MEDIUM', 'APPROVED', 'Nước sinh hoạt thiếu tại Quận 3', DATE_SUB(NOW(), INTERVAL 41 HOUR), 'Võ Thị Sáu', 25, 14),
(36, 'Hải Phòng', DATE_SUB(NOW(), INTERVAL 52 HOUR), 'Áp thấp nhiệt đới với mưa và gió mạnh. Giao thông bị ảnh hưởng, nhiều nhà cửa bị hư hỏng nhẹ.', 'Ngô Quyền', b'0', DATE_SUB(NOW(), INTERVAL 52 HOUR), 20.8449, 106.6881, 'MEDIUM', 'APPROVED', 'Áp thấp nhiệt đới tại Hải Phòng', DATE_SUB(NOW(), INTERVAL 51 HOUR), 'Máy Chai', 9, 40),
(37, 'Vũng Tàu', DATE_SUB(NOW(), INTERVAL 58 HOUR), 'Mưa lớn gây ngập úng. Nhiều tuyến đường bị ngập, giao thông bị cản trở.', 'Thành phố Vũng Tàu', b'0', DATE_SUB(NOW(), INTERVAL 58 HOUR), 10.3460, 107.0843, 'HIGH', 'APPROVED', 'Mưa lớn tại Vũng Tàu', DATE_SUB(NOW(), INTERVAL 57 HOUR), 'Thắng Tam', 1, 41),
(38, 'Cần Thơ', DATE_SUB(NOW(), INTERVAL 68 HOUR), 'Ngập úng do nước đọng không thoát được. Nhiều cửa hàng bị ảnh hưởng, giao thông bị cản trở.', 'Ninh Kiều', b'0', DATE_SUB(NOW(), INTERVAL 68 HOUR), 10.0452, 105.7469, 'MEDIUM', 'APPROVED', 'Ngập úng tại Cần Thơ', DATE_SUB(NOW(), INTERVAL 67 HOUR), 'Cái Khế', 4, 42),
(39, 'Huế', DATE_SUB(NOW(), INTERVAL 75 HOUR), 'Mưa dông lớn với sấm sét. Nhiều khu vực bị mất điện tạm thời, cây cối bị đổ.', 'Huế', b'0', DATE_SUB(NOW(), INTERVAL 75 HOUR), 16.4637, 107.5909, 'MEDIUM', 'APPROVED', 'Mưa dông tại Huế', DATE_SUB(NOW(), INTERVAL 74 HOUR), 'Phú Hội', 2, 27),
(40, 'Nha Trang', DATE_SUB(NOW(), INTERVAL 80 HOUR), 'Bão với gió mạnh và mưa lớn. Giao thông tê liệt, nhiều nhà cửa bị hư hỏng.', 'Nha Trang', b'0', DATE_SUB(NOW(), INTERVAL 80 HOUR), 12.2388, 109.1967, 'CRITICAL', 'APPROVED', 'Bão tại Nha Trang', DATE_SUB(NOW(), INTERVAL 79 HOUR), 'Vĩnh Hải', 8, 28),
(41, 'Đà Lạt', DATE_SUB(NOW(), INTERVAL 85 HOUR), 'Rét đậm với nhiệt độ xuống dưới 8°C. Nhiều người già và trẻ em bị ảnh hưởng.', 'Đà Lạt', b'0', DATE_SUB(NOW(), INTERVAL 85 HOUR), 11.9404, 108.4583, 'MEDIUM', 'APPROVED', 'Rét đậm tại Đà Lạt', DATE_SUB(NOW(), INTERVAL 84 HOUR), 'Phường 1', 21, 29),
(42, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 90 HOUR), 'Hạn hán kéo dài gây thiếu nước. Nhiều khu vực bị ảnh hưởng, cần hỗ trợ.', 'Hoàn Kiếm', b'0', DATE_SUB(NOW(), INTERVAL 90 HOUR), 21.0285, 105.8542, 'MEDIUM', 'APPROVED', 'Hạn hán tại Hà Nội', DATE_SUB(NOW(), INTERVAL 89 HOUR), 'Tràng Tiền', 12, 5),
(43, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 95 HOUR), 'Khô hạn với độ ẩm thấp. Nhiều cây cối bị khô héo, thiếu nước tưới tiêu.', 'Quận 1', b'0', DATE_SUB(NOW(), INTERVAL 95 HOUR), 10.8231, 106.6297, 'LOW', 'APPROVED', 'Khô hạn tại Quận 1', DATE_SUB(NOW(), INTERVAL 94 HOUR), 'Bến Nghé', 14, 11),
(44, 'Đà Nẵng', DATE_SUB(NOW(), INTERVAL 100 HOUR), 'Cháy rừng do thời tiết khô hanh. Nhiều khu vực bị ảnh hưởng, cần hỗ trợ khẩn cấp.', 'Hải Châu', b'0', DATE_SUB(NOW(), INTERVAL 100 HOUR), 16.0544, 108.2022, 'CRITICAL', 'APPROVED', 'Cháy rừng tại Đà Nẵng', DATE_SUB(NOW(), INTERVAL 99 HOUR), 'Hải Châu', 13, 22),
(45, 'Hà Nội', DATE_SUB(NOW(), INTERVAL 105 HOUR), 'Đường sá hư hỏng do thời tiết xấu. Nhiều đoạn đường bị hư hỏng, giao thông bị cản trở.', 'Hoàn Kiếm', b'0', DATE_SUB(NOW(), INTERVAL 105 HOUR), 21.0285, 105.8542, 'MEDIUM', 'APPROVED', 'Đường sá hư hỏng tại Hoàn Kiếm', DATE_SUB(NOW(), INTERVAL 104 HOUR), 'Tràng Tiền', 22, 4),
(46, 'Hồ Chí Minh', DATE_SUB(NOW(), INTERVAL 110 HOUR), 'Mưa lớn gây ngập úng tại Quận 5. Nhiều phương tiện bị kẹt, giao thông tê liệt.', 'Quận 5', b'0', DATE_SUB(NOW(), INTERVAL 110 HOUR), 10.7626, 106.6602, 'HIGH', 'APPROVED', 'Mưa lớn tại Quận 5', DATE_SUB(NOW(), INTERVAL 109 HOUR), 'Phường 14', 1, 15),
(47, 'Hải Phòng', DATE_SUB(NOW(), INTERVAL 115 HOUR), 'Gió mạnh làm đổ nhiều cây cối. Cần xử lý gấp để đảm bảo an toàn giao thông.', 'Ngô Quyền', b'0', DATE_SUB(NOW(), INTERVAL 115 HOUR), 20.8449, 106.6881, 'MEDIUM', 'APPROVED', 'Gió mạnh làm đổ cây tại Hải Phòng', DATE_SUB(NOW(), INTERVAL 114 HOUR), 'Máy Chai', 6, 24),
(48, 'Vũng Tàu', DATE_SUB(NOW(), INTERVAL 120 HOUR), 'Mưa dông với sấm sét. Nhiều khu vực bị mất điện tạm thời, cây cối bị đổ.', 'Thành phố Vũng Tàu', b'0', DATE_SUB(NOW(), INTERVAL 120 HOUR), 10.3460, 107.0843, 'MEDIUM', 'APPROVED', 'Mưa dông tại Vũng Tàu', DATE_SUB(NOW(), INTERVAL 119 HOUR), 'Thắng Tam', 2, 41),
(49, 'Cần Thơ', DATE_SUB(NOW(), INTERVAL 125 HOUR), 'Lũ lụt với nước dâng cao. Nhiều nhà cửa bị ngập, cần hỗ trợ khẩn cấp.', 'Ninh Kiều', b'0', DATE_SUB(NOW(), INTERVAL 125 HOUR), 10.0452, 105.7469, 'CRITICAL', 'APPROVED', 'Lũ lụt tại Cần Thơ', DATE_SUB(NOW(), INTERVAL 124 HOUR), 'Cái Khế', 3, 42),
(50, 'Huế', DATE_SUB(NOW(), INTERVAL 130 HOUR), 'Mưa lớn kéo dài gây ngập úng. Nhiều khu vực bị ảnh hưởng, giao thông bị cản trở.', 'Huế', b'0', DATE_SUB(NOW(), INTERVAL 130 HOUR), 16.4637, 107.5909, 'HIGH', 'APPROVED', 'Mưa lớn tại Huế', DATE_SUB(NOW(), INTERVAL 129 HOUR), 'Phú Hội', 1, 27);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `incident_types`
--
ALTER TABLE `incident_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKp186ha71urs7fo0vt1r2rbcrm` (`name`);

--
-- Indexes for table `report_images`
--
ALTER TABLE `report_images`
  ADD KEY `FK45aq6qdhqrun5ns3keco51feh` (`weather_reports_id`);

--
-- Indexes for table `report_votes`
--
ALTER TABLE `report_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_vote` (`report_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  ADD UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`);

--
-- Indexes for table `weather_alerts`
--
ALTER TABLE `weather_alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK6b7d4j7xgnyc7bo7jowr7wh55` (`admin_id`);

--
-- Indexes for table `weather_data`
--
ALTER TABLE `weather_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `weather_reports`
--
ALTER TABLE `weather_reports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKked2xvmpply6pcr2ijy5khv8w` (`incident_type_id`),
  ADD KEY `FKa1gp7b71iptin7d15qa1hfee6` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `incident_types`
--
ALTER TABLE `incident_types`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `report_votes`
--
ALTER TABLE `report_votes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=63;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `weather_alerts`
--
ALTER TABLE `weather_alerts`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `weather_data`
--
ALTER TABLE `weather_data`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT for table `weather_reports`
--
ALTER TABLE `weather_reports`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `report_images`
--
ALTER TABLE `report_images`
  ADD CONSTRAINT `FK45aq6qdhqrun5ns3keco51feh` FOREIGN KEY (`weather_reports_id`) REFERENCES `weather_reports` (`id`);

--
-- Constraints for table `report_votes`
--
ALTER TABLE `report_votes`
  ADD CONSTRAINT `report_votes_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `weather_reports` (`id`),
  ADD CONSTRAINT `report_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `weather_alerts`
--
ALTER TABLE `weather_alerts`
  ADD CONSTRAINT `FK6b7d4j7xgnyc7bo7jowr7wh55` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `weather_reports`
--
ALTER TABLE `weather_reports`
  ADD CONSTRAINT `FKa1gp7b71iptin7d15qa1hfee6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKked2xvmpply6pcr2ijy5khv8w` FOREIGN KEY (`incident_type_id`) REFERENCES `incident_types` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
