import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { reportAPI, weatherAPI } from '../utils/api';
import { FiMapPin, FiAlertCircle, FiCloud, FiSun, FiDroplet } from 'react-icons/fi';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const Map = () => {
  const [reports, setReports] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [center, setCenter] = useState([10.8231, 106.6297]); // Ho Chi Minh City
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    fetchReports();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter([latitude, longitude]);
          fetchWeather(latitude, longitude);
        },
        () => {
          fetchWeather(center[0], center[1]);
        }
      );
    }
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getAll();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (lat, lng) => {
    try {
      const response = await weatherAPI.getCurrent(lat, lng);
      setCurrentWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const getMarkerColor = (status, severity) => {
    if (status === 'RESOLVED') return '#4CAF50';
    if (status === 'REJECTED') return '#F44336';
    if (severity === 'CRITICAL') return '#FF1744';
    if (severity === 'HIGH') return '#FF6B6B';
    if (severity === 'MEDIUM') return '#FFA07A';
    return '#FFD93D';
  };

  const createCustomIcon = (color) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 30],
    });
  };

  if (loading) {
    return (
      <div className="map-page">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="map-page">
      <div className="map-container-wrapper">
        <div className="map-sidebar">
          <h2>
            <FiMapPin /> Bản đồ Sự cố Thời tiết
          </h2>
          <div className="sidebar-stats">
            <div className="stat-item">
              <span className="stat-label">Tổng báo cáo:</span>
              <span className="stat-value">{reports.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đang chờ:</span>
              <span className="stat-value">
                {reports.filter((r) => r.status === 'PENDING').length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Đã duyệt:</span>
              <span className="stat-value">
                {reports.filter((r) => r.status === 'APPROVED').length}
              </span>
            </div>
          </div>

          {currentWeather && (
            <div className="weather-widget card">
              <h3>Thời tiết hiện tại</h3>
              <div className="weather-widget-content">
                <div className="weather-temp">{Math.round(currentWeather.temperature)}°C</div>
                <div className="weather-desc">{currentWeather.description}</div>
                <div className="weather-details">
                  <div>Độ ẩm: {currentWeather.humidity}%</div>
                  <div>Gió: {currentWeather.windSpeed?.toFixed(1)} m/s</div>
                </div>
              </div>
            </div>
          )}

          <div className="reports-list">
            <h3>Danh sách báo cáo</h3>
            <div className="reports-scroll">
              {reports.slice(0, 10).map((report) => (
                <div
                  key={report.id}
                  className={`report-item ${selectedReport?.id === report.id ? 'active' : ''}`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="report-item-header">
                    <span className="report-item-type">{report.incidentTypeName}</span>
                    <span className={`report-item-status status-${report.status.toLowerCase()}`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="report-item-title">{report.title}</div>
                  <div className="report-item-location">
                    <FiMapPin /> {report.district || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="map-container">
          <MapContainer
            center={center}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {reports.map((report) => (
              <Marker
                key={report.id}
                position={[report.latitude, report.longitude]}
                icon={createCustomIcon(getMarkerColor(report.status, report.severity))}
                eventHandlers={{
                  click: () => setSelectedReport(report),
                }}
              >
                <Popup>
                  <div className="marker-popup">
                    <h3>{report.title}</h3>
                    <p><strong>Loại:</strong> {report.incidentTypeName}</p>
                    <p><strong>Trạng thái:</strong> {report.status}</p>
                    <p><strong>Mức độ:</strong> {report.severity}</p>
                    <p><strong>Địa điểm:</strong> {report.district || 'N/A'}</p>
                    <p>{report.description}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      {selectedReport && (
        <div className="report-detail-modal">
          <div className="modal-content card">
            <button
              className="modal-close"
              onClick={() => setSelectedReport(null)}
            >
              ×
            </button>
            <h2>{selectedReport.title}</h2>
            <div className="modal-details">
              <div className="detail-row">
                <span className="detail-label">Loại sự cố:</span>
                <span className="detail-value">{selectedReport.incidentTypeName}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <span className={`detail-value status-${selectedReport.status.toLowerCase()}`}>
                  {selectedReport.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mức độ:</span>
                <span className="detail-value">{selectedReport.severity}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Địa điểm:</span>
                <span className="detail-value">
                  {selectedReport.address || selectedReport.district || 'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Mô tả:</span>
                <span className="detail-value">{selectedReport.description}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Thời gian:</span>
                <span className="detail-value">
                  {new Date(selectedReport.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;










