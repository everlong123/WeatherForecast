-- Script tự động tạo database weather_db
-- Chạy script này trong MySQL/phpMyAdmin trước khi start Spring Boot

-- Tạo database nếu chưa tồn tại
CREATE DATABASE IF NOT EXISTS weather_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Sử dụng database
USE weather_db;

-- Sau khi chạy script này, Spring Boot sẽ tự động tạo các bảng khi khởi động
-- (vì có spring.jpa.hibernate.ddl-auto=update)

