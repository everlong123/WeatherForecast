import React, { useState, useEffect } from 'react';
import { adminAPI, reportAPI } from '../utils/api';
import { isAdmin } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { 
  FiCheck, FiX, FiCheckCircle, FiShield, FiUsers, FiAlertCircle, 
  FiSettings, FiBarChart2, FiEdit, FiTrash2, FiPlus, FiDownload,
  FiToggleLeft, FiToggleRight, FiList, FiActivity
} from 'react-icons/fi';
import './Admin.css';

const Admin = () => {
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [stats, setStats] = useState(null);
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState(null);
  const [editingIncident, setEditingIncident] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const navigate = useNavigate();

  const [alertForm, setAlertForm] = useState({
    title: '',
    message: '',
    level: 'INFO',
    district: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: '',
  });

  const [incidentForm, setIncidentForm] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#001f3f',
  });

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
    address: '',
    district: '',
    ward: '',
    city: '',
    incidentTime: new Date().toISOString().slice(0, 16),
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      console.log('Fetching admin data...');
      const [reportsRes, usersRes, alertsRes, typesRes, statsRes, actionsRes] = await Promise.all([
        reportAPI.getAll(),
        adminAPI.getAllUsers(),
        adminAPI.getAllAlerts(),
        adminAPI.getIncidentTypes(),
        adminAPI.getStats(),
        adminAPI.getActions(),
      ]);
      console.log('Fetched data:', {
        reports: reportsRes.data?.length || 0,
        users: usersRes.data?.length || 0,
        alerts: alertsRes.data?.length || 0,
        types: typesRes.data?.length || 0,
        stats: statsRes.data,
        actions: actionsRes.data?.length || 0,
      });
      setReports(Array.isArray(reportsRes.data) ? reportsRes.data : []);
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setAlerts(Array.isArray(alertsRes.data) ? alertsRes.data : []);
      setIncidentTypes(Array.isArray(typesRes.data) ? typesRes.data : []);
      setStats(statsRes.data || null);
      const actionsData = Array.isArray(actionsRes.data) ? actionsRes.data : [];
      setActions(actionsData.slice(0, 50)); // Last 50 actions
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
      setAlerts([]);
      setIncidentTypes([]);
      setActions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveReport(id);
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectReport(id);
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleResolve = async (id) => {
    try {
      await adminAPI.resolveReport(id);
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

  const handleSaveAlert = async (e) => {
    e.preventDefault();
    try {
      if (editingAlert) {
        await adminAPI.updateAlert(editingAlert.id, alertForm);
      } else {
        await adminAPI.createAlert(alertForm);
      }
      setShowAlertForm(false);
      setEditingAlert(null);
      setAlertForm({ title: '', message: '', level: 'INFO', district: '', startTime: new Date().toISOString().slice(0, 16), endTime: '' });
      fetchData();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleDeleteAlert = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa cảnh báo này?')) {
      try {
        await adminAPI.deleteAlert(id);
        fetchData();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
      }
    }
  };

  const handleSaveIncidentType = async (e) => {
    e.preventDefault();
    try {
      console.log('Saving incident type:', incidentForm);
      if (editingIncident) {
        await adminAPI.updateIncidentType(editingIncident.id, incidentForm);
      } else {
        await adminAPI.createIncidentType(incidentForm);
      }
      setShowIncidentForm(false);
      setEditingIncident(null);
      setIncidentForm({ name: '', description: '', icon: '', color: '#001f3f' });
      fetchData();
    } catch (error) {
      console.error('Error saving incident type:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đã xảy ra lỗi';
      alert('Lỗi: ' + errorMessage);
    }
  };

  const handleDeleteIncidentType = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa loại sự cố này?')) {
      try {
        await adminAPI.deleteIncidentType(id);
        fetchData();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
      }
    }
  };

  const handleEditAlert = (alert) => {
    setEditingAlert(alert);
    setAlertForm({
      title: alert.title,
      message: alert.message,
      level: alert.level,
      district: alert.district || '',
      startTime: alert.startTime ? alert.startTime.slice(0, 16) : new Date().toISOString().slice(0, 16),
      endTime: alert.endTime ? alert.endTime.slice(0, 16) : '',
    });
    setShowAlertForm(true);
  };

  const handleEditIncident = (type) => {
    setEditingIncident(type);
    setIncidentForm({
      name: type.name,
      description: type.description || '',
      icon: type.icon || '',
      color: type.color || '#001f3f',
    });
    setShowIncidentForm(true);
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
    try {
      await reportAPI.updateReport(editingReport.id, reportForm);
      setShowReportForm(false);
      setEditingReport(null);
      setReportForm({ title: '', description: '', incidentTypeId: '', severity: 'LOW', status: 'PENDING', address: '', district: '', ward: '', city: '', incidentTime: new Date().toISOString().slice(0, 16) });
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

  const handleEditReport = (report) => {
    setEditingReport(report);
    setReportForm({
      title: report.title || '',
      description: report.description || '',
      incidentTypeId: report.incidentTypeId || '',
      severity: report.severity || 'LOW',
      status: report.status || 'PENDING',
      address: report.address || '',
      district: report.district || '',
      ward: report.ward || '',
      city: report.city || '',
      incidentTime: report.incidentTime ? new Date(report.incidentTime).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    });
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
      case 'alerts':
        data = alerts;
        filename = 'alerts.json';
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
            <FiAlertCircle /> Báo cáo ({pendingReports.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FiUsers /> Người dùng
          </button>
          <button
            className={`tab-button ${activeTab === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveTab('alerts')}
          >
            <FiAlertCircle /> Cảnh báo
          </button>
          <button
            className={`tab-button ${activeTab === 'incidents' ? 'active' : ''}`}
            onClick={() => setActiveTab('incidents')}
          >
            <FiList /> Loại sự cố
          </button>
          <button
            className={`tab-button ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            <FiActivity /> Lịch sử
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
              <button className="btn btn-secondary" onClick={() => exportData('reports')}>
                <FiDownload /> Xuất dữ liệu
              </button>
            </div>
            <div className="reports-table">
              {reports.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  <p>Chưa có báo cáo nào.</p>
                </div>
              ) : (
                reports.map((report) => (
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
                    <button className="btn-icon" onClick={() => handleEditReport(report)} title="Chỉnh sửa">
                      <FiEdit />
                    </button>
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

        {activeTab === 'alerts' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>Quản lý Cảnh báo</h2>
              <div>
                <button className="btn btn-primary" onClick={() => {
                  setEditingAlert(null);
                  setAlertForm({ title: '', message: '', level: 'INFO', district: '', startTime: new Date().toISOString().slice(0, 16), endTime: '' });
                  setShowAlertForm(true);
                }}>
                  <FiPlus /> Tạo cảnh báo
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('alerts')}>
                  <FiDownload /> Xuất dữ liệu
                </button>
              </div>
            </div>
            <div className="alerts-list">
              {alerts.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  <p>Chưa có cảnh báo nào. Hãy tạo cảnh báo mới.</p>
                </div>
              ) : (
                alerts.map((alert) => (
                <div key={alert.id} className="alert-card card card-navy fade-in">
                  <div className="alert-header">
                    <h3>{alert.title}</h3>
                    <div className="alert-actions">
                      <button className="btn-icon" onClick={() => handleEditAlert(alert)}>
                        <FiEdit />
                      </button>
                      <button className="btn-icon" onClick={() => handleDeleteAlert(alert.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <p>{alert.message}</p>
                  <div className="alert-meta">
                    <span>Mức độ: {alert.level}</span>
                    <span>Khu vực: {alert.district || 'Toàn quốc'}</span>
                    <span>Trạng thái: {alert.active ? 'Hoạt động' : 'Đã tắt'}</span>
                    <span>Bắt đầu: {new Date(alert.startTime).toLocaleString('vi-VN')}</span>
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>Quản lý Loại Sự cố</h2>
              <button className="btn btn-primary" onClick={() => {
                setEditingIncident(null);
                setIncidentForm({ name: '', description: '', icon: '', color: '#001f3f' });
                setShowIncidentForm(true);
              }}>
                <FiPlus /> Thêm loại sự cố
              </button>
            </div>
            <div className="incidents-grid grid grid-3">
              {incidentTypes.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>
                  <p>Chưa có loại sự cố nào. Hãy thêm loại sự cố mới.</p>
                </div>
              ) : (
                incidentTypes.map((type) => (
                <div key={type.id} className="incident-card card card-navy fade-in">
                  <div className="incident-header">
                    <div className="incident-icon" style={{ color: type.color }}>
                      {type.icon || '⚠️'}
                    </div>
                    <div className="incident-actions">
                      <button className="btn-icon" onClick={() => handleEditIncident(type)}>
                        <FiEdit />
                      </button>
                      <button className="btn-icon" onClick={() => handleDeleteIncidentType(type.id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  <h3>{type.name}</h3>
                  <p>{type.description || 'Không có mô tả'}</p>
                  <div className="incident-color" style={{ backgroundColor: type.color }}></div>
                </div>
              )))}
            </div>
          </div>
        )}

        {activeTab === 'actions' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>Lịch sử Hoạt động</h2>
            </div>
            <div className="actions-list">
              {actions.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  <p>Chưa có hoạt động nào.</p>
                </div>
              ) : (
                actions.map((action) => (
                <div key={action.id} className="action-card card card-navy fade-in">
                  <div className="action-header">
                    <span className={`action-type type-${action.actionType.toLowerCase()}`}>
                      {action.actionType}
                    </span>
                    <span className="action-time">
                      {new Date(action.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="action-details">
                    <span>Admin: {action.admin?.username || 'N/A'}</span>
                    <span>Báo cáo: {action.report?.title || 'N/A'}</span>
                    {action.comment && <p>Ghi chú: {action.comment}</p>}
                  </div>
                </div>
              )))}
            </div>
          </div>
        )}

        {showAlertForm && (
          <div className="modal-overlay" onClick={() => {
            setShowAlertForm(false);
            setEditingAlert(null);
          }}>
            <div className="modal-content card card-navy" onClick={(e) => e.stopPropagation()}>
              <h2>{editingAlert ? 'Chỉnh sửa Cảnh báo' : 'Tạo Cảnh báo mới'}</h2>
              <form onSubmit={handleSaveAlert}>
                <input
                  type="text"
                  placeholder="Tiêu đề"
                  value={alertForm.title}
                  onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                  required
                  className="input"
                />
                <textarea
                  placeholder="Nội dung"
                  value={alertForm.message}
                  onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                  required
                  className="input"
                  rows="4"
                />
                <select
                  value={alertForm.level}
                  onChange={(e) => setAlertForm({ ...alertForm, level: e.target.value })}
                  className="input"
                >
                  <option value="INFO">Thông tin</option>
                  <option value="WARNING">Cảnh báo</option>
                  <option value="DANGER">Nguy hiểm</option>
                  <option value="CRITICAL">Nghiêm trọng</option>
                </select>
                <input
                  type="text"
                  placeholder="Quận/Huyện (tùy chọn)"
                  value={alertForm.district}
                  onChange={(e) => setAlertForm({ ...alertForm, district: e.target.value })}
                  className="input"
                />
                <input
                  type="datetime-local"
                  value={alertForm.startTime}
                  onChange={(e) => setAlertForm({ ...alertForm, startTime: e.target.value })}
                  required
                  className="input"
                />
                <input
                  type="datetime-local"
                  placeholder="Thời gian kết thúc (tùy chọn)"
                  value={alertForm.endTime}
                  onChange={(e) => setAlertForm({ ...alertForm, endTime: e.target.value })}
                  className="input"
                />
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Lưu</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowAlertForm(false);
                    setEditingAlert(null);
                  }}>Hủy</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showIncidentForm && (
          <div className="modal-overlay" onClick={() => {
            setShowIncidentForm(false);
            setEditingIncident(null);
          }}>
            <div className="modal-content card card-navy" onClick={(e) => e.stopPropagation()}>
              <h2>{editingIncident ? 'Chỉnh sửa Loại Sự cố' : 'Thêm Loại Sự cố mới'}</h2>
              <form onSubmit={handleSaveIncidentType}>
                <input
                  type="text"
                  placeholder="Tên loại sự cố"
                  value={incidentForm.name}
                  onChange={(e) => setIncidentForm({ ...incidentForm, name: e.target.value })}
                  required
                  className="input"
                />
                <textarea
                  placeholder="Mô tả"
                  value={incidentForm.description}
                  onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                  className="input"
                  rows="3"
                />
                <input
                  type="text"
                  placeholder="Icon (emoji hoặc text)"
                  value={incidentForm.icon}
                  onChange={(e) => setIncidentForm({ ...incidentForm, icon: e.target.value })}
                  className="input"
                />
                <input
                  type="color"
                  value={incidentForm.color}
                  onChange={(e) => setIncidentForm({ ...incidentForm, color: e.target.value })}
                  className="input"
                />
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Lưu</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowIncidentForm(false);
                    setEditingIncident(null);
                  }}>Hủy</button>
                </div>
              </form>
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
                <input
                  type="text"
                  placeholder="Username *"
                  value={userForm.username}
                  onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                  required
                  className="input"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  required
                  className="input"
                />
                <input
                  type="password"
                  placeholder={editingUser ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu *"}
                  value={userForm.password}
                  onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                  required={!editingUser}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Họ tên"
                  value={userForm.fullName}
                  onChange={(e) => setUserForm({ ...userForm, fullName: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Số điện thoại"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={userForm.address}
                  onChange={(e) => setUserForm({ ...userForm, address: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Quận/Huyện"
                  value={userForm.district}
                  onChange={(e) => setUserForm({ ...userForm, district: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Phường/Xã"
                  value={userForm.ward}
                  onChange={(e) => setUserForm({ ...userForm, ward: e.target.value })}
                  className="input"
                />
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

        {showReportForm && editingReport && (
          <div className="modal-overlay" onClick={() => {
            setShowReportForm(false);
            setEditingReport(null);
          }}>
            <div className="modal-content card card-navy" onClick={(e) => e.stopPropagation()}>
              <h2>Chỉnh sửa Báo cáo</h2>
              <form onSubmit={handleSaveReport}>
                <input
                  type="text"
                  placeholder="Tiêu đề *"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  required
                  className="input"
                />
                <textarea
                  placeholder="Mô tả *"
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  required
                  className="input"
                  rows="4"
                />
                <select
                  value={reportForm.incidentTypeId}
                  onChange={(e) => setReportForm({ ...reportForm, incidentTypeId: e.target.value })}
                  required
                  className="input"
                >
                  <option value="">Chọn loại sự cố *</option>
                  {incidentTypes.map((type) => (
                    <option key={type.id} value={type.id}>{type.icon || '⚠️'} {type.name}</option>
                  ))}
                </select>
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
                <input
                  type="text"
                  placeholder="Địa chỉ"
                  value={reportForm.address}
                  onChange={(e) => setReportForm({ ...reportForm, address: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Quận/Huyện"
                  value={reportForm.district}
                  onChange={(e) => setReportForm({ ...reportForm, district: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Phường/Xã"
                  value={reportForm.ward}
                  onChange={(e) => setReportForm({ ...reportForm, ward: e.target.value })}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Tỉnh/Thành phố"
                  value={reportForm.city}
                  onChange={(e) => setReportForm({ ...reportForm, city: e.target.value })}
                  className="input"
                />
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
