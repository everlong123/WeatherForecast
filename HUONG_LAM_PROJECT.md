# HƯỚNG LÀM PROJECT - HỆ THỐNG CẢNH BÁO THỜI TIẾT

## 1. TỔNG QUAN DỰ ÁN

### 1.1. Tên dự án
**Hệ Thống Cảnh Báo Thời Tiết Dựa Trên Dữ Liệu Cộng Đồng**
(Weather Forecast System - Community-Based Weather Alert Platform)

### 1.2. Mô tả
Hệ thống web cho phép người dùng báo cáo sự cố thời tiết và xem thông tin thời tiết theo thời gian thực. Hệ thống tích hợp Machine Learning để dự đoán thời tiết, giúp cộng đồng cảnh báo sớm và ứng phó hiệu quả với các hiện tượng thời tiết cực đoan.

### 1.3. Đối tượng sử dụng
- **Người dùng thường**: Báo cáo sự cố thời tiết, xem thời tiết, xem bản đồ
- **Quản trị viên**: Duyệt báo cáo, quản lý người dùng, tạo cảnh báo

---

## 2. MỤC TIÊU DỰ ÁN

### 2.1. Mục tiêu chính
1. **Tạo nền tảng chia sẻ thông tin thời tiết**
   - Cho phép người dùng báo cáo sự cố thời tiết từ cộng đồng
   - Thu thập và quản lý dữ liệu thời tiết theo thời gian thực

2. **Cảnh báo sớm các sự cố thời tiết**
   - Hiển thị báo cáo trên bản đồ tương tác
   - Phân loại mức độ nghiêm trọng
   - Hỗ trợ cộng đồng ứng phó kịp thời

3. **Dự đoán thời tiết bằng Machine Learning**
   - Sử dụng Python ML model để dự đoán thời tiết
   - Học từ dữ liệu lịch sử để cải thiện độ chính xác

4. **Quản lý và phân tích dữ liệu**
   - Dashboard thống kê tổng quan
   - Phân tích xu hướng thời tiết
   - Quản lý người dùng và báo cáo

### 2.2. Mục tiêu kỹ thuật
- Xây dựng hệ thống full-stack hiện đại
- Tích hợp Machine Learning vào ứng dụng web
- Đảm bảo bảo mật và hiệu suất
- Responsive design, hỗ trợ nhiều thiết bị

---

## 3. CHỨC NĂNG HỆ THỐNG

### 3.1. Quản lý người dùng
- **Đăng ký/Đăng nhập**: Xác thực bằng JWT token
- **Phân quyền**: USER và ADMIN
- **Quản lý profile**: Cập nhật thông tin cá nhân

### 3.2. Quản lý báo cáo sự cố
- **Tạo báo cáo**: Người dùng báo cáo sự cố thời tiết
  - Tiêu đề, mô tả, địa điểm
  - Phân loại loại sự cố (mưa lớn, gió mạnh, lũ lụt, ...)
  - Mức độ nghiêm trọng (LOW, MEDIUM, HIGH, CRITICAL)
  - Upload hình ảnh
- **Quản lý báo cáo**: 
  - Xem danh sách báo cáo
  - Chỉnh sửa/Xóa báo cáo của mình
  - Admin duyệt/từ chối/giải quyết báo cáo

### 3.3. Hiển thị thời tiết
- **Thời tiết hiện tại**: 
  - Tự động lấy vị trí người dùng (Geolocation API)
  - Hoặc chọn địa điểm từ dropdown (Tỉnh/Quận/Xã)
  - Hiển thị nhiệt độ, độ ẩm, gió, mây, mưa
- **Lịch sử thời tiết**: Xem dữ liệu thời tiết theo thời gian
- **Dự đoán thời tiết**: 
  - Dự đoán từ 1-168 giờ (7 ngày)
  - Sử dụng Python ML model (Random Forest)

### 3.4. Bản đồ tương tác
- **Hiển thị báo cáo trên bản đồ**: 
  - Markers theo địa điểm
  - Màu sắc theo trạng thái và mức độ
  - Click để xem chi tiết
