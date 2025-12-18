# HƯỚNG LÀM PROJECT - HỆ THỐNG CẢNH BÁO THỜI TIẾT

## 1. TỔNG QUAN

**Hệ Thống Cảnh Báo Thời Tiết Dựa Trên Dữ Liệu Cộng Đồng**

Hệ thống web cho phép người dùng báo cáo sự cố thời tiết và xem thông tin thời tiết theo thời gian thực. Tích hợp Machine Learning để dự đoán thời tiết, hỗ trợ cộng đồng cảnh báo sớm và ứng phó với các hiện tượng thời tiết cực đoan.

**Đối tượng sử dụng:**
- Người dùng: Báo cáo sự cố, xem thời tiết, xem bản đồ
- Admin: Duyệt báo cáo, quản lý người dùng, tạo cảnh báo

---

## 2. MỤC TIÊU

1. Nền tảng chia sẻ thông tin thời tiết từ cộng đồng
2. Cảnh báo sớm sự cố thời tiết qua bản đồ tương tác
3. Dự đoán thời tiết bằng Machine Learning
4. Dashboard thống kê và phân tích

---

## 3. CHỨC NĂNG

### 3.1. Quản lý người dùng
- **Đăng ký/Đăng nhập**: Xác thực bằng JWT token, mã hóa mật khẩu BCrypt
- **Phân quyền**: USER (người dùng thường) và ADMIN (quản trị viên)
- **Quản lý profile**: Cập nhật thông tin cá nhân (họ tên, email, số điện thoại, địa chỉ)
- **Bảo mật**: Token tự động hết hạn, yêu cầu đăng nhập lại

### 3.2. Báo cáo sự cố thời tiết
- **Tạo báo cáo**: 
  - Tiêu đề, mô tả chi tiết
  - Chọn địa điểm (Tỉnh/Quận/Xã) hoặc tự động lấy vị trí (Geolocation)
  - Chọn loại sự cố (mưa lớn, gió mạnh, lũ lụt, sạt lở, ...)
  - Phân loại mức độ nghiêm trọng (LOW, MEDIUM, HIGH, CRITICAL)
  - Upload nhiều hình ảnh minh chứng
  - Chọn thời gian xảy ra sự cố
- **Quản lý báo cáo**: 
  - Xem danh sách báo cáo của mình
  - Chỉnh sửa/Xóa báo cáo (chỉ báo cáo của mình)
  - Xem chi tiết báo cáo
- **Duyệt báo cáo (Admin)**: 
  - Xem danh sách báo cáo PENDING
  - Duyệt (APPROVED) hoặc từ chối (REJECTED) báo cáo
  - Đánh dấu RESOLVED khi đã xử lý xong
  - Ghi log hành động vào admin_actions

### 3.3. Hiển thị thời tiết
- **Thời tiết hiện tại**: 
  - Tự động lấy vị trí người dùng (Geolocation API)
  - Hoặc chọn địa điểm từ dropdown (Tỉnh/Quận/Xã)
  - Hiển thị: nhiệt độ, độ ẩm, gió, mây, mưa, áp suất, tầm nhìn
  - Icon và mô tả thời tiết
- **Lịch sử thời tiết**: Xem dữ liệu thời tiết đã lưu trong database
- **Dự đoán thời tiết**: 
  - Dự đoán từ 1-168 giờ (7 ngày)
  - Sử dụng Python ML model (Random Forest Regressor)
  - Hiển thị biểu đồ nhiệt độ, độ ẩm theo thời gian
  - Dự đoán các yếu tố: nhiệt độ, độ ẩm, gió, mây, loại thời tiết

### 3.4. Bản đồ tương tác
- **Hiển thị báo cáo trên bản đồ**: 
  - Markers theo địa điểm của báo cáo
  - Màu sắc markers theo trạng thái (PENDING, APPROVED, RESOLVED) và mức độ nghiêm trọng
  - Click marker để xem popup chi tiết báo cáo
  - Hiển thị hình ảnh trong popup
- **Tìm kiếm địa điểm**: Tìm kiếm theo Tỉnh/Quận/Xã
- **Lọc báo cáo**: 
  - Lọc theo loại sự cố
  - Lọc theo trạng thái (PENDING, APPROVED, REJECTED, RESOLVED)
  - Lọc theo mức độ nghiêm trọng
  - Lọc theo khoảng thời gian
- **Bản đồ satellite**: Chuyển đổi giữa bản đồ thường và satellite imagery

### 3.5. Dashboard thống kê
- **Thống kê tổng quan**: 
  - Tổng số báo cáo, người dùng
  - Số báo cáo theo trạng thái (PENDING, APPROVED, REJECTED, RESOLVED)
  - Số báo cáo theo mức độ nghiêm trọng
- **Phân tích theo loại sự cố**: Biểu đồ cột/pie chart
- **Phân tích theo địa điểm**: Top tỉnh/quận có nhiều báo cáo nhất
- **Phân tích theo thời gian**: Biểu đồ xu hướng theo ngày/tuần/tháng
- **Thống kê thời tiết**: Nhiệt độ trung bình, độ ẩm trung bình

### 3.6. Quản trị hệ thống (Admin)
- **Quản lý báo cáo**: 
  - Xem tất cả báo cáo (kèm filter và search)
  - Duyệt/từ chối/giải quyết báo cáo
  - Xem chi tiết và hình ảnh báo cáo
- **Quản lý người dùng**: 
  - Xem danh sách người dùng
  - Khóa/mở khóa tài khoản
  - Phân quyền ADMIN/USER
  - Xem lịch sử báo cáo của từng user
- **Quản lý loại sự cố**: 
  - Thêm, sửa, xóa loại sự cố
  - Thiết lập icon và màu sắc cho từng loại
- **Tạo cảnh báo thời tiết**: 
  - Tạo cảnh báo cho cộng đồng
  - Chọn địa điểm (Tỉnh/Quận/Xã) hoặc tọa độ + bán kính
  - Phân loại mức độ (INFO, WARNING, DANGER, CRITICAL)
  - Thiết lập thời gian bắt đầu và kết thúc
- **Lịch sử hành động**: Xem log các thao tác admin đã thực hiện

### 3.7. Tính năng bổ sung
- **Upload hình ảnh**: Hỗ trợ upload nhiều file, tự động lưu vào server
- **Geocoding tự động**: Tự động chuyển đổi địa điểm → tọa độ (Nominatim API hoặc location_coordinates.json)
- **Reverse geocoding**: Chuyển đổi tọa độ → tên địa điểm
- **Responsive design**: Giao diện tối ưu cho mobile, tablet, desktop
- **Real-time updates**: Cập nhật dữ liệu theo thời gian thực

---

## 4. CÔNG NGHỆ

**Backend:** Java 17 + Spring Boot 4.0 + Spring Security + JWT + Spring Data JPA + MySQL 8.0

**Frontend:** React 19.2 + React Router + Leaflet (bản đồ) + Recharts (biểu đồ) + Axios

**Machine Learning:** Python 3.8+ + Flask + scikit-learn (Random Forest Regressor)

**Dữ liệu:** JSON files (63 tỉnh, 705 quận, 10,599 xã) + location_coordinates.json

---

## 5. KIẾN TRÚC HỆ THỐNG

### 5.1. Kiến trúc tổng quan

```
┌─────────────────────────────────────┐
│   FRONTEND (React.js)                │
│   - User Interface                   │
│   - State Management                 │
│   - API Calls                        │
└──────────────┬──────────────────────┘
               │
               │ REST API
               ↓
┌─────────────────────────────────────┐
│   BACKEND (Spring Boot)              │
│   - Business Logic                   │
│   - Authentication (JWT)             │
│   - Data Processing                  │
└──────┬──────────────────┬───────────┘
       │                  │
       │                  │
       ↓                  ↓
┌──────────────┐  ┌──────────────────┐
│ MySQL        │  │ Python ML        │
│ Database     │  │ (Flask)          │
│              │  │ - Analysis       │
│              │  │ - ML (optional)   │
└──────────────┘  └──────────────────┘
```

