import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { reportAPI, incidentTypeAPI, locationAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiAlertCircle, FiClock, FiCheck, FiX } from 'react-icons/fi';
import { getProvinces, getDistricts, getWards } from '../data/locations';
import { incidentTypes as defaultIncidentTypes, getCategories, getIncidentTypesByCategory } from '../data/incidentTypes';
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
  const [mapCenter, setMapCenter] = useState([16.0583, 108.2772]);
  const [mapZoom, setMapZoom] = useState(7);
  const [isSyncingFromCoordinates, setIsSyncingFromCoordinates] = useState(false);
  const lastNominatimRequestRef = useRef(0);

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
    setIsSyncingFromCoordinates(true);
    
    // Luôn reset districts và wards
    setDistricts([]);
    setWards([]);
    
    // Reset form data và clear tọa độ
    setFormData(prev => ({ 
      ...prev, 
      city: province, 
      district: '', 
      ward: '',
      latitude: null,
      longitude: null
    }));
    
    if (province) {
      const data = await getDistricts(province);
      setDistricts(data);
    }
    setIsSyncingFromCoordinates(false);
  }, []);

  const handleDistrictChange = useCallback(async (e) => {
    const district = e.target.value;
    setIsSyncingFromCoordinates(true);
    
    // Lấy city từ formData hiện tại trước khi update
    setFormData(prev => {
      const city = prev.city;
      
      // Cập nhật district và reset ward ngay lập tức
      const newData = { ...prev, district, ward: '' };
      
      if (district && city) {
        getWards(city, district).then(setWards);
        
        // Delay để tránh rate limit của Nominatim (1 request/second)
        const now = Date.now();
        const timeSinceLastRequest = now - lastNominatimRequestRef.current;
        const delay = timeSinceLastRequest < 1100 ? 1100 - timeSinceLastRequest : 0;
        
        setTimeout(() => {
          lastNominatimRequestRef.current = Date.now();
          // Tự động lấy tọa độ khi chọn district
          locationAPI.getCoordinates(city, district, null).then(response => {
            // Chỉ set tọa độ nếu có kết quả hợp lệ
            if (response.data && typeof response.data.lat === 'number' && typeof response.data.lng === 'number') {
              const lat = response.data.lat;
              const lng = response.data.lng;
              // Kiểm tra xem có phải tọa độ mặc định không (16.0583, 108.2772)
              const isDefaultCoords = Math.abs(lat - 16.0583) < 0.0001 && Math.abs(lng - 108.2772) < 0.0001;
              if (!isDefaultCoords) {
                setFormData(current => ({
                  ...current,
                  latitude: lat,
                  longitude: lng
                }));
                // Cập nhật map center
                setMapCenter([lat, lng]);
                setMapZoom(13);
              }
            }
            setIsSyncingFromCoordinates(false);
          }).catch((error) => {
            console.error('Error getting coordinates:', error);
            setIsSyncingFromCoordinates(false);
          });
        }, delay);
      } else {
        setIsSyncingFromCoordinates(false);
      }
      
      if (!district) {
        // Nếu không chọn district, reset tọa độ
        newData.latitude = null;
        newData.longitude = null;
      }
      
      return newData;
    });
    setWards([]);
  }, []);

  const handleWardChange = useCallback(async (e) => {
    const ward = e.target.value;
    setIsSyncingFromCoordinates(true);
    
    // Lấy city và district từ formData hiện tại trước khi update
    setFormData(prev => {
      const city = prev.city;
      const district = prev.district;
      
      // Cập nhật ward ngay lập tức
      const newData = { ...prev, ward };
      
      if (ward && city && district) {
        // Delay để tránh rate limit của Nominatim (1 request/second)
        const now = Date.now();
        const timeSinceLastRequest = now - lastNominatimRequestRef.current;
        const delay = timeSinceLastRequest < 1100 ? 1100 - timeSinceLastRequest : 0;
        
        setTimeout(() => {
          lastNominatimRequestRef.current = Date.now();
          // Tự động lấy tọa độ khi chọn ward
          locationAPI.getCoordinates(city, district, ward).then(response => {
            // Chỉ set tọa độ nếu có kết quả hợp lệ
            if (response.data && typeof response.data.lat === 'number' && typeof response.data.lng === 'number') {
              const lat = response.data.lat;
              const lng = response.data.lng;
              // Kiểm tra xem có phải tọa độ mặc định không (16.0583, 108.2772)
              const isDefaultCoords = Math.abs(lat - 16.0583) < 0.0001 && Math.abs(lng - 108.2772) < 0.0001;
              if (!isDefaultCoords) {
                setFormData(current => ({
                  ...current,
                  latitude: lat,
                  longitude: lng
                }));
                // Cập nhật map center
                setMapCenter([lat, lng]);
                setMapZoom(15);
              }
            }
            setIsSyncingFromCoordinates(false);
          }).catch((error) => {
            console.error('Error getting coordinates:', error);
            setIsSyncingFromCoordinates(false);
          });
        }, delay);
      } else {
        setIsSyncingFromCoordinates(false);
      }
      
      return newData;
    });
  }, []);

  // Cập nhật map center khi tọa độ thay đổi từ input (không phải từ map click)
  useEffect(() => {
    if (formData.latitude && formData.longitude && showForm && !isSyncingFromCoordinates) {
      // Kiểm tra xem map center có khác với tọa độ hiện tại không
      const newCenter = [formData.latitude, formData.longitude];
      const isCenterDifferent = Math.abs(mapCenter[0] - newCenter[0]) > 0.0001 || 
                                Math.abs(mapCenter[1] - newCenter[1]) > 0.0001;
      
      if (isCenterDifferent) {
        setMapCenter(newCenter);
        setMapZoom(13);
      }
    }
  }, [formData.latitude, formData.longitude, showForm, isSyncingFromCoordinates, mapCenter]);

  // Tự động lấy địa điểm từ tọa độ khi lat/lng thay đổi (chỉ khi không đang sync từ dropdown)
  useEffect(() => {
    const syncLocationFromCoordinates = async () => {
      // Chỉ sync nếu có lat/lng, form đang mở, và không đang sync từ dropdown
      if (formData.latitude && formData.longitude && showForm && !isSyncingFromCoordinates) {
        // Chỉ sync nếu chưa có city hoặc district (tức là đang nhập từ map/GPS)
        if (!formData.city || !formData.district) {
          setIsSyncingFromCoordinates(true);
          try {
            const response = await locationAPI.getLocationFromCoordinates(
              formData.latitude,
              formData.longitude
            );
            
            if (response.data && Object.keys(response.data).length > 0) {
              const location = response.data;
              
              setFormData(prev => {
                const updates = { ...prev };
                
                // Cập nhật city nếu chưa có hoặc khác
                if (location.city && (!prev.city || location.city !== prev.city)) {
                  updates.city = location.city;
                  getDistricts(location.city).then(setDistricts);
                }
                
                // Cập nhật district nếu chưa có hoặc khác
                if (location.district && (!prev.district || location.district !== prev.district)) {
                  updates.district = location.district;
                  if (updates.city || location.city) {
                    getWards(updates.city || location.city, location.district).then(setWards);
                  }
                }
                
                // Cập nhật ward nếu chưa có hoặc khác
                if (location.ward && (!prev.ward || location.ward !== prev.ward)) {
                  updates.ward = location.ward;
                }
                
                return updates;
              });
            }
          } catch (error) {
            console.error('Error reverse geocoding:', error);
          } finally {
            setIsSyncingFromCoordinates(false);
          }
        }
      }
    };

    // Debounce để tránh gọi quá nhiều lần
    const timeoutId = setTimeout(syncLocationFromCoordinates, 800);
    return () => clearTimeout(timeoutId);
  }, [formData.latitude, formData.longitude, showForm, isSyncingFromCoordinates]);


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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label className="form-label">Tỉnh/Thành phố</label>
                    <select
                      value={formData.city || ''}
                      onChange={handleProvinceChange}
                      className="input"
                    >
                      <option value="">-- Chọn tỉnh/thành phố --</option>
                      {provinces.map((province, index) => (
                        <option key={`${province}-${index}`} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
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
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
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
                  </div>

                  <div>
                    <label className="form-label">Địa chỉ chi tiết</label>
                    <input
                      type="text"
                      placeholder="Nhập địa chỉ cụ thể (tên đường, số nhà...)"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <label className="form-label" style={{ marginTop: '10px' }}>
                  Chọn vị trí trên bản đồ hoặc nhập tọa độ
                </label>
                <div style={{ 
                  marginBottom: '15px', 
                  border: '2px solid #ddd', 
                  borderRadius: '8px', 
                  overflow: 'hidden',
                  position: 'relative',
                  height: '350px',
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
                    <MapClickHandler onMapClick={async (latlng) => {
                      const lat = latlng.lat;
                      const lng = latlng.lng;
                      
                      // Cập nhật tọa độ
                      setIsSyncingFromCoordinates(true);
                      setFormData(prev => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng
                      }));
                      
                      // Cập nhật map center và zoom
                      setMapCenter([lat, lng]);
                      setMapZoom(15);
                      
                      // Tự động lấy địa điểm từ tọa độ
                      try {
                        const response = await locationAPI.getLocationFromCoordinates(lat, lng);
                        if (response.data && Object.keys(response.data).length > 0) {
                          const location = response.data;
                          setFormData(prev => {
                            const updates = { ...prev };
                            if (location.city) {
                              updates.city = location.city;
                              getDistricts(location.city).then(setDistricts);
                            }
                            if (location.district) {
                              updates.district = location.district;
                              if (updates.city) {
                                getWards(updates.city, location.district).then(setWards);
                              }
                            }
                            if (location.ward) {
                              updates.ward = location.ward;
                            }
                            return updates;
                          });
                        }
                      } catch (error) {
                        console.error('Error reverse geocoding:', error);
                      } finally {
                        setIsSyncingFromCoordinates(false);
                      }
                    }} />
                    {formData.latitude && formData.longitude && (
                      <Marker position={[formData.latitude, formData.longitude]} />
                    )}
                  </MapContainer>
                </div>
                
                <label className="form-label" style={{ fontSize: '13px', color: '#666' }}>
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
                        const lat = val ? parseFloat(val) : null;
                        setIsSyncingFromCoordinates(false); // Đang nhập từ input, không phải từ dropdown
                        setFormData(prev => ({ ...prev, latitude: lat }));
                        
                        // Cập nhật map center nếu có cả lat và lng
                        if (lat && formData.longitude) {
                          setMapCenter([lat, formData.longitude]);
                          setMapZoom(13);
                          
                          // Tự động sync location nếu có cả lat và lng
                          setIsSyncingFromCoordinates(true);
                          locationAPI.getLocationFromCoordinates(lat, formData.longitude)
                            .then(response => {
                              if (response.data && Object.keys(response.data).length > 0) {
                                const location = response.data;
                                setFormData(prev => {
                                  const updates = { ...prev };
                                  if (location.city) {
                                    updates.city = location.city;
                                    getDistricts(location.city).then(setDistricts);
                                  }
                                  if (location.district) {
                                    updates.district = location.district;
                                    if (updates.city || location.city) {
                                      getWards(updates.city || location.city, location.district).then(setWards);
                                    }
                                  }
                                  if (location.ward) {
                                    updates.ward = location.ward;
                                  }
                                  return updates;
                                });
                              }
                              setIsSyncingFromCoordinates(false);
                            })
                            .catch(err => {
                              console.error('Error reverse geocoding:', err);
                              setIsSyncingFromCoordinates(false);
                            });
                        } else if (!lat) {
                          // Nếu xóa lat, cũng cập nhật map về center mặc định
                          setMapCenter([16.0583, 108.2772]);
                          setMapZoom(7);
                        }
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
                        const lng = val ? parseFloat(val) : null;
                        setIsSyncingFromCoordinates(false); // Đang nhập từ input, không phải từ dropdown
                        setFormData(prev => ({ ...prev, longitude: lng }));
                        
                        // Cập nhật map center nếu có cả lat và lng
                        if (lng && formData.latitude) {
                          setMapCenter([formData.latitude, lng]);
                          setMapZoom(13);
                          
                          // Tự động sync location nếu có cả lat và lng
                          setIsSyncingFromCoordinates(true);
                          locationAPI.getLocationFromCoordinates(formData.latitude, lng)
                            .then(response => {
                              if (response.data && Object.keys(response.data).length > 0) {
                                const location = response.data;
                                setFormData(prev => {
                                  const updates = { ...prev };
                                  if (location.city) {
                                    updates.city = location.city;
                                    getDistricts(location.city).then(setDistricts);
                                  }
                                  if (location.district) {
                                    updates.district = location.district;
                                    if (updates.city || location.city) {
                                      getWards(updates.city || location.city, location.district).then(setWards);
                                    }
                                  }
                                  if (location.ward) {
                                    updates.ward = location.ward;
                                  }
                                  return updates;
                                });
                              }
                              setIsSyncingFromCoordinates(false);
                            })
                            .catch(err => {
                              console.error('Error reverse geocoding:', err);
                              setIsSyncingFromCoordinates(false);
                            });
                        } else if (!lng) {
                          // Nếu xóa lng, cũng cập nhật map về center mặc định
                          setMapCenter([16.0583, 108.2772]);
                          setMapZoom(7);
                        }
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
                  💡 Click trên bản đồ để chọn vị trí, hoặc nhập tọa độ trực tiếp. Chọn từ dropdown sẽ tự động cập nhật bản đồ và ngược lại. Hệ thống sẽ tự động đồng bộ giữa bản đồ, tọa độ và selector địa điểm.
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