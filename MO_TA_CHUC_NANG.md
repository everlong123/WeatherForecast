# MÔ TẢ HỆ THỐNG CLIMATESHARE - CỘNG ĐỒNG CHIA SẺ THÔNG TIN THỜI TIẾT VÀ CẢNH BÁO SỰ CỐ

## 1. KIẾN TRÚC HỆ THỐNG

### 1.1. Kiến trúc tổng quan
- **Mô hình**: Client-Server (SPA - Single Page Application)
- **Backend**: Spring Boot REST API (Java 17)
- **Frontend**: React 19 (SPA với React Router)
- **Database**: MySQL 8.0 / MariaDB (qua XAMPP)
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
- **RDBMS**: MySQL 8.0 / MariaDB (qua XAMPP)
- **Connection**: JDBC với connection pooling
- **Schema Management**: Hibernate DDL auto-update
- **XAMPP Setup**: 
  - Port: 3306 (mặc định)
  - Username: root (mặc định)
  - Password: (thường để trống trong XAMPP)
  - phpMyAdmin: http://localhost/phpmyadmin

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
  - Latitude, Longitude (từ bản đồ khi đăng ký)
  - City, District, Ward (từ reverse geocoding)
- **Validation**: Kiểm tra trùng username/email, format email hợp lệ
- **Mặc định**: Role = `USER`, Enabled = `true`, Trust Score = `0`

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
- Xem và cập nhật thông tin cá nhân (Profile)
- Vote xác nhận/phản đối báo cáo của người khác (trong phạm vi 10km)

#### Role: ADMIN
- Tất cả quyền của USER
- Xem và quản lý tất cả báo cáo (duyệt/từ chối/giải quyết)
- Quản lý người dùng (CRUD, khóa/mở khóa)
- Quản lý loại sự cố (CRUD)
- Quản lý cảnh báo thời tiết
- Xem Dashboard thống kê
- Truy cập trang Admin
- Xem trust score của tất cả users

### 2.4. Route Protection
- **Public Routes**: `/`, `/about`, `/login`, `/map`
- **Private Routes**: `/reports`, `/profile` (yêu cầu đăng nhập)
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
    - Tọa độ GPS (latitude, longitude) - từ bản đồ hoặc nhập thủ công
    - Địa chỉ đầy đủ (address) - tự động từ reverse geocoding
  - **Thời gian xảy ra** (incidentTime): Datetime picker
  - **Mức độ nghiêm trọng** (severity): LOW, MEDIUM, HIGH, CRITICAL
  - **Ảnh đính kèm** (imageUrl): Upload file, lưu trong `uploads/`
- **Tự động gán**: User hiện tại, Status = `PENDING`
- **UI**: Modal form với bản đồ tích hợp để chọn vị trí

### 3.2. Xem danh sách báo cáo
- **Endpoint**: `GET /api/reports` (tất cả) hoặc `GET /api/reports/my-reports` (của user)
- **Hiển thị**:
  - Card layout với thông tin đầy đủ
  - Badge màu sắc cho severity và status
  - Trust score badge của người tạo báo cáo
  - Vote counts (confirmCount, rejectCount)
  - Ảnh báo cáo (nếu có)
  - Địa chỉ và thời gian
  - Action buttons (Edit, Delete, View location, Vote)
- **Lọc**: Theo loại sự cố, trạng thái, mức độ
- **Location Filtering**: 
  - Lọc báo cáo trong bán kính 10km từ vị trí user
  - Có 2 tùy chọn: GPS hiện tại hoặc địa chỉ trong profile
- **Sắp xếp**: Theo thời gian (mới nhất trước)

### 3.3. Cập nhật/Xóa báo cáo
- **Cập nhật**: `PUT /api/reports/{id}`
  - User chỉ được sửa báo cáo của mình
  - Admin có thể sửa mọi báo cáo
- **Xóa**: `DELETE /api/reports/{id}`
  - User chỉ được xóa báo cáo của mình
  - Admin có thể xóa mọi báo cáo

