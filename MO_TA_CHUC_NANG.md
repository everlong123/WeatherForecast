# MÔ TẢ HỆ THỐNG WEATHER ALERT - HỆ THỐNG CẢNH BÁO THỜI TIẾT DỰA TRÊN DỮ LIỆU CỘNG ĐỒNG

## 1. KIẾN TRÚC HỆ THỐNG

### 1.1. Kiến trúc tổng quan
- **Mô hình**: Client-Server (SPA - Single Page Application)
- **Backend**: Spring Boot REST API (Java 17)
- **Frontend**: React 19 (SPA với React Router)
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Token)
- **File Storage**: Local filesystem (`uploads/` directory)

### 1.2. Công nghệ sử dụng

#### Backend
- **Framework**: Spring Boot 4.0.0
- **Security**: Spring Security với JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Gradle
- **Java Version**: 17
- **Dependencies chính**:
  - `spring-boot-starter-web`: REST API
  - `spring-boot-starter-security`: Bảo mật
  - `spring-boot-starter-data-jpa`: Database access
  - `io.jsonwebtoken:jjwt`: JWT authentication
  - `com.mysql:mysql-connector-j`: MySQL driver
  - `lombok`: Code generation

#### Frontend
- **Framework**: React 19.2.1
- **Routing**: React Router DOM 7.10.1
- **HTTP Client**: Axios 1.13.2
- **Maps**: Leaflet 1.9.4 + React Leaflet 5.0.0
- **Icons**: React Icons 5.5.0
- **Charts**: Recharts 3.5.1
- **Build Tool**: React Scripts 5.0.1

#### Database
- **RDBMS**: MySQL 8.0
- **Connection**: JDBC với connection pooling
- **Schema Management**: Hibernate DDL auto-update

---

## 2. XÁC THỰC VÀ PHÂN QUYỀN

### 2.1. Đăng ký tài khoản
- **Endpoint**: `POST /api/auth/register`
- **Thông tin yêu cầu**:
  - Username (unique, bắt buộc)
  - Email (unique, bắt buộc)
  - Password (mã hóa BCrypt, bắt buộc)
  - Full name (bắt buộc)
  - Phone (tùy chọn)
  - Address (tùy chọn)
  - District, Ward (tùy chọn)
- **Validation**: Kiểm tra trùng username/email, format email hợp lệ
- **Mặc định**: Role = `USER`, Enabled = `true`

### 2.2. Đăng nhập
- **Endpoint**: `POST /api/auth/login`
- **Response**: JWT token (hết hạn sau 24 giờ)
- **Storage**: Token lưu trong `localStorage`
- **Authorization**: Token được gửi trong header `Authorization: Bearer <token>` cho mọi request cần bảo vệ

### 2.3. Phân quyền người dùng

#### Role: USER
- Xem thời tiết hiện tại, dự báo 24h, lịch sử
- Xem bản đồ và các báo cáo
- Tạo báo cáo sự cố thời tiết
- Xem, chỉnh sửa, xóa báo cáo của chính mình
- Xem trang "Báo cáo của tôi"

#### Role: ADMIN
- Tất cả quyền của USER
- Xem và quản lý tất cả báo cáo (duyệt/từ chối/giải quyết)
- Quản lý người dùng (CRUD, khóa/mở khóa)
- Quản lý loại sự cố (CRUD)
- Quản lý cảnh báo thời tiết
- Xem Dashboard thống kê
- Truy cập trang Admin

### 2.4. Route Protection
- **Public Routes**: `/`, `/login`, `/map`
- **Private Routes**: `/reports` (yêu cầu đăng nhập)
- **Admin Routes**: `/admin`, `/dashboard` (yêu cầu role ADMIN)

---

## 3. QUẢN LÝ BÁO CÁO SỰ CỐ THỜI TIẾT

### 3.1. Tạo báo cáo
- **Endpoint**: `POST /api/reports`
- **Thông tin báo cáo**:
  - **Loại sự cố** (incidentTypeId): Dropdown từ danh sách loại sự cố
  - **Tiêu đề** (title): Bắt buộc
  - **Mô tả** (description): Chi tiết sự cố
  - **Địa điểm**: 
    - Tỉnh/Thành phố (city)
    - Quận/Huyện (district)
    - Phường/Xã (ward)
    - Tọa độ GPS (latitude, longitude) - từ bản đồ hoặc nhập thủ công
  - **Thời gian xảy ra** (incidentTime): Datetime picker
  - **Mức độ nghiêm trọng** (severity): LOW, MEDIUM, HIGH, CRITICAL
  - **Ảnh đính kèm** (imageUrl): Upload file, lưu trong `uploads/`
