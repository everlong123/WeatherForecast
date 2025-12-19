import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { weatherAPI, reportAPI } from '../utils/api';
import { FiMapPin, FiAlertCircle, FiTrendingUp, FiCloud, FiSun, FiDroplet, FiClock, FiCompass, FiEye, FiActivity } from 'react-icons/fi';
import './Home.css';

const Home = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

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

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async (lat, lng) => {
    try {
      const response = await weatherAPI.getCurrent(lat, lng);
      console.log('Weather data received:', response.data);
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

  const getWindDirection = (degrees) => {
    const directions = ['Bắc', 'Đông Bắc', 'Đông', 'Đông Nam', 'Nam', 'Tây Nam', 'Tây', 'Tây Bắc'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
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
              <div className="weather-card-header">
                <div className="weather-location-section">
                  <div className="location-full">
                    <FiMapPin className="location-icon" />
                    <div>
                      <h2 className="weather-location">
                        {(() => {
                          const parts = [];
                          if (currentWeather.city) parts.push(currentWeather.city);
                          if (currentWeather.district && currentWeather.district !== currentWeather.city) {
                            parts.push(currentWeather.district);
                          }
                          if (currentWeather.ward && currentWeather.ward !== currentWeather.district && currentWeather.ward !== currentWeather.city) {
                            parts.push(currentWeather.ward);
                          }
                          return parts.length > 0 ? parts.join(', ') : 'Vị trí hiện tại';
                        })()}
                      </h2>
                      {currentWeather.latitude && currentWeather.longitude && (
                        <p className="weather-coords">
                          {currentWeather.latitude.toFixed(4)}, {currentWeather.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="real-time-clock">
                  <FiClock className="clock-icon" />
                  <div className="clock-time">
                    <span className="clock-hours">{currentTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    <span className="clock-date">{currentTime.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              <div className="weather-main-content">
                <div className="weather-left-group">
                  <div className="weather-icon-large">
                    {getWeatherIcon(currentWeather.mainWeather)}
                  </div>
                  <div className="weather-info-main">
                    <div className="temperature">
                      <span className="temp-value">{Math.round(currentWeather.temperature)}°C</span>
                      <span className="temp-feels">
                        Cảm giác như {Math.round(currentWeather.feelsLike || currentWeather.temperature)}°C
                      </span>
                    </div>
                    <p className="weather-desc">{currentWeather.description || currentWeather.mainWeather || 'N/A'}</p>
                    {currentWeather.recordedAt && (
                      <p className="weather-updated">
                        Cập nhật: {new Date(currentWeather.recordedAt).toLocaleString('vi-VN')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="weather-details-section">
                  <div className="weather-details grid grid-3">
                  <div className="detail-item">
                    <FiDroplet className="detail-icon" /> 
                    <div>
                      <span className="detail-label">Độ ẩm</span>
                      <span className="detail-value">{currentWeather.humidity || 0}%</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiTrendingUp className="detail-icon" /> 
                    <div>
                      <span className="detail-label">Gió</span>
                      <span className="detail-value">
                        {currentWeather.windSpeed?.toFixed(1) || '0.0'} m/s
                        {currentWeather.windDirection && ` ${getWindDirection(currentWeather.windDirection)}`}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiActivity className="detail-icon" /> 
                    <div>
                      <span className="detail-label">Áp suất</span>
                      <span className="detail-value">{currentWeather.pressure ? `${Math.round(currentWeather.pressure)} hPa` : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiEye className="detail-icon" /> 
                    <div>
                      <span className="detail-label">Tầm nhìn</span>
                      <span className="detail-value">
                        {currentWeather.visibility ? `${(currentWeather.visibility / 1000).toFixed(1)} km` : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <FiCloud className="detail-icon" /> 
                    <div>
                      <span className="detail-label">Mây</span>
                      <span className="detail-value">{currentWeather.cloudiness || 0}%</span>
                    </div>
                  </div>
                  {(currentWeather.rainVolume > 0 || currentWeather.snowVolume > 0) && (
                    <>
                      {currentWeather.rainVolume > 0 && (
                        <div className="detail-item">
                          <FiDroplet className="detail-icon" style={{ color: '#4A90E2' }} /> 
                          <div>
                            <span className="detail-label">Lượng mưa</span>
                            <span className="detail-value">{currentWeather.rainVolume.toFixed(1)} mm</span>
                          </div>
                        </div>
                      )}
                      {currentWeather.snowVolume > 0 && (
                        <div className="detail-item">
                          <FiCloud className="detail-icon" style={{ color: '#B0BEC5' }} /> 
                          <div>
                            <span className="detail-label">Lượng tuyết</span>
                            <span className="detail-value">{currentWeather.snowVolume.toFixed(1)} mm</span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  </div>
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

