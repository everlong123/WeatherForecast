import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiGithub, FiMail, FiMapPin, FiBook, 
  FiUsers, FiCode, FiHeart, FiCloud
} from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-section">
            <div className="footer-logo">
              <FiCloud className="footer-logo-icon" />
              <span className="footer-logo-text">Weather Alert</span>
            </div>
            <p className="footer-description">
              Hệ thống cảnh báo thời tiết thông minh, kết nối cộng đồng để chia sẻ 
              và cảnh báo về các sự cố thời tiết một cách nhanh chóng và chính xác. 
              Giúp mọi người chủ động ứng phó và bảo vệ an toàn.
            </p>
            <div className="footer-project-badge">
              <FiBook className="badge-icon" />
              <span>Đồ án môn học Lập trình Web</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Liên kết nhanh</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">Trang chủ</Link>
              </li>
              <li>
                <Link to="/about">Giới thiệu</Link>
              </li>
              <li>
                <Link to="/map">Bản đồ</Link>
              </li>
              <li>
                <Link to="/reports">Báo cáo</Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div className="footer-section">
            <h3 className="footer-title">Tính năng</h3>
            <ul className="footer-links">
              <li>Thời tiết Real-time</li>
              <li>Bản đồ Tương tác</li>
              <li>Báo cáo Sự cố</li>
              <li>Xác nhận Cộng đồng</li>
              <li>Gợi ý Thông minh</li>
            </ul>
          </div>

          {/* Technology */}
          <div className="footer-section">
            <h3 className="footer-title">Công nghệ</h3>
            <ul className="footer-tech">
              <li>
                <FiCode className="tech-icon" />
                <span>React 19</span>
              </li>
              <li>
                <FiCode className="tech-icon" />
                <span>Spring Boot 4.0</span>
              </li>
              <li>
                <FiCode className="tech-icon" />
                <span>MySQL 8.0</span>
              </li>
              <li>
                <FiCode className="tech-icon" />
                <span>Leaflet Maps</span>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