- **Tìm kiếm địa điểm**: Tìm kiếm theo tỉnh/quận/xã
- **Lọc báo cáo**: Lọc theo loại sự cố, trạng thái

### 3.5. Dashboard thống kê
- **Thống kê tổng quan**:
  - Tổng số báo cáo, người dùng
  - Báo cáo theo loại sự cố
  - Báo cáo theo địa điểm
  - Biểu đồ phân tích
- **Phân tích xu hướng**: Thống kê theo thời gian

### 3.6. Quản trị hệ thống (Admin)
- **Quản lý báo cáo**: Duyệt, từ chối, giải quyết báo cáo
- **Quản lý người dùng**: Xem, khóa/mở khóa, phân quyền
- **Quản lý loại sự cố**: Thêm, sửa, xóa loại sự cố
- **Tạo cảnh báo**: Tạo cảnh báo thời tiết cho cộng đồng
- **Lịch sử hành động**: Theo dõi các thao tác admin

---

## 4. THIẾT KẾ DATABASE

### 4.1. Sơ đồ ER (Entity Relationship)

```
┌─────────────┐         ┌──────────────────┐
│    User     │────────<│  WeatherReport   │
└─────────────┘         └──────────────────┘
     │                           │
     │                           │
     │                           ▼
     │                   ┌──────────────┐
     │                   │ IncidentType │
     │                   └──────────────┘
     │
     │
     ▼
┌─────────────┐
│ WeatherAlert│
└─────────────┘

┌─────────────┐
│ WeatherData │
└─────────────┘

┌─────────────┐
│ AdminAction│
└─────────────┘
```

### 4.2. Các bảng dữ liệu

#### 4.2.1. Bảng `users`
Quản lý thông tin người dùng

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | BIGINT | Primary key |
| username | VARCHAR(50) | Tên đăng nhập (unique) |
| email | VARCHAR(100) | Email (unique) |
| password | VARCHAR(255) | Mật khẩu (đã mã hóa) |
| role | ENUM | USER hoặc ADMIN |
| full_name | VARCHAR(100) | Họ tên |
| phone | VARCHAR(20) | Số điện thoại |
| address | VARCHAR(255) | Địa chỉ |
| district | VARCHAR(100) | Quận/Huyện |
| ward | VARCHAR(100) | Xã/Phường |
| enabled | BOOLEAN | Trạng thái kích hoạt |
| created_at | DATETIME | Ngày tạo |
| updated_at | DATETIME | Ngày cập nhật |

#### 4.2.2. Bảng `weather_reports`
Lưu trữ báo cáo sự cố thời tiết

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | BIGINT | Primary key |
| user_id | BIGINT | Foreign key → users |
| incident_type_id | BIGINT | Foreign key → incident_types |
| title | VARCHAR(255) | Tiêu đề báo cáo |
| description | TEXT | Mô tả chi tiết |
| address | VARCHAR(255) | Địa chỉ |
| city | VARCHAR(100) | Tỉnh/Thành phố |
| district | VARCHAR(100) | Quận/Huyện |
| ward | VARCHAR(100) | Xã/Phường |
| status | ENUM | PENDING, APPROVED, REJECTED, RESOLVED |
| severity | ENUM | LOW, MEDIUM, HIGH, CRITICAL |
| incident_time | DATETIME | Thời gian xảy ra sự cố |
| created_at | DATETIME | Ngày tạo |
| updated_at | DATETIME | Ngày cập nhật |

#### 4.2.3. Bảng `report_images`
Lưu trữ hình ảnh của báo cáo

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| report_id | BIGINT | Foreign key → weather_reports |
| image_url | VARCHAR(500) | Đường dẫn hình ảnh |

#### 4.2.4. Bảng `incident_types`
Danh mục loại sự cố thời tiết

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | BIGINT | Primary key |
| name | VARCHAR(100) | Tên loại sự cố |
| description | TEXT | Mô tả |
| icon | VARCHAR(50) | Icon (emoji) |
| color | VARCHAR(20) | Màu sắc |

