# MÔ TẢ CHỨC NĂNG HỆ THỐNG WEATHER FORECAST (BẢN HIỆN TẠI – KHÔNG DÙNG PYTHON/ML)

## 1. XÁC THỰC VÀ PHÂN QUYỀN

- **Đăng ký**: username, email, mật khẩu, họ tên, SĐT, địa chỉ; mật khẩu mã hóa BCrypt; kiểm tra trùng username/email.
- **Đăng nhập**: JWT token (hết hạn sau 24h), gửi kèm trong mọi request cần bảo vệ.
- **Phân quyền**:
  - **USER**: xem thời tiết, xem/báo cáo sự cố, quản lý báo cáo của chính mình.
  - **ADMIN**: toàn quyền quản trị (báo cáo, người dùng, loại sự cố, cảnh báo).

---

## 2. QUẢN LÝ BÁO CÁO SỰ CỐ THỜI TIẾT

- **Tạo báo cáo**:
  - Thông tin: loại sự cố, tiêu đề, mô tả chi tiết, địa điểm (tỉnh/quận/phường), tọa độ, thời gian xảy ra, mức độ (LOW → CRITICAL), ảnh đính kèm (tùy chọn).
  - Hệ thống tự gán user hiện tại, trạng thái ban đầu: `PENDING`.
- **Xem danh sách báo cáo**:
  - Xem tất cả báo cáo (theo quyền), xem riêng báo cáo của mình.
  - Lọc theo loại sự cố, trạng thái, mức độ; sắp xếp theo thời gian.
- **Cập nhật/Xóa**:
  - User chỉ được sửa/xóa báo cáo của chính mình.
  - Admin có thể sửa/xóa mọi báo cáo.

---

## 3. THỜI TIẾT HIỆN TẠI, DỰ BÁO 24H VÀ LỊCH SỬ

### 3.1. Thời tiết hiện tại

- Lấy theo **tọa độ (lat/lng)**:
  - Tự động lấy vị trí GPS của trình duyệt hoặc tọa độ người dùng chọn.
- Hiển thị:
  - Nhiệt độ, cảm giác như, độ ẩm, áp suất.
  - Tốc độ gió, hướng gió, mây che phủ, tầm nhìn, lượng mưa/tuyết.
  - Mô tả thời tiết + icon tương ứng.
- Nguồn dữ liệu:
  1. **Database** (bản ghi đã lưu gần nhất cho vị trí đó).
  2. **Open-Meteo API** (miễn phí, không cần API key).
  3. **OpenWeatherMap API** (nếu cấu hình API key).
  4. **Mock data** (fallback cho demo/khi mất mạng).
- Frontend:
  - Trang Home với **weather card** lớn (Vị trí hiện tại, thời gian thực, thông tin chi tiết).

### 3.2. Dự báo thời tiết 24h (API)

- Dự báo 24 giờ tới theo thứ tự ưu tiên:
  1. **OpenWeatherMap One Call API 3.0** (nếu có key & subscription).
  2. **Open-Meteo Forecast API** (miễn phí, không key).
- Output (backend): danh sách tối đa 24 mốc giờ, mỗi mốc gồm:
  - Thời gian, nhiệt độ, độ ẩm, áp suất.
  - Tốc độ gió, mây che phủ, lượng mưa, mô tả thời tiết.
- Frontend:
  - Tab **“Dự báo (24h)”** dưới weather card:
    - Hiển thị list dọc 24 record theo timeline.
    - Mỗi item: thời gian, icon, nhiệt độ nổi bật, độ ẩm, lượng mưa.

### 3.3. Lịch sử thời tiết

- Mỗi lần lấy thời tiết hiện tại, hệ thống **lưu vào MySQL** (bảng `weather_data`).
- API `/weather/history` trả về danh sách bản ghi theo lat/lng (mới nhất trước).
- Frontend:
  - Tab **“Lịch sử”**:
    - Nhóm bản ghi theo ngày, mỗi ngày có nhiều mốc giờ.
    - Hiển thị: thời gian, icon, nhiệt độ, độ ẩm, gió, áp suất, mưa.

