import React, { useState, useEffect } from 'react';
import { dashboardAPI, reportAPI } from '../utils/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiUsers, FiAlertCircle, FiCheckCircle, FiClock, FiXCircle, FiActivity, FiMapPin, FiCloud, FiFilter, FiX } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [allReports, setAllReports] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [timeFilter, setTimeFilter] = useState('all'); // '7days', '30days', '90days', 'all'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'APPROVED', 'PENDING', 'REJECTED', 'RESOLVED'
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchAllReports();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllReports = async () => {
    try {
      // Lấy tất cả reports để filter
      let allReportsData = [];
      let page = 0;
      const pageSize = 100;
      
      while (true) {
        const response = await reportAPI.getAll(page, pageSize);
        if (response.data && response.data.content) {
          allReportsData.push(...response.data.content);
          if (response.data.last) break;
          page++;
        } else if (Array.isArray(response.data)) {
          allReportsData.push(...response.data);
          break;
        } else {
          break;
        }
      }
      
      setAllReports(allReportsData);
    } catch (error) {
      console.error('Error fetching all reports:', error);
    }
  };

  const COLORS = ['#4A90E2', '#7B9ACC', '#FF6B6B', '#FFA07A', '#FFD93D', '#95E1D3', '#A8E6CF', '#FFD3A5', '#FD9853', '#A8A8A8'];

  // Filter reports based on filters
  const getFilteredReports = () => {
    let filtered = [...allReports];
    
    // Filter by time
    if (timeFilter !== 'all') {
      const now = new Date();
      const daysAgo = timeFilter === '7days' ? 7 : timeFilter === '30days' ? 30 : 90;
      const cutoffDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.createdAt);
        return reportDate >= cutoffDate;
      });
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    return filtered;
  };

  const filteredReports = getFilteredReports();

  // Calculate filtered stats
  const calculateFilteredStats = () => {
    const filtered = filteredReports;
    
    const filteredStats = {
      totalReports: filtered.length,
      approvedReports: filtered.filter(r => r.status === 'APPROVED').length,
      pendingReports: filtered.filter(r => r.status === 'PENDING').length,
      rejectedReports: filtered.filter(r => r.status === 'REJECTED').length,
      resolvedReports: filtered.filter(r => r.status === 'RESOLVED').length,
      reportsByType: {},
      reportsByDistrict: {},
      recentReports: filtered
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
        .map(r => ({
          title: r.title,
          type: r.incidentTypeName || r.incidentType?.name || 'N/A',
          status: r.status,
          district: r.district || 'N/A',
          createdAt: r.createdAt
        })),
      weatherTrends: []
    };

    // Group by type
    filtered.forEach(report => {
      const typeName = report.incidentTypeName || report.incidentType?.name || 'Unknown';
      filteredStats.reportsByType[typeName] = (filteredStats.reportsByType[typeName] || 0) + 1;
    });

    // Group by district
    filtered.forEach(report => {
      if (report.district) {
        filteredStats.reportsByDistrict[report.district] = (filteredStats.reportsByDistrict[report.district] || 0) + 1;
      }
    });

    // Calculate trends (last 7 days)
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      
      const count = filtered.filter(r => {
        const reportDate = new Date(r.createdAt);
        return reportDate >= startOfDay && reportDate <= endOfDay;
      }).length;
      
      filteredStats.weatherTrends.push({
        date: startOfDay.toISOString().split('T')[0],
        count
      });
    }

    return filteredStats;
  };

  const displayStats = (allReports.length > 0 && (timeFilter !== 'all' || statusFilter !== 'all')) 
    ? calculateFilteredStats() 
    : stats;

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!displayStats) {
    return <div className="dashboard-page">Không có dữ liệu</div>;
  }

  const reportsByTypeData = Object.entries(displayStats.reportsByType || {})
    .map(([name, value]) => ({
    name,
    value,
    }))
    .sort((a, b) => b.value - a.value);

  const reportsByDistrictData = Object.entries(displayStats.reportsByDistrict || {})
    .slice(0, 10)
    .map(([name, value]) => ({
      name: name.length > 20 ? name.substring(0, 20) + '...' : name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  // Tính toán insights
  const approvalRate = displayStats.totalReports > 0 
    ? ((displayStats.approvedReports / displayStats.totalReports) * 100).toFixed(1) 
    : '0';
  const pendingRate = displayStats.totalReports > 0 
    ? ((displayStats.pendingReports / displayStats.totalReports) * 100).toFixed(1) 
    : '0';
  
  // Calculate week over week change for filtered data
  const calculateWeekOverWeek = () => {
    if (filteredReports.length === 0) return null;
    
    const now = new Date();
    const thisWeekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const lastWeekEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekCount = filteredReports.filter(r => {
      const date = new Date(r.createdAt);
      return date >= thisWeekStart;
    }).length;
    
    const lastWeekCount = filteredReports.filter(r => {
      const date = new Date(r.createdAt);
      return date >= lastWeekStart && date < lastWeekEnd;
    }).length;
    
    if (lastWeekCount === 0) return thisWeekCount > 0 ? 100 : 0;
    return ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
  };
  
  const weekOverWeekChange = calculateWeekOverWeek();
  const isPositiveTrend = weekOverWeekChange !== null && weekOverWeekChange >= 0;
  
  const hasActiveFilters = timeFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header-section">
          <div className="header-content">
            <div>
              <h1 className="dashboard-main-title">Dashboard Thống kê</h1>
              <p className="dashboard-subtitle">Tổng quan về hoạt động và xu hướng báo cáo thời tiết</p>
            </div>
            <div className="header-actions">
              <button 
                className={`filter-toggle-btn ${hasActiveFilters ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FiFilter /> Bộ lọc
                {hasActiveFilters && <span className="filter-badge">{hasActiveFilters ? '1' : ''}</span>}
              </button>
              <div className="trend-badge">
                {weekOverWeekChange !== null && (
                  <>
                    {isPositiveTrend ? <FiTrendingUp /> : <FiTrendingDown />}
                    <span className={isPositiveTrend ? 'positive' : 'negative'}>
                      {isPositiveTrend ? '+' : ''}{weekOverWeekChange.toFixed(1)}%
                    </span>
                    <span className="trend-label">so với tuần trước</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilters && (
            <div className="filter-panel">
              <div className="filter-panel-header">
                <h3>Bộ lọc</h3>
                <button className="close-filter-btn" onClick={() => setShowFilters(false)}>
                  <FiX />
                </button>
              </div>
              <div className="filter-panel-body">
                <div className="filter-group">
                  <label className="filter-label">Thời gian</label>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Tất cả thời gian</option>
                    <option value="7days">7 ngày qua</option>
                    <option value="30days">30 ngày qua</option>
                    <option value="90days">90 ngày qua</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label className="filter-label">Trạng thái</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="PENDING">Đang chờ</option>
                    <option value="REJECTED">Đã từ chối</option>
                    <option value="RESOLVED">Đã xử lý</option>
                  </select>
                </div>
                {hasActiveFilters && (
                  <button 
                    className="clear-filters-btn"
                    onClick={() => {
                      setTimeFilter('all');
                      setStatusFilter('all');
                    }}
                  >
                    <FiX /> Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card metric-primary">
            <div className="metric-icon-wrapper">
              <FiAlertCircle className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-label">TỔNG BÁO CÁO</div>
              <div className="metric-value">{displayStats.totalReports?.toLocaleString() || 0}</div>
              <div className="metric-footer">
                <span className="metric-description">
                  {hasActiveFilters ? 'Đã lọc' : 'Tất cả báo cáo trong hệ thống'}
                </span>
            </div>
            </div>
          </div>

          <div className="metric-card metric-success">
            <div className="metric-icon-wrapper">
              <FiCheckCircle className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-label">ĐÃ DUYỆT</div>
              <div className="metric-value">{displayStats.approvedReports?.toLocaleString() || 0}</div>
              <div className="metric-footer">
                <span className="metric-badge success">{approvalRate}%</span>
                <span className="metric-description">tỷ lệ duyệt</span>
            </div>
            </div>
          </div>

          <div className="metric-card metric-warning">
            <div className="metric-icon-wrapper">
              <FiClock className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-label">ĐANG CHỜ</div>
              <div className="metric-value">{displayStats.pendingReports?.toLocaleString() || 0}</div>
              <div className="metric-footer">
                <span className="metric-badge warning">{pendingRate}%</span>
                <span className="metric-description">cần xử lý</span>
            </div>
            </div>
          </div>

          <div className="metric-card metric-info">
            <div className="metric-icon-wrapper">
              <FiUsers className="metric-icon" />
            </div>
            <div className="metric-content">
              <div className="metric-label">NGƯỜI DÙNG</div>
              <div className="metric-value">{stats?.totalUsers?.toLocaleString() || 0}</div>
              <div className="metric-footer">
                <span className="metric-description">
                  {stats?.totalReports > 0 && stats?.totalUsers > 0 
                    ? `${Math.round(stats.totalReports / stats.totalUsers)}` 
                    : '0'} báo cáo/người
                </span>
            </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-section">
          {/* Row 1: Line Chart and Pie Chart */}
          <div className="charts-row">
            <div className="chart-container large">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">📈 Xu hướng báo cáo (7 ngày)</h3>
                  <p className="chart-subtitle">Biểu đồ theo dõi số lượng báo cáo theo thời gian</p>
                </div>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={displayStats.weatherTrends || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="date" 
                      stroke="#666"
                      style={{ fontSize: '13px', fontWeight: '500' }}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }}
                    />
                    <YAxis 
                      stroke="#666"
                      style={{ fontSize: '13px', fontWeight: '500' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: '2px solid #4A90E2',
                        borderRadius: '12px',
                        fontSize: '14px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return `Ngày ${date.toLocaleDateString('vi-VN')}`;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4A90E2"
                  strokeWidth={3}
                      dot={{ fill: '#4A90E2', r: 5 }}
                      activeDot={{ r: 7 }}
                  name="Số lượng báo cáo"
                />
              </LineChart>
            </ResponsiveContainer>
              </div>
          </div>

            <div className="chart-container medium">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">🥧 Báo cáo theo loại sự cố</h3>
                  <p className="chart-subtitle">Phân bổ các loại sự cố thời tiết</p>
                </div>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                      data={reportsByTypeData.slice(0, 10)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                      label={false}
                      outerRadius={120}
                      innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                      paddingAngle={2}
                >
                      {reportsByTypeData.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: '2px solid #4A90E2',
                        borderRadius: '12px',
                        fontSize: '14px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                      formatter={(value, name, props) => [
                        `${value} báo cáo (${((value / displayStats.totalReports) * 100).toFixed(1)}%)`,
                        props.payload.name
                      ]}
                    />
              </PieChart>
            </ResponsiveContainer>
                <div className="pie-legend-compact">
                  {reportsByTypeData.slice(0, 8).map((entry, index) => {
                    const percent = ((entry.value / stats.totalReports) * 100).toFixed(1);
                    return (
                      <div key={index} className="legend-item-compact">
                        <div 
                          className="legend-dot" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="legend-name-compact">{entry.name.length > 15 ? entry.name.substring(0, 15) + '...' : entry.name}</span>
                        <span className="legend-value-compact">{percent}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Bar Chart and Recent Reports */}
          <div className="charts-row">
            <div className="chart-container large">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">📍 Báo cáo theo quận/huyện</h3>
                  <p className="chart-subtitle">Top 10 khu vực có nhiều báo cáo nhất</p>
                </div>
              </div>
              <div className="chart-body">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={reportsByDistrictData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45} 
                      textAnchor="end" 
                      height={80}
                      stroke="#666"
                      style={{ fontSize: '12px', fontWeight: '500' }}
                    />
                    <YAxis 
                      stroke="#666"
                      style={{ fontSize: '13px', fontWeight: '500' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                        border: '2px solid #4A90E2',
                        borderRadius: '12px',
                        fontSize: '14px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                    <Bar 
                      dataKey="value" 
                      fill="#4A90E2" 
                      name="Số lượng"
                      radius={[8, 8, 0, 0]}
                    />
              </BarChart>
            </ResponsiveContainer>
              </div>
          </div>

            <div className="chart-container medium">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">📋 Báo cáo gần đây</h3>
                  <p className="chart-subtitle">10 báo cáo mới nhất trong hệ thống</p>
                </div>
              </div>
              <div className="chart-body">
                <div className="recent-reports-list-new">
                  {displayStats.recentReports && displayStats.recentReports.length > 0 ? (
                    displayStats.recentReports.map((report, index) => (
                      <div key={index} className="recent-report-item-new">
                        <div className="report-number">{index + 1}</div>
                        <div className="report-content-new">
                          <div className="report-title-new">{report.title || 'Không có tiêu đề'}</div>
                          <div className="report-meta-new">
                            <span className="meta-badge type">{report.type || 'N/A'}</span>
                            {(report.district || report.displayAddress) && (
                              <span className="meta-badge location">
                                <FiMapPin /> {report.district || report.displayAddress}
                              </span>
                            )}
                            <span className="meta-badge time">
                              <FiClock /> {new Date(report.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                    </span>
                  </div>
                        </div>
                        <div className={`report-status-badge status-${report.status?.toLowerCase()}`}>
                          {report.status}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-reports">Chưa có báo cáo nào</div>
                  )}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
