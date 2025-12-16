import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { weatherAPI, reportAPI } from '../utils/api';
import { FiMapPin, FiAlertCircle, FiTrendingUp, FiCloud, FiSun, FiDroplet } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchWeather(latitude, longitude);
        },
        () => {
          // Default to Ho Chi Minh City
          const defaultLoc = { lat: 10.8231, lng: 106.6297 };
          setUserLocation(defaultLoc);
          fetchWeather(defaultLoc.lat, defaultLoc.lng);
        }
      );
    }

    fetchRecentReports();
  }, []);

  const fetchWeather = async (lat, lng) => {
    try {
      const response = await weatherAPI.getCurrent(lat, lng);
      setCurrentWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentReports = async () => {
    try {
      const response = await reportAPI.getAll();
      setRecentReports(response.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  const getWeatherIcon = (main) => {
    switch (main?.toLowerCase()) {
      case 'rain':
      case 'drizzle':
        return <FiDroplet className="weather-icon" style={{ color: '#4A90E2' }} />;
      case 'clear':
        return <FiSun className="weather-icon" style={{ color: '#FFD93D' }} />;
      default:
        return <FiCloud className="weather-icon" style={{ color: '#7B9ACC' }} />;
    }
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 30) return 'warm';
    if (temp <= 15) return 'cold';
    return 'normal';
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content fade-in">
          <h1 className="hero-title">
            Hệ thống Cảnh báo Thời tiết
            <br />
            <span className="gradient-text">Dựa trên Dữ liệu Cộng đồng</span>
          </h1>
          <p className="hero-subtitle">
            Theo dõi thời tiết realtime và báo cáo sự cố thời tiết tại Việt Nam
          </p>
          <div className="hero-buttons">
            <Link to="/map" className="btn btn-primary">
              Xem Bản đồ
            </Link>
            <Link to="/reports" className="btn btn-secondary">
              Báo cáo Sự cố
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="container">
          {currentWeather && (
            <div className={`weather-card card card-${getTemperatureColor(currentWeather.temperature)} fade-in`}>
              <div className="weather-header">
                <div className="weather-icon-large">
                  {getWeatherIcon(currentWeather.mainWeather)}
                </div>
                <div className="weather-info">
                  <h2>{currentWeather.city || 'Vị trí hiện tại'}</h2>
                  <div className="temperature">
                    <span className="temp-value">{Math.round(currentWeather.temperature)}°C</span>
                    <span className="temp-feels">
                      Cảm giác như {Math.round(currentWeather.feelsLike)}°C
                    </span>
                  </div>
                  <p className="weather-desc">{currentWeather.description}</p>
                </div>
              </div>
              <div className="weather-details grid grid-4">
                <div className="detail-item">
                  <FiDroplet /> Độ ẩm: {currentWeather.humidity}%
                </div>
                <div className="detail-item">
                  <FiTrendingUp /> Gió: {currentWeather.windSpeed?.toFixed(1)} m/s
                </div>
                <div className="detail-item">
                  <FiCloud /> Mây: {currentWeather.cloudiness}%
                </div>
                <div className="detail-item">
                  <FiMapPin /> {currentWeather.district || 'N/A'}
                </div>
              </div>
            </div>
          )}

          <div className="reports-section">
            <h2 className="section-title">
              <FiAlertCircle /> Báo cáo gần đây
            </h2>
            <div className="reports-grid grid grid-3">
              {recentReports.map((report) => (
                <div key={report.id} className="report-card card fade-in">
                  <div className="report-header">
                    <span className={`report-status status-${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                    <span className="report-type">{report.incidentTypeName}</span>
                  </div>
                  <h3 className="report-title">{report.title}</h3>
                  <p className="report-description">{report.description}</p>
                  <div className="report-footer">
                    <span className="report-location">
                      <FiMapPin /> {report.district || 'N/A'}
                    </span>
                    <span className="report-time">
                      {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-footer">
              <Link to="/map" className="btn btn-primary">
                Xem tất cả trên bản đồ
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;










