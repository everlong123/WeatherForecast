import React, { useState, useEffect, useMemo } from 'react';
import { reportAPI, incidentTypeAPI, locationAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiAlertCircle, FiClock, FiCheck } from 'react-icons/fi';
import { incidentTypes as defaultIncidentTypes } from '../data/incidentTypes';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
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

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState(defaultIncidentTypes);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [error, setError] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);
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
  });
  
  const [mapCenter, setMapCenter] = useState([16.0583, 108.2772]); // Trung tâm Việt Nam
  const [mapZoom, setMapZoom] = useState(6);

  useEffect(() => {
    fetchData();
    fetchIncidentTypes();
  }, []);

  const fetchData = async () => {
    try {
      const response = await reportAPI.getMyReports();
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
    try {
      const response = await locationAPI.getLocationFromCoordinates(lat, lng);
      if (response.data && Object.keys(response.data).length > 0) {
        const location = response.data;
        setFormData(prev => ({
          ...prev,
          city: location.city || '',
          district: location.district || '',
          ward: location.ward || '',
          displayAddress: location.display_name || 
            [location.ward, location.district, location.city]
              .filter(Boolean)
              .join(', '),
        }));
      } else {
        // Không tìm thấy địa chỉ
        setFormData(prev => ({
          ...prev,
          city: '',
          district: '',
          ward: '',
          displayAddress: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
        }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      setFormData(prev => ({
        ...prev,
        displayAddress: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)} (Không tìm thấy địa chỉ)`,
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
    });
    
    if (report.latitude && report.longitude) {
      setMapCenter([report.latitude, report.longitude]);
      setMapZoom(15);
    }
    
    setShowForm(true);
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
    });
    setEditingReport(null);
    setShowForm(false);
    setError('');
    setMapCenter([16.0583, 108.2772]);
    setMapZoom(6);
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
    <div className="reports-container">
      <div className="reports-header">
        <h2>Báo cáo sự cố thời tiết</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          <FiPlus /> Tạo báo cáo mới
        </button>
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
              
              <div style={{ 
                marginBottom: '15px', 
                border: '2px solid #ddd', 
                borderRadius: '8px', 
                overflow: 'hidden',
                height: '400px',
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
                      <p style={{ margin: 0, color: '#334155' }}>
                        {formData.displayAddress || 'Chưa có địa chỉ'}
                      </p>
                      <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                        Tọa độ: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                      </p>
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
                  <button onClick={() => handleEdit(report)} className="btn-icon">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(report.id)} className="btn-icon delete">
                    <FiTrash2 />
                  </button>
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

              <div className="report-location">
                <FiMapPin />
                <span>
                  {[report.ward, report.district, report.city].filter(Boolean).join(', ') || 
                   `${report.latitude?.toFixed(4)}, ${report.longitude?.toFixed(4)}`}
                </span>
              </div>

              <div className="report-time">
                <FiClock />
                <span>{new Date(report.incidentTime).toLocaleString('vi-VN')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reports;