#### 4.2.5. Bảng `weather_data`
Lưu trữ dữ liệu thời tiết

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | BIGINT | Primary key |
| latitude | DOUBLE | Vĩ độ |
| longitude | DOUBLE | Kinh độ |
| city | VARCHAR(100) | Tỉnh/Thành phố |
| district | VARCHAR(100) | Quận/Huyện |
| ward | VARCHAR(100) | Xã/Phường |
| temperature | DOUBLE | Nhiệt độ (°C) |
| feels_like | DOUBLE | Cảm giác như (°C) |
| humidity | DOUBLE | Độ ẩm (%) |
| pressure | DOUBLE | Áp suất (hPa) |
| wind_speed | DOUBLE | Tốc độ gió (m/s) |
| wind_direction | DOUBLE | Hướng gió (độ) |
| visibility | DOUBLE | Tầm nhìn (km) |
| cloudiness | DOUBLE | Mây (%) |
| rain_volume | DOUBLE | Lượng mưa (mm) |
| snow_volume | DOUBLE | Lượng tuyết (mm) |
| main_weather | VARCHAR(50) | Loại thời tiết |
| description | VARCHAR(255) | Mô tả |
| icon | VARCHAR(100) | Icon |
| recorded_at | DATETIME | Thời gian ghi nhận |
| created_at | DATETIME | Ngày tạo |

#### 4.2.6. Bảng `weather_alerts`
Cảnh báo thời tiết từ admin

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | BIGINT | Primary key |
| admin_id | BIGINT | Foreign key → users |
| title | VARCHAR(255) | Tiêu đề cảnh báo |
| message | TEXT | Nội dung cảnh báo |
| level | ENUM | INFO, WARNING, DANGER, CRITICAL |
| city | VARCHAR(100) | Tỉnh/Thành phố |
| district | VARCHAR(100) | Quận/Huyện |
| ward | VARCHAR(100) | Xã/Phường |
| latitude | DOUBLE | Vĩ độ |
| longitude | DOUBLE | Kinh độ |
| radius | DOUBLE | Bán kính (km) |
| start_time | DATETIME | Thời gian bắt đầu |
| end_time | DATETIME | Thời gian kết thúc |
| active | BOOLEAN | Trạng thái |
| created_at | DATETIME | Ngày tạo |
| updated_at | DATETIME | Ngày cập nhật |

#### 4.2.7. Bảng `admin_actions`
Lịch sử hành động của admin

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| id | BIGINT | Primary key |
| admin_id | BIGINT | Foreign key → users |
| action_type | ENUM | APPROVE_REPORT, REJECT_REPORT, ... |
| target_type | VARCHAR(50) | Loại đối tượng |
| target_id | BIGINT | ID đối tượng |
| description | TEXT | Mô tả |
| created_at | DATETIME | Ngày tạo |

### 4.3. Quan hệ giữa các bảng
- **User** → **WeatherReport** (1-N): Một user có nhiều báo cáo
- **User** → **WeatherAlert** (1-N): Một admin tạo nhiều cảnh báo
- **User** → **AdminAction** (1-N): Một admin có nhiều hành động
- **IncidentType** → **WeatherReport** (1-N): Một loại sự cố có nhiều báo cáo
- **WeatherReport** → **report_images** (1-N): Một báo cáo có nhiều hình ảnh

---

## 5. CÔNG NGHỆ SỬ DỤNG

### 5.1. Backend

#### 5.1.1. Framework & Language
- **Java 17**: Ngôn ngữ lập trình
- **Spring Boot 4.0**: Framework chính
- **Spring Security**: Bảo mật và xác thực
- **Spring Data JPA**: ORM và quản lý database
- **Gradle**: Build tool

#### 5.1.2. Database
- **MySQL 8.0+**: Hệ quản trị cơ sở dữ liệu
- **Hibernate/JPA**: ORM framework

