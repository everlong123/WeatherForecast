import React, { useState, useEffect } from 'react';
import { dashboardAPI } from '../utils/api';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FiTrendingUp, FiUsers, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
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

  const COLORS = ['#4A90E2', '#7B9ACC', '#FF6B6B', '#FFA07A', '#FFD93D', '#95E1D3'];

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return <div className="dashboard-page">Không có dữ liệu</div>;
  }

  const reportsByTypeData = Object.entries(stats.reportsByType || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const reportsByDistrictData = Object.entries(stats.reportsByDistrict || {})
    .slice(0, 10)
    .map(([name, value]) => ({
      name: name.length > 15 ? name.substring(0, 15) + '...' : name,
      value,
    }));

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1 className="dashboard-title">📊 Dashboard Thống kê</h1>

        <div className="stats-grid grid grid-4">
          <div className="stat-card card card-cold fade-in">
            <div className="stat-icon">
              <FiAlertCircle />
            </div>
            <div className="stat-content">
              <div className="stat-label">Tổng báo cáo</div>
              <div className="stat-value">{stats.totalReports}</div>
            </div>
          </div>

          <div className="stat-card card card-cold fade-in">
            <div className="stat-icon">
              <FiCheckCircle />
            </div>
            <div className="stat-content">
              <div className="stat-label">Đã duyệt</div>
              <div className="stat-value">{stats.approvedReports}</div>
            </div>
          </div>

          <div className="stat-card card card-warm fade-in">
            <div className="stat-icon">
              <FiAlertCircle />
            </div>
            <div className="stat-content">
              <div className="stat-label">Đang chờ</div>
              <div className="stat-value">{stats.pendingReports}</div>
            </div>
          </div>

          <div className="stat-card card card-warm fade-in">
            <div className="stat-icon">
              <FiUsers />
            </div>
            <div className="stat-content">
              <div className="stat-label">Người dùng</div>
              <div className="stat-value">{stats.totalUsers}</div>
            </div>
          </div>
        </div>

        <div className="charts-grid grid grid-2">
          <div className="chart-card card fade-in">
            <h2>Xu hướng báo cáo (7 ngày)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.weatherTrends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#4A90E2"
                  strokeWidth={3}
                  name="Số lượng báo cáo"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card fade-in">
            <h2>Báo cáo theo loại</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reportsByTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reportsByTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card fade-in">
            <h2>Báo cáo theo quận/huyện</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={reportsByDistrictData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#4A90E2" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card card fade-in">
            <h2>Báo cáo gần đây</h2>
            <div className="recent-reports-list">
              {stats.recentReports?.map((report, index) => (
                <div key={index} className="recent-report-item">
                  <div className="report-item-header">
                    <span className="report-item-title">{report.title}</span>
                    <span className={`report-item-status status-${report.status?.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="report-item-meta">
                    <span>{report.type}</span>
                    <span>{report.district}</span>
                    <span>{new Date(report.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;























