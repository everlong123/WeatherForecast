# PHÂN CÔNG CÔNG VIỆC - CLIMATESHARE PROJECT

## TỔNG QUAN DỰ ÁN

**Tên đề tài**: Xây dựng hệ thống chia sẻ thông tin thời tiết và cảnh báo sự cố ClimateShare

**Mô tả**: Nền tảng web kết nối cộng đồng để chia sẻ, theo dõi và cảnh báo về các sự cố thời tiết. Hệ thống tích hợp thông tin thời tiết real-time, bản đồ tương tác, hệ thống báo cáo với xác thực cộng đồng và quản trị thông minh.

**Công nghệ**: Spring Boot (Backend), React (Frontend), MySQL (Database), Leaflet (Maps), Recharts (Charts)

---

## SINH VIÊN 1: BACKEND DEVELOPER

- Thiết kế cơ sở dữ liệu và tạo các bảng cần thiết trên XAMPP
- Xây dựng dự án Spring Boot với Spring Security và xác thực JWT
- Xây dựng API xác thực (đăng ký, đăng nhập, lấy thông tin người dùng)
- Tích hợp API thời tiết (Open-Meteo, OpenWeatherMap) cho thời tiết hiện tại, dự báo, lịch sử
- Xây dựng API quản lý báo cáo (thao tác CRUD với phân trang)
- Xây dựng chức năng upload ảnh cho báo cáo
- Xây dựng hệ thống vote cộng đồng (XÁC NHẬN/TỪ CHỐI với kiểm tra khoảng cách 10km)
- Tích hợp API địa chỉ hóa và địa chỉ hóa ngược (BigDataCloud, Open-Meteo)
- Xây dựng API quản trị (quản lý báo cáo, người dùng, loại sự cố)
- Xây dựng logic gợi ý cho admin (tính điểm ưu tiên)
- Xây dựng API thống kê cho dashboard
- Xây dựng hệ thống điểm tin cậy (tăng/giảm điểm, tính mức độ tin cậy)
- Viết tài liệu API và kiểm thử các endpoint
- Xử lý lỗi và kiểm tra dữ liệu đầu vào

---

## SINH VIÊN 2: FRONTEND DEVELOPER

- Khởi tạo dự án React với các thư viện cần thiết
- Xây dựng giao diện xác thực (đăng ký, đăng nhập, bảo vệ route)
- Tạo thanh điều hướng và bố cục (Navbar, Footer)
- Làm trang chủ (phần hero, thẻ thời tiết với các tab, báo cáo gần đây)
- Làm trang bản đồ (bản đồ Leaflet, đánh dấu, bộ lọc, điều khiển lớp)
- Làm trang báo cáo (thẻ báo cáo, lọc theo vị trí, nút vote, form modal)
- Làm trang hồ sơ (thông tin cá nhân, huy hiệu điểm tin cậy, form chỉnh sửa với bản đồ)
- Làm trang dashboard (thẻ số liệu, bảng lọc, biểu đồ, danh sách báo cáo gần đây)
- Làm các trang quản trị (Quản lý báo cáo, Quản lý người dùng, Quản lý loại sự cố)
- Xây dựng hệ thống thiết kế giao diện (màu sắc, kiểu chữ, nút, thẻ, huy hiệu)
- Xây dựng giao diện responsive cho tất cả các trang
- Tạo hiệu ứng, trạng thái tải, thông báo lỗi
- Kiểm thử và tối ưu hiệu suất

---

## CÔNG VIỆC CHUNG (CẢ 2 SINH VIÊN)

- Kết nối Frontend với Backend API và kiểm thử end-to-end
- Sửa lỗi và vấn đề khi tích hợp
- Viết README.md và MO_TA_CHUC_NANG.md
- Tài liệu hóa các API endpoint
- Chuẩn bị demo và thuyết trình
- Kiểm thử toàn bộ hệ thống trước khi nộp bài

---

## LƯU Ý

- Cả 2 sinh viên cần giao tiếp thường xuyên để đảm bảo hợp đồng API và định dạng dữ liệu nhất quán
- Sử dụng Git để quản lý code, tạo nhánh cho từng tính năng
- Xem xét code của nhau trước khi hợp nhất
- Kiểm thử kỹ trước khi bàn giao cho người kia
- Cập nhật tài liệu khi có thay đổi