#### 5.1.3. Authentication & Security
- **JWT (JSON Web Token)**: Xác thực stateless
- **BCrypt**: Mã hóa mật khẩu
- **CORS**: Cross-origin resource sharing

#### 5.1.4. API
- **RESTful API**: Kiến trúc API
- **Jackson**: JSON serialization/deserialization

### 5.2. Frontend

#### 5.2.1. Framework & Library
- **React 19.2**: UI framework
- **React Router**: Điều hướng
- **Axios**: HTTP client
- **React Icons**: Icon library

#### 5.2.2. Visualization
- **Leaflet**: Bản đồ tương tác
- **React Leaflet**: React wrapper cho Leaflet
- **Recharts**: Biểu đồ và thống kê

#### 5.2.3. Build Tool
- **npm**: Package manager
- **React Scripts**: Build và development tools

### 5.3. Machine Learning

#### 5.3.1. Python Service
- **Python 3.8+**: Ngôn ngữ lập trình
- **Flask**: Web framework
- **scikit-learn**: Machine Learning library
- **Random Forest Regressor**: Algorithm dự đoán
- **Pandas & NumPy**: Data processing

#### 5.3.2. Model
- **Algorithm**: Random Forest Regressor
- **Features**: Month, Hour, Humidity, Pressure, Wind Speed, Cloudiness
- **Target**: Temperature
- **Training**: Dữ liệu lịch sử từ database

### 5.4. Dữ liệu địa điểm
- **JSON files**: 
  - `provinces.json`: 63 tỉnh/thành phố
  - `districts.json`: 705 quận/huyện
  - `wards.json`: 10,599 xã/phường
  - `location_coordinates.json`: Tọa độ cho tất cả địa điểm

---

## 6. KIẾN TRÚC HỆ THỐNG

### 6.1. Kiến trúc tổng quan

```
┌─────────────────────────────────────┐
│   FRONTEND (React)                   │
│   - React Router                     │
│   - Leaflet Maps                     │
│   - Recharts                         │
│   - Axios                            │
└──────────────┬──────────────────────┘
               │ HTTP/REST API
┌──────────────▼──────────────────────┐
│   BACKEND (Spring Boot)              │
│   - REST API                         │
│   - Spring Security + JWT             │
│   - Spring Data JPA                   │
│   - Business Logic                   │
└──────────────┬──────────────────────┘
               │
               │ HTTP REST API
┌──────────────▼──────────────────────┐
│   PYTHON ML SERVICE (Flask)          │
│   - Weather Prediction Model         │
│   - Random Forest Regressor          │
└──────────────────────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   DATABASE (MySQL)                   │
│   - Users                            │
│   - Weather Reports                  │
│   - Weather Data                     │
│   - Incident Types                   │
└──────────────────────────────────────┘
```

### 6.2. Luồng xử lý báo cáo

```
1. Người dùng tạo báo cáo
   ↓
2. Frontend gửi POST /api/reports
   ↓
3. Backend validate và lưu vào database
   ↓
4. Báo cáo ở trạng thái PENDING
   ↓
5. Admin xem xét báo cáo
   ↓
6. Admin duyệt (APPROVED) hoặc từ chối (REJECTED)
   ↓
7. Báo cáo được hiển thị trên bản đồ (nếu APPROVED)
   ↓
8. Admin đánh dấu RESOLVED khi xử lý xong
```

### 6.3. Luồng dự đoán thời tiết

```
1. User yêu cầu dự đoán thời tiết
   ↓
2. Frontend gọi GET /api/weather/forecast
   ↓
3. Backend lấy thời tiết hiện tại từ database
   ↓
4. Backend gọi Python ML service POST /predict
   ↓
5. Python service:
   - Load model (Random Forest)
   - Predict dựa trên features
   - Trả về predictions
   ↓
6. Backend trả về kết quả cho Frontend
   ↓
7. Frontend hiển thị dự đoán
```

---

## 7. DỮ LIỆU THỜI TIẾT

