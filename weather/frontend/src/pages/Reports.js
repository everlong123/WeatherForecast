import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { reportAPI, incidentTypeAPI, locationAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiAlertCircle, FiClock, FiCheck } from 'react-icons/fi';
import { getProvinces, getDistricts, getWards } from '../data/locations';
import { incidentTypes as defaultIncidentTypes, getCategories, getIncidentTypesByCategory } from '../data/incidentTypes';
import './Reports.css';

// Memoized component for incident type select to prevent re-rendering
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
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="input"
    >
      <option value="">-- Chọn loại sự cố --</option>
      {options}
    </select>
  );
});

IncidentTypeSelect.displayName = 'IncidentTypeSelect';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState(defaultIncidentTypes);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    incidentTypeId: '',
    severity: 'LOW',
    address: '',
    city: '',
    district: '',
    ward: '',
    latitude: null,
    longitude: null,
    incidentTime: new Date().toISOString().slice(0, 16),
  });
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapPickerPosition, setMapPickerPosition] = useState([16.0583, 108.2772]);

  useEffect(() => {
    fetchData();
    fetchIncidentTypes();
    fetchProvinces();
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

  const fetchProvinces = async () => {
    try {
      const data = await getProvinces();
      setProvinces(data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const handleProvinceChange = useCallback(async (e) => {
    const province = e.target.value;
    setFormData(prev => ({ ...prev, city: province, district: '', ward: '' }));
    setDistricts([]);
    setWards([]);
    if (province) {
      const data = await getDistricts(province);
      setDistricts(data);
    }
  }, []);

  const handleDistrictChange = useCallback(async (e) => {
    const district = e.target.value;
    setFormData(prev => {
      if (district && prev.city) {
        getWards(prev.city, district).then(setWards);
        // Tự động lấy tọa độ khi chọn district
        locationAPI.getCoordinates(prev.city, district, null).then(response => {
          setFormData(current => ({
            ...current,
            latitude: response.data.lat,
            longitude: response.data.lng
          }));
        }).catch(() => {});
      }
      return { ...prev, district, ward: '' };
    });
    setWards([]);
  }, []);

  const handleWardChange = useCallback(async (e) => {
    const ward = e.target.value;
    setFormData(prev => {
      if (ward && prev.city && prev.district) {
        // Tự động lấy tọa độ khi chọn ward
        locationAPI.getCoordinates(prev.city, prev.district, ward).then(response => {
          setFormData(current => ({
            ...current,
            latitude: response.data.lat,
            longitude: response.data.lng
          }));
        }).catch(() => {});
      }
      return { ...prev, ward };
    });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const submitData = {
        ...formData,
        incidentTypeId: parseInt(formData.incidentTypeId) || null,
      };

      if (editingReport) {
        await reportAPI.update(editingReport.id, submitData);
      } else {
        await reportAPI.create(submitData);
      }

      setShowForm(false);
      setEditingReport(null);
      resetForm();
      fetchData();
    } catch (err) {
      console.error('Error saving report:', err);
      setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      title: report.title || '',
      description: report.description || '',
      incidentTypeId: report.incidentTypeId?.toString() || '',
      severity: report.severity || 'LOW',
      address: report.address || '',
      city: report.city || '',
      district: report.district || '',
      ward: report.ward || '',
      incidentTime: report.incidentTime
        ? new Date(report.incidentTime).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    });

    // Load districts and wards if city/district exists
    if (report.city) {
      getDistricts(report.city).then(setDistricts);
      if (report.district) {
        getWards(report.city, report.district).then(setWards);
      }
    }

    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa báo cáo này?')) {
      try {
        await reportAPI.delete(id);
        fetchData();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      incidentTypeId: '',
      severity: 'LOW',
      address: '',
      city: '',
      district: '',
      ward: '',
      latitude: null,
      longitude: null,
      incidentTime: new Date().toISOString().slice(0, 16),
    });
    setDistricts([]);
    setWards([]);
    setEditingReport(null);
    setError('');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'status-approved';
      case 'PENDING':
        return 'status-pending';
      case 'RESOLVED':
        return 'status-resolved';
      case 'REJECTED':
        return 'status-rejected';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="reports-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <div className="container">
        <div className="reports-header">
          <h1>
            <FiAlertCircle /> Báo cáo của tôi
          </h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FiPlus /> Tạo báo cáo mới
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="reports-list">
          {reports.length === 0 ? (
            <div className="empty-state">
              <FiAlertCircle />
              <h3>Chưa có báo cáo nào</h3>
              <p>Hãy tạo báo cáo đầu tiên của bạn để bắt đầu!</p>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="report-card card fade-in">
                <div className="report-header">
                  <div className="report-title-section">
                    <h3>{report.title}</h3>
                    <span className={`report-status ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="report-actions">
                    {report.status === 'PENDING' && (
                      <>
                        <button
                          className="btn-icon"
                          onClick={() => handleEdit(report)}
                          title="Chỉnh sửa"
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleDelete(report.id)}
                          title="Xóa"
                        >
                          <FiTrash2 />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="report-description">{report.description}</p>
                <div className="report-meta">
                  <div className="meta-item">
                    <span className="meta-label">Loại sự cố:</span>
                    <span className="meta-value">{report.incidentTypeName || 'N/A'}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Mức độ:</span>
                    <span className={`meta-value severity-${report.severity?.toLowerCase()}`}>
                      {report.severity}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FiMapPin />
                    <span>
                      {report.district || report.city || 'N/A'}
                      {report.ward ? `, ${report.ward}` : ''}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FiClock />
                    <span>
                      {new Date(report.incidentTime || report.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showForm && (
          <div
            className="modal-overlay"
            onClick={() => {
              setShowForm(false);
              resetForm();
            }}
          >
            <div
              className="modal-content card"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>{editingReport ? 'Chỉnh sửa Báo cáo' : 'Tạo Báo cáo mới'}</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit}>
                <label className="form-label">Tiêu đề <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề báo cáo"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="input"
                />

                <label className="form-label">Mô tả chi tiết <span className="required">*</span></label>
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

                <label className="form-label">Tỉnh/Thành phố</label>
                <select
                  value={formData.city}
                  onChange={handleProvinceChange}
                  className="input"
                >
                  <option value="">-- Chọn tỉnh/thành phố --</option>
                  {provinces.map((province, index) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>

                <label className="form-label">Quận/Huyện</label>
                <select
                  value={formData.district}
                  onChange={handleDistrictChange}
                  className="input"
                  disabled={!formData.city}
                >
                  <option value="">-- Chọn quận/huyện --</option>
                  {districts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>

                <label className="form-label">Phường/Xã</label>
                <select
                  value={formData.ward}
                  onChange={handleWardChange}
                  className="input"
                  disabled={!formData.district}
                >
                  <option value="">-- Chọn phường/xã --</option>
                  {wards.map((ward, index) => (
                    <option key={index} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>

                <label className="form-label">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ cụ thể (tên đường, số nhà...)"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input"
                />

                <label className="form-label">Chọn vị trí trên bản đồ (Tùy chọn)</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      // Mở map trong tab mới với chế độ chọn vị trí
                      window.onLocationSelected = (lat, lng) => {
                        setFormData(prev => ({
                          ...prev,
                          latitude: lat,
                          longitude: lng
                        }));
                        window.onLocationSelected = null;
                      };
                      const mapWindow = window.open('/map?pickLocation=true', '_blank', 'width=1200,height=800');
                      if (mapWindow) {
                        mapWindow.focus();
                      }
                    }}
                    style={{ flex: '1 1 auto', minWidth: '200px' }}
                  >
                    <FiMapPin /> Chọn trên bản đồ
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      // Mở trang GPS Coordinates trong popup
                      const gpsWindow = window.open(
                        'https://www.gps-coordinates.net/',
                        '_blank',
                        'width=1000,height=700'
                      );
                      if (gpsWindow) {
                        // Hướng dẫn người dùng
                        alert('Vui lòng:\n1. Tìm vị trí trên bản đồ\n2. Copy tọa độ (lat, lng)\n3. Dán vào ô bên dưới');
                      }
                    }}
                    style={{ flex: '1 1 auto', minWidth: '200px' }}
                  >
                    🌐 Mở GPS Coordinates
                  </button>
                </div>
                
                <label className="form-label" style={{ marginTop: '10px', fontSize: '13px', color: '#666' }}>
                  Hoặc nhập tọa độ trực tiếp (Lat, Lng):
                </label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                  <input
                    type="text"
                    placeholder="Ví dụ: 10.3460"
                    value={formData.latitude || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (!isNaN(val) && val >= -90 && val <= 90)) {
                        setFormData(prev => ({ ...prev, latitude: val ? parseFloat(val) : null }));
                      }
                    }}
                    className="input"
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="Ví dụ: 107.0843"
                    value={formData.longitude || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || (!isNaN(val) && val >= -180 && val <= 180)) {
                        setFormData(prev => ({ ...prev, longitude: val ? parseFloat(val) : null }));
                      }
                    }}
                    className="input"
                    style={{ flex: 1 }}
                  />
                </div>
                
                {formData.latitude && formData.longitude && (
                  <div style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '15px', padding: '8px', background: '#f0f0f0', borderRadius: '6px' }}>
                    <FiCheck style={{ color: '#4CAF50' }} />
                    <span>
                      <strong>Tọa độ:</strong> {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, latitude: null, longitude: null }))}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        color: '#f44336', 
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: '2px 5px',
                        marginLeft: 'auto'
                      }}
                      title="Xóa vị trí"
                    >
                      ×
                    </button>
                  </div>
                )}
                <p style={{ fontSize: '12px', color: '#999', marginTop: '-10px', marginBottom: '15px' }}>
                  💡 Có 3 cách: (1) Click "Chọn trên bản đồ" để chọn trực tiếp, (2) Mở GPS Coordinates để tìm và copy tọa độ, (3) Nhập tọa độ trực tiếp vào ô trên.
                </p>

                <label className="form-label">Thời gian sự cố <span className="required">*</span></label>
                <input
                  type="datetime-local"
                  value={formData.incidentTime}
                  onChange={(e) => setFormData({ ...formData, incidentTime: e.target.value })}
                  required
                  className="input"
                />

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingReport ? 'Cập nhật' : 'Tạo báo cáo'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;