- **Tự động gán**: User hiện tại, Status = `PENDING`
- **UI**: Modal form với bản đồ tích hợp để chọn vị trí

### 3.2. Xem danh sách báo cáo
- **Endpoint**: `GET /api/reports` (tất cả) hoặc `GET /api/reports/my` (của user)
- **Hiển thị**:
  - Card layout với thông tin đầy đủ
  - Badge màu sắc cho severity và status
  - Ảnh báo cáo (nếu có)
  - Địa chỉ và thời gian
  - Action buttons (Edit, Delete, View location)
- **Lọc**: Theo loại sự cố, trạng thái, mức độ
- **Sắp xếp**: Theo thời gian (mới nhất trước)

### 3.3. Cập nhật/Xóa báo cáo
- **Cập nhật**: `PUT /api/reports/{id}`
  - User chỉ được sửa báo cáo của mình
  - Admin có thể sửa mọi báo cáo
- **Xóa**: `DELETE /api/reports/{id}`
  - User chỉ được xóa báo cáo của mình
  - Admin có thể xóa mọi báo cáo

### 3.4. Duyệt báo cáo (Admin)
- **Duyệt**: `PUT /api/admin/reports/{id}/approve` → Status: `APPROVED`
- **Từ chối**: `PUT /api/admin/reports/{id}/reject` → Status: `REJECTED`
- **Giải quyết**: `PUT /api/admin/reports/{id}/resolve` → Status: `RESOLVED`
- **Comment**: Có thể thêm comment khi duyệt/từ chối

---

## 4. THỜI TIẾT HIỆN TẠI, DỰ BÁO 24H VÀ LỊCH SỬ

### 4.1. Thời tiết hiện tại

#### Lấy dữ liệu
- **Endpoint**: `GET /api/weather/current?lat={lat}&lng={lng}`
- **Nguồn dữ liệu** (theo thứ tự ưu tiên):
  1. **Database**: Bản ghi `weather_data` gần nhất cho vị trí đó (trong vòng 1 giờ)
  2. **Open-Meteo API**: Current weather (miễn phí, không cần API key)
  3. **OpenWeatherMap API**: Current Weather API (cần API key)
  4. **Mock Weather Service**: Fallback khi mất mạng hoặc API lỗi

#### Hiển thị thông tin
- **Nhiệt độ**: Nhiệt độ hiện tại và "Cảm giác như"
- **Độ ẩm**: Phần trăm độ ẩm
- **Gió**: Tốc độ (m/s) và hướng gió (Bắc, Đông, Nam, Tây...)
- **Áp suất**: hPa
- **Tầm nhìn**: km
- **Mây che phủ**: Phần trăm
- **Lượng mưa/Tuyết**: mm (nếu có)
- **Mô tả**: Trạng thái thời tiết (Clear, Cloudy, Rain...)
- **Icon**: Icon tương ứng với trạng thái

#### Giao diện
- **Trang Home**: Hero section + Weather card lớn
- **Weather Card**:
  - Header: Vị trí (tự động từ GPS hoặc đã chọn), nút "Chọn vị trí khác", đồng hồ real-time
  - Main: Icon thời tiết lớn, nhiệt độ nổi bật, mô tả
  - Details: Grid 6 metrics (Độ ẩm, Gió, Áp suất, Tầm nhìn, Mây, Mưa)
- **Reverse Geocoding**: Tự động hiển thị địa chỉ khi chỉ có lat/long

### 4.2. Dự báo thời tiết 24 giờ

#### Lấy dữ liệu
- **Endpoint**: `GET /api/weather/forecast?lat={lat}&lng={lng}&hours=24`
- **Nguồn dữ liệu**:
  1. **OpenWeatherMap One Call API 3.0**: Hourly forecast (nếu có API key và subscription)
  2. **Open-Meteo Forecast API**: Hourly forecast (miễn phí, không key)

#### Hiển thị
- **Tab "Dự báo (24h)"** trong weather card
- **Layout**: List dọc với timeline
- **Mỗi item hiển thị**:
  - Thời gian (giờ:phút, ngày)
  - Icon thời tiết
  - Nhiệt độ (nổi bật)
  - Mô tả thời tiết
  - Độ ẩm
  - Lượng mưa (nếu có)
- **Loading state**: Hiển thị "Đang tải dữ liệu dự báo..."
- **Error handling**: Hiển thị lỗi và nút "Thử lại"

### 4.3. Lịch sử thời tiết

#### Lưu trữ
- Mỗi lần lấy thời tiết hiện tại, hệ thống tự động lưu vào bảng `weather_data`
- Lưu: lat, lng, tất cả thông tin thời tiết, timestamp

#### Lấy dữ liệu
- **Endpoint**: `GET /api/weather/history?lat={lat}&lng={lng}`
- Trả về danh sách bản ghi theo lat/lng, sắp xếp mới nhất trước

#### Hiển thị
- **Tab "Lịch sử"** trong weather card
- **Layout**: Nhóm theo ngày
- **Mỗi ngày**:
  - Header: Ngày, số lượng bản ghi
  - List các mốc thời gian trong ngày
- **Mỗi item hiển thị**:
  - Thời gian (giờ:phút)
  - Icon thời tiết lớn
  - Nhiệt độ và mô tả
  - Stats: Độ ẩm, Gió, Áp suất, Lượng mưa

---

## 5. BẢN ĐỒ VÀ ĐỊA LÝ

### 5.1. Hiển thị bản đồ
- **Library**: Leaflet + React Leaflet
- **Tile Layer**: OpenStreetMap
- **Features**:
  - Hiển thị tất cả báo cáo thời tiết dưới dạng markers
  - Click marker để xem chi tiết báo cáo
  - Lọc markers theo:
    - Loại sự cố
    - Trạng thái (PENDING, APPROVED, REJECTED, RESOLVED)
    - Mức độ nghiêm trọng (LOW, MEDIUM, HIGH, CRITICAL)
  - Layer control: Bật/tắt các lớp báo cáo
  - Zoom controls
  - Click trên map để chọn vị trí (khi tạo/chỉnh sửa báo cáo)

### 5.2. Geocoding (Địa chỉ → Tọa độ)
- **Endpoint**: `GET /api/locations/coordinates?city={city}&district={district}&ward={ward}`
- **Nguồn dữ liệu** (theo thứ tự ưu tiên):
  1. **File JSON local**: `provinces.json`, `districts.json`, `wards.json` (cache)
  2. **Open-Meteo Geocoding API**: Miễn phí, không cần API key
  3. **OpenWeatherMap Geocoding API**: Cần API key
- **Sử dụng**: Khi user chọn địa điểm từ dropdown (Tỉnh → Quận → Phường)

### 5.3. Reverse Geocoding (Tọa độ → Địa chỉ)
- **Endpoint**: `GET /api/locations/reverse?lat={lat}&lng={lng}`
- **Nguồn dữ liệu**:
  1. **BigDataCloud Reverse Geocoding API**: Miễn phí, 10k requests/month, không cần API key (đang bật)
  2. **Nominatim API**: OpenStreetMap (đang tắt do rate limit/403)
- **Sử dụng**: 
  - Khi user click trên map để chọn vị trí
  - Khi hiển thị địa chỉ từ GPS coordinates
  - Tự động điền city/district/ward vào form

### 5.4. Location Coordinate Service
- **File cache**: `location_coordinates.json` (nếu có)
- **Service**: `LocationCoordinateService` - Tìm tọa độ từ cache trước khi gọi API

---

## 6. QUẢN TRỊ (ADMIN)

### 6.1. Dashboard Thống kê
- **Endpoint**: `GET /api/admin/dashboard/stats`
- **Thống kê hiển thị**:
  - Tổng số báo cáo
  - Số báo cáo theo trạng thái (PENDING, APPROVED, REJECTED, RESOLVED)
  - Số báo cáo theo loại sự cố
  - Số báo cáo theo mức độ nghiêm trọng
  - Số người dùng theo role (USER, ADMIN)
- **Giao diện**: 
  - Stat cards với icon và số liệu
  - Biểu đồ (Recharts) trực quan hóa dữ liệu
  - Responsive grid layout

### 6.2. Quản lý báo cáo
- **Xem tất cả**: Danh sách tất cả báo cáo (kể cả chưa duyệt)
- **Duyệt/Từ chối**: 
  - Modal với comment field
  - Cập nhật status và lưu comment
- **Giải quyết**: Đánh dấu báo cáo đã được xử lý
- **Chỉnh sửa/Xóa**: Admin có thể sửa/xóa bất kỳ báo cáo
- **Lọc**: Theo trạng thái, loại sự cố, mức độ, user

### 6.3. Quản lý người dùng
- **Xem danh sách**: Tất cả users với thông tin đầy đủ
- **Tạo user mới**: 
  - Form với đầy đủ thông tin
  - Chọn role (USER/ADMIN)
  - Set enabled/disabled
- **Chỉnh sửa**: Cập nhật thông tin user
- **Khóa/Mở khóa**: Toggle `enabled` field
- **Xóa**: Xóa user (có thể có validation)

