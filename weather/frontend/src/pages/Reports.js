import React, { useState, useEffect } from 'react';
import { reportAPI, incidentTypeAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiMapPin, FiAlertCircle, FiClock } from 'react-icons/fi';
import { getProvinces, getDistricts, getWards } from '../data/locations';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
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
    latitude: '',
    longitude: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    incidentTime: new Date().toISOString().slice(0, 16),
  });

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
      console.log('Fetching incident types...');
      const response = await incidentTypeAPI.getAll();
      console.log('Incident types response:', response);
      console.log('Incident types data:', response.data);
      if (response.data && Array.isArray(response.data)) {
        setIncidentTypes(response.data);
        console.log('Incident types set:', response.data.length, 'items');
      } else {
        console.warn('Response data is not an array:', response.data);
        setIncidentTypes([]);
      }
    } catch (error) {
      console.error('Error fetching incident types:', error);
      console.error('Error details:', error.response?.data || error.message);
      setError('Không thể tải danh sách loại sự cố. Vui lòng thử lại sau.');
      setIncidentTypes([]);
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

  const handleProvinceChange = async (e) => {
    const province = e.target.value;
    setFormData({ ...formData, city: province, district: '', ward: '' });
    setDistricts([]);
    setWards([]);
    if (province) {
      const data = await getDistricts(province);
      setDistricts(data);
    }
  };

  const handleDistrictChange = async (e) => {
    const district = e.target.value;
    setFormData({ ...formData, district, ward: '' });
    setWards([]);
    if (district && formData.city) {
      const data = await getWards(formData.city, district);
      setWards(data);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
        },
        (error) => {
          alert('Không thể lấy vị trí. Vui lòng nhập thủ công.');
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const submitData = {
        ...formData,
        latitude: parseFloat(formData.latitude) || null,
        longitude: parseFloat(formData.longitude) || null,
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
      latitude: report.latitude?.toString() || '',
      longitude: report.longitude?.toString() || '',
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
      latitude: '',
      longitude: '',
      address: '',
      city: '',
      district: '',
      ward: '',
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
                <input
                  type="text"
                  placeholder="Tiêu đề *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="input"
                />

                <textarea
                  placeholder="Mô tả chi tiết *"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="input"
                  rows="4"
                />

                <select
                  value={formData.incidentTypeId}
                  onChange={(e) => setFormData({ ...formData, incidentTypeId: e.target.value })}
                  required
                  className="input"
                >
                  <option value="">Chọn loại sự cố * ({incidentTypes.length} loại có sẵn)</option>
                  {incidentTypes && incidentTypes.length > 0 ? (
                    incidentTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.icon || '⚠️'} {type.name}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Đang tải danh sách loại sự cố...</option>
                  )}
                </select>

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

                <select
                  value={formData.city}
                  onChange={handleProvinceChange}
                  className="input"
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map((province, index) => (
                    <option key={index} value={province}>
                      {province}
                    </option>
                  ))}
                </select>

                <select
                  value={formData.district}
                  onChange={handleDistrictChange}
                  className="input"
                  disabled={!formData.city}
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map((district, index) => (
                    <option key={index} value={district}>
                      {district}
                    </option>
                  ))}
                </select>

                <select
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  className="input"
                  disabled={!formData.district}
                >
                  <option value="">Chọn phường/xã</option>
                  {wards.map((ward, index) => (
                    <option key={index} value={ward}>
                      {ward}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Địa chỉ chi tiết"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input"
                />

                <div className="location-inputs">
                  <input
                    type="number"
                    step="any"
                    placeholder="Vĩ độ (Latitude)"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="input"
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Kinh độ (Longitude)"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="input"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleGetLocation}
                  >
                    <FiMapPin /> Lấy vị trí hiện tại
                  </button>
                </div>

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