### 3.4. Vote báo cáo (Community Confirmation)
- **Endpoint**: `POST /api/reports/{id}/vote`
- **Body**: `{ voteType: "CONFIRM" | "REJECT", latitude: number, longitude: number }`
- **Validation**: 
  - User không thể vote báo cáo của chính mình
  - Phải trong phạm vi 10km từ vị trí báo cáo
  - Mỗi user chỉ vote 1 lần / report (có thể thay đổi)
- **Response**: `{ confirmCount, rejectCount, userVote, message }`

### 3.5. Duyệt báo cáo (Admin)
- **Duyệt**: `PUT /api/admin/reports/{id}/approve` → Status: `APPROVED`
  - Tự động tăng trust score của user (+5 điểm)
- **Từ chối**: `PUT /api/admin/reports/{id}/reject` → Status: `REJECTED`
  - Tự động giảm trust score của user (-3 điểm, tối thiểu 0)
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
- **Endpoint**: `GET /api/weather/forecast?lat={lat}&lng={lng}&hoursAhead=24`
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
- **Tile Layer**: OpenStreetMap (có thể chuyển sang Satellite, Terrain)
- **Features**:
  - Hiển thị tất cả báo cáo thời tiết dưới dạng markers
  - Click marker để xem chi tiết báo cáo
  - Lọc markers theo:
    - Loại sự cố
    - Trạng thái (PENDING, APPROVED, REJECTED, RESOLVED)
    - Mức độ nghiêm trọng (LOW, MEDIUM, HIGH, CRITICAL)
  - Layer control: Bật/tắt các lớp báo cáo, chọn loại bản đồ
  - Zoom controls: minZoom=2, maxZoom=18 (có thể zoom out toàn cầu)
  - **Không giới hạn bounds**: Có thể di chuyển map ra ngoài Việt Nam
  - Click trên map để chọn vị trí (khi tạo/chỉnh sửa báo cáo)
  - Tự động lấy tất cả báo cáo (không bị giới hạn pagination)

### 5.2. Geocoding (Địa chỉ → Tọa độ)
- **Endpoint**: `GET /api/locations/coordinates?city={city}&district={district}&ward={ward}`
- **Nguồn dữ liệu** (theo thứ tự ưu tiên):
  1. **Open-Meteo Geocoding API**: Miễn phí, không cần API key
  2. **OpenWeatherMap Geocoding API**: Cần API key
  3. **Nominatim API**: Fallback (nếu bật)
- **Sử dụng**: Khi user nhập địa chỉ hoặc chọn từ dropdown

### 5.3. Reverse Geocoding (Tọa độ → Địa chỉ)
- **Endpoint**: `GET /api/locations/reverse?lat={lat}&lng={lng}`
- **Nguồn dữ liệu**:
  1. **BigDataCloud Reverse Geocoding API**: Miễn phí, 10k requests/month, không cần API key (đang bật)
  2. **Nominatim API**: OpenStreetMap (đang tắt do rate limit/403)
- **Sử dụng**: 
  - Khi user click trên map để chọn vị trí
  - Khi hiển thị địa chỉ từ GPS coordinates
  - Tự động điền address vào form

### 5.4. Location Filtering
- **Tùy chọn**: User có thể chọn giữa GPS hiện tại hoặc địa chỉ trong profile
- **Logic**: 
  - Ưu tiên latitude/longitude từ profile
  - Fallback: Geocode từ address nếu không có lat/lng
  - Cuối cùng: Sử dụng GPS nếu không có profile location
- **Bán kính**: Lọc báo cáo trong phạm vi 10km từ vị trí đã chọn

---

## 6. QUẢN TRỊ (ADMIN)

### 6.1. Dashboard Thống kê
- **Endpoint**: `GET /api/admin/stats`
- **Thống kê hiển thị**:
  - Tổng số báo cáo
  - Số báo cáo theo trạng thái (PENDING, APPROVED, REJECTED, RESOLVED)
  - Số báo cáo theo loại sự cố
  - Số báo cáo theo mức độ nghiêm trọng
  - Số người dùng theo role (USER, ADMIN)
  - Thống kê trust score (trung bình, cao nhất, thấp nhất)
  - Xu hướng tuần này so với tuần trước (% thay đổi)