### 6.4. Quản lý loại sự cố
- **Endpoint**: `GET/POST/PUT/DELETE /api/incident-types`
- **CRUD đầy đủ**: Thêm, sửa, xóa loại sự cố
- **Danh sách mặc định**: Bão, Lũ lụt, Lốc xoáy, Sét, Mưa đá, Bụi mù, Sương mù, Nhiệt độ cực đoan...
- **Hiển thị**: List với action buttons

### 6.5. Quản lý cảnh báo thời tiết
- **Entity**: `WeatherAlert`
- **Chức năng**: Tạo, cập nhật, xóa cảnh báo
- **Thông tin**: Tiêu đề, mô tả, mức độ cảnh báo, vùng ảnh hưởng

### 6.6. Giao diện Admin
- **Layout**: Tab-based interface
- **Tabs**: Dashboard, Báo cáo, Người dùng, Loại sự cố, Cảnh báo
- **Style**: Dark blue gradient background, white cards
- **Responsive**: Mobile-friendly

---

## 7. GIAO DIỆN NGƯỜI DÙNG

### 7.1. Navbar (Navigation Bar)
- **Layout**: 3 cột grid
  - **Cột 1**: Logo "Weather Alert" với icon 🌦️
  - **Cột 2**: Menu items (căn giữa) - Trang chủ, Bản đồ, Báo cáo của tôi (user), Thống kê (admin), Quản trị (admin)
  - **Cột 3**: User section (căn phải) - Username + nút Đăng xuất (nếu đã login) hoặc nút Đăng nhập (nếu chưa login)
- **Style**: 
  - Dark blue background với backdrop blur
  - Fixed position, z-index cao
  - Hover effects với transform và shadow
  - Responsive: Chuyển layout dọc trên mobile

### 7.2. Trang Home
- **Hero Section**:
  - Background: Dark blue gradient với light blue speckles
  - Title: "Hệ thống Cảnh báo Thời tiết" + "Dựa trên Dữ liệu Cộng đồng"
  - Subtitle: Mô tả ngắn gọn
  - CTA Buttons: "Xem Bản đồ" và "Báo cáo Sự cố" (pill-shaped, gradient blue, cùng style)
- **Weather Card Section**:
  - Tabs: "Hiện tại", "Dự báo (24h)", "Lịch sử"
  - Weather card lớn với thông tin chi tiết
  - Real-time clock
  - Location picker
- **Recent Reports Section**:
  - Grid layout với report cards
  - Link "Xem tất cả trên bản đồ"

### 7.3. Trang Bản đồ (Map)
- **Full-screen map** với Leaflet
- **Controls**: 
  - Layer control panel (filter by incident type, status, severity)
  - Zoom controls
  - Location picker (nếu có query param `selectLocation=true`)
- **Markers**: 
  - Color-coded theo severity hoặc status
  - Popup với thông tin báo cáo
- **Click handler**: Chọn vị trí và reverse geocode

### 7.4. Trang Báo cáo (Reports)
- **Header**: Title + nút "Tạo báo cáo mới"
- **Report Cards**:
  - Header: Title + action buttons (Edit, Delete, View location)
  - Content: Description, badges (incident type, severity, status)
  - Images: Hiển thị ảnh báo cáo
  - Footer: Location và timestamp
- **Modal Form**: 
  - Tạo/chỉnh sửa báo cáo
  - Map tích hợp để chọn vị trí
  - File upload cho ảnh
  - Validation

### 7.5. Trang Admin
- **Tab Navigation**: Dashboard, Báo cáo, Người dùng, Loại sự cố, Cảnh báo
- **Dark Theme**: Navy blue gradient background
- **Cards**: White cards với shadow và border
- **Forms**: Modal forms cho CRUD operations
- **Tables/Lists**: Responsive với action buttons

### 7.6. Design System

#### Colors
- **Primary**: Navy blue (`#001f3f`, `#003d7a`, `#0056b3`)
- **White**: `#ffffff`
- **Gradients**: 
  - Navy gradient: `linear-gradient(135deg, #001f3f 0%, #003d7a 50%, #0056b3 100%)`
  - Button primary: `linear-gradient(135deg, #4a90e2 0%, #357abd 100%)`
  - Button secondary: `linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)`