**Giải thích:**
- **Frontend giao tiếp với Backend qua REST API** - React gửi HTTP request (GET, POST, PUT, DELETE) đến Spring Boot
- **Backend xử lý logic, lưu trữ vào MySQL** - Spring Boot xử lý business logic, xác thực, và lưu dữ liệu vào database
- **Python service xử lý phân tích và ML (optional)** - Backend gọi Python ML service khi cần dự đoán thời tiết

### 5.2. Các thành phần chính

**Frontend (React.js):**
- Giao diện người dùng, hiển thị dữ liệu
- Quản lý state (đăng nhập, token, dữ liệu)
- Gọi API đến Backend qua Axios

**Backend (Spring Boot):**
- Xử lý business logic và authentication
- Giao tiếp với Database để lưu/đọc dữ liệu
- Gọi Python ML Service khi cần dự đoán

**MySQL Database:**
- Lưu trữ dữ liệu: users, reports, weather_data, alerts, ...

**Python ML Service (Flask):**
- Xử lý Machine Learning (dự đoán thời tiết)
- Tùy chọn - hệ thống vẫn hoạt động nếu không có

### 5.3. Luồng xử lý chính

#### Luồng đăng nhập:
```
1. User nhập username/password → Frontend
2. Frontend POST /api/auth/login → Backend
3. Backend kiểm tra credentials → Database
4. Backend tạo JWT token → Trả về Frontend
5. Frontend lưu token → Gửi kèm các request sau
```

#### Luồng tạo báo cáo:
```
1. User điền form báo cáo → Frontend
2. Frontend POST /api/reports (kèm JWT token) → Backend
3. Backend validate token → Kiểm tra quyền USER
4. Backend lấy tọa độ từ địa điểm (Nominatim API hoặc location_coordinates.json)
5. Backend lưu báo cáo vào DB (status: PENDING) → Database
6. Backend trả về báo cáo đã tạo → Frontend
7. Frontend hiển thị thông báo thành công
```

#### Luồng duyệt báo cáo (Admin):
```
1. Admin xem danh sách báo cáo PENDING → Frontend
2. Frontend GET /api/admin/reports → Backend
3. Backend kiểm tra quyền ADMIN → Trả về danh sách
4. Admin chọn duyệt → Frontend PUT /api/admin/reports/{id}/approve
5. Backend cập nhật status = APPROVED → Database
6. Backend ghi log vào admin_actions → Database
7. Báo cáo hiển thị trên bản đồ (status = APPROVED)
```

#### Luồng dự đoán thời tiết:
```
1. User chọn địa điểm → Frontend
2. Frontend GET /api/weather/current?city=... → Backend
3. Backend lấy thời tiết hiện tại từ Database hoặc OpenWeatherMap API
4. User yêu cầu dự đoán → Frontend POST /api/weather/forecast
5. Backend gọi Python ML Service POST /predict (dữ liệu thời tiết hiện tại)
6. Python ML Service predict → Trả về kết quả (1-168 giờ)
7. Backend nhận kết quả → Trả về Frontend
8. Frontend hiển thị biểu đồ dự đoán
```

#### Luồng hiển thị bản đồ:
```
1. User mở trang bản đồ → Frontend
2. Frontend GET /api/reports?status=APPROVED → Backend
3. Backend trả về danh sách báo cáo đã duyệt
4. Frontend hiển thị markers trên Leaflet map
5. User click marker → Frontend hiển thị popup chi tiết
```

### 5.4. API Endpoints chính

**Authentication:**
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập

**Báo cáo:**
- `GET /api/reports` - Lấy danh sách báo cáo
- `POST /api/reports` - Tạo báo cáo mới
- `PUT /api/reports/{id}` - Cập nhật báo cáo
- `DELETE /api/reports/{id}` - Xóa báo cáo

**Thời tiết:**
- `GET /api/weather/current` - Thời tiết hiện tại
- `POST /api/weather/forecast` - Dự đoán thời tiết

**Admin:**
- `GET /api/admin/reports` - Quản lý báo cáo
- `PUT /api/admin/reports/{id}/approve` - Duyệt báo cáo
- `PUT /api/admin/reports/{id}/reject` - Từ chối báo cáo
- `GET /api/admin/users` - Quản lý người dùng

### 5.5. Xử lý lỗi và Fallback

- **OpenWeatherMap API không khả dụng** → Fallback về MockWeatherService
- **Nominatim API rate limit** → Sử dụng location_coordinates.json
- **Python ML Service không chạy** → Thông báo lỗi, không hiển thị dự đoán
- **JWT token hết hạn** → Redirect về trang đăng nhập

---

## 6. DATABASE

### 6.1. Các bảng chính và mục đích

**`users`** - Thông tin người dùng
- Lưu thông tin đăng nhập (username, email, password), phân quyền (USER/ADMIN)
- Thông tin cá nhân (họ tên, số điện thoại, địa chỉ)
- Trạng thái tài khoản (enabled/disabled)
- **Lý do:** Quản lý người dùng, xác thực, phân quyền

**`weather_reports`** - Báo cáo sự cố thời tiết
- Lưu báo cáo từ người dùng (tiêu đề, mô tả, địa điểm, tọa độ)
- Trạng thái (PENDING, APPROVED, REJECTED, RESOLVED)
- Mức độ nghiêm trọng (LOW, MEDIUM, HIGH, CRITICAL)
- **Lý do:** Lưu trữ báo cáo sự cố từ cộng đồng, quản lý workflow duyệt báo cáo

**`report_images`** - Hình ảnh báo cáo
- Lưu danh sách URL hình ảnh của mỗi báo cáo
- **Lý do:** Một báo cáo có thể có nhiều hình ảnh minh chứng, tách riêng để tối ưu storage

**`incident_types`** - Loại sự cố
- Danh mục loại sự cố (mưa lớn, gió mạnh, lũ lụt, sạt lở, ...)
- Icon và màu sắc để hiển thị trên bản đồ
- **Lý do:** Phân loại báo cáo, dễ quản lý và thống kê, có thể thêm/sửa/xóa loại mới

**`weather_data`** - Dữ liệu thời tiết
- Lưu dữ liệu thời tiết theo thời gian (nhiệt độ, độ ẩm, gió, mưa, ...)
- Gắn với tọa độ và địa điểm
- **Lý do:** Lưu lịch sử thời tiết để phân tích, train ML model, hiển thị xu hướng

**`weather_alerts`** - Cảnh báo thời tiết
- Cảnh báo từ admin cho cộng đồng
- Phạm vi cảnh báo (tọa độ + bán kính hoặc địa điểm)
- Mức độ (INFO, WARNING, DANGER, CRITICAL)
- **Lý do:** Admin có thể tạo cảnh báo chủ động, không phụ thuộc vào báo cáo từ người dùng

**`admin_actions`** - Lịch sử hành động admin
- Ghi log các thao tác admin (duyệt, từ chối, giải quyết, xóa báo cáo)
- **Lý do:** Audit trail, theo dõi hoạt động admin, bảo mật và minh bạch

### 6.2. Mối quan hệ giữa các bảng

```
users (1) ──→ (N) weather_reports
  │                │
  │                │
  │                └──→ (N) report_images (ElementCollection)
  │                │
  │                └──→ (1) incident_types
  │
  ├──→ (N) weather_alerts
  │
  └──→ (N) admin_actions ──→ (1) weather_reports (nullable)
```

**Chi tiết quan hệ:**

1. **User → WeatherReport (1-N)**
   - Một user có thể tạo nhiều báo cáo
   - Foreign key: `weather_reports.user_id` → `users.id`
   - **Đúng** ✓

2. **IncidentType → WeatherReport (1-N)**
   - Một loại sự cố có thể có nhiều báo cáo
   - Foreign key: `weather_reports.incident_type_id` → `incident_types.id`
   - **Đúng** ✓

3. **WeatherReport → report_images (1-N)**
   - Một báo cáo có nhiều hình ảnh
   - Sử dụng `@ElementCollection` (không phải entity riêng)
   - Bảng: `report_images` với `report_id` và `image_url`
   - **Đúng** ✓

4. **User → WeatherAlert (1-N)**
   - Một admin có thể tạo nhiều cảnh báo
   - Foreign key: `weather_alerts.admin_id` → `users.id`
   - **Thiếu trong tài liệu** - Cần bổ sung

5. **User → AdminAction (1-N)**
   - Một admin có nhiều hành động
   - Foreign key: `admin_actions.admin_id` → `users.id`
   - **Thiếu trong tài liệu** - Cần bổ sung

6. **WeatherReport → AdminAction (1-N, nullable)**
   - Một báo cáo có thể có nhiều hành động admin (duyệt, từ chối, ...)
   - Foreign key: `admin_actions.report_id` → `weather_reports.id` (nullable)
   - Có `report_id_backup` để lưu ID ngay cả khi report bị xóa
   - **Thiếu trong tài liệu** - Cần bổ sung

7. **WeatherData** - Độc lập
   - Không có quan hệ với bảng khác
   - Lưu dữ liệu thời tiết theo thời gian và vị trí
   - **Đúng** ✓

### 6.3. Đánh giá thiết kế

**Điểm mạnh:**
- ✅ Phân tách rõ ràng các chức năng (users, reports, alerts, actions)
- ✅ Quan hệ hợp lý, đảm bảo tính toàn vẹn dữ liệu
- ✅ Có audit trail (admin_actions) để theo dõi
- ✅ Hỗ trợ soft delete (report_id_backup trong admin_actions)

**Có cần thêm không?**
- **Không cần thêm bảng** - Thiết kế hiện tại đã đủ cho các chức năng chính
- Có thể mở rộng sau: `notifications` (thông báo cho user), `comments` (bình luận trên báo cáo), `favorites` (báo cáo yêu thích)

---

## 7. MACHINE LEARNING

**Model:** Random Forest Regressor
- **Features:** Month, Hour, Humidity, Pressure, Wind Speed, Cloudiness
- **Target:** Temperature (°C)
- **Quy trình:** Thu thập dữ liệu → Train model → Predict (1-168 giờ)

**API:** `POST /predict`, `POST /retrain`, `GET /health`

---

## 8. API BÊN NGOÀI (Tùy chọn)

- **OpenWeatherMap API** (tùy chọn): Lấy dữ liệu thời tiết thực tế, cần API key, có fallback về MockWeatherService
- **Nominatim (OpenStreetMap) API** (miễn phí): Geocoding (địa điểm → tọa độ), rate limit 1 request/second
- **ArcGIS Map Server**: Hiển thị bản đồ satellite imagery

## 9. DỮ LIỆU THỜI TIẾT

- **MockWeatherService**: Tự tạo dữ liệu thời tiết (fallback khi không có OpenWeatherMap API)
- Template theo mùa: Mùa mưa (5-10), Mùa khô (11-4)
- Tự động map địa điểm → tọa độ từ location_coordinates.json hoặc Nominatim API

---

## 10. BẢO MẬT

- JWT Token authentication
- BCrypt mã hóa mật khẩu
- Role-based access control (USER/ADMIN)
- CORS, Input validation

---

## 11. CÀI ĐẶT

**Yêu cầu:** Java 17+, Node.js 14+, MySQL 8.0+, Python 3.8+ (tùy chọn)

**Thứ tự khởi động:**
1. MySQL: `CREATE DATABASE weather_db;`
2. Backend: `cd weather && ./gradlew bootRun` → `http://localhost:8080/api`
3. Frontend: `cd weather/frontend && npm install && npm start` → `http://localhost:3000`
4. Python ML: `cd python_ml && pip install -r requirements.txt && python app.py` → `http://localhost:5000`

---

## 12. KẾT QUẢ

✅ Authentication với JWT  
✅ RESTful API đầy đủ  
✅ Giao diện React thân thiện  
✅ Bản đồ tương tác (Leaflet)  
✅ Dashboard thống kê  
✅ Admin panel  
✅ Machine Learning prediction  
✅ Tự tạo dữ liệu thời tiết  

**Metrics:** 20+ API endpoints, 15+ React components, 7 database tables

---

**Ngày tạo**: 2024 | **Phiên bản**: 1.0
