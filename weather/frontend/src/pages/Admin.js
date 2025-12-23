import React, { useState, useEffect } from 'react';
import { adminAPI, reportAPI, incidentTypeAPI, locationAPI } from '../utils/api';
import { isAdmin } from '../utils/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  FiCheck, FiX, FiCheckCircle, FiShield, FiUsers, FiAlertCircle, 
  FiSettings, FiBarChart2, FiEdit, FiTrash2, FiPlus, FiDownload,
  FiToggleLeft, FiToggleRight, FiActivity, FiMapPin, FiEye, FiEyeOff,
  FiTrendingUp, FiTrendingDown, FiArrowUp, FiArrowDown, FiFilter, FiSliders
} from 'react-icons/fi';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports'); // Đổi default từ 'dashboard' sang 'reports'
  const [showIncidentTypeForm, setShowIncidentTypeForm] = useState(false);
  const [editingIncidentType, setEditingIncidentType] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingReport, setEditingReport] = useState(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [incidentTypeFilter, setIncidentTypeFilter] = useState('ALL');
  const [reportSortBy, setReportSortBy] = useState('createdAt');
  const [reportSortOrder, setReportSortOrder] = useState('desc');
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [userEnabledFilter, setUserEnabledFilter] = useState('ALL');
  const [userSortBy, setUserSortBy] = useState('createdAt');
  const [userSortOrder, setUserSortOrder] = useState('desc');

  const [incidentTypeForm, setIncidentTypeForm] = useState({
    name: '',
    description: '',
    icon: '',
  });

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
      return;
    }
    
    // Check URL params for tab
    const tabParam = searchParams.get('tab');
    if (tabParam && ['reports', 'users', 'incident-types'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    fetchData();
    fetchIncidentTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchIncidentTypes = async () => {
    try {
      console.log('Fetching incident types...');
      const response = await adminAPI.getIncidentTypes();
      console.log('Incident types response:', response);
      console.log('Incident types data:', response.data);
      console.log('Is array?', Array.isArray(response.data));
      
      if (Array.isArray(response.data)) {
        console.log('Setting incident types:', response.data.length, 'types');
        setIncidentTypes(response.data);
      } else {
        console.error('Response is not an array:', response.data);
        setIncidentTypes([]);
      }
    } catch (error) {
      console.error('Error fetching incident types:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      alert('Lỗi khi tải loại sự cố: ' + (error.response?.data?.message || error.message || 'Đã xảy ra lỗi'));
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
    if (window.confirm('Bạn có chắc chắn muốn duyệt báo cáo này?')) {
      try {
        await adminAPI.approveReport(id);
        fetchData();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
      }
    }
  };

  const handleReject = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn từ chối báo cáo này?')) {
      try {
        await adminAPI.rejectReport(id);
        fetchData();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
      }
    }
  };

  const handleResolve = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn đánh dấu báo cáo này đã được xử lý?')) {
      try {
        await adminAPI.resolveReport(id);
        fetchData();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Đã xảy ra lỗi'));
      }
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

  // Incident Type Handlers
  const handleSaveIncidentType = async (e) => {
    e.preventDefault();
    try {
      if (editingIncidentType) {
        await adminAPI.updateIncidentType(editingIncidentType.id, incidentTypeForm);
      } else {
        await adminAPI.createIncidentType(incidentTypeForm);
      }
      setShowIncidentTypeForm(false);
      setEditingIncidentType(null);
      setIncidentTypeForm({ name: '', description: '', icon: '' });
      fetchIncidentTypes();
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || error.message || 'Đã xảy ra lỗi'));
    }
  };

  const handleDeleteIncidentType = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa loại sự cố này?')) {
      try {
        await adminAPI.deleteIncidentType(id);
        fetchIncidentTypes();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || error.message || 'Đã xảy ra lỗi'));
      }
    }
  };

  const handleEditIncidentType = (type) => {
    setEditingIncidentType(type);
    setIncidentTypeForm({
      name: type.name || '',
      description: type.description || '',
      icon: type.icon || '',
    });
    setShowIncidentTypeForm(true);
  };

  // Filter and Sort Functions
  const getFilteredAndSortedReports = () => {
    let filtered = [...reports];
    
    // Filter by severity
    if (severityFilter !== 'ALL') {
      filtered = filtered.filter(r => r.severity === severityFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }
    
    // Filter by incident type
    if (incidentTypeFilter !== 'ALL') {
      filtered = filtered.filter(r => r.incidentTypeId === parseInt(incidentTypeFilter));
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (reportSortBy) {
        case 'createdAt':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'priorityScore':
          aVal = a.priorityScore || 0;
          bVal = b.priorityScore || 0;
          break;
        case 'severity':
          const severityOrder = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'CRITICAL': 4 };
          aVal = severityOrder[a.severity] || 0;
          bVal = severityOrder[b.severity] || 0;
          break;
        case 'title':
          aVal = (a.title || '').toLowerCase();
          bVal = (b.title || '').toLowerCase();
          break;
        case 'confirmCount':
          aVal = a.confirmCount || 0;
          bVal = b.confirmCount || 0;
          break;
        default:
          aVal = 0;
          bVal = 0;
      }
      
      if (reportSortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
    
    return filtered;
  };

  const getFilteredAndSortedUsers = () => {
    let filtered = [...users];
    
    // Filter by role
    if (userRoleFilter !== 'ALL') {
      filtered = filtered.filter(u => u.role === userRoleFilter);
    }
    
    // Filter by enabled
    if (userEnabledFilter !== 'ALL') {
      filtered = filtered.filter(u => {
        if (userEnabledFilter === 'ENABLED') return u.enabled === true;
        if (userEnabledFilter === 'DISABLED') return u.enabled === false;
        return true;
      });
    }
    
    // Sort
    filtered.sort((a, b) => {
      let aVal, bVal;
      switch (userSortBy) {
        case 'createdAt':
          aVal = new Date(a.createdAt || 0).getTime();
          bVal = new Date(b.createdAt || 0).getTime();
          break;
        case 'username':
          aVal = (a.username || '').toLowerCase();
          bVal = (b.username || '').toLowerCase();
          break;
        case 'email':
          aVal = (a.email || '').toLowerCase();
          bVal = (b.email || '').toLowerCase();
          break;
        case 'role':
          aVal = a.role === 'ADMIN' ? 1 : 0;
          bVal = b.role === 'ADMIN' ? 1 : 0;
          break;
        default:
          aVal = 0;
          bVal = 0;
      }
      
      if (userSortOrder === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
    
    return filtered;
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
          <button
            className={`tab-button ${activeTab === 'incident-types' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('incident-types');
              fetchIncidentTypes();
            }}
          >
            <FiSettings /> Loại sự cố ({incidentTypes.length})
          </button>
        </div>

        {activeTab === 'incident-types' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>Quản lý Loại sự cố</h2>
              <div>
                <button className="btn btn-primary" onClick={() => {
                  setEditingIncidentType(null);
                  setIncidentTypeForm({ name: '', description: '', icon: '' });
                  setShowIncidentTypeForm(true);
                }}>
                  <FiPlus /> Tạo loại sự cố
                </button>
              </div>
            </div>
            <div className="incidents-grid grid grid-3">
              {incidentTypes.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#888', gridColumn: '1 / -1' }}>
                  <p>Chưa có loại sự cố nào. Hãy tạo loại sự cố mới.</p>
                </div>
              ) : (
                incidentTypes.map((type) => (
                  <div key={type.id} className="incident-card card card-navy fade-in">
                    <div className="incident-header">
                      <div className="incident-icon" style={{ fontSize: '48px' }}>
                        {type.icon || '⚠️'}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-icon" onClick={() => handleEditIncidentType(type)} title="Chỉnh sửa">
                          <FiEdit />
                        </button>
                        <button className="btn-icon btn-danger" onClick={() => handleDeleteIncidentType(type.id)} title="Xóa">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <h3>{type.name}</h3>
                    <p>{type.description || 'Không có mô tả'}</p>
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                      ID: {type.id}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="admin-content">
            <div className="section-header">
              <h2>Quản lý Báo cáo</h2>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="filter-group">
                  <FiFilter style={{ marginRight: '5px', color: '#666' }} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="input filter-select"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="REJECTED">Đã từ chối</option>
                    <option value="RESOLVED">Đã xử lý</option>
                  </select>
                </div>
                <div className="filter-group">
                  <select
                    value={severityFilter}
                    onChange={(e) => setSeverityFilter(e.target.value)}
                    className="input filter-select"
                  >
                    <option value="ALL">Tất cả mức độ</option>
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HIGH">Cao</option>
                    <option value="CRITICAL">Nghiêm trọng</option>
                  </select>
                </div>
                <div className="filter-group">
                  <select
                    value={incidentTypeFilter}
                    onChange={(e) => setIncidentTypeFilter(e.target.value)}
                    className="input filter-select"
                  >
                    <option value="ALL">Tất cả loại sự cố</option>
                    {incidentTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.icon || '⚠️'} {type.name}</option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <FiSliders style={{ marginRight: '5px', color: '#666' }} />
                  <select
                    value={reportSortBy}
                    onChange={(e) => setReportSortBy(e.target.value)}
                    className="input filter-select"
                  >
                    <option value="createdAt">Thời gian tạo</option>
                    <option value="priorityScore">Điểm ưu tiên</option>
                    <option value="severity">Mức độ</option>
                    <option value="title">Tiêu đề</option>
                    <option value="confirmCount">Số xác nhận</option>
                  </select>
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setReportSortOrder(reportSortOrder === 'asc' ? 'desc' : 'asc')}
                  title={reportSortOrder === 'asc' ? 'Sắp xếp tăng dần' : 'Sắp xếp giảm dần'}
                >
                  {reportSortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                </button>
                <button className="btn btn-secondary" onClick={() => exportData('reports')}>
                  <FiDownload /> Xuất dữ liệu
                </button>
              </div>
            </div>
            <div className="reports-table">
              {getFilteredAndSortedReports().length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  <p>Chưa có báo cáo nào.</p>
                </div>
              ) : (
                getFilteredAndSortedReports().map((report) => (
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
                    {/* Admin Suggestion */}
                    {report.priorityScore !== undefined && report.suggestedStatus && (
                      <div className="admin-suggestion" style={{
                        marginTop: '12px',
                        padding: '12px',
                        borderRadius: '8px',
                        background: report.suggestedStatus === 'APPROVE' 
                          ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)'
                          : report.suggestedStatus === 'REVIEW'
                          ? 'linear-gradient(135deg, #ffa726 0%, #fb8c00 100%)'
                          : 'linear-gradient(135deg, #ef5350 0%, #e53935 100%)',
                        color: 'white',
                        border: '1px solid rgba(255,255,255,0.2)',
                        fontSize: '13px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <FiActivity />
                          <strong>Hệ thống đề xuất: {report.suggestedStatus === 'APPROVE' ? 'DUYỆT' : report.suggestedStatus === 'REVIEW' ? 'XEM XÉT KỸ' : 'TỪ CHỐI'}</strong>
                        </div>
                        <div style={{ fontSize: '12px', opacity: 0.9 }}>
                          Điểm ưu tiên: {report.priorityScore.toFixed(1)}/100
                          {report.confirmCount > 0 && (
                            <span style={{ marginLeft: '12px' }}>
                              ✓ {report.confirmCount} xác nhận
                            </span>
                          )}
                          {report.rejectCount > 0 && (
                            <span style={{ marginLeft: '12px' }}>
                              ✗ {report.rejectCount} phản đối
                            </span>
                          )}
                        </div>
                      </div>
                    )}
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
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div className="filter-group">
                  <FiFilter style={{ marginRight: '5px', color: '#666' }} />
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="input filter-select"
                  >
                    <option value="ALL">Tất cả vai trò</option>
                    <option value="USER">Người dùng</option>
                    <option value="ADMIN">Quản trị viên</option>
                  </select>
                </div>
                <div className="filter-group">
                  <select
                    value={userEnabledFilter}
                    onChange={(e) => setUserEnabledFilter(e.target.value)}
                    className="input filter-select"
                  >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="ENABLED">Đã kích hoạt</option>
                    <option value="DISABLED">Đã khóa</option>
                  </select>
                </div>
                <div className="filter-group">
                  <FiSliders style={{ marginRight: '5px', color: '#666' }} />
                  <select
                    value={userSortBy}
                    onChange={(e) => setUserSortBy(e.target.value)}
                    className="input filter-select"
                  >
                    <option value="createdAt">Thời gian tạo</option>
                    <option value="username">Tên đăng nhập</option>
                    <option value="email">Email</option>
                    <option value="role">Vai trò</option>
                  </select>
                </div>
                <button 
                  className="btn btn-secondary" 
                  onClick={() => setUserSortOrder(userSortOrder === 'asc' ? 'desc' : 'asc')}
                  title={userSortOrder === 'asc' ? 'Sắp xếp tăng dần' : 'Sắp xếp giảm dần'}
                >
                  {userSortOrder === 'asc' ? <FiArrowUp /> : <FiArrowDown />}
                </button>
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
              {getFilteredAndSortedUsers().length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                  <p>Chưa có người dùng nào. Hãy tạo người dùng mới.</p>
                </div>
              ) : (
                getFilteredAndSortedUsers().map((user) => (
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

        {/* Modal form cho Incident Type */}
        {showIncidentTypeForm && (
          <div className="modal-overlay" onClick={() => {
            setShowIncidentTypeForm(false);
            setEditingIncidentType(null);
          }}>
            <div className="modal-content card card-navy" onClick={(e) => e.stopPropagation()}>
              <h2>{editingIncidentType ? 'Chỉnh sửa Loại sự cố' : 'Tạo Loại sự cố mới'}</h2>
              <form onSubmit={handleSaveIncidentType}>
                <label className="form-label">Tên loại sự cố <span className="required">*</span></label>
                <input
                  type="text"
                  placeholder="Ví dụ: Mưa lớn, Lũ lụt, Bão..."
                  value={incidentTypeForm.name}
                  onChange={(e) => setIncidentTypeForm({ ...incidentTypeForm, name: e.target.value })}
                  required
                  className="input"
                />
                <label className="form-label">Mô tả</label>
                <textarea
                  placeholder="Mô tả chi tiết về loại sự cố này"
                  value={incidentTypeForm.description}
                  onChange={(e) => setIncidentTypeForm({ ...incidentTypeForm, description: e.target.value })}
                  className="input"
                  rows="3"
                />
                <label className="form-label">Icon (Emoji hoặc ký tự)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 🌧️, ⛈️, 🌊..."
                  value={incidentTypeForm.icon}
                  onChange={(e) => setIncidentTypeForm({ ...incidentTypeForm, icon: e.target.value })}
                  className="input"
                />
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Lưu</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowIncidentTypeForm(false);
                    setEditingIncidentType(null);
                    setIncidentTypeForm({ name: '', description: '', icon: '' });
                  }}>
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

export default Admin;