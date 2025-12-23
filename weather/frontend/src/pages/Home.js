import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { weatherAPI, reportAPI, locationAPI } from '../utils/api';
import { FiMapPin, FiAlertCircle, FiTrendingUp, FiCloud, FiSun, FiDroplet, FiClock, FiCompass, FiEye, FiActivity, FiCalendar, FiArrowRight } from 'react-icons/fi';
import { isAdmin } from '../utils/auth';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const admin = isAdmin();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [history, setHistory] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [forecastError, setForecastError] = useState(null);
  const [historyError, setHistoryError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('current'); // 'current', 'forecast', 'history'
  const [reverseGeocodeAddress, setReverseGeocodeAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    // Check for saved location from localStorage first
    const savedLocation = localStorage.getItem('selectedWeatherLocation');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        setUserLocation(location);
        fetchWeather(location.lat, location.lng);
        fetchRecentReports();
        return;
      } catch (e) {
        console.error('Error parsing saved location:', e);
      }
    }

    // Get user location from GPS
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

  // Reverse geocode khi có lat/long nhưng không có địa chỉ
  useEffect(() => {
    if (currentWeather && 
        currentWeather.latitude && 
        currentWeather.longitude && 
        !currentWeather.city && 
        !currentWeather.district && 
        !currentWeather.ward) {
      const lat = currentWeather.latitude;
      const lng = currentWeather.longitude;
      
      setLoadingAddress(true);
      setReverseGeocodeAddress(null);
      
      locationAPI.getLocationFromCoordinates(lat, lng)
        .then(response => {
          if (response.data && Object.keys(response.data).length > 0) {
            const location = response.data;
            
            // Tạo địa chỉ đầy đủ từ các thành phần
            const addressParts = [];
            if (location.ward) addressParts.push(location.ward);
            if (location.district) addressParts.push(location.district);
            if (location.city) addressParts.push(location.city);
            
            // Ưu tiên display_name, sau đó là ward/district/city
            const fullAddress = location.display_name || 
              (addressParts.length > 0 ? addressParts.join(', ') : null);
            
            if (fullAddress) {
              setReverseGeocodeAddress(fullAddress);
            }
          }
        })
        .catch(error => {
          console.error('Error reverse geocoding:', error);
        })
        .finally(() => {
          setLoadingAddress(false);
        });
    } else {
      // Reset địa chỉ nếu đã có city/district/ward
      setReverseGeocodeAddress(null);
    }
  }, [currentWeather]);

  const fetchWeather = async (lat, lng) => {
    try {
      // Fetch current weather
      const currentResponse = await weatherAPI.getCurrent(lat, lng);
      console.log('Weather data received:', currentResponse.data);
      setCurrentWeather(currentResponse.data);
      
      // Fetch forecast (24 hours ahead)
      setForecastLoading(true);
      setForecastError(null);
      try {
        console.log('Fetching forecast for lat:', lat, 'lng:', lng);
        const forecastResponse = await weatherAPI.getForecast(lat, lng, 24);
        console.log('Forecast response:', forecastResponse);
        if (forecastResponse.data && Array.isArray(forecastResponse.data) && forecastResponse.data.length > 0) {
          console.log('Forecast data received:', forecastResponse.data.length, 'items');
          setForecast(forecastResponse.data);
        } else {
          console.warn('Forecast data is empty or invalid:', forecastResponse.data);
          setForecastError('Không có dữ liệu dự báo');
        }
      } catch (error) {
        console.error('Error fetching forecast:', error);
        setForecastError(error.response?.data?.message || 'Không thể tải dữ liệu dự báo');
      } finally {
        setForecastLoading(false);
      }
      
      // Fetch history
      setHistoryLoading(true);
      setHistoryError(null);
      try {
        console.log('Fetching history for lat:', lat, 'lng:', lng);
        const historyResponse = await weatherAPI.getHistory(lat, lng);
        console.log('History response:', historyResponse);
        if (historyResponse.data && Array.isArray(historyResponse.data) && historyResponse.data.length > 0) {
          console.log('History data received:', historyResponse.data.length, 'items');
          setHistory(historyResponse.data);
        } else {
          console.warn('History data is empty or invalid:', historyResponse.data);
          setHistoryError('Chưa có dữ liệu lịch sử');
        }
      } catch (error) {
        console.error('Error fetching history:', error);
        setHistoryError(error.response?.data?.message || 'Không thể tải dữ liệu lịch sử');
      } finally {
        setHistoryLoading(false);
      }
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

  // Reverse geocoding: Lấy địa chỉ từ lat/long
  const reverseGeocode = async (lat, lng) => {
    if (!lat || !lng) return;
    
    setLoadingAddress(true);
    setReverseGeocodeAddress(null);
    
    try {
      const response = await locationAPI.getLocationFromCoordinates(lat, lng);
      if (response.data && Object.keys(response.data).length > 0) {
        const location = response.data;
        
        // Tạo địa chỉ đầy đủ từ các thành phần
        const addressParts = [];
        if (location.ward) addressParts.push(location.ward);
        if (location.district) addressParts.push(location.district);
        if (location.city) addressParts.push(location.city);
        
        // Ưu tiên display_name, sau đó là ward/district/city
        const fullAddress = location.display_name || 
          (addressParts.length > 0 ? addressParts.join(', ') : null);
        
        if (fullAddress) {
          setReverseGeocodeAddress(fullAddress);
        }
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    } finally {
      setLoadingAddress(false);
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
          {/* Forecast and History Tabs */}
          {currentWeather && (
            <div className="weather-tabs-section card fade-in">
              <div className="tabs-header">
                <button 
                  className={`weather-tab-button ${activeTab === 'current' ? 'active' : ''}`}
                  onClick={() => setActiveTab('current')}
                >
                  <FiClock /> Hiện tại
                </button>
                <button 
                  className={`weather-tab-button ${activeTab === 'forecast' ? 'active' : ''}`}
                  onClick={() => setActiveTab('forecast')}
                >
                  <FiArrowRight /> Dự báo (24h)
                </button>
                <button 
                  className={`weather-tab-button ${activeTab === 'history' ? 'active' : ''}`}
                  onClick={() => setActiveTab('history')}
                >
                  <FiCalendar /> Lịch sử
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'forecast' && (
                  <div className="forecast-content">
                    <h3 className="tab-title">Dự báo thời tiết 24 giờ tới</h3>
                    {forecastLoading ? (
                      <div className="empty-state">
                        <p>Đang tải dữ liệu dự báo...</p>
                      </div>
                    ) : forecastError ? (
                      <div className="empty-state">
                        <p style={{ color: '#f44336' }}>{forecastError}</p>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => userLocation && fetchWeather(userLocation.lat, userLocation.lng)}
                          style={{ marginTop: '15px' }}
                        >
                          Thử lại
                        </button>
                      </div>
                    ) : forecast.length > 0 ? (
                      <div className="forecast-list">
                        {forecast.slice(0, 24).map((item, index) => {
                          const date = item.datetime ? new Date(item.datetime) : null;
                          const timeStr = date
                            ? date.toLocaleTimeString('vi-VN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : `+${index + 1}h`;
                          const dayStr = date
                            ? date.toLocaleDateString('vi-VN', {
                                weekday: 'short',
                                day: '2-digit',
                                month: '2-digit',
                              })
                            : '';

                          return (
                            <div key={index} className="forecast-item">
                              <div className="forecast-time-badge">
                                <span className="forecast-time-main">{timeStr}</span>
                                {dayStr && <span className="forecast-time-sub">{dayStr}</span>}
                              </div>
                              <div className="forecast-main">
                                <div className="forecast-icon">
                                  {getWeatherIcon(item.mainWeather)}
                                </div>
                                <div className="forecast-temp">
                                  {item.temperature ? Math.round(item.temperature) : 'N/A'}°C
                                </div>
                              </div>
                              {item.description && (
                                <div className="forecast-description">
                                  {item.description}
                                </div>
                              )}
                              <div className="forecast-extra">
                                <span className="forecast-humidity">
                                  Độ ẩm: {item.humidity ? `${Math.round(item.humidity)}%` : 'N/A'}
                                </span>
                                {item.rainVolume > 0 && (
                                  <span className="rain-indicator">
                                    <FiDroplet /> {item.rainVolume.toFixed(1)}mm
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>Không có dữ liệu dự báo. Vui lòng thử lại sau.</p>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => userLocation && fetchWeather(userLocation.lat, userLocation.lng)}
                          style={{ marginTop: '15px' }}
                        >
                          Thử lại
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="history-content">
                    <h3 className="tab-title">Lịch sử thời tiết</h3>
                    {historyLoading ? (
                      <div className="empty-state">
                        <p>Đang tải dữ liệu lịch sử...</p>
                      </div>
                    ) : historyError ? (
                      <div className="empty-state">
                        <p style={{ color: '#f44336' }}>{historyError}</p>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => userLocation && fetchWeather(userLocation.lat, userLocation.lng)}
                          style={{ marginTop: '15px' }}
                        >
                          Thử lại
                        </button>
                      </div>
                    ) : history.length > 0 ? (
                      <div className="history-list">
                        {(() => {
                          // Nhóm lịch sử theo ngày
                          const groupedByDate = {};
                          history.forEach((item) => {
                            if (item.recordedAt) {
                              const date = new Date(item.recordedAt);
                              const dateKey = date.toLocaleDateString('vi-VN', { 
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                              });
                              if (!groupedByDate[dateKey]) {
                                groupedByDate[dateKey] = [];
                              }
                              groupedByDate[dateKey].push(item);
                            }
                          });

                          return Object.entries(groupedByDate).map(([dateKey, items]) => (
                            <div key={dateKey} className="history-day-group">
                              <div className="history-day-header">
                                <FiCalendar className="day-icon" />
                                <h4 className="day-title">{dateKey}</h4>
                                <span className="day-count">{items.length} bản ghi</span>
                              </div>
                              <div className="history-day-items">
                                {items.map((item, index) => {
                                  const date = new Date(item.recordedAt);
                                  const timeStr = date.toLocaleTimeString('vi-VN', { 
                                    hour: '2-digit', 
                                    minute: '2-digit'
                                  });
                                  return (
                                    <div key={index} className="history-item">
                                      <div className="history-time-badge">
                                        <FiClock className="time-icon" />
                                        <span>{timeStr}</span>
                                      </div>
                                      <div className="history-main-info">
                                        <div className="history-icon-large">
                                          {getWeatherIcon(item.mainWeather)}
                                        </div>
                                        <div className="history-temp-large">
                                          <span className="temp-value">{item.temperature ? Math.round(item.temperature) : 'N/A'}°C</span>
                                          <span className="temp-desc">{item.description || item.mainWeather || 'N/A'}</span>
                                        </div>
                                      </div>
                                      <div className="history-stats">
                                        <div className="stat-item">
                                          <FiDroplet className="stat-icon" />
                                          <span className="stat-value">{item.humidity || 0}%</span>
                                        </div>
                                        <div className="stat-item">
                                          <FiTrendingUp className="stat-icon" />
                                          <span className="stat-value">{item.windSpeed?.toFixed(1) || '0.0'} m/s</span>
                                        </div>
                                        <div className="stat-item">
                                          <FiActivity className="stat-icon" />
                                          <span className="stat-value">{item.pressure ? Math.round(item.pressure) : 'N/A'} hPa</span>
                                        </div>
                                        {item.rainVolume > 0 && (
                                          <div className="stat-item rain-stat">
                                            <FiDroplet className="stat-icon" style={{ color: '#4A90E2' }} />
                                            <span className="stat-value">{item.rainVolume.toFixed(1)} mm</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <p>Chưa có dữ liệu lịch sử. Dữ liệu sẽ được lưu khi bạn xem thời tiết.</p>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => userLocation && fetchWeather(userLocation.lat, userLocation.lng)}
                          style={{ marginTop: '15px' }}
                        >
                          Tải lại
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'current' && (
                  <div className="current-content">
                    <div className={`weather-card-inline card-${getTemperatureColor(currentWeather.temperature)}`}>
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
                              {/* Hiển thị tọa độ và địa chỉ nếu không có địa điểm đầy đủ */}
                              {currentWeather.latitude && currentWeather.longitude && 
                               !currentWeather.city && !currentWeather.district && !currentWeather.ward && (
                                <>
                                  {loadingAddress ? (
                                    <p className="weather-coords">Đang tải địa chỉ...</p>
                                  ) : reverseGeocodeAddress ? (
                                    <p className="weather-coords">
                                      {reverseGeocodeAddress}
                                      <br />
                                      <span style={{ fontSize: '12px', color: '#888', fontStyle: 'italic' }}>
                                        ({currentWeather.latitude.toFixed(4)}, {currentWeather.longitude.toFixed(4)})
                                      </span>
                                    </p>
                                  ) : (
                                    <p className="weather-coords">
                                      {currentWeather.latitude.toFixed(4)}, {currentWeather.longitude.toFixed(4)}
                                    </p>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <Link to="/map?selectLocation=true" className="btn-change-location">
                            <FiMapPin /> Chọn vị trí khác
                          </Link>
                        </div>
                        {/* Weather Action Suggestion Banner */}
                        {currentWeather.suggestedAction && (
                          <div className="weather-suggestion-banner" style={{
                            marginTop: '20px',
                            padding: '16px',
                            borderRadius: '12px',
                            background: currentWeather.suggestionPriority === 'HIGH' 
                              ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                              : currentWeather.suggestionPriority === 'MEDIUM'
                              ? 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)'
                              : 'linear-gradient(135deg, #66bb6a 0%, #4caf50 100%)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <FiAlertCircle size={24} />
                              <strong style={{ fontSize: '16px' }}>Gợi ý từ hệ thống</strong>
                            </div>
                            <p style={{ margin: '0 0 12px 0', fontSize: '14px', lineHeight: '1.5' }}>
                              {currentWeather.suggestedAction}
                            </p>
                            {currentWeather.suggestedIncidentType && (
                              <Link 
                                to="/reports" 
                                className="btn btn-primary"
                                style={{
                                  background: 'rgba(255,255,255,0.2)',
                                  border: '1px solid rgba(255,255,255,0.3)',
                                  color: 'white',
                                  padding: '8px 16px',
                                  fontSize: '14px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  // Lưu suggested incident type vào localStorage để form tự điền
                                  localStorage.setItem('suggestedIncidentType', currentWeather.suggestedIncidentType);
                                  window.location.href = '/reports';
                                }}
                              >
                                <FiAlertCircle />
                                Báo cáo ngay
                              </Link>
                            )}
                          </div>
                        )}
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
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="reports-section">
            <h2 className="section-title">
              <FiAlertCircle /> Báo cáo gần đây
            </h2>
            <div className="reports-grid grid grid-3">
              {recentReports.map((report) => (
                <div 
                  key={report.id} 
                  className="report-card card fade-in"
                  onClick={() => {
                    if (admin) {
                      // Admin: navigate đến trang Admin với tab reports
                      navigate('/admin?tab=reports');
                    } else {
                      // User: chỉ xem trên bản đồ
                      navigate(`/map?reportId=${report.id}`);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
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
                  {admin && (
                    <div style={{ 
                      marginTop: '10px', 
                      paddingTop: '10px', 
                      borderTop: '1px solid #eee',
                      fontSize: '12px',
                      color: '#4a90e2',
                      fontWeight: '600'
                    }}>
                      👆 Click để quản lý
                    </div>
                  )}
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