---

## 4. BẢN ĐỒ VÀ ĐỊA LÝ

- **Hiển thị bản đồ**:
  - Hiển thị các marker báo cáo thời tiết; click để xem chi tiết.
  - Lọc marker theo loại sự cố, trạng thái, mức độ nghiêm trọng.
- **Geocoding (Địa chỉ → Tọa độ)**:
  - Ưu tiên: file JSON local (`locations.json`, `location_coordinates.json`) → **Open-Meteo Geocoding API** → OpenWeatherMap Geocoding.
  - **Nominatim** tạm **disable** do bị rate limit/403.
- **Reverse geocoding (Tọa độ → Địa chỉ)**:
  - Khi bật lại Nominatim, có thể dùng để hiển thị tên địa điểm từ GPS.

---

## 5. QUẢN TRỊ (ADMIN)

- **Quản lý báo cáo**:
  - Duyệt/Từ chối (`PENDING → APPROVED/REJECTED`).
  - Xem tất cả báo cáo (kể cả chưa duyệt), cập nhật/xóa bất kỳ báo cáo.
- **Quản lý người dùng**:
  - Danh sách user, tạo user mới (USER/ADMIN), cập nhật thông tin, khóa/mở khóa tài khoản, xóa user.
- **Quản lý loại sự cố**:
  - Thêm/sửa/xóa loại sự cố (Bão, Lũ lụt, Lốc xoáy…).
- **Quản lý cảnh báo**:
  - Tạo/cập nhật/xóa các cảnh báo thời tiết gửi tới người dùng.
- **Dashboard & thống kê**:
  - Thống kê: số báo cáo theo trạng thái, loại, mức độ; số user theo vai trò.
  - Biểu đồ trực quan trên trang admin.

---

## 6. TÍCH HỢP API BÊN THỨ BA

- **Open-Meteo API**:
  - Geocoding (địa điểm → tọa độ).
  - Current & hourly forecast (không cần API key).
- **OpenWeatherMap API**:
  - Geocoding (cần API key).
  - Current Weather & One Call 3.0 (current + hourly forecast) – dùng khi cần dữ liệu chi tiết và có key.
- **Nominatim API (OpenStreetMap)**:
  - Đã tích hợp nhưng **đang tạm tắt** (bị 403/rate limit).
  - Khi bật lại phải tuân thủ: User-Agent có email liên hệ, delay ≥ 1s giữa các request, không bulk.

---

## 7. LƯU TRỮ DỮ LIỆU

- **MySQL**:
  - `users`: tài khoản người dùng.
  - `weather_reports`: báo cáo sự cố thời tiết.
  - `incident_types`: loại sự cố.
  - `weather_data`: dữ liệu thời tiết (current + history).
  - `weather_alerts`: cảnh báo thời tiết.
- **File uploads**:
  - Lưu ảnh báo cáo trong thư mục `uploads/`.
- **JSON cache địa điểm**:
  - `locations.json`, `location_coordinates.json` để giảm số lần gọi geocoding API.

---

## 8. BẢO MẬT & HẠ TẦNG

- **JWT**: bảo vệ tất cả API (trừ đăng ký/đăng nhập).
- **Mã hóa mật khẩu**: BCrypt, không lưu plain text.
- **Phân quyền**: kiểm tra theo role (USER/ADMIN) trong backend.
- **CORS**: chỉ cho phép frontend từ `http://localhost:3000` (trong môi trường dev).

---

## 9. TÓM TẮT CÔNG NGHỆ

- **Backend**: Spring Boot (REST API, bảo mật, JPA/Hibernate, tích hợp Open-Meteo & OpenWeatherMap).
- **Frontend**: React (SPA, layout hero + weather card + tabs “Hiện tại / Dự báo (24h) / Lịch sử”, trang Admin).
- **Database**: MySQL.
- **Khác**: JSON cache địa điểm, upload file, logging & error handling tập trung.


