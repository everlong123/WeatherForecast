import React, { useState, useEffect } from 'react';
import { adminAPI, reportAPI, incidentTypeAPI, locationAPI } from '../utils/api';
import { isAdmin } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiCheck, FiX, FiCheckCircle, FiShield, FiUsers, FiAlertCircle, 
  FiSettings, FiBarChart2, FiEdit, FiTrash2, FiPlus, FiDownload,
  FiToggleLeft, FiToggleRight, FiActivity, FiMapPin, FiEye, FiEyeOff
} from 'react-icons/fi';
import './Admin.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component để lắng nghe click trên map
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

const Admin = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [incidentTypes, setIncidentTypes] = useState([]); // Chỉ dùng cho dropdown trong form báo cáo
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const navigate = useNavigate();

  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: '',
    district: '',
    ward: '',
    role: 'USER',
    enabled: true,
  });

  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    incidentTypeId: '',
    severity: 'LOW',
    status: 'PENDING',
    latitude: null,
    longitude: null,
    city: '',
    district: '',
    ward: '',
    displayAddress: '',
    incidentTime: new Date().toISOString().slice(0, 16),
  });
  const [mapCenter, setMapCenter] = useState([16.0583, 108.2772]);
  const [mapZoom, setMapZoom] = useState(6);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [commentAction, setCommentAction] = useState(null); // 'approve', 'reject', 'resolve'
  const [commentReportId, setCommentReportId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchData();
    fetchIncidentTypes();
  }, []);

  const fetchIncidentTypes = async () => {
    try {
      const response = await incidentTypeAPI.getAll();
      setIncidentTypes(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching incident types:', error);
      setIncidentTypes([]);
    }
  };

  const fetchData = async () => {
    try {
      console.log('Fetching admin data...');
      const [reportsRes, usersRes, statsRes] = await Promise.all([
        adminAPI.getAllReports ? adminAPI.getAllReports() : reportAPI.getAll(),
        adminAPI.getAllUsers(),
        adminAPI.getStats(),
      ]);
      console.log('Fetched data:', {
        reports: reportsRes.data?.length || 0,
        users: usersRes.data?.length || 0,
        stats: statsRes.data,
      });
      console.log('Raw users response:', usersRes);
      console.log('Users data type:', typeof usersRes.data);
      console.log('Is array?', Array.isArray(usersRes.data));
      console.log('Users data:', usersRes.data);
      setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setStats(statsRes.data || null);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      console.error('Error response:', error.response);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert('Bạn không có quyền truy cập. Vui lòng đăng nhập lại với tài khoản admin.');
        navigate('/login');
      } else {
        alert('Lỗi khi tải dữ liệu: ' + (error.response?.data?.message || error.message || 'Đã xảy ra lỗi'));
      }
      // Set empty arrays on error to prevent map errors
      setReports([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setCommentAction('approve');
    setCommentReportId(id);
    setCommentText('');
    setShowCommentModal(true);
  };

  const handleReject = async (id) => {
    setCommentAction('reject');
    setCommentReportId(id);
    setCommentText('');
    setShowCommentModal(true);
  };

  const handleResolve = async (id) => {
    setCommentAction('resolve');
    setCommentReportId(id);
    setCommentText('');
    setShowCommentModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (commentAction === 'approve') {
        await adminAPI.approveReport(commentReportId, commentText);
      } else if (commentAction === 'reject') {
        await adminAPI.rejectReport(commentReportId, commentText);
      } else if (commentAction === 'resolve') {
        await adminAPI.resolveReport(commentReportId, commentText);
      }
      setShowCommentModal(false);
      setCommentText('');
      setCommentAction(null);
      setCommentReportId(null);
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleHideReport = async (id) => {
    try {
      await adminAPI.hideReport(id);
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleUnhideReport = async (id) => {
    try {
      await adminAPI.unhideReport(id);
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleToggleUser = async (id) => {
    try {
      await adminAPI.toggleUserStatus(id);
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleChangeUserRole = async (id, role) => {
    try {
      await adminAPI.updateUserRole(id, role);
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };


  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      console.log('Saving user:', userForm);
      if (editingUser) {
        await adminAPI.updateUser(editingUser.id, userForm);
      } else {
        await adminAPI.createUser(userForm);
      }
      setShowUserForm(false);
      setEditingUser(null);
      setUserForm({ username: '', email: '', password: '', fullName: '', phone: '', address: '', district: '', ward: '', role: 'USER', enabled: true });
      fetchData();
    } catch (error) {
      console.error('Error saving user:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi';
      alert('Lỗi: ' + errorMessage);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await adminAPI.deleteUser(id);
        fetchData();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username || '',
      email: user.email || '',
      password: '', // Don't show password
      fullName: user.fullName || '',
      phone: user.phone || '',
      address: user.address || '',
      district: user.district || '',
      ward: user.ward || '',
      role: user.role || 'USER',
      enabled: user.enabled !== undefined ? user.enabled : true,
    });
    setShowUserForm(true);
  };

  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!reportForm.latitude || !reportForm.longitude) {
      alert('Vui lòng chọn vị trí trên bản đồ');
      return;
    }
    try {
      const reportData = {
        title: reportForm.title,
        description: reportForm.description,
        incidentTypeId: parseInt(reportForm.incidentTypeId),
        severity: reportForm.severity,
        status: reportForm.status,
        latitude: reportForm.latitude,
        longitude: reportForm.longitude,
        city: reportForm.city,
        district: reportForm.district,
        ward: reportForm.ward,
        incidentTime: reportForm.incidentTime,
      };
      await reportAPI.updateReport(editingReport.id, reportData);
      setShowReportForm(false);
      setEditingReport(null);
      setReportForm({ 
        title: '', 
        description: '', 
        incidentTypeId: '', 
        severity: 'LOW', 
        status: 'PENDING', 
        latitude: null, 
        longitude: null, 
        city: '', 
        district: '', 
        ward: '', 
        displayAddress: '',
        incidentTime: new Date().toISOString().slice(0, 16) 
      });
      setMapCenter([16.0583, 108.2772]);
      setMapZoom(6);
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa báo cáo này?')) {
      try {
        await reportAPI.deleteReport(id);
        fetchData();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
      }
    }
  };

  const reverseGeocode = async (lat, lng) => {
    if (!lat || !lng) return;
    setLoadingAddress(true);
    try {
      const response = await locationAPI.getLocationFromCoordinates(lat, lng);
      if (response.data) {
        const { city, district, ward } = response.data;
        setReportForm(prev => ({
          ...prev,
          city: city || '',
          district: district || '',
          ward: ward || '',
          displayAddress: [ward, district, city].filter(Boolean).join(', ') || '',
        }));
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleMapClick = async (latlng) => {
    const lat = latlng.lat;
    const lng = latlng.lng;
    setReportForm(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    setMapCenter([lat, lng]);
    setMapZoom(15);
    await reverseGeocode(lat, lng);
  };

  const handleLatitudeChange = async (e) => {
    const lat = parseFloat(e.target.value);
    if (!isNaN(lat)) {
      setReportForm(prev => {
        const newForm = { ...prev, latitude: lat };
        if (prev.longitude) {
          setMapCenter([lat, prev.longitude]);
          reverseGeocode(lat, prev.longitude);
        }
        return newForm;
      });
    } else {
      setReportForm(prev => ({ ...prev, latitude: null }));
    }
  };

  const handleLongitudeChange = async (e) => {
    const lng = parseFloat(e.target.value);
    if (!isNaN(lng)) {
      setReportForm(prev => {
        const newForm = { ...prev, longitude: lng };
        if (prev.latitude) {
          setMapCenter([prev.latitude, lng]);
          reverseGeocode(prev.latitude, lng);
        }
        return newForm;
      });
    } else {
      setReportForm(prev => ({ ...prev, longitude: null }));
    }
  };

  const handleEditReport = (report) => {
    setEditingReport(report);
    setReportForm({
      title: report.title || '',
      description: report.description || '',
      incidentTypeId: report.incidentTypeId || '',
      severity: report.severity || 'LOW',
      status: report.status || 'PENDING',
      latitude: report.latitude || null,
      longitude: report.longitude || null,
      city: report.city || '',
      district: report.district || '',
      ward: report.ward || '',
      displayAddress: [report.ward, report.district, report.city].filter(Boolean).join(', ') || '',
      incidentTime: report.incidentTime ? new Date(report.incidentTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    });
    if (report.latitude && report.longitude) {
      setMapCenter([report.latitude, report.longitude]);
      setMapZoom(15);
    }
    setShowReportForm(true);
  };

  const exportData = (type) => {
    let data, filename;
    switch (type) {
      case 'reports':
        data = reports;
        filename = 'reports.json';
        break;
      case 'users':
        data = users;
        filename = 'users.json';
        break;
      default:
        return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="admin-page">
        <div className="spinner"></div>
      </div>
    );
  }

  const pendingReports = reports.filter((r) => r.status === 'PENDING');
  const totalReports = reports.length;

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>
            <FiShield /> Trang Quản trị
          </h1>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <FiBarChart2 /> Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <FiAlertCircle /> Báo cáo ({totalReports})
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FiUsers /> Người dùng
          </button>
        </div>

        {activeTab === 'dashboard' && stats && (
          <div className="admin-content">
            <div className="stats-grid grid grid-4">
              <div className="stat-card card card-navy fade-in">
                <div className="stat-icon"><FiUsers /></div>
                <div className="stat-content">
                  <div className="stat-label">Tổng người dùng</div>
                  <div className="stat-value">{stats.totalUsers}</div>
                </div>
              </div>
              <div className="stat-card card card-navy fade-in">
                <div className="stat-icon"><FiAlertCircle /></div>
                <div className="stat-content">
                  <div className="stat-label">Tổng báo cáo</div>
                  <div className="stat-value">{stats.totalReports}</div>
                </div>
              </div>
              <div className="stat-card card card-navy fade-in">
                <div className="stat-icon"><FiAlertCircle /></div>
                <div className="stat-content">
                  <div className="stat-label">Chờ duyệt</div>
                  <div className="stat-value">{stats.pendingReports}</div>
                </div>
              </div>
              <div className="stat-card card card-navy fade-in">
                <div className="stat-icon"><FiShield /></div>
                <div className="stat-content">
                  <div className="stat-label">Cảnh báo hoạt động</div>
                  <div className="stat-value">{stats.activeAlerts}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>Quản lý Báo cáo</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="input"
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="ALL">Tất cả mức độ</option>
                  <option value="LOW">Thấp</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HIGH">Cao</option>
                  <option value="CRITICAL">Nghiêm trọng</option>
                </select>
                <button className="btn btn-secondary" onClick={() => exportData('reports')}>
                  <FiDownload /> Xuất dữ liệu
                </button>
              </div>
            </div>
            <div className="reports-table">
              {reports.filter(r => severityFilter === 'ALL' || r.severity === severityFilter).length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  <p>Chưa có báo cáo nào.</p>
                </div>
              ) : (
                reports.filter(r => severityFilter === 'ALL' || r.severity === severityFilter).map((report) => (
                <div key={report.id} className="admin-report-card card card-navy fade-in">
                  <div className="report-info">
                    <h3>{report.title}</h3>
                    <p>{report.description}</p>
                    <div className="report-meta">
                      <span>Loại: {report.incidentTypeName}</span>
                      <span>Mức độ: {report.severity}</span>
                      <span>Địa điểm: {report.district || 'N/A'}</span>
                      <span>Người báo: {report.username}</span>
                      <span>Thời gian: {new Date(report.createdAt).toLocaleString('vi-VN')}</span>
                    </div>
                    <div className={`report-status status-${report.status.toLowerCase()}`}>
                      {report.status}
                    </div>
                  </div>
                  <div className="report-actions">
                    {report.hidden ? (
                      <button className="btn-icon" onClick={() => handleUnhideReport(report.id)} title="Hiện báo cáo">
                        <FiEyeOff />
                      </button>
                    ) : (
                      <button className="btn-icon" onClick={() => handleHideReport(report.id)} title="Ẩn báo cáo">
                        <FiEye />
                      </button>
                    )}
                    <button className="btn-icon btn-danger" onClick={() => handleDeleteReport(report.id)} title="Xóa">
                      <FiTrash2 />
                    </button>
                    {report.status === 'PENDING' && (
                      <>
                        <button className="btn btn-approve" onClick={() => handleApprove(report.id)}>
                          <FiCheck /> Duyệt
                        </button>
                        <button className="btn btn-reject" onClick={() => handleReject(report.id)}>
                          <FiX /> Từ chối
                        </button>
                      </>
                    )}
                    {report.status === 'APPROVED' && (
                      <button className="btn btn-resolve" onClick={() => handleResolve(report.id)}>
                        <FiCheckCircle /> Đánh dấu đã xử lý
                      </button>
                    )}
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>Quản lý Người dùng</h2>
              <div>
                <button className="btn btn-primary" onClick={() => {
                  setEditingUser(null);
                  setUserForm({ username: '', email: '', password: '', fullName: '', phone: '', address: '', district: '', ward: '', role: 'USER', enabled: true });
                  setShowUserForm(true);
                }}>
                  <FiPlus /> Tạo người dùng
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('users')}>
                  <FiDownload /> Xuất dữ liệu
                </button>
              </div>
            </div>
            <div className="users-table">
              {users.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  <p>Chưa có người dùng nào. Hãy tạo người dùng mới.</p>
                </div>
              ) : (
                users.map((user) => (
                <div key={user.id} className="user-card card card-navy fade-in">
                  <div className="user-info">
                    <h3>{user.username}</h3>
                    <p>{user.email}</p>
                    <div className="user-meta">
                      <span>Họ tên: {user.fullName || 'N/A'}</span>
                      <span>Địa chỉ: {user.address || 'N/A'}</span>
                      <span>Quận: {user.district || 'N/A'}</span>
                      <span>Đăng ký: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                    <div className="user-actions">
                      <div className={`user-role role-${user.role.toLowerCase()}`}>
                        {user.role}
                      </div>
                      <button className="btn-icon" onClick={() => handleEditUser(user)} title="Chỉnh sửa">
                        <FiEdit />
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => handleDeleteUser(user.id)} title="Xóa">
                        <FiTrash2 />
                      </button>
                      <select
                        className="role-select"
                        value={user.role}
                        onChange={(e) => handleChangeUserRole(user.id, e.target.value)}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                      <button
                        className={`btn-toggle ${user.enabled ? 'enabled' : 'disabled'}`}
                        onClick={() => handleToggleUser(user.id)}
                        title={user.enabled ? 'Vô hiệu hóa' : 'Kích hoạt'}
                      >
                        {user.enabled ? <FiToggleRight /> : <FiToggleLeft />}
                      </button>
                    </div>
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {showUserForm && (
          <div className="modal-overlay" onClick={() => {
            setShowUserForm(false);
            setEditingUser(null);
          }}>
            <div className="modal-content card card-navy" onClick={(e) => e.stopPropagation()}>
              <h2>{editingUser ? 'Chỉnh sửa Người dùng' : 'Tạo Người dùng mới'}</h2>
              <form onSubmit={handleSaveUser}>
                <label className="form-label">Username <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  required
                  className="input"
                />
                <label className="form-label">Email <span className="required">*</span></label>
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                  className="input"
                />
                <label className="form-label">
                  Mật khẩu {!editingUser && <span className="required">*</span>}
                  {editingUser && <span style={{fontSize: '12px', fontWeight: 'normal', color: '#666'}}> (để trống nếu không đổi)</span>}
                </label>
                <input
                  type="password"
                  placeholder={editingUser ? "Nhập mật khẩu mới (để trống nếu không đổi)" : "Nhập mật khẩu"}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  required={!editingUser}
                  className="input"
                />
                <label className="form-label">Họ tên</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={userForm.fullName}
                  onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                  className="input"
                />
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="input"
                />
                <label className="form-label">Địa chỉ</label>
                <input
                  type="text"
                  placeholder="Nhập địa chỉ"
                  value={userForm.address}
                  onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                  className="input"
                />
                <label className="form-label">Quận/Huyện</label>
                <input
                  type="text"
                  placeholder="Nhập quận/huyện"
                  value={userForm.district}
                  onChange={(e) => setUserForm({ ...userForm, district: e.target.value })}
                  className="input"
                />
                <label className="form-label">Phường/Xã</label>
                <input
                  type="text"
                  placeholder="Nhập phường/xã"
                  value={userForm.ward}
                  onChange={(e) => setUserForm({ ...userForm, ward: e.target.value })}
                  className="input"
                />
                <label className="form-label">Vai trò</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                  className="input"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={userForm.enabled}
                    onChange={(e) => setUserForm({ ...userForm, enabled: e.target.checked })}
                  />
                  Kích hoạt tài khoản
                </label>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Lưu</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowUserForm(false);
                    setEditingUser(null);
                  }}>Hủy</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCommentModal && (
          <div className="modal-overlay" onClick={() => {
            setShowCommentModal(false);
            setCommentText('');
            setCommentAction(null);
            setCommentReportId(null);
          }}>
            <div className="modal-content card card-navy" onClick={(e) => e.stopPropagation()}>
              <h2>
                {commentAction === 'approve' && 'Duyệt báo cáo'}
                {commentAction === 'reject' && 'Từ chối báo cáo'}
                {commentAction === 'resolve' && 'Đánh dấu đã xử lý'}
              </h2>
              <label className="form-label">Ghi chú (tùy chọn)</label>
              <textarea
                placeholder="Nhập ghi chú..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="input"
                rows="4"
              />
              <div className="form-actions" style={{ marginTop: '20px' }}>
                <button type="button" className="btn btn-primary" onClick={handleConfirmAction}>
                  Xác nhận
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowCommentModal(false);
                  setCommentText('');
                  setCommentAction(null);
                  setCommentReportId(null);
                }}>
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {showReportForm && editingReport && (
          <div className="modal-overlay" onClick={() => {
            setShowReportForm(false);
            setEditingReport(null);
          }}>
            <div className="modal-content card card-navy" onClick={(e) => e.stopPropagation()}>
              <h2>Chỉnh sửa Báo cáo</h2>
              <form onSubmit={handleSaveReport}>
                <label className="form-label">Tiêu đề <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề báo cáo"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  required
                  className="input"
                />
                <label className="form-label">Mô tả <span className="required">*</span></label>
                <textarea
                  placeholder="Mô tả chi tiết về sự cố"
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  required
                  className="input"
                  rows="4"
                />
                <label className="form-label">Loại sự cố <span className="required">*</span></label>
                <select
                  value={reportForm.incidentTypeId}
                  onChange={(e) => setReportForm({ ...reportForm, incidentTypeId: e.target.value })}
                  required
                  className="input"
                >
                  <option value="">-- Chọn loại sự cố --</option>
                  {incidentTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.icon || '⚠️'} {type.name}</option>
                  ))}
                </select>
                <label className="form-label">Mức độ</label>
                <select
                  value={reportForm.severity}
                  onChange={(e) => setReportForm({ ...reportForm, severity: e.target.value })}
                  className="input"
                >
                  <option value="LOW">Thấp</option>
                  <option value="MEDIUM">Trung bình</option>
                  <option value="HIGH">Cao</option>
                  <option value="CRITICAL">Nghiêm trọng</option>
                </select>
                <label className="form-label">Trạng thái</label>
                <select
                  value={reportForm.status}
                  onChange={(e) => setReportForm({ ...reportForm, status: e.target.value })}
                  className="input"
                >
                  <option value="PENDING">Chờ duyệt</option>
                  <option value="APPROVED">Đã duyệt</option>
                  <option value="REJECTED">Từ chối</option>
                  <option value="RESOLVED">Đã xử lý</option>
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
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  height: '320px',
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
                    {reportForm.latitude && reportForm.longitude && (
                      <Marker position={[reportForm.latitude, reportForm.longitude]} />
                    )}
                  </MapContainer>
                </div>

                {/* Hiển thị địa chỉ từ reverse geocoding */}
                {reportForm.latitude && reportForm.longitude && (
                  <div style={{ 
                    padding: '12px', 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: '8px', 
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
                          {reportForm.displayAddress || 'Chưa có địa chỉ'}
                        </p>
                        <p style={{ margin: '6px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                          Tọa độ: {reportForm.latitude.toFixed(6)}, {reportForm.longitude.toFixed(6)}
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
                    value={reportForm.latitude || ''}
                    onChange={handleLatitudeChange}
                    className="input"
                    style={{ fontSize: '14px' }}
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Kinh độ (Longitude)"
                    value={reportForm.longitude || ''}
                    onChange={handleLongitudeChange}
                    className="input"
                    style={{ fontSize: '14px' }}
                  />
                </div>
                <label className="form-label">Thời gian sự cố</label>
                <input
                  type="datetime-local"
                  value={reportForm.incidentTime}
                  onChange={(e) => setReportForm({ ...reportForm, incidentTime: e.target.value })}
                  className="input"
                />
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Lưu</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowReportForm(false);
                    setEditingReport(null);
                  }}>Hủy</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;