### 7.1. Tạo dữ liệu thời tiết (Mock Data)

Thay vì gọi API bên ngoài, hệ thống tự tạo dữ liệu thời tiết:

- **MockWeatherService**: Service tạo dữ liệu giả
- **Template-based generation**: 
  - Mùa mưa (tháng 5-10): Nhiệt độ 25-32°C, độ ẩm cao, có mưa
  - Mùa khô (tháng 11-4): Nhiệt độ 20-35°C, độ ẩm thấp, trời quang
- **Random với range hợp lý**: Đảm bảo dữ liệu realistic
- **Seed data**: Tự động tạo dữ liệu mẫu khi khởi động

### 7.2. Lấy tọa độ từ địa điểm

- **LocationCoordinateService**: Service lấy tọa độ từ địa điểm
- **location_coordinates.json**: Chứa tọa độ cho:
  - 63 tỉnh/thành phố
  - 705 quận/huyện
  - 10,599 xã/phường
- **Auto-mapping**: Tự động map địa điểm → tọa độ → dữ liệu thời tiết

---

## 8. MACHINE LEARNING - DỰ ĐOÁN THỜI TIẾT

### 8.1. Model Architecture

- **Algorithm**: Random Forest Regressor
- **Features**:
  - Month (1-12)
  - Hour (0-23)
  - Humidity (%)
  - Pressure (hPa)
  - Wind Speed (m/s)
  - Cloudiness (%)
- **Target**: Temperature (°C)

### 8.2. Training Process

1. **Initial Training**: 
   - Tạo model với dữ liệu mẫu
   - Lưu model vào `models/weather_model.pkl`

2. **Retrain với dữ liệu thực**:
   - Thu thập dữ liệu lịch sử từ database
   - Retrain model định kỳ
   - Cải thiện độ chính xác theo thời gian

### 8.3. Prediction Process

1. Nhận thời tiết hiện tại
2. Generate features cho các giờ tiếp theo
3. Predict nhiệt độ
4. Điều chỉnh theo mùa và thời gian trong ngày
5. Dự đoán các yếu tố khác (độ ẩm, gió, loại thời tiết)

### 8.4. API Endpoints

- `POST /predict`: Dự đoán thời tiết (1-168 giờ)
- `POST /retrain`: Retrain model với dữ liệu mới
- `GET /health`: Health check

---

## 9. BẢO MẬT

### 9.1. Authentication
- JWT Token-based authentication
- Password encryption (BCrypt)
- Token expiration

### 9.2. Authorization
- Role-based access control (RBAC)
- Phân quyền USER/ADMIN
- Secure endpoints

### 9.3. Data Validation
- Input validation
- SQL injection prevention (JPA)
- XSS protection

### 9.4. CORS Configuration
- Cross-origin resource sharing
- Whitelist domains

---

## 10. QUY TRÌNH PHÁT TRIỂN

### 10.1. Planning & Design
- Phân tích yêu cầu
- Thiết kế database
- API design
- UI/UX mockup

### 10.2. Backend Development
- Setup Spring Boot project
- Implement entities & repositories
- Develop services & controllers
- Security configuration
- API testing

### 10.3. Frontend Development
- Setup React project
- Component development
- API integration
- Map integration
- State management

### 10.4. Machine Learning Development
- Tạo Python service
- Develop prediction model
- Train và test model
- Integrate với Spring Boot

### 10.5. Integration & Testing
- API integration testing
- End-to-end testing
- Bug fixing
- Performance optimization

### 10.6. Deployment
- Database setup
- Backend deployment
- Frontend build & deploy
- Python service deployment

---

## 11. KẾT QUẢ ĐẠT ĐƯỢC

### 11.1. Tính năng hoàn thành
✅ Hệ thống authentication hoàn chỉnh  
✅ RESTful API đầy đủ tính năng  
✅ Giao diện người dùng thân thiện  
✅ Tích hợp bản đồ tương tác  
✅ Dashboard thống kê  
✅ Admin panel  
✅ Machine Learning prediction  
✅ Tự tạo dữ liệu thời tiết  
✅ Mapping địa điểm → tọa độ  

