import React, { useState, useEffect, useMemo } from 'react';
import { reportAPI, incidentTypeAPI, locationAPI, uploadAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiAlertCircle, FiClock, FiCheck, FiThumbsUp, FiX } from 'react-icons/fi';
import { incidentTypes as defaultIncidentTypes } from '../data/incidentTypes';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { isAdmin, getUser } from '../utils/auth';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Reports.css';

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

// Memoized component for incident type select
const IncidentTypeSelect = React.memo(({ value, onChange, incidentTypes, required }) => {
  const options = useMemo(() => {
    if (!incidentTypes || incidentTypes.length === 0) {
      return <option value="" disabled>Đang tải danh sách loại sự cố...</option>;
    }

    const hasCategory = incidentTypes[0]?.category;
    if (hasCategory) {
      const categories = [...new Set(incidentTypes.map(t => t.category).filter(Boolean))];
      return categories.map(category => {
        const typesInCategory = incidentTypes.filter(t => t.category === category);
        return (
          <optgroup key={category} label={category}>
            {typesInCategory.map((type) => (
              <option key={type.id} value={type.id}>
                {type.icon || '⚠️'} {type.name}
              </option>
            ))}
          </optgroup>
        );
      });
    } else {
      return incidentTypes.map((type) => (
        <option key={type.id} value={type.id}>
          {type.icon || '⚠️'} {type.name}
        </option>
      ));
    }
  }, [incidentTypes]);

  return (
    <select value={value} onChange={onChange} required={required} className="input">
      <option value="">-- Chọn loại sự cố --</option>
      {options}
    </select>
  );
});

IncidentTypeSelect.displayName = 'IncidentTypeSelect';

