# Weather Forecast System

Hệ thống cảnh báo thời tiết dựa trên dữ liệu cộng đồng. Ứng dụng web cho phép người dùng báo cáo sự cố thời tiết và xem thông tin thời tiết theo thời gian thực.

## Yêu cầu hệ thống

- Java 17 hoặc cao hơn
- Node.js 14+ và npm
- MySQL 8.0+
- Maven hoặc Gradle

## Cài đặt

### 1. Database

Tạo database MySQL:

```sql
CREATE DATABASE weather_db;
```

### 2. Backend (Spring Boot)

1. Vào thư mục backend:
```bash
cd weather
```

2. Sao chép file cấu hình:
```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

3. Chỉnh sửa `src/main/resources/application.properties`:
   - Thay đổi `spring.datasource.password` với password MySQL của bạn
   - Cấu hình JWT secret key (khuyến nghị dùng chuỗi ngẫu nhiên dài)
   - Thêm OpenWeather API key (tùy chọn, lấy tại https://openweathermap.org/api)

4. Chạy ứng dụng:
```bash
./gradlew bootRun
```

Backend sẽ chạy tại: http://localhost:8080/api

### 3. Frontend (React)

1. Vào thư mục frontend:
```bash
cd weather/frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy ứng dụng:
```bash
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## Cấu trúc project

- `weather/src/main/java` - Backend Java/Spring Boot code
- `weather/frontend/src` - Frontend React code
- `weather/python_service` - Python service (tùy chọn)
- `tools` - Các công cụ hỗ trợ

## Tính năng

- Đăng ký/Đăng nhập người dùng
- Xem thời tiết theo thời gian thực
- Báo cáo sự cố thời tiết
- Xem bản đồ các sự cố
- Dashboard thống kê
- Quản trị hệ thống (Admin)

## API Endpoints

- `/api/auth/login` - Đăng nhập
- `/api/auth/register` - Đăng ký
- `/api/reports` - Quản lý báo cáo
- `/api/weather/current` - Thời tiết hiện tại
- `/api/incident-types` - Danh sách loại sự cố
- `/api/admin/*` - Các endpoint quản trị

## Ghi chú

- Đảm bảo MySQL đang chạy trước khi khởi động backend
- Backend cần chạy trước frontend
- Để sử dụng tính năng thời tiết, cần đăng ký OpenWeather API key