### 11.2. Metrics
- **API endpoints**: 20+
- **React components**: 15+
- **Database tables**: 7+
- **Tính năng chính**: 6 modules
- **Loại sự cố**: 20+ loại
- **Địa điểm**: 63 tỉnh, 705 quận, 10,599 xã

---

## 12. HƯỚNG PHÁT TRIỂN TƯƠNG LAI

### 12.1. Mobile App
- React Native
- Push notifications
- Offline mode

### 12.2. Advanced Features
- Machine Learning cải tiến (LSTM, Transformer)
- Chat/Forum cộng đồng
- Email/SMS alerts
- Weather forecasting AI nâng cao

### 12.3. Performance
- Redis caching
- CDN cho static files
- Database optimization
- Load balancing

### 12.4. Analytics
- Advanced reporting
- Data export
- Custom dashboards
- Real-time analytics

### 12.5. Integration
- Social media sharing
- Government API integration
- IoT sensors integration

---

## 13. KẾT LUẬN

Hệ thống Cảnh báo Thời tiết là một nền tảng web hiện đại, tích hợp Machine Learning để dự đoán thời tiết và hỗ trợ cộng đồng trong việc báo cáo và ứng phó với các sự cố thời tiết. Hệ thống sử dụng các công nghệ tiên tiến, đảm bảo hiệu suất, bảo mật và khả năng mở rộng.

**Điểm mạnh:**
- Kiến trúc rõ ràng, dễ bảo trì
- Tích hợp ML để dự đoán
- Giao diện thân thiện, dễ sử dụng
- Bảo mật tốt với JWT
- Không phụ thuộc API bên ngoài

**Ứng dụng thực tế:**
- Cảnh báo sớm thiên tai
- Hỗ trợ cộng đồng ứng phó
- Thu thập dữ liệu thời tiết
- Phân tích xu hướng

---

---

## 14. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY

### 14.1. Yêu cầu hệ thống
- Java 17 hoặc cao hơn
- Node.js 14+ và npm
- MySQL 8.0+ (đang chạy)
- Python 3.8+ (cho ML service, tùy chọn)

### 14.2. Cài đặt Database

1. **Khởi động MySQL Server**
   ```bash
   # Windows: Kiểm tra service MySQL
   # Services → MySQL → Start
   
   # Hoặc dùng command line
   net start MySQL80
   ```

2. **Tạo database**
   ```sql
   CREATE DATABASE weather_db;
   ```

3. **Cấu hình trong `application.properties`**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/weather_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD  # ⚠️ QUAN TRỌNG: Điền password MySQL của bạn
   ```

### 14.3. Chạy Backend

```bash
cd weather
./gradlew bootRun
# Hoặc trên Windows:
gradlew.bat bootRun
```

Backend sẽ chạy tại: `http://localhost:8080/api`

**Lưu ý**: Nếu gặp lỗi "Connection refused":
- Kiểm tra MySQL đang chạy: `net start MySQL80` (Windows)
- Kiểm tra password trong `application.properties`
- Kiểm tra port 3306 có bị chiếm không

### 14.4. Chạy Frontend

```bash
cd weather/frontend
npm install
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

### 14.5. Chạy Python ML Service (Tùy chọn)

```bash
cd python_ml
pip install -r requirements.txt
python app.py
```

Python service sẽ chạy tại: `http://localhost:5000`

**Lưu ý**: Nếu không chạy Python service, tính năng dự đoán thời tiết sẽ không hoạt động, nhưng các tính năng khác vẫn bình thường.

### 14.6. Thứ tự khởi động

1. **MySQL** (bắt buộc)
2. **Backend Spring Boot** (bắt buộc)
3. **Frontend React** (bắt buộc)
4. **Python ML Service** (tùy chọn)

---

**Ngày tạo**: 2024  
**Phiên bản**: 1.0  
**Tác giả**: [Tên nhóm]