// Helper: Chuẩn hóa URL ảnh (nếu backend trả về đường dẫn tương đối như /uploads/...)
const getImageUrl = (url) => {
  if (!url) return '';
  // Nếu đã là absolute URL (bắt đầu bằng http/https), dùng nguyên
  if (/^https?:\/\//i.test(url)) return url;
  // Ngược lại, prepend host của backend
  const base = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
  // Đảm bảo không bị trùng dấu '/'
  if (url.startsWith('/')) {
    return `${base}${url}`;
  }
  return `${base}/${url}`;
};

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState(defaultIncidentTypes);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [error, setError] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [reportAddresses, setReportAddresses] = useState({}); // Cache địa chỉ theo report ID
  const [viewMode, setViewMode] = useState('all'); // 'all' hoặc 'my'
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incidentTypeId: '',
    severity: 'LOW',
    city: '',
    district: '',
    ward: '',
    displayAddress: '', // Địa chỉ đầy đủ từ reverse geocoding
    latitude: null,
    longitude: null,
    incidentTime: new Date().toISOString().slice(0, 16),
    imageUrl: '',
  });
  
  const [mapCenter, setMapCenter] = useState([16.0583, 108.2772]); // Trung tâm Việt Nam
  const [mapZoom, setMapZoom] = useState(6);
  const admin = isAdmin();

  useEffect(() => {
    // Admin không được vào trang Reports, redirect về Admin
    if (admin) {
      navigate('/admin');
      return;
    }
    fetchData();
    fetchIncidentTypes();
  }, [admin, navigate]);

  // Tự động reverse geocode cho các report thiếu địa điểm
  useEffect(() => {
    if (reports.length > 0) {
      reports.forEach(report => {
        // Nếu có lat/long nhưng không có city/district/ward, và chưa có trong cache
        if (report.latitude && report.longitude && 
            !report.city && !report.district && !report.ward &&
            !reportAddresses[report.id]) {
          fetchAddressForReport(report.id, report.latitude, report.longitude);
        }
      });
    }
  }, [reports]);

  // Fetch địa chỉ cho một report cụ thể
  const fetchAddressForReport = async (reportId, lat, lng) => {
    // Tránh gọi nhiều lần cho cùng một report
    if (reportAddresses[reportId]) return;
    
    try {
      const response = await locationAPI.getLocationFromCoordinates(lat, lng);
      if (response.data && Object.keys(response.data).length > 0) {
        const location = response.data;
        const address = location.display_name || 
          [location.ward, location.district, location.city]
            .filter(Boolean)
            .join(', ') ||
          `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        
        setReportAddresses(prev => ({
          ...prev,
          [reportId]: address
        }));
      } else {
        // Fallback về tọa độ nếu không tìm thấy
        setReportAddresses(prev => ({
          ...prev,
          [reportId]: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
        }));
      }
    } catch (error) {
      console.error('Error fetching address for report:', error);
      // Fallback về tọa độ nếu có lỗi
      setReportAddresses(prev => ({
        ...prev,
        [reportId]: `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      }));
    }
  };

  // Helper function để lấy địa chỉ hiển thị cho một report
  const getReportAddress = (report) => {
    // Ưu tiên: city/district/ward từ database
    const dbAddress = [report.ward, report.district, report.city].filter(Boolean).join(', ');
    if (dbAddress) return dbAddress;
    
    // Nếu không có, dùng địa chỉ từ cache (reverse geocoded)
    if (reportAddresses[report.id]) {
      return reportAddresses[report.id];
    }
    
    // Fallback cuối cùng: tọa độ
    if (report.latitude && report.longitude) {
      return `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}`;
    }
    
    return 'Chưa có địa điểm';
  };

  const fetchData = async () => {
    try {
      let response;
      if (viewMode === 'all') {
        response = await reportAPI.getAll();
      } else {
        response = await reportAPI.getMyReports();
      }
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch khi viewMode thay đổi
  useEffect(() => {
    fetchData();
  }, [viewMode]);

  const fetchIncidentTypes = async () => {
    try {
      const response = await incidentTypeAPI.getAll();
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        setIncidentTypes(response.data);
      } else {
        setIncidentTypes(defaultIncidentTypes);
      }
    } catch (error) {
      console.error('Error fetching incident types:', error);
      setIncidentTypes(defaultIncidentTypes);
    }
  };

  // Reverse geocoding: lat/long → address
  const reverseGeocode = async (lat, lng) => {
    setLoadingAddress(true);
    
    const tryReverseGeocode = async () => {
      try {
        const response = await locationAPI.getLocationFromCoordinates(lat, lng);
        console.log('Reverse geocoding response:', response.data);
        
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
            setFormData(prev => ({
              ...prev,
              city: location.city || '',
              district: location.district || '',
              ward: location.ward || '',
              displayAddress: fullAddress,
            }));
            setLoadingAddress(false);
            return true; // Thành công
          }
        }
        return false; // Không tìm thấy
      } catch (error) {
        console.error('Error reverse geocoding:', error);
        return false; // Có lỗi
      }
    };
    
    // Thử lần đầu
    const success = await tryReverseGeocode();
    
    // Nếu không thành công, thử lại sau 1.5 giây (Nominatim có rate limit)
    if (!success) {
      setTimeout(async () => {
        const retrySuccess = await tryReverseGeocode();
        if (!retrySuccess) {
          // Vẫn không thành công sau retry - hiển thị tọa độ
          setFormData(prev => ({
            ...prev,
            displayAddress: `Tọa độ: ${lat.toFixed(6)}, ${lng.toFixed(6)} (Không tìm thấy địa chỉ)`,
          }));
          setLoadingAddress(false);
        }
      }, 1500);
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

  // Xử lý thay đổi tọa độ thủ công
  const handleLatitudeChange = async (e) => {
    const val = e.target.value;
    if (val === '' || (!isNaN(val) && val >= -90 && val <= 90)) {
      const lat = val ? parseFloat(val) : null;
      setFormData(prev => ({ ...prev, latitude: lat }));
      
      if (lat && formData.longitude) {
        setMapCenter([lat, formData.longitude]);
        setMapZoom(13);
        await reverseGeocode(lat, formData.longitude);
      }
    }
  };

  const handleLongitudeChange = async (e) => {
    const val = e.target.value;
    if (val === '' || (!isNaN(val) && val >= -180 && val <= 180)) {
      const lng = val ? parseFloat(val) : null;
      setFormData(prev => ({ ...prev, longitude: lng }));
      
      if (lng && formData.latitude) {
        setMapCenter([formData.latitude, lng]);
        setMapZoom(13);
        await reverseGeocode(formData.latitude, lng);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.latitude || !formData.longitude) {
      setError('Vui lòng chọn vị trí trên bản đồ');
      return;
    }

    try {
      let imageUrl = formData.imageUrl;

      if (imageFile) {
        const uploadRes = await uploadAPI.uploadImage(imageFile);
        imageUrl = uploadRes.data?.url || imageUrl;
      }

      const reportData = {
        title: formData.title,
        description: formData.description,
        incidentTypeId: parseInt(formData.incidentTypeId),
        severity: formData.severity,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
        latitude: formData.latitude,
        longitude: formData.longitude,
        incidentTime: formData.incidentTime,
        images: imageUrl ? [imageUrl] : undefined,
      };

      if (editingReport) {
        await reportAPI.update(editingReport.id, reportData);
      } else {
        await reportAPI.create(reportData);
      }

      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error submitting report:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo');
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      title: report.title || '',
      description: report.description || '',
      incidentTypeId: report.incidentTypeId?.toString() || '',
      severity: report.severity || 'LOW',
      city: report.city || '',
      district: report.district || '',
      ward: report.ward || '',
      displayAddress: [report.ward, report.district, report.city].filter(Boolean).join(', ') || '',
      latitude: report.latitude,
      longitude: report.longitude,
      incidentTime: report.incidentTime
        ? new Date(report.incidentTime).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
      imageUrl: report.images && report.images.length > 0 ? report.images[0] : '',
    });
    
    if (report.latitude && report.longitude) {
      setMapCenter([report.latitude, report.longitude]);
      setMapZoom(15);
    }
    
    setShowForm(true);
  };

  const handleVote = async (reportId, voteType) => {
    try {
      // Lấy vị trí GPS của user
      let userLat = null;
      let userLng = null;
      
      // Thử lấy từ localStorage (nếu đã lưu trước đó)
      const savedLocation = localStorage.getItem('userLocation');
      if (savedLocation) {
        try {
          const location = JSON.parse(savedLocation);
          userLat = location.lat;
          userLng = location.lng;
        } catch (e) {
          console.error('Error parsing saved location:', e);
        }
      }
      
      // Nếu không có trong localStorage, lấy từ GPS
      if (userLat === null || userLng === null) {
        if (navigator.geolocation) {
          await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;
                // Lưu vào localStorage
                localStorage.setItem('userLocation', JSON.stringify({ lat: userLat, lng: userLng }));
                resolve();
              },
              (error) => {
                console.error('Error getting location:', error);
                reject(new Error('Không thể lấy vị trí GPS. Vui lòng cho phép truy cập vị trí để vote.'));
              },
              { timeout: 10000, enableHighAccuracy: true }
            );
          });
        } else {
          throw new Error('Trình duyệt không hỗ trợ GPS. Vui lòng sử dụng trình duyệt khác.');
        }
      }
      
      // Gửi vote với vị trí
      const response = await reportAPI.vote(reportId, voteType, userLat, userLng);
      
      // Cập nhật vote counts trong state
      setReports(prevReports => 
        prevReports.map(report => 
          report.id === reportId 
            ? { 
                ...report, 
                confirmCount: response.data.confirmCount || 0,
                rejectCount: response.data.rejectCount || 0,
                userVote: response.data.userVote
              }
            : report
        )
      );
    } catch (error) {
      console.error('Error voting:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Không thể vote. Vui lòng thử lại.';
      alert(errorMessage);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa báo cáo này?')) {
      try {
        await reportAPI.delete(id);
        fetchData();
      } catch (error) {
        console.error('Error deleting report:', error);
        setError('Có lỗi xảy ra khi xóa báo cáo');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      incidentTypeId: '',
      severity: 'LOW',
      city: '',
      district: '',
      ward: '',
      displayAddress: '',
      latitude: null,
      longitude: null,
      incidentTime: new Date().toISOString().slice(0, 16),
      imageUrl: '',
    });
    setEditingReport(null);
    setShowForm(false);
    setError('');
    setMapCenter([16.0583, 108.2772]);
    setMapZoom(6);
    setImageFile(null);
    setImagePreview('');
  };

  const getSeverityColor = (severity) => {
    const colors = {
      LOW: '#4CAF50',
      MEDIUM: '#FF9800',
      HIGH: '#f44336',
      CRITICAL: '#9C27B0'
    };
    return colors[severity] || '#666';
  };

  const getSeverityText = (severity) => {
    const texts = {
      LOW: 'Thấp',
      MEDIUM: 'Trung bình',
      HIGH: 'Cao',
      CRITICAL: 'Nghiêm trọng'
    };
    return texts[severity] || severity;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#FF9800',
      APPROVED: '#4CAF50',
      REJECTED: '#f44336',
      RESOLVED: '#2196F3'
    };
    return colors[status] || '#666';
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'Chờ duyệt',
      APPROVED: 'Đã duyệt',
      REJECTED: 'Từ chối',
      RESOLVED: 'Đã giải quyết'
    };
    return texts[status] || status;
  };

  if (loading) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="reports-page">
      <div className="reports-container">
        <div className="reports-header">
        <h2>Báo cáo sự cố thời tiết</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Toggle view mode */}
          <div className="view-mode-toggle">
            <button
              onClick={() => setViewMode('all')}
              className={`toggle-btn ${viewMode === 'all' ? 'active' : ''}`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setViewMode('my')}
              className={`toggle-btn ${viewMode === 'my' ? 'active' : ''}`}
            >
              Của tôi
            </button>
          </div>
          {!admin && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              <FiPlus /> Tạo báo cáo mới
            </button>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingReport ? 'Chỉnh sửa báo cáo' : 'Tạo báo cáo mới'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="report-form">
              <label className="form-label">Tiêu đề <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Nhập tiêu đề báo cáo"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="input"
              />

              <label className="form-label">Mô tả <span className="required">*</span></label>
              <textarea
                placeholder="Mô tả chi tiết về sự cố"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="input"
                rows="4"
              />

              <label className="form-label">Loại sự cố <span className="required">*</span></label>
              <IncidentTypeSelect
                value={formData.incidentTypeId}
                onChange={(e) => setFormData({ ...formData, incidentTypeId: e.target.value })}
                incidentTypes={incidentTypes}
                required
              />

              <label className="form-label">Mức độ</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                className="input"
              >
                <option value="LOW">Thấp</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HIGH">Cao</option>
                <option value="CRITICAL">Nghiêm trọng</option>
              </select>

              <label className="form-label" style={{ marginTop: '15px' }}>
                <FiMapPin /> Chọn vị trí trên bản đồ <span className="required">*</span>
              </label>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                Click trên bản đồ để chọn vị trí sự cố
              </p>
              
              <div className="map-container-wrapper" style={{ 
                marginBottom: '15px', 
                border: '2px solid #ddd', 
                borderRadius: '12px', 
                overflow: 'hidden',
                height: '400px',
                backgroundColor: '#e8f4f8',
                position: 'relative',
                zIndex: 1
              }}>
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: '100%', width: '100%', zIndex: 1 }}
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

              {/* Hiển thị địa chỉ từ reverse geocoding */}
              {formData.latitude && formData.longitude && (
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f0f9ff', 
                  borderRadius: '6px', 
                  marginBottom: '15px',
                  border: '1px solid #0284c7'
                }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#0369a1', marginBottom: '8px' }}>
                    📍 Địa chỉ đã chọn:
                  </p>
                  {loadingAddress ? (
                    <p style={{ margin: 0, color: '#666', fontStyle: 'italic' }}>
                      Đang tìm địa chỉ...
                    </p>
                  ) : (
                    <>
                      <p style={{ margin: 0, color: '#334155', fontWeight: '500' }}>
                        {formData.displayAddress || 'Đang tìm địa chỉ...'}
                      </p>
                      {/* Chỉ hiển thị tọa độ nếu địa chỉ không chứa "Tọa độ:" (tức là đã có tên địa điểm) */}
                      {formData.displayAddress && !formData.displayAddress.includes('Tọa độ:') && (
                        <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                          Tọa độ: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Nhập tọa độ thủ công */}
              <label className="form-label" style={{ fontSize: '13px', color: '#666', marginTop: '10px' }}>
                Hoặc nhập tọa độ trực tiếp:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <input
                  type="number"
                  step="any"
                  placeholder="Vĩ độ (Latitude)"
                  value={formData.latitude || ''}
                  onChange={handleLatitudeChange}
                  className="input"
                  style={{ fontSize: '14px' }}
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Kinh độ (Longitude)"
                  value={formData.longitude || ''}
                  onChange={handleLongitudeChange}
                  className="input"
                  style={{ fontSize: '14px' }}
                />
              </div>

              <label className="form-label">Thời gian xảy ra</label>
              <input
                type="datetime-local"
                value={formData.incidentTime}
                onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                className="input"
              />

              <label className="form-label">Ảnh minh họa</label>
              <input
                type="file"
                accept="image/*"
                className="input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setImageFile(file || null);
                  if (file) {
                    const previewUrl = URL.createObjectURL(file);
                    setImagePreview(previewUrl);
                  } else {
                    setImagePreview('');
                  }
                }}
              />
              {imagePreview && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={imagePreview}
                    alt="Xem trước ảnh"
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
                  />
                </div>
              )}

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-secondary">
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  {editingReport ? 'Cập nhật' : 'Tạo báo cáo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="reports-list">
        {reports.length === 0 ? (
          <div className="empty-state">
            <FiAlertCircle size={48} color="#ccc" />
            <p>Chưa có báo cáo nào</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-header">
                <h3>{report.title}</h3>
                <div className="report-actions">
                  {report.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleEdit(report)} className="btn-icon" title="Chỉnh sửa">
                        <FiEdit />
                      </button>
                      <button onClick={() => handleDelete(report.id)} className="btn-icon delete" title="Xóa">
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                  {report.latitude && report.longitude && (
                    <button 
                      onClick={() => window.open(`/map?lat=${report.latitude}&lng=${report.longitude}`, '_blank')}
                      className="btn-icon"
                      title="Xem thời tiết tại vị trí này"
                    >
                      <FiMapPin />
                    </button>
                  )}
                </div>
              </div>

              <p className="report-description">{report.description}</p>

              <div className="report-meta">
                <span className="incident-type">
                  {report.incidentTypeName || 'Chưa phân loại'}
                </span>
                <span 
                  className="severity-badge" 
                  style={{ backgroundColor: getSeverityColor(report.severity) }}
                >
                  {getSeverityText(report.severity)}
                </span>
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: getStatusColor(report.status) }}
                >
                  {report.status === 'APPROVED' && <FiCheck />}
                  {getStatusText(report.status)}
                </span>
              </div>

              {report.images && report.images.length > 0 && (
                <div className="report-images">
                  {report.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={getImageUrl(img)}
                      alt={`Ảnh báo cáo ${report.title}`}
                      style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '8px', marginTop: '8px' }}
                    />
                  ))}
                </div>
              )}

              <div className="report-location">
                <FiMapPin />
                <span>
                  {getReportAddress(report)}
                </span>
              </div>

              <div className="report-time">
                <FiClock />
                <span>{new Date(report.incidentTime).toLocaleString('vi-VN')}</span>
              </div>

              {/* Vote Section - Chỉ hiển thị nếu không phải owner và có tọa độ báo cáo */}
              {(() => {
                const currentUser = getUser();
                const isOwner = currentUser && report.userId === currentUser.id;
                const hasLocation = report.latitude != null && report.longitude != null;
                return !isOwner && hasLocation && (
                  <div className="report-votes" style={{ 
                    marginTop: '12px', 
                    paddingTop: '12px', 
                    borderTop: '1px solid rgba(0, 31, 63, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <button
                      onClick={() => handleVote(report.id, 'CONFIRM')}
                      className={`vote-btn confirm ${report.userVote === 'CONFIRM' ? 'active' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${report.userVote === 'CONFIRM' ? '#4CAF50' : 'rgba(0, 31, 63, 0.2)'}`,
                        background: report.userVote === 'CONFIRM' ? '#4CAF50' : 'rgba(76, 175, 80, 0.1)',
                        color: report.userVote === 'CONFIRM' ? 'white' : '#4CAF50',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      title="Tôi cũng gặp"
                    >
                      <FiThumbsUp />
                      <span>Tôi cũng gặp</span>
                      {report.confirmCount > 0 && (
                        <span style={{ 
                          background: report.userVote === 'CONFIRM' ? 'rgba(255,255,255,0.3)' : '#4CAF50',
                          color: report.userVote === 'CONFIRM' ? 'white' : 'white',
                          padding: '2px 6px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {report.confirmCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleVote(report.id, 'REJECT')}
                      className={`vote-btn reject ${report.userVote === 'REJECT' ? 'active' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: `1px solid ${report.userVote === 'REJECT' ? '#F44336' : 'rgba(0, 31, 63, 0.2)'}`,
                        background: report.userVote === 'REJECT' ? '#F44336' : 'rgba(244, 67, 54, 0.1)',
                        color: report.userVote === 'REJECT' ? 'white' : '#F44336',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      title="Không đúng"
                    >
                      <FiX />
                      <span>Không đúng</span>
                      {report.rejectCount > 0 && (
                        <span style={{ 
                          background: report.userVote === 'REJECT' ? 'rgba(255,255,255,0.3)' : '#F44336',
                          color: report.userVote === 'REJECT' ? 'white' : 'white',
                          padding: '2px 6px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {report.rejectCount}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })()}
            </div>
          ))
        )}
      </div>
      </div>
    </div>
  );
};

export default Reports;

