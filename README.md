# ClimateShare

**Cộng đồng chia sẻ thông tin thời tiết và cảnh báo sự cố**

Nền tảng kết nối cộng đồng để cùng chia sẻ, theo dõi và cảnh báo về các sự cố thời tiết. Giúp mọi người chủ động ứng phó và bảo vệ an toàn thông qua việc chia sẻ thông tin kịp thời và chính xác.

## Yêu cầu hệ thống

- Java 17 hoặc cao hơn
- Node.js 14+ và npm
- XAMPP (MySQL/MariaDB) hoặc MySQL 8.0+
- Gradle

## Cài đặt

### 1. Database (XAMPP)

1. Khởi động XAMPP Control Panel
2. Start Apache và MySQL services
3. Mở phpMyAdmin: http://localhost/phpmyadmin
4. Tạo database mới:

```sql
CREATE DATABASE weather_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. Chạy migration scripts nếu database đã tồn tại:
   - `src/main/resources/migration_add_trust_score.sql` - Thêm trust_score column
   - `src/main/resources/migration_add_user_location.sql` - Thêm latitude/longitude columns

**Lưu ý**: XAMPP thường sử dụng MySQL/MariaDB trên port 3306, username mặc định là `root` và password để trống.

### 2. Backend (Spring Boot)

1. Vào thư mục backend:
```bash
cd weather
```

2. Chỉnh sửa `src/main/resources/application.properties`:
   - **XAMPP**: Thường không cần password, để trống `spring.datasource.password=`
   - Nếu có password MySQL, thay đổi `spring.datasource.password` với password của bạn
   - Cấu hình JWT secret key (khuyến nghị dùng chuỗi ngẫu nhiên dài)
   - Thêm OpenWeather API key (tùy chọn, lấy tại https://openweathermap.org/api)

3. Chạy ứng dụng:
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
- `weather/src/main/resources` - Configuration files và migration scripts
- `weather/uploads` - Thư mục lưu ảnh upload

## Tính năng chính

### Cho người dùng
- ✅ Đăng ký/Đăng nhập với JWT authentication
- ✅ Xem thời tiết real-time, dự báo 24h và lịch sử
- ✅ Tạo và quản lý báo cáo sự cố thời tiết
- ✅ Xem bản đồ tương tác với tất cả báo cáo
- ✅ Vote xác nhận/phản đối báo cáo (trong phạm vi 10km)
- ✅ Xem và cập nhật thông tin cá nhân (Profile)
- ✅ Xem trust score và thống kê cá nhân
- ✅ Lọc báo cáo theo vị trí (GPS hoặc profile address)

### Cho Admin
- ✅ Dashboard thống kê tổng quan với bộ lọc (thời gian, trạng thái)
- ✅ Quản lý báo cáo với gợi ý thông minh (duyệt/từ chối/giải quyết)
- ✅ Quản lý người dùng (CRUD, khóa/mở khóa, xem trust score)
- ✅ Quản lý loại sự cố (CRUD)
- ✅ Quản lý cảnh báo thời tiết
- ✅ Hệ thống gợi ý dựa trên priority score
- ✅ Filter dashboard theo thời gian (7/30/90 ngày) và trạng thái

### Hệ thống thông minh
- ✅ **Trust Score**: Độ tin cậy người dùng (bắt đầu từ 0, không giới hạn)
  - Tăng khi report được approve (+5)
  - Giảm khi report bị reject (-3)
  - Trust Levels: EXPERT, ADVANCED, INTERMEDIATE, BEGINNER
- ✅ **Community Vote**: Xác nhận từ cộng đồng
- ✅ **Admin Suggestions**: Gợi ý quyết định dựa trên nhiều yếu tố

## API Endpoints chính

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user hiện tại
- `GET /api/auth/me/stats` - Thống kê user
- `PUT /api/auth/me` - Cập nhật profile

### Weather
- `GET /api/weather/current` - Thời tiết hiện tại
- `GET /api/weather/forecast` - Dự báo 24h
- `GET /api/weather/history` - Lịch sử thời tiết

### Reports
- `GET /api/reports` - Tất cả báo cáo
- `GET /api/reports/my-reports` - Báo cáo của user
- `POST /api/reports` - Tạo báo cáo
- `PUT /api/reports/{id}` - Cập nhật báo cáo
- `DELETE /api/reports/{id}` - Xóa báo cáo
- `POST /api/reports/{id}/vote` - Vote báo cáo

### Admin
- `GET /api/admin/stats` - Thống kê
- `GET /api/admin/reports` - Tất cả báo cáo (với suggestions)
- `PUT /api/admin/reports/{id}/approve` - Duyệt báo cáo
- `PUT /api/admin/reports/{id}/reject` - Từ chối báo cáo
- `GET /api/admin/users` - Quản lý users
- `GET /api/admin/incident-types` - Quản lý loại sự cố

### Locations
- `GET /api/locations/coordinates` - Geocoding (address → lat/lng)
- `GET /api/locations/reverse` - Reverse geocoding (lat/lng → address)

### Upload
- `POST /uploads` - Upload ảnh (không qua `/api` prefix)

## Công nghệ sử dụng

### Backend
- Spring Boot 4.0.0
- Spring Security + JWT
- Spring Data JPA / Hibernate
- MySQL 8.0
- Gradle

### Frontend
- React 19.2.1
- React Router DOM 7.10.1
- Axios 1.13.2
- Leaflet Maps
- React Icons
- Recharts

### APIs bên thứ ba
- Open-Meteo API (Weather data, miễn phí)
- OpenWeatherMap API (Weather data, cần API key)
- BigDataCloud API (Reverse geocoding, miễn phí)

## Ghi chú

- **XAMPP**: Đảm bảo MySQL service đang chạy trong XAMPP Control Panel trước khi khởi động backend
- Backend cần chạy trước frontend
- Trust score mặc định là 0 cho user mới
- Vote chỉ hoạt động trong phạm vi 10km từ vị trí báo cáo
- User có thể cập nhật location trong profile page
- Dashboard có bộ lọc để xem thống kê theo thời gian và trạng thái
- Map có thể di chuyển tự do, không bị giới hạn trong phạm vi Việt Nam

## Demo

Để chạy demo với cả user và admin frontend:
1. Backend: Chạy trên port 8080
2. User Frontend: Chạy trên port 3000
3. Admin Frontend: Có thể chạy trên port khác hoặc dùng cùng port với user (chuyển đổi qua login)

## License

Đồ án môn học Lập trình Web