- **Bộ lọc (Filter)**:
  - **Thời gian**: Tất cả thời gian, 7 ngày qua, 30 ngày qua, 90 ngày qua
  - **Trạng thái**: Tất cả, Đã duyệt, Đang chờ, Đã từ chối, Đã xử lý
  - Filter panel có thể mở/đóng
  - Tự động tính toán lại stats khi filter thay đổi
  - Hiển thị badge khi có filter active
- **Giao diện**: 
  - Header với title, subtitle và trend badge lớn
  - 4 metric cards lớn, dễ nhìn với icons và badges
  - Charts: Line chart (xu hướng 7 ngày), Pie chart (theo loại), Bar chart (theo quận/huyện)
  - Recent reports list với styling hiện đại
  - Responsive grid layout
  - Modern design với clean UI

### 6.2. Quản lý báo cáo
- **Xem tất cả**: Danh sách tất cả báo cáo (kể cả chưa duyệt)
- **Admin Suggestion Logic**:
  - Tính priority score (0-100) dựa trên:
    - Severity (40%)
    - Community votes (30%)
    - Time factor (20%)
    - Has images (10%)
    - Penalty cho nhiều REJECT votes
  - Gợi ý hành động: APPROVE (≥70), REVIEW (40-69), REJECT (<40)
  - Hiển thị badge màu trên mỗi report card
- **Duyệt/Từ chối**: 
  - Modal với comment field
  - Cập nhật status và lưu comment
  - Tự động cập nhật trust score của user
- **Giải quyết**: Đánh dấu báo cáo đã được xử lý
- **Chỉnh sửa/Xóa**: Admin có thể sửa/xóa bất kỳ báo cáo
- **Lọc**: Theo trạng thái, loại sự cố, mức độ, user, trust score
- **Sắp xếp**: Theo priority score, trust score, thời gian

### 6.3. Quản lý người dùng
- **Xem danh sách**: Tất cả users với thông tin đầy đủ, trust score
- **Tạo user mới**: 
  - Form với đầy đủ thông tin
  - Chọn role (USER/ADMIN)
  - Set enabled/disabled
  - Trust score mặc định = 0
- **Chỉnh sửa**: Cập nhật thông tin user
- **Khóa/Mở khóa**: Toggle `enabled` field
- **Xóa**: Xóa user (có thể có validation)
- **Sắp xếp**: Theo trust score, username, role

### 6.4. Quản lý loại sự cố
- **Endpoint**: `GET/POST/PUT/DELETE /api/admin/incident-types`
- **CRUD đầy đủ**: Thêm, sửa, xóa loại sự cố
- **Danh sách mặc định**: Bão, Lũ lụt, Lốc xoáy, Sét, Mưa đá, Bụi mù, Sương mù, Nhiệt độ cực đoan...
- **Hiển thị**: List với action buttons, icon và màu sắc

### 6.5. Quản lý cảnh báo thời tiết
- **Entity**: `WeatherAlert`
- **Chức năng**: Tạo, cập nhật, xóa cảnh báo
- **Thông tin**: Tiêu đề, mô tả, mức độ cảnh báo, vùng ảnh hưởng (lat/lng + radius)

### 6.6. Giao diện Admin
- **Layout**: Tab-based interface
- **Tabs**: Dashboard, Báo cáo, Người dùng, Loại sự cố, Cảnh báo
- **Style**: Dark blue gradient background, white cards
- **Responsive**: Mobile-friendly

---

## 7. HỆ THỐNG TRUST SCORE (ĐỘ TIN CẬY NGƯỜI DÙNG)

### 7.1. Khái niệm
- **Trust Score**: Điểm số phản ánh độ tin cậy của người dùng trong hệ thống
- **Mục đích**: Đánh giá chất lượng báo cáo và hỗ trợ admin trong việc duyệt báo cáo
- **Giá trị**: Bắt đầu từ 0, không có giới hạn trên (có thể tăng không giới hạn)

