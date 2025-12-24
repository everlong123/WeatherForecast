import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiCloud, FiMapPin, FiUsers, FiShield, FiActivity, 
  FiAlertCircle, FiTrendingUp, FiZap, FiCheckCircle,
  FiGlobe, FiSmartphone, FiDatabase, FiCode
} from 'react-icons/fi';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <FiCloud className="hero-icon" />
              ClimateShare
            </h1>
            <p className="hero-subtitle">
              Cộng đồng chia sẻ thông tin thời tiết và cảnh báo sự cố
            </p>
            <p className="hero-description">
              Nền tảng kết nối cộng đồng để cùng chia sẻ, theo dõi và cảnh báo về các sự cố thời tiết. 
              Giúp mọi người chủ động ứng phó và bảo vệ an toàn thông qua việc chia sẻ thông tin kịp thời và chính xác.
            </p>
          </div>
        </div>
      </div>

      <div className="about-content">
        <div className="container">
          {/* Mục đích */}
          <section className="about-section">
            <h2 className="section-title">
              <FiActivity /> Mục đích
            </h2>
            <div className="section-content">
              <p>
                <strong>ClimateShare</strong> được xây dựng với mục tiêu tạo ra một cộng đồng 
                chia sẻ thông tin về thời tiết, khí hậu và các sự cố liên quan, giúp người dùng:
              </p>
              <ul className="feature-list">
                <li>📊 Theo dõi thời tiết hiện tại, dự báo 24h và lịch sử</li>
                <li>📍 Báo cáo và xem các sự cố thời tiết trên bản đồ tương tác</li>
                <li>✅ Xác nhận độ tin cậy của báo cáo thông qua hệ thống vote</li>
                <li>⚡ Nhận gợi ý hành động thông minh dựa trên điều kiện thời tiết</li>
                <li>🛡️ Quản lý và xử lý báo cáo hiệu quả (dành cho Admin)</li>
              </ul>
            </div>
          </section>

          {/* Tính năng chính */}
          <section className="about-section">
            <h2 className="section-title">
              <FiZap /> Tính năng chính
            </h2>
            <div className="features-grid">
              <div className="feature-card card fade-in">
                <div className="feature-icon">
                  <FiCloud />
                </div>
                <h3>Thời tiết Real-time</h3>
                <p>
                  Xem thời tiết hiện tại, dự báo 24 giờ và lịch sử tại bất kỳ vị trí nào. 
                  Dữ liệu được cập nhật từ nhiều nguồn API uy tín.
                </p>
              </div>

              <div className="feature-card card fade-in">
                <div className="feature-icon">
                  <FiMapPin />
                </div>
                <h3>Bản đồ Tương tác</h3>
                <p>
                  Xem tất cả báo cáo sự cố trên bản đồ, lọc theo loại, trạng thái, mức độ. 
                  Click để xem chi tiết và chọn vị trí khi tạo báo cáo.
                </p>
              </div>

              <div className="feature-card card fade-in">
                <div className="feature-icon">
                  <FiAlertCircle />
                </div>
                <h3>Báo cáo Sự cố</h3>
                <p>
                  Tạo báo cáo về các sự cố thời tiết với đầy đủ thông tin: loại sự cố, 
                  mức độ nghiêm trọng, vị trí GPS, ảnh minh họa.
                </p>
              </div>

              <div className="feature-card card fade-in">
                <div className="feature-icon">
                  <FiUsers />
                </div>
                <h3>Xác nhận Cộng đồng</h3>
                <p>
                  Người dùng có thể vote xác nhận hoặc phản đối báo cáo trong phạm vi 
                  vài km, giúp đánh giá độ tin cậy của thông tin.
                </p>
              </div>

              <div className="feature-card card fade-in">
                <div className="feature-icon">
                  <FiTrendingUp />
                </div>
                <h3>Gợi ý Thông minh</h3>
                <p>
                  Hệ thống tự động phân tích thời tiết và gợi ý hành động phù hợp, 
                  ví dụ: "Mưa lớn → Gợi ý báo cáo ngập úng".
                </p>
              </div>

              <div className="feature-card card fade-in">
                <div className="feature-icon">
                  <FiShield />
                </div>
                <h3>Quản trị Chuyên nghiệp</h3>
                <p>
                  Admin có công cụ quản lý đầy đủ: duyệt báo cáo, quản lý người dùng, 
                  loại sự cố, và thống kê với dashboard trực quan.
                </p>
              </div>
            </div>
          </section>

          {/* Công nghệ */}
          <section className="about-section">
            <h2 className="section-title">
              <FiCode /> Công nghệ
            </h2>
            <div className="tech-grid">
              <div className="tech-card card fade-in">
                <FiCode className="tech-icon" />
                <h3>Frontend</h3>
                <ul>
                  <li>React 19</li>
                  <li>React Router</li>
                  <li>Leaflet Maps</li>
                  <li>Recharts</li>
                </ul>
              </div>

              <div className="tech-card card fade-in">
                <FiDatabase className="tech-icon" />
                <h3>Backend</h3>
                <ul>
                  <li>Spring Boot 4.0</li>
                  <li>Spring Security</li>
                  <li>JPA / Hibernate</li>
                  <li>MySQL 8.0</li>
                </ul>
              </div>

              <div className="tech-card card fade-in">
                <FiGlobe className="tech-icon" />
                <h3>API & Services</h3>
                <ul>
                  <li>Open-Meteo API</li>
                  <li>OpenWeatherMap</li>
                  <li>BigDataCloud Geocoding</li>
                  <li>JWT Authentication</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cách sử dụng */}
          <section className="about-section">
            <h2 className="section-title">
              <FiSmartphone /> Cách sử dụng
            </h2>
            <div className="steps-grid">
              <div className="step-card card fade-in">
                <div className="step-number">1</div>
                <h3>Đăng ký / Đăng nhập</h3>
                <p>
                  Tạo tài khoản miễn phí để bắt đầu sử dụng. Bạn có thể đăng nhập 
                  và quản lý báo cáo của mình.
                </p>
              </div>

              <div className="step-card card fade-in">
                <div className="step-number">2</div>
                <h3>Xem Thời tiết</h3>
                <p>
                  Trang chủ hiển thị thời tiết tại vị trí của bạn. Bạn có thể xem 
                  thời tiết hiện tại, dự báo 24h và lịch sử.
                </p>
              </div>

              <div className="step-card card fade-in">
                <div className="step-number">3</div>
                <h3>Tạo Báo cáo</h3>
                <p>
                  Khi gặp sự cố thời tiết, tạo báo cáo với đầy đủ thông tin: loại sự cố, 
                  mức độ, vị trí (từ bản đồ hoặc GPS), và ảnh minh họa.
                </p>
              </div>

              <div className="step-card card fade-in">
                <div className="step-number">4</div>
                <h3>Xem Bản đồ</h3>
                <p>
                  Khám phá bản đồ để xem tất cả báo cáo, lọc theo loại sự cố, 
                  và click để xem chi tiết.
                </p>
              </div>

              <div className="step-card card fade-in">
                <div className="step-number">5</div>
                <h3>Xác nhận Báo cáo</h3>
                <p>
                  Nếu bạn ở gần một sự cố (trong vòng vài km), bạn có thể vote 
                  xác nhận hoặc phản đối để giúp đánh giá độ tin cậy.
                </p>
              </div>

              <div className="step-card card fade-in">
                <div className="step-number">6</div>
                <h3>Quản lý (Admin)</h3>
                <p>
                  Admin có thể duyệt/từ chối báo cáo, quản lý người dùng và loại sự cố, 
                  xem thống kê chi tiết trên dashboard.
                </p>
              </div>
            </div>
          </section>

          {/* Lợi ích */}
          <section className="about-section">
            <h2 className="section-title">
              <FiCheckCircle /> Lợi ích
            </h2>
            <div className="benefits-list">
              <div className="benefit-item">
                <FiCheckCircle className="benefit-icon" />
                <div>
                  <h3>Thông tin Kịp thời</h3>
                  <p>Nhận cảnh báo và thông tin về sự cố thời tiết ngay khi chúng xảy ra</p>
                </div>
              </div>
              <div className="benefit-item">
                <FiCheckCircle className="benefit-icon" />
                <div>
                  <h3>Độ tin cậy Cao</h3>
                  <p>Hệ thống vote cộng đồng giúp xác minh và đánh giá độ tin cậy của báo cáo</p>
                </div>
              </div>
              <div className="benefit-item">
                <FiCheckCircle className="benefit-icon" />
                <div>
                  <h3>Dễ sử dụng</h3>
                  <p>Giao diện trực quan, dễ dàng tạo báo cáo và xem thông tin trên bản đồ</p>
                </div>
              </div>
              <div className="benefit-item">
                <FiCheckCircle className="benefit-icon" />
                <div>
                  <h3>Hỗ trợ Quyết định</h3>
                  <p>Gợi ý thông minh giúp người dùng và admin đưa ra quyết định phù hợp</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="about-cta">
            <div className="cta-content card fade-in">
              <h2>Sẵn sàng bắt đầu?</h2>
              <p>Tham gia cộng đồng ClimateShare ngay hôm nay</p>
              <div className="cta-buttons">
                <Link to="/" className="btn btn-primary">
                  <FiCloud /> Xem Thời tiết
                </Link>
                <Link to="/map" className="btn btn-secondary">
                  <FiMapPin /> Xem Bản đồ
                </Link>
                {!localStorage.getItem('token') && (
                  <Link to="/login" className="btn btn-secondary">
                    <FiUsers /> Đăng nhập
                  </Link>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;



