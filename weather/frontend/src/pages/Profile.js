import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, locationAPI } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import { 
  FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiCalendar, 
  FiEdit, FiSave, FiX, FiTrendingUp, FiAward, FiBarChart2
} from 'react-icons/fi';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Profile.css';

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

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalReports: 0,
    approvedReports: 0,
    pendingReports: 0,
    rejectedReports: 0,
    resolvedReports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    latitude: null,
    longitude: null,
  });
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState([16.0583, 108.2772]); // Trung tâm Việt Nam
  const [mapZoom, setMapZoom] = useState(6);
  const [loadingAddress, setLoadingAddress] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    fetchUserProfile();
    fetchUserStats();
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getCurrentUser();
      setUser(response.data);
      setFormData({
        fullName: response.data.fullName || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        latitude: response.data.latitude || null,
        longitude: response.data.longitude || null,
      });
      
      // Set map center nếu có lat/lng
      if (response.data.latitude && response.data.longitude) {
        setMapCenter([response.data.latitude, response.data.longitude]);
        setMapZoom(15);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      alert('Lỗi khi tải thông tin người dùng: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await authAPI.getUserStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      // Không hiển thị alert vì đây không phải lỗi nghiêm trọng
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    setShowMap(false);
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        address: user.address || '',
        latitude: user.latitude || null,
        longitude: user.longitude || null,
      });
      if (user.latitude && user.longitude) {
        setMapCenter([user.latitude, user.longitude]);
        setMapZoom(15);
      } else {
        setMapCenter([16.0583, 108.2772]);
        setMapZoom(6);
      }
    }
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
        
        // Cập nhật formData với thông tin từ reverse geocode
        setFormData(prev => ({
          ...prev,
          address: address || `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
        }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setFormData(prev => ({
        ...prev,
        address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
      }));
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

  const handleSave = async () => {
    try {
      const updateData = {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };
      
      const response = await authAPI.updateProfile(updateData);
      setUser(response.data);
      setEditing(false);
      setShowMap(false);
      alert('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Lỗi khi cập nhật thông tin: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };

  const getTrustLevel = (score) => {
    // Đã giảm ngưỡng để thăng hạng dễ hơn
    if (score >= 100) return { label: 'Chuyên gia', color: '#9333ea', icon: '●' };
    if (score >= 50) return { label: 'Cao cấp', color: '#10b981', icon: '●' };
    if (score >= 30) return { label: 'Trung cấp', color: '#3b82f6', icon: '✓' };
    return { label: 'Sơ cấp', color: '#f59e0b', icon: '○' };
  };

  const getTrustScoreColor = (score) => {
    // Đã giảm ngưỡng để thăng hạng dễ hơn
    if (score >= 100) return 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)'; // Purple - Expert
    if (score >= 50) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)'; // Green - Advanced
    if (score >= 30) return 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'; // Blue - Intermediate
    return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'; // Orange - Beginner
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-spinner">Đang tải...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-message">Không thể tải thông tin người dùng</div>
        </div>
      </div>
    );
  }

  const trustLevel = getTrustLevel(user.trustScore || 0);
  const isAdminUser = user.role === 'ADMIN';

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-avatar">
            <FiUser className="avatar-icon" />
          </div>
          <div className="profile-title">
            <h1>{user.username}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
          {!editing && (
            <button className="btn-edit-profile" onClick={handleEdit}>
              <FiEdit /> Chỉnh sửa
            </button>
          )}
        </div>

        {/* Trust Score Card - chỉ hiển thị cho USER, không hiển thị cho ADMIN */}
        {!isAdminUser && (
          <div className="trust-score-card card">
            <div className="trust-score-header">
              <FiShield className="trust-icon" />
              <h2>Độ Tin Cậy</h2>
            </div>
            <div className="trust-score-content">
              <div 
                className="trust-score-badge-large"
                style={{
                  background: getTrustScoreColor(user.trustScore || 0),
                }}
              >
                <div className="trust-score-value">{user.trustScore || 0}</div>
              </div>
              <div className="trust-level-info">
                <span className="trust-level-label" style={{ color: trustLevel.color }}>
                  {trustLevel.label}
                </span>
              </div>
              <div className="trust-score-description">
                <p>
                  Độ tin cậy của bạn được tính dựa trên chất lượng các báo cáo bạn đã gửi.
                  Báo cáo được duyệt sẽ tăng điểm, báo cáo bị từ chối sẽ giảm điểm.
                </p>
                <div className="trust-score-tips">
                  <h4>💡 Mẹo để tăng độ tin cậy:</h4>
                  <ul>
                    <li>Gửi báo cáo chính xác và chi tiết</li>
                    <li>Đính kèm hình ảnh rõ ràng</li>
                    <li>Chọn đúng loại sự cố và mức độ nghiêm trọng</li>
                    <li>Báo cáo kịp thời khi phát hiện sự cố</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Information Card */}
        <div className="profile-info-card card">
          <div className="card-header">
            <h2>Thông Tin Cá Nhân</h2>
            {editing && (
              <div className="edit-actions">
                <button className="btn-save" onClick={handleSave}>
                  <FiSave /> Lưu
                </button>
                <button className="btn-cancel" onClick={handleCancel}>
                  <FiX /> Hủy
                </button>
              </div>
            )}
          </div>
          <div className="profile-info-content">
            <div className="info-row">
              <div className="info-label">
                <FiUser /> Tên đăng nhập
              </div>
              <div className="info-value">{user.username}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FiMail /> Email
              </div>
              <div className="info-value">{user.email}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FiUser /> Họ và tên
              </div>
              {editing ? (
                <input
                  type="text"
                  className="info-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nhập họ và tên"
                />
              ) : (
                <div className="info-value">{user.fullName || 'Chưa cập nhật'}</div>
              )}
            </div>
            <div className="info-row">
              <div className="info-label">
                <FiPhone /> Số điện thoại
              </div>
              {editing ? (
                <input
                  type="tel"
                  className="info-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              ) : (
                <div className="info-value">{user.phone || 'Chưa cập nhật'}</div>
              )}
            </div>
            <div className="info-row">
              <div className="info-label">
                <FiMapPin /> Địa chỉ
              </div>
              {editing ? (
                <div style={{ width: '100%' }}>
                  <input
                    type="text"
                    className="info-input"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Nhập địa chỉ hoặc chọn trên bản đồ"
                    readOnly
                    style={{ marginBottom: '8px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowMap(!showMap)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: showMap ? '#f44336' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    {showMap ? 'Ẩn bản đồ' : 'Chọn trên bản đồ'}
                  </button>
                  {showMap && (
                    <div style={{ marginTop: '12px', height: '300px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd' }}>
                      <MapContainer
                        center={mapCenter}
                        zoom={mapZoom}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <MapClickHandler onMapClick={handleMapClick} />
                        {formData.latitude && formData.longitude && (
                          <Marker position={[formData.latitude, formData.longitude]} />
                        )}
                      </MapContainer>
                    </div>
                  )}
                  {loadingAddress && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                      Đang tải địa chỉ...
                    </div>
                  )}
                  {formData.latitude && formData.longitude && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                      Tọa độ: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </div>
                  )}
                </div>
              ) : (
                <div className="info-value">{user.address || 'Chưa cập nhật'}</div>
              )}
            </div>
            <div className="info-row">
              <div className="info-label">
                <FiCalendar /> Ngày đăng ký
              </div>
              <div className="info-value">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <FiShield /> Vai trò
              </div>
              <div className="info-value">
                <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                  {user.role || 'USER'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card - chỉ hiển thị cho USER, không hiển thị cho ADMIN */}
        {!isAdminUser && (
          <div className="profile-stats-card card">
            <h2>Thống Kê</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <FiBarChart2 className="stat-icon" />
                <div className="stat-value">{stats.totalReports || 0}</div>
                <div className="stat-label">Tổng báo cáo</div>
              </div>
              <div className="stat-item">
                <FiTrendingUp className="stat-icon" />
                <div className="stat-value">{stats.approvedReports || 0}</div>
                <div className="stat-label">Báo cáo đã duyệt</div>
              </div>
              <div className="stat-item">
                <FiAward className="stat-icon" />
                <div className="stat-value">{user.trustScore || 0}</div>
                <div className="stat-label">Điểm tin cậy</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