### 7.2. Cách tính điểm
- **Tăng điểm**: 
  - Report được admin approve: +5 điểm
- **Giảm điểm**: 
  - Report bị admin reject: -3 điểm
  - Tối thiểu: 0 điểm (không thể âm)

### 7.3. Trust Levels
Dựa trên trust score, user được phân loại thành các level:

- **EXPERT** (≥200 điểm): Chuyên gia
  - Màu: Purple (#9333ea)
- **ADVANCED** (≥100 điểm): Nâng cao
  - Màu: Green (#10b981)
- **INTERMEDIATE** (≥60 điểm): Trung cấp
  - Màu: Blue (#3b82f6)
- **BEGINNER** (<60 điểm): Sơ cấp
  - Màu: Yellow/Orange (#f59e0b) hoặc Red (#ef4444) tùy điểm số

### 7.4. Ứng dụng
- **Admin Suggestion**: Trust score được tính vào priority score khi gợi ý duyệt báo cáo
- **Hiển thị**: 
  - Badge trust score trên report cards
  - Profile page hiển thị trust score và level
  - Admin page có thể sắp xếp users theo trust score
- **API**: 
  - `GET /api/auth/me`: Lấy trust score của user hiện tại
  - `GET /api/admin/users`: Lấy trust score của tất cả users

---

## 8. PROFILE NGƯỜI DÙNG

### 8.1. Xem thông tin cá nhân
- **Endpoint**: `GET /api/auth/me`
- **Thông tin hiển thị**:
  - Username, Email, Full Name, Phone
  - Address, Latitude, Longitude
  - Trust Score và Trust Level
  - Thống kê báo cáo (tổng số, theo trạng thái)
  - Ngày tạo tài khoản

### 8.2. Cập nhật thông tin
- **Endpoint**: `PUT /api/auth/me`
- **Có thể cập nhật**:
  - Full Name, Phone
  - Address
  - Latitude, Longitude (từ bản đồ)
- **UI**: 
  - Form chỉnh sửa với map tích hợp
  - Click trên map để chọn vị trí mới
  - Tự động reverse geocode để lấy address

### 8.3. Thống kê cá nhân
- **Endpoint**: `GET /api/auth/me/stats`
- **Thống kê**:
  - Tổng số báo cáo đã tạo
  - Số báo cáo theo trạng thái (PENDING, APPROVED, REJECTED, RESOLVED)
  - Trust Score hiện tại

---

## 9. GIAO DIỆN NGƯỜI DÙNG

### 9.1. Navbar (Navigation Bar)
- **Layout**: 3 cột grid
  - **Cột 1**: Logo "ClimateShare" với icon 🌍
  - **Cột 2**: Menu items (căn giữa) - Trang chủ, Giới thiệu, Bản đồ, Báo cáo của tôi (user), Thống kê (admin), Quản trị (admin)
  - **Cột 3**: User section (căn phải) - Username + nút Đăng xuất (nếu đã login) hoặc nút Đăng nhập (nếu chưa login)
- **Style**: 
  - Dark blue background với backdrop blur
  - Fixed position, z-index cao
  - Hover effects với transform và shadow
  - Responsive: Chuyển layout dọc trên mobile

### 9.2. Trang Home
- **Hero Section**:
  - Background: Dark blue gradient với light blue speckles
  - Title: "ClimateShare" + "Cộng đồng chia sẻ thông tin thời tiết"
  - Subtitle: "Nền tảng kết nối cộng đồng để chia sẻ, theo dõi và cảnh báo về các sự cố thời tiết tại Việt Nam"
  - CTA Buttons: "Xem Bản đồ" và "Báo cáo Sự cố" (pill-shaped, gradient blue)
- **Weather Card Section**:
  - Tabs: "Hiện tại", "Dự báo (24h)", "Lịch sử"
  - Weather card lớn với thông tin chi tiết
  - Real-time clock
  - Location picker
- **Recent Reports Section**:
  - Grid layout với report cards
  - Link "Xem tất cả trên bản đồ"

### 9.3. Trang Bản đồ (Map)
- **Full-screen map** với Leaflet
- **Controls**: 
  - Layer control panel (filter by incident type, status, severity)
  - Zoom controls
  - Location picker (nếu có query param `selectLocation=true`)
- **Markers**: 
  - Color-coded theo severity hoặc status
  - Popup với thông tin báo cáo
- **Click handler**: Chọn vị trí và reverse geocode

### 9.4. Trang Báo cáo (Reports)
- **Header**: Title + nút "Tạo báo cáo mới"
- **Location Filtering**:
  - Radio buttons: "GPS hiện tại" hoặc "Địa chỉ trong profile"
  - Hiển thị tọa độ đang sử dụng
  - Cảnh báo nếu không có vị trí
- **Report Cards**:
  - Header: Title + action buttons (Edit, Delete, View location)
  - Content: Description, badges (incident type, severity, status, trust score)
  - Vote buttons: "Tôi cũng gặp" (CONFIRM) và "Không đúng" (REJECT)
  - Vote counts: confirmCount và rejectCount
  - Images: Hiển thị ảnh báo cáo
  - Footer: Location và timestamp
- **Modal Form**: 
  - Tạo/chỉnh sửa báo cáo
  - Map tích hợp để chọn vị trí
  - File upload cho ảnh
  - Validation

### 9.5. Trang Profile
- **Thông tin cá nhân**:
  - Card hiển thị thông tin cơ bản
  - Trust Score badge lớn với màu sắc theo level
  - Trust Level label (EXPERT, ADVANCED, INTERMEDIATE, BEGINNER)
- **Thống kê**:
  - Card hiển thị số liệu báo cáo
  - Trust Score hiện tại
- **Chỉnh sửa**:
  - Form với các trường có thể chỉnh sửa
  - Map tích hợp để cập nhật vị trí
  - Nút "Chọn trên bản đồ" để mở map
  - Click trên map để cập nhật lat/lng và address

### 9.6. Trang Admin
- **Tab Navigation**: Dashboard, Báo cáo, Người dùng, Loại sự cố, Cảnh báo
- **Dark Theme**: Navy blue gradient background
- **Cards**: White cards với shadow và border
- **Forms**: Modal forms cho CRUD operations
- **Tables/Lists**: Responsive với action buttons
- **Admin Suggestions**: Badge màu hiển thị gợi ý duyệt/từ chối

### 9.7. Trang About
- **Hero Section**: 
  - Title: "ClimateShare"
  - Subtitle: "Cộng đồng chia sẻ thông tin thời tiết và cảnh báo sự cố"
  - Description: Mô tả về hệ thống
- **Nội dung**:
  - Mục đích
  - Tính năng chính
  - Công nghệ sử dụng
  - Cách sử dụng
  - Lợi ích
  - CTA buttons

### 9.8. Design System

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

## 10. TÍCH HỢP API BÊN THỨ BA

### 10.1. Open-Meteo API
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
  - Miễn phí, không cần API key
  - Rate limit: Không có giới hạn nghiêm ngặt
- **Current Weather**: `https://api.open-meteo.com/v1/forecast`
  - Current + hourly forecast
  - Miễn phí, không cần API key
- **Sử dụng**: Primary source cho weather data

### 10.2. OpenWeatherMap API
- **Geocoding**: `https://api.openweathermap.org/geo/1.0/direct`
  - Cần API key
  - Rate limit: 60 calls/minute (free tier)
- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
  - Cần API key
- **One Call API 3.0**: `https://api.openweathermap.org/data/3.0/onecall`
  - Hourly forecast
  - Cần API key và subscription
- **Sử dụng**: Fallback khi Open-Meteo không có dữ liệu

### 10.3. BigDataCloud Reverse Geocoding API
- **Endpoint**: `https://api.bigdatacloud.net/data/reverse-geocode-client`
- **Miễn phí**: 10,000 requests/month
- **Không cần API key**
- **Sử dụng**: Primary source cho reverse geocoding (lat/lng → address)
- **Status**: Đang bật (`bigdatacloud.api.enabled=true`)

### 10.4. Nominatim API (OpenStreetMap)
- **Endpoint**: `https://nominatim.openstreetmap.org/reverse`
- **Miễn phí** nhưng có rate limit nghiêm ngặt
- **Yêu cầu**: User-Agent với email liên hệ, delay ≥ 1s giữa requests
- **Status**: Đang tắt (`nominatim.api.enabled=false`) do bị 403/rate limit
- **Sử dụng**: Fallback cho reverse geocoding (khi bật lại)

### 10.5. Mock Weather Service
- **Mục đích**: Fallback khi tất cả API đều lỗi hoặc mất mạng
- **Dữ liệu**: Template data với giá trị hợp lý
- **Sử dụng**: Demo/testing

---

## 11. LƯU TRỮ DỮ LIỆU

### 11.1. Database Schema (MySQL)

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
- `latitude` (DOUBLE) - Tọa độ từ profile
- `longitude` (DOUBLE) - Tọa độ từ profile
- `role` (ENUM: USER, ADMIN) - Default: USER
- `enabled` (BOOLEAN) - Default: true
- `trust_score` (INT) - Default: 0, không giới hạn trên
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
- `hidden` (BOOLEAN) - Default: false
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Bảng `report_images`
- `weather_reports_id` (BIGINT, FK → weather_reports.id)
- `image_url` (VARCHAR)

#### Bảng `report_votes`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `report_id` (BIGINT, FK → weather_reports.id, NOT NULL)
- `user_id` (BIGINT, FK → users.id, NOT NULL)
- `vote_type` (ENUM: CONFIRM, REJECT, NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- **Unique Constraint**: (report_id, user_id)

#### Bảng `incident_types`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `name` (VARCHAR, UNIQUE, NOT NULL)
- `description` (TEXT)
- `icon` (VARCHAR)
- `color` (VARCHAR)
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
- `icon` (VARCHAR)
- `city` (VARCHAR)
- `district` (VARCHAR)
- `ward` (VARCHAR)
- `recorded_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

#### Bảng `weather_alerts`
- `id` (BIGINT, PK, AUTO_INCREMENT)
- `admin_id` (BIGINT, FK → users.id)
- `title` (VARCHAR, NOT NULL)
- `message` (TEXT)
- `level` (ENUM: INFO, WARNING, CRITICAL)
- `city` (VARCHAR)
- `district` (VARCHAR)
- `ward` (VARCHAR)
- `latitude` (DOUBLE)
- `longitude` (DOUBLE)
- `radius` (DOUBLE)
- `start_time` (DATETIME)
- `end_time` (DATETIME)
- `active` (BOOLEAN) - Default: true
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### 11.2. File Storage
- **Directory**: `weather/uploads/`
- **Naming**: `{timestamp}_{hash}.{extension}`
- **Supported formats**: JPG, PNG, GIF
- **Endpoint**: `POST /uploads` (không qua `/api` prefix)
- **Access**: Public URL `http://localhost:8080/uploads/{filename}`

---

## 12. BẢO MẬT & HẠ TẦNG

### 12.1. Authentication & Authorization
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

### 12.2. CORS Configuration
- **Allowed Origins**: `http://localhost:3000` (development)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: Authorization, Content-Type
- **Configuration**: `WebConfig.java` với `@CrossOrigin`

### 12.3. Error Handling
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

### 12.4. Validation
- **Backend**: Spring Validation annotations (`@NotNull`, `@NotBlank`, `@Email`, etc.)
- **Frontend**: Form validation với error messages
- **Database**: Constraints (UNIQUE, NOT NULL, FOREIGN KEY)

### 12.5. Logging
- **Framework**: Spring Boot default logging (Logback)
- **Levels**: INFO, WARN, ERROR
- **Console Output**: UTF-8 encoding

---

## 13. DEPLOYMENT & CONFIGURATION

### 13.1. Backend Configuration
- **Port**: 8080 (default)
- **Database**: MySQL/MariaDB qua XAMPP trên localhost:3306
- **Database Name**: `weather_db`
- **XAMPP Setup**:
  - Username: `root` (mặc định)
  - Password: (thường để trống, hoặc password bạn đã set)
  - phpMyAdmin: http://localhost/phpmyadmin
- **JWT Secret**: Config trong `application.properties` (nên thay đổi trong production)
- **API Keys**: Config trong `application.properties`

### 13.2. Frontend Configuration
- **Port**: 3000 (development)
- **API Base URL**: `http://localhost:8080/api`
- **Build**: `npm run build` → `build/` directory
- **Static Files**: Serve từ `build/` hoặc integrate với backend

### 13.3. Environment Variables
- **Backend**: `application.properties`
- **Frontend**: Hardcoded URLs (có thể chuyển sang `.env` file)

---

## 14. TÓM TẮT CÔNG NGHỆ VÀ CHỨC NĂNG

### 14.1. Stack Technology
- **Backend**: Spring Boot 4.0.0 (Java 17) + Spring Security + JPA/Hibernate
- **Frontend**: React 19.2.1 + React Router + Axios + Leaflet
- **Database**: MySQL 8.0 / MariaDB (qua XAMPP)
- **Build Tools**: Gradle (backend), npm/react-scripts (frontend)
- **Authentication**: JWT
- **Maps**: Leaflet + OpenStreetMap (có thể chuyển sang Satellite, Terrain)

### 14.2. Main Features
1. ✅ User Authentication & Authorization (Register, Login, JWT)
2. ✅ Weather Current/Forecast/History (Multiple API sources)
3. ✅ Weather Reports Management (CRUD, Admin approval)
4. ✅ Interactive Map (Markers, Filters, Location picker, không giới hạn bounds)
5. ✅ Geocoding & Reverse Geocoding (Multiple providers)
6. ✅ Admin Dashboard với bộ lọc (Stats, Filter theo thời gian/trạng thái, User management, Report management)
7. ✅ File Upload (Images for reports)
8. ✅ Real-time Clock & Location Display
9. ✅ Responsive UI với modern design
10. ✅ Trust Score System (Độ tin cậy người dùng)
11. ✅ Community Vote System (Xác nhận từ cộng đồng)
12. ✅ Admin Suggestion Logic (Gợi ý quyết định)
13. ✅ User Profile với map để cập nhật location
14. ✅ Location-based Filtering (GPS hoặc profile address)
15. ✅ Dashboard Filter System (Lọc theo thời gian: 7/30/90 ngày, trạng thái: APPROVED/PENDING/REJECTED/RESOLVED)

### 14.3. API Endpoints Summary
- **Auth**: 
  - `POST /api/auth/register` - Đăng ký
  - `POST /api/auth/login` - Đăng nhập
  - `GET /api/auth/me` - Lấy thông tin user hiện tại
  - `GET /api/auth/me/stats` - Lấy thống kê user
  - `PUT /api/auth/me` - Cập nhật profile
- **Weather**: 
  - `GET /api/weather/current` - Thời tiết hiện tại
  - `GET /api/weather/forecast` - Dự báo 24h
  - `GET /api/weather/history` - Lịch sử thời tiết
- **Reports**: 
  - `GET /api/reports` - Tất cả báo cáo
  - `GET /api/reports/my-reports` - Báo cáo của user
  - `POST /api/reports` - Tạo báo cáo
  - `PUT /api/reports/{id}` - Cập nhật báo cáo
  - `DELETE /api/reports/{id}` - Xóa báo cáo
  - `POST /api/reports/{id}/vote` - Vote báo cáo
- **Admin**: 
  - `GET /api/admin/stats` - Thống kê
  - `GET /api/admin/reports` - Tất cả báo cáo (với suggestions)
  - `PUT /api/admin/reports/{id}/approve` - Duyệt báo cáo
  - `PUT /api/admin/reports/{id}/reject` - Từ chối báo cáo
  - `PUT /api/admin/reports/{id}/resolve` - Giải quyết báo cáo
  - `GET /api/admin/users` - Tất cả users
  - `POST /api/admin/users` - Tạo user
  - `PUT /api/admin/users/{id}` - Cập nhật user
  - `DELETE /api/admin/users/{id}` - Xóa user
  - `PUT /api/admin/users/{id}/toggle` - Khóa/mở khóa user
  - `PUT /api/admin/users/{id}/role` - Đổi role
- **Locations**: 
  - `GET /api/locations/coordinates` - Geocoding (address → lat/lng)
  - `GET /api/locations/reverse` - Reverse geocoding (lat/lng → address)
- **Upload**: 
  - `POST /uploads` - Upload ảnh (no `/api` prefix)
- **Incident Types**: 
  - `GET /api/incident-types` - Danh sách loại sự cố
  - `GET /api/admin/incident-types` - Quản lý loại sự cố (admin)
  - `POST /api/admin/incident-types` - Tạo loại sự cố
  - `PUT /api/admin/incident-types/{id}` - Cập nhật loại sự cố
  - `DELETE /api/admin/incident-types/{id}` - Xóa loại sự cố

---

## 15. TÍNH NĂNG THÔNG MINH

### 15.1. Community Vote System - Xác nhận từ Cộng đồng

#### Mục tiêu
Đánh giá độ tin cậy báo cáo dựa trên sự xác nhận của cộng đồng người dùng.

#### Logic cốt lõi
- User A tạo report
- User B, C, D có thể:
  - **Xác nhận đúng** (CONFIRM) - "Tôi cũng gặp"
  - **Phản đối** (REJECT) - "Không đúng"
- Mỗi user chỉ vote 1 lần / report (có thể thay đổi vote)
- Phải trong phạm vi 10km từ vị trí báo cáo
- Report có:
  - `confirmCount`: Số lượng xác nhận
  - `rejectCount`: Số lượng phản đối
  - `userVote`: Vote của user hiện tại (nếu có)

#### Cách triển khai
- **Entity**: `ReportVote` với unique constraint (report_id, user_id)
- **Service**: `ReportVoteService` xử lý vote logic
- **API**: `POST /api/reports/{id}/vote`
- **UI**: 2 nút vote với badge hiển thị số lượng

### 15.2. Admin Suggestion Logic - Gợi ý Quyết định cho Admin

#### Mục tiêu
Hỗ trợ admin ra quyết định duyệt/từ chối báo cáo dựa trên priority score.

#### Logic tính điểm
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
5. **Trust Score** (20%):
   - ≥ 100: +20
   - < 100: Scale tuyến tính
6. **Penalty**:
   - ≥ 3 REJECT: -20
   - ≥ 2 REJECT: -10

Từ score → gợi ý hành động:
- **Score ≥ 70**: `APPROVE` (Nên duyệt)
- **Score 40-69**: `REVIEW` (Cần xem xét kỹ)
- **Score < 40**: `REJECT` (Nên từ chối)

#### Cách triển khai
- **Service**: `AdminSuggestionService` tính priority score
- **AdminController**: Thêm suggestions vào report DTOs
- **UI**: Badge màu hiển thị gợi ý trên mỗi report card

---

## 16. MIGRATION SCRIPTS

### 16.1. Migration Trust Score
- **File**: `migration_add_trust_score.sql`
- **Nội dung**: Thêm column `trust_score` với default = 0
- **Chạy khi**: Database đã tồn tại và chưa có column

### 16.2. Migration User Location
- **File**: `migration_add_user_location.sql`
- **Nội dung**: Thêm columns `latitude` và `longitude` vào bảng users
- **Chạy khi**: Database đã tồn tại và chưa có columns

---

## 17. GHI CHÚ QUAN TRỌNG

- **Trust Score**: Bắt đầu từ 0, không có giới hạn trên
- **Location**: Ưu tiên latitude/longitude trực tiếp từ profile, fallback geocode từ address
- **Vote Distance**: Chỉ vote được trong phạm vi 10km từ vị trí báo cáo
- **Profile Location**: User có thể cập nhật location qua map trong profile page
- **Admin Suggestions**: Dựa trên nhiều yếu tố để đưa ra gợi ý duyệt/từ chối
