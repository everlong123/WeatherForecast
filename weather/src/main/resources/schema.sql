-- Script tạo schema thủ công cho weather_db
-- Chạy script này trong MySQL trước khi chạy ứng dụng

USE weather_db;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. Tạo bảng users (không có FK)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(50),
    address VARCHAR(500),
    district VARCHAR(255),
    ward VARCHAR(255),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tạo bảng incident_types (không có FK)
CREATE TABLE IF NOT EXISTS incident_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(50),
    created_at DATETIME(6),
    updated_at DATETIME(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Tạo bảng weather_data (không có FK)
CREATE TABLE IF NOT EXISTS weather_data (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    city VARCHAR(255),
    district VARCHAR(255),
    ward VARCHAR(255),
    temperature DOUBLE NOT NULL,
    feels_like DOUBLE,
    humidity DOUBLE,
    pressure DOUBLE,
    wind_speed DOUBLE,
    wind_direction DOUBLE,
    visibility DOUBLE,
    cloudiness DOUBLE,
    rain_volume DOUBLE,
    snow_volume DOUBLE,
    main_weather VARCHAR(255),
    description TEXT,
    icon VARCHAR(50),
    recorded_at DATETIME(6) NOT NULL,
    created_at DATETIME(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Tạo bảng weather_reports (có FK đến users và incident_types)
CREATE TABLE IF NOT EXISTS weather_reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    incident_type_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(500),
    district VARCHAR(255),
    ward VARCHAR(255),
    city VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    severity VARCHAR(50) NOT NULL DEFAULT 'LOW',
    incident_time DATETIME(6),
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT FK_weather_reports_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT FK_weather_reports_incident_type FOREIGN KEY (incident_type_id) REFERENCES incident_types(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Tạo bảng report_images (ElementCollection của weather_reports)
CREATE TABLE IF NOT EXISTS report_images (
    weather_reports_id BIGINT NOT NULL,
    image_url VARCHAR(500),
    CONSTRAINT FK_report_images_weather_report FOREIGN KEY (weather_reports_id) REFERENCES weather_reports(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tạo bảng weather_alerts (có FK đến users)
CREATE TABLE IF NOT EXISTS weather_alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id BIGINT NOT NULL,
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    level VARCHAR(50) NOT NULL DEFAULT 'INFO',
    city VARCHAR(255),
    district VARCHAR(255),
    ward VARCHAR(255),
    latitude DOUBLE,
    longitude DOUBLE,
    radius DOUBLE,
    start_time DATETIME(6) NOT NULL,
    end_time DATETIME(6),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT FK_weather_alerts_admin FOREIGN KEY (admin_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