#### Typography
- **Font Family**: System fonts (-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'...)
- **Headings**: Bold, large sizes
- **Body**: Regular weight, readable sizes

#### Components
- **Buttons**: 
  - Pill-shaped (border-radius: 999px)
  - Thin black border (1px solid rgba(0, 0, 0, 0.7))
  - Gradient background
  - Hover effect với ripple animation
  - Consistent style across all pages
- **Cards**: 
  - Rounded corners (12-20px)
  - White background với shadow
  - Hover effects (translateY, shadow increase)
- **Badges**: 
  - Pill-shaped
  - Gradient background
  - Color-coded (green for low/approved, orange for pending, red for high/rejected, blue for resolved)
- **Inputs**: 
  - Rounded corners
  - Border với focus state
  - Placeholder styling

#### Animations
- **Fade In**: Page load animations
- **Hover Effects**: Transform, shadow, color transitions
- **Ripple Effect**: Button hover với ::before pseudo-element
- **Pulse**: Weather icons animation

---

## 8. TÍCH HỢP API BÊN THỨ BA

### 8.1. Open-Meteo API
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
  - Miễn phí, không cần API key
  - Rate limit: Không có giới hạn nghiêm ngặt
- **Current Weather**: `https://api.open-meteo.com/v1/forecast`
  - Current + hourly forecast
  - Miễn phí, không cần API key
- **Sử dụng**: Primary source cho weather data

### 8.2. OpenWeatherMap API
- **Geocoding**: `https://api.openweathermap.org/geo/1.0/direct`
  - Cần API key
  - Rate limit: 60 calls/minute (free tier)
- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
  - Cần API key
- **One Call API 3.0**: `https://api.openweathermap.org/data/3.0/onecall`
  - Hourly forecast
  - Cần API key và subscription
- **Sử dụng**: Fallback khi Open-Meteo không có dữ liệu

### 8.3. BigDataCloud Reverse Geocoding API
- **Endpoint**: `https://api.bigdatacloud.net/data/reverse-geocode-client`
- **Miễn phí**: 10,000 requests/month
- **Không cần API key**
- **Sử dụng**: Primary source cho reverse geocoding (lat/lng → address)
- **Status**: Đang bật (`bigdatacloud.api.enabled=true`)

### 8.4. Nominatim API (OpenStreetMap)
- **Endpoint**: `https://nominatim.openstreetmap.org/reverse`
- **Miễn phí** nhưng có rate limit nghiêm ngặt
- **Yêu cầu**: User-Agent với email liên hệ, delay ≥ 1s giữa requests
- **Status**: Đang tắt (`nominatim.api.enabled=false`) do bị 403/rate limit
- **Sử dụng**: Fallback cho reverse geocoding (khi bật lại)

### 8.5. Mock Weather Service
- **Mục đích**: Fallback khi tất cả API đều lỗi hoặc mất mạng
- **Dữ liệu**: Template data với giá trị hợp lý
- **Sử dụng**: Demo/testing

---

## 9. LƯU TRỮ DỮ LIỆU

### 9.1. Database Schema (MySQL)

#### Bảng `users`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `username` (VARCHAR, UNIQUE, NOT NULL)
- `email` (VARCHAR, UNIQUE, NOT NULL)
- `password` (VARCHAR, NOT NULL) - BCrypt hashed
- `full_name` (VARCHAR)
- `phone` (VARCHAR)
- `address` (VARCHAR)
- `district` (VARCHAR)
- `ward` (VARCHAR)
- `role` (ENUM: USER, ADMIN) - Default: USER
- `enabled` (BOOLEAN) - Default: true
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Bảng `weather_reports`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `user_id` (BIGINT, FK → users.id)
- `incident_type_id` (BIGINT, FK → incident_types.id)
- `title` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `severity` (ENUM: LOW, MEDIUM, HIGH, CRITICAL)
- `status` (ENUM: PENDING, APPROVED, REJECTED, RESOLVED) - Default: PENDING
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `city` (VARCHAR)
- `district` (VARCHAR)
- `ward` (VARCHAR)
- `incident_time` (DATETIME)
- `image_url` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Bảng `incident_types`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `name` (VARCHAR, UNIQUE, NOT NULL)
- `description` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Bảng `weather_data`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `latitude` (DECIMAL, NOT NULL)
- `longitude` (DECIMAL, NOT NULL)
- `temperature` (DECIMAL)
- `feels_like` (DECIMAL)
- `humidity` (DECIMAL)
- `pressure` (DECIMAL)
- `wind_speed` (DECIMAL)
- `wind_direction` (DECIMAL)
- `cloudiness` (DECIMAL)
- `visibility` (DECIMAL)
- `rain_volume` (DECIMAL)
- `snow_volume` (DECIMAL)
- `main_weather` (VARCHAR)
- `description` (VARCHAR)
- `recorded_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

#### Bảng `weather_alerts`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `title` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `alert_level` (ENUM: INFO, WARNING, CRITICAL)
- `affected_area` (VARCHAR)
- `start_time` (DATETIME)
- `end_time` (DATETIME)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 9.2. File Storage
- **Directory**: `weather/uploads/`
- **Naming**: `{timestamp}_{hash}.{extension}`
- **Supported formats**: JPG, PNG, GIF
- **Endpoint**: `POST /uploads` (không qua `/api` prefix)
- **Access**: Public URL `http://localhost:8080/uploads/{filename}`

### 9.3. JSON Cache Files
- **Location**: `weather/src/main/resources/` và `weather/frontend/public/`
- **Files**:
  - `provinces.json`: Danh sách tỉnh/thành phố
  - `districts.json`: Danh sách quận/huyện
  - `wards.json`: Danh sách xã/phường
  - `location_coordinates.json`: Tọa độ cache (nếu có)
- **Mục đích**: Giảm số lần gọi geocoding API

---

## 10. BẢO MẬT & HẠ TẦNG

### 10.1. Authentication & Authorization
- **JWT Token**: 
  - Secret key: Config trong `application.properties`
  - Expiration: 24 giờ (86400000 ms)
  - Algorithm: HS256
- **Password Encryption**: BCrypt với salt rounds
- **Route Protection**: 
  - Spring Security filter chain
  - Frontend route guards (PrivateRoute, AdminRoute)
- **Role-based Access**: 
  - `@PreAuthorize` annotations trong controllers
  - Frontend conditional rendering

### 10.2. CORS Configuration
- **Allowed Origins**: `http://localhost:3000` (development)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Authorization, Content-Type
- **Configuration**: `WebConfig.java` với `@CrossOrigin`

### 10.3. Error Handling
- **Global Exception Handler**: `GlobalExceptionHandler.java`
- **HTTP Status Codes**: 
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden
  - 404: Not Found
  - 500: Internal Server Error
- **Error Response Format**: JSON với message và timestamp

### 10.4. Validation
- **Backend**: Spring Validation annotations (`@NotNull`, `@NotBlank`, `@Email`, etc.)
- **Frontend**: Form validation với error messages
- **Database**: Constraints (UNIQUE, NOT NULL, FOREIGN KEY)

### 10.5. Logging
- **Framework**: Spring Boot default logging (Logback)
- **Levels**: INFO, WARN, ERROR
- **Console Output**: UTF-8 encoding

---

## 11. DEPLOYMENT & CONFIGURATION

### 11.1. Backend Configuration
- **Port**: 8080 (default)
- **Database**: MySQL trên localhost:3306
- **Database Name**: `weather_db`
- **JWT Secret**: Config trong `application.properties` (nên thay đổi trong production)
- **API Keys**: Config trong `application.properties`

### 11.2. Frontend Configuration
- **Port**: 3000 (development)
- **API Base URL**: `http://localhost:8080/api`
- **Build**: `npm run build` → `build/` directory
- **Static Files**: Serve từ `build/` hoặc integrate với backend

### 11.3. Environment Variables
- **Backend**: `application.properties`
- **Frontend**: Hardcoded URLs (có thể chuyển sang `.env` file)

---

## 12. TÓM TẮT CÔNG NGHỆ VÀ CHỨC NĂNG

### 12.1. Stack Technology
- **Backend**: Spring Boot 4.0.0 (Java 17) + Spring Security + JPA/Hibernate
- **Frontend**: React 19.2.1 + React Router + Axios + Leaflet
- **Database**: MySQL 8.0
- **Build Tools**: Gradle (backend), npm/react-scripts (frontend)
- **Authentication**: JWT
- **Maps**: Leaflet + OpenStreetMap

### 12.2. Main Features
1. ✅ User Authentication & Authorization (Register, Login, JWT)
2. ✅ Weather Current/Forecast/History (Multiple API sources)
3. ✅ Weather Reports Management (CRUD, Admin approval)
4. ✅ Interactive Map (Markers, Filters, Location picker)
5. ✅ Geocoding & Reverse Geocoding (Multiple providers)
6. ✅ Admin Dashboard (Stats, User management, Report management)
7. ✅ File Upload (Images for reports)
8. ✅ Real-time Clock & Location Display
9. ✅ Responsive UI với modern design

### 12.3. API Endpoints Summary
- **Auth**: `/api/auth/register`, `/api/auth/login`
- **Weather**: `/api/weather/current`, `/api/weather/forecast`, `/api/weather/history`
- **Reports**: `/api/reports/*`, `/api/reports/my`, `/api/reports/{id}/vote`
- **Admin**: `/api/admin/*`
- **Locations**: `/api/locations/coordinates`, `/api/locations/reverse`
- **Upload**: `/uploads` (no `/api` prefix)
- **Incident Types**: `/api/incident-types/*`
- **Dashboard**: `/api/admin/dashboard/stats`

---

## 14. TÍNH NĂNG MỚI - HỆ THỐNG THÔNG MINH

### 14.1. Community Confirm (Vote) - Xác nhận từ Cộng đồng

#### Mục tiêu
Đánh giá độ tin cậy báo cáo dựa trên sự xác nhận của cộng đồng người dùng.

#### Logic cốt lõi
- User A tạo report
- User B, C, D có thể:
  - **Xác nhận đúng** (CONFIRM) - "Tôi cũng gặp"
  - **Phản đối** (REJECT) - "Không đúng"
- Mỗi user chỉ vote 1 lần / report (có thể thay đổi vote)
- Report có:
  - `confirmCount`: Số lượng xác nhận
  - `rejectCount`: Số lượng phản đối
  - `userVote`: Vote của user hiện tại (nếu có)

#### Cách triển khai

**Backend:**
- **Entity**: `ReportVote` với các trường:
  - `report_id` (FK → weather_reports)
  - `user_id` (FK → users)
  - `vote_type` (ENUM: CONFIRM, REJECT)
  - Unique constraint: (report_id, user_id)
- **Repository**: `ReportVoteRepository` với methods:
  - `findByReportAndUser()`: Tìm vote của user cho report
  - `countConfirmsByReport()`: Đếm số CONFIRM
  - `countRejectsByReport()`: Đếm số REJECT
- **Service**: `ReportVoteService`
  - `voteReport()`: Upsert vote (nếu vote cùng loại → xóa, khác loại → cập nhật)
  - `getConfirmCount()` / `getRejectCount()`: Lấy số lượng votes
  - `getUserVote()`: Lấy vote của user hiện tại
- **API Endpoint**: `POST /api/reports/{id}/vote?voteType=CONFIRM|REJECT`
  - Validation: User không thể vote báo cáo của chính mình
  - Response: `{ confirmCount, rejectCount, userVote, message }`

**Frontend:**
- **Reports Page**: 
  - 2 nút vote: "Tôi cũng gặp" (CONFIRM) và "Không đúng" (REJECT)
  - Hiển thị số lượng votes với badge
  - Highlight nút nếu user đã vote
  - Chỉ hiển thị cho user khác (không phải owner)
- **UI**: 
  - Green button cho CONFIRM với icon thumbs up
  - Red button cho REJECT với icon X
  - Badge hiển thị số lượng votes

#### Giá trị
- ✅ Không chỉ CRUD, có dữ liệu cộng đồng
- ✅ Admin không duyệt mù, có thông tin xác nhận
- ✅ Tăng độ tin cậy của báo cáo

---

### 14.2. Weather-Based Action Suggestion - Gợi ý Hành động dựa trên Thời tiết

#### Mục tiêu
Hệ thống chủ động gợi ý hành động cho user dựa trên điều kiện thời tiết hiện tại.

#### Logic cốt lõi
1. Lấy thời tiết hiện tại
2. Phân tích điều kiện:
   - Mưa (rainVolume)
   - Gió (windSpeed)
   - Nhiệt độ (temperature)
   - Độ ẩm (humidity)
   - Trạng thái thời tiết (mainWeather)
3. Ánh xạ → hành động gợi ý

#### Rules (Ví dụ)
- **Mưa lớn (> 10mm)** → Gợi ý báo cáo "Lũ lụt" (Priority: HIGH)
- **Gió mạnh (> 15 m/s)** → Gợi ý báo cáo "Bão" (Priority: HIGH)
- **Nhiệt độ cực cao (> 38°C)** → Gợi ý báo cáo "Nhiệt độ cực đoan" (Priority: MEDIUM)
- **Nhiệt độ cực thấp (< 5°C)** → Gợi ý báo cáo "Nhiệt độ cực đoan" (Priority: MEDIUM)
- **Mưa vừa (5-10mm)** → Gợi ý báo cáo "Mưa" (Priority: LOW)
- **Độ ẩm cao (> 90%) + Mưa nhẹ** → Gợi ý báo cáo "Sương mù" (Priority: LOW)
- **Gió mạnh vừa (10-15 m/s)** → Gợi ý báo cáo "Gió mạnh" (Priority: MEDIUM)
- **Có sét (thunderstorm)** → Gợi ý báo cáo "Sét" (Priority: HIGH)

#### Cách triển khai

**Backend:**
- **Service**: `WeatherDecisionService`
  - `analyzeWeatherAndSuggestAction(WeatherDataDTO)`: Phân tích và trả về suggestion
  - Return: `{ suggestedAction, suggestedIncidentType, priority }`
- **WeatherController**: 
  - Sau khi fetch weather, gọi `WeatherDecisionService`
  - Thêm fields vào `WeatherDataDTO`:
    - `suggestedAction`: String mô tả gợi ý
    - `suggestedIncidentType`: Tên loại sự cố gợi ý
    - `suggestionPriority`: "LOW", "MEDIUM", "HIGH"

**Frontend:**
- **Home Page**:
  - Nếu `currentWeather.suggestedAction` có giá trị:
    - Hiển thị banner với màu theo priority:
      - HIGH: Red gradient
      - MEDIUM: Orange gradient
      - LOW: Green gradient
    - Hiển thị message gợi ý
    - Nút "Báo cáo ngay" → Link đến `/reports` và tự động điền `suggestedIncidentType`

#### Giá trị
- ✅ Hệ thống không thụ động, chủ động gợi ý
- ✅ Thể hiện tư duy logic và phân tích dữ liệu
- ✅ Tăng engagement của user

---

### 14.3. Admin Suggestion Logic - Gợi ý Quyết định cho Admin

#### Mục tiêu
Hỗ trợ admin ra quyết định duyệt/từ chối báo cáo dựa trên priority score.

#### Logic cốt lõi
Với mỗi report, tính **priorityScore** (0-100) dựa trên:
1. **Severity** (40%):
   - CRITICAL: +40
   - HIGH: +30
   - MEDIUM: +20
   - LOW: +10
2. **Community Confirmation** (30%):
   - Tỷ lệ CONFIRM / tổng votes × 30
   - Bonus: +10 nếu có ≥ 5 CONFIRM
3. **Time Factor** (20%):
   - < 24h: +20 (rất mới)
   - < 72h: +15 (mới)
   - < 168h (1 tuần): +10 (vừa)
   - ≥ 168h: +5 (cũ)
4. **Has Images** (10%):
   - Có ảnh: +10
5. **Penalty**:
   - ≥ 3 REJECT: -20
   - ≥ 2 REJECT: -10

Từ score → gợi ý hành động:
- **Score ≥ 70**: `APPROVE` (Nên duyệt)
- **Score 40-69**: `REVIEW` (Cần xem xét kỹ)
- **Score < 40**: `REJECT` (Nên từ chối)

#### Cách triển khai

**Backend:**
- **Service**: `AdminSuggestionService`
  - `calculatePriorityScore(WeatherReport)`: Tính điểm ưu tiên
  - `suggestAction(double score)`: Đề xuất hành động
  - `getSuggestion(WeatherReport)`: Trả về `AdminSuggestion` object
- **AdminSuggestion** class:
  - `priorityScore`: double (0-100)
  - `suggestedAction`: String ("APPROVE", "REVIEW", "REJECT")
  - `confirmCount`: Long
  - `rejectCount`: Long
- **AdminController**:
  - `GET /api/admin/reports`: Thêm suggestions vào mỗi report DTO
- **WeatherReportDTO**:
  - `priorityScore`: Double
  - `suggestedStatus`: String

**Frontend:**
- **Admin Page**:
  - Hiển thị suggestion badge trên mỗi report card:
    - Màu theo suggestedStatus:
      - APPROVE: Green gradient
      - REVIEW: Orange gradient
      - REJECT: Red gradient
    - Hiển thị: "Hệ thống đề xuất: DUYỆT/XEM XÉT KỸ/TỪ CHỐI"
    - Hiển thị priority score và vote counts
  - Sort reports theo priority score (tùy chọn)

#### Giá trị
- ✅ Admin không chỉ click, có dữ liệu hỗ trợ quyết định
- ✅ Hệ thống có "não", thể hiện AI/ML thinking
- ✅ Tăng hiệu quả và độ chính xác trong quản lý

---

## 15. DATABASE SCHEMA UPDATES

### 15.1. Bảng `report_votes`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `report_id` (BIGINT, FK → weather_reports.id, NOT NULL)
- `user_id` (BIGINT, FK → users.id, NOT NULL)
- `vote_type` (ENUM: CONFIRM, REJECT, NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- **Unique Constraint**: (report_id, user_id) - Mỗi user chỉ vote 1 lần / report

### 15.2. Cập nhật DTOs
- **WeatherReportDTO**: 
  - `confirmCount` (Long)
  - `rejectCount` (Long)
  - `userVote` (String: "CONFIRM", "REJECT", null)
  - `priorityScore` (Double) - Admin only
  - `suggestedStatus` (String) - Admin only
- **WeatherDataDTO**:
  - `suggestedAction` (String)
  - `suggestedIncidentType` (String)
  - `suggestionPriority` (String: "LOW", "MEDIUM", "HIGH")
