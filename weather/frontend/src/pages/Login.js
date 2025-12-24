import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, locationAPI } from '../utils/api';
import { setAuthToken, setUser } from '../utils/auth';
import { FiCloud, FiSun, FiDroplet, FiMapPin } from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Login.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Component để lắng nghe click trên map
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    latitude: null,
    longitude: null,
    district: '',
    ward: '',
    city: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([16.0583, 108.2772]); // Trung tâm Việt Nam
  const [mapZoom, setMapZoom] = useState(6);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [displayAddress, setDisplayAddress] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Reverse geocoding: lat/long → address
  const reverseGeocode = async (lat, lng) => {
    setLoadingAddress(true);
    try {
      const response = await locationAPI.getLocationFromCoordinates(lat, lng);
      if (response.data && Object.keys(response.data).length > 0) {
        const location = response.data;
        const address = location.display_name || 
          [location.ward, location.district, location.city]
            .filter(Boolean)
            .join(', ');
        setDisplayAddress(address || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
        
        // Lưu district, ward, city vào formData để gửi lên backend
        setFormData(prev => ({
          ...prev,
          district: location.district || '',
          ward: location.ward || '',
          city: location.city || '',
        }));
      } else {
        setDisplayAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setDisplayAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
    } finally {
      setLoadingAddress(false);
    }
  };

  // Xử lý click trên map
  const handleMapClick = async (latlng) => {
    const lat = latlng.lat;
    const lng = latlng.lng;
    
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    
    setMapCenter([lat, lng]);
    setMapZoom(15);
    
    // Reverse geocode
    await reverseGeocode(lat, lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await authAPI.login({
          username: formData.username,
          password: formData.password,
        });
      } else {
        // Chỉ gửi các trường backend chấp nhận
        const registerData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone || null,
          address: displayAddress || null, // Lưu địa chỉ đầy đủ từ map
          district: formData.district || null, // Quận/Huyện từ reverse geocode
          ward: formData.ward || null, // Phường/Xã từ reverse geocode
          latitude: formData.latitude || null, // Tọa độ từ map khi đăng ký
          longitude: formData.longitude || null, // Tọa độ từ map khi đăng ký
        };
        response = await authAPI.register(registerData);
      }

      setAuthToken(response.data.token);
      setUser(response.data);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Đã xảy ra lỗi. Vui lòng thử lại sau.';
      setError(errorMessage);
      
      // Log chi tiết để debug
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      } else if (err.request) {
        console.error('No response received. Is backend running?');
        setError('Không thể kết nối đến server. Vui lòng kiểm tra backend đã chạy chưa.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="weather-icon-cloud">
          <FiCloud />
        </div>
        <div className="weather-icon-sun">
          <FiSun />
        </div>
        <div className="weather-icon-rain">
          <FiDroplet />
        </div>
      </div>
      
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🌍</span>
            <h1 className="logo-text">ClimateShare</h1>
          </div>
          <p>{isLogin ? 'Đăng nhập vào hệ thống' : 'Tạo tài khoản mới'}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={formData.fullName}
                onChange={handleChange}
                className="input"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input"
              />
            </>
          )}
          
          <input
            type="text"
            name="username"
            placeholder="Tên đăng nhập"
            value={formData.username}
            onChange={handleChange}
            required
            className="input"
          />
          
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            className="input"
          />

          {!isLogin && (
            <>
              <input
                type="text"
                name="phone"
                placeholder="Số điện thoại (tùy chọn)"
                value={formData.phone}
                onChange={handleChange}
                className="input"
              />
              
              {/* Map picker tùy chọn */}
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: showMap ? '#e3f2fd' : '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    color: showMap ? '#1976d2' : '#666',
                  }}
                >
                  <FiMapPin />
                  {showMap ? 'Ẩn bản đồ' : 'Chọn vị trí trên bản đồ (tùy chọn)'}
                </button>
                
                {showMap && (
                  <div style={{ 
                    marginTop: '10px', 
                    border: '2px solid #ddd', 
                    borderRadius: '12px', 
                    overflow: 'hidden',
                    height: '250px',
                    backgroundColor: '#e8f4f8'
                  }}>
                    <MapContainer
                      center={mapCenter}
                      zoom={mapZoom}
                      style={{ height: '100%', width: '100%' }}
                      scrollWheelZoom={true}
                      key={`${mapCenter[0]}-${mapCenter[1]}-${mapZoom}`}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      />
                      <MapClickHandler onMapClick={handleMapClick} />
                      {formData.latitude && formData.longitude && (
                        <Marker position={[formData.latitude, formData.longitude]} />
                      )}
                    </MapContainer>
                  </div>
                )}
                
                {formData.latitude && formData.longitude && (
                  <div style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: '6px', 
                    fontSize: '12px',
                    color: '#0369a1'
                  }}>
                    {loadingAddress ? (
                      <span>Đang tìm địa chỉ...</span>
                    ) : (
                      <>
                        <div><strong>📍 {displayAddress || 'Đã chọn vị trí'}</strong></div>
                        <div style={{ marginTop: '4px', color: '#64748b' }}>
                          Tọa độ: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : isLogin ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setShowMap(false);
              setFormData({
                username: '',
                email: '',
                password: '',
                fullName: '',
                phone: '',
                latitude: null,
                longitude: null,
              });
              setDisplayAddress('');
            }}
            className="toggle-link"
          >
            {isLogin
              ? 'Chưa có tài khoản? Đăng ký ngay'
              : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

