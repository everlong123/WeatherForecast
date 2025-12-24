import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import { reportAPI } from '../utils/api';
import { FiMapPin, FiAlertCircle, FiCloud, FiSun, FiDroplet, FiLayers, FiX, FiCheck } from 'react-icons/fi';
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

// Component để fit map vào bounds của Việt Nam
const FitVietnamBounds = () => {
  const map = useMap();
  
  useEffect(() => {
    const vietnamBounds = [
      [8.0, 102.0], // Southwest
      [23.5, 110.0]  // Northeast
    ];
    map.fitBounds(vietnamBounds, {
      padding: [20, 20],
      maxZoom: 7
    });
  }, [map]);
  
  return null;
};

// Mapping các tỉnh/thành phố Việt Nam sang tọa độ
const getLocationCoordinates = (city, district) => {
  const cityCoordinates = {
    'Thành phố Hà Nội': [21.0285, 105.8542],
    'Thành phố Hồ Chí Minh': [10.8231, 106.6297],
    'Thành phố Đà Nẵng': [16.0544, 108.2022],
    'Thành phố Hải Phòng': [20.8449, 106.6881],
    'Tỉnh Hà Giang': [22.8026, 104.9785],
    'Tỉnh Cao Bằng': [22.6650, 106.2571],
    'Tỉnh Bắc Kạn': [22.1473, 105.8342],
    'Tỉnh Tuyên Quang': [21.7769, 105.2284],
    'Tỉnh Lào Cai': [22.4809, 103.9755],
    'Tỉnh Điện Biên': [21.3860, 103.0230],
    'Tỉnh Lai Châu': [22.3964, 103.4582],
    'Tỉnh Sơn La': [21.3257, 103.9177],
    'Tỉnh Yên Bái': [21.7150, 104.9067],
    'Tỉnh Hoà Bình': [20.8137, 105.3383],
    'Tỉnh Thái Nguyên': [21.5944, 105.8481],
    'Tỉnh Lạng Sơn': [21.8537, 106.7615],
    'Tỉnh Quảng Ninh': [20.9101, 107.1839],
    'Tỉnh Bắc Giang': [21.2813, 106.1946],
    'Tỉnh Phú Thọ': [21.3087, 105.3006],
    'Tỉnh Vĩnh Phúc': [21.3059, 105.5968],
    'Tỉnh Bắc Ninh': [21.1861, 106.0763],
    'Tỉnh Hải Dương': [20.9373, 106.3145],
    'Tỉnh Hưng Yên': [20.6464, 106.0511],
    'Tỉnh Thái Bình': [20.4466, 106.3366],
    'Tỉnh Hà Nam': [20.5434, 105.9229],
    'Tỉnh Nam Định': [20.4280, 106.1687],
    'Tỉnh Ninh Bình': [20.2506, 105.9744],
    'Tỉnh Thanh Hóa': [19.8067, 105.7852],
    'Tỉnh Nghệ An': [18.6796, 105.6813],
    'Tỉnh Hà Tĩnh': [18.3428, 105.9059],
    'Tỉnh Quảng Bình': [17.4680, 106.6227],
    'Tỉnh Quảng Trị': [16.7500, 107.2000],
    'Tỉnh Thừa Thiên Huế': [16.4637, 107.5908],
    'Tỉnh Quảng Nam': [15.8801, 108.3380],
    'Tỉnh Quảng Ngãi': [15.1214, 108.8044],
    'Tỉnh Bình Định': [13.7696, 109.2336],
    'Tỉnh Phú Yên': [13.0884, 109.0929],
    'Tỉnh Khánh Hòa': [12.2388, 109.1967],
    'Tỉnh Ninh Thuận': [11.5643, 108.9886],
    'Tỉnh Bình Thuận': [10.9286, 108.0993],
    'Tỉnh Kon Tum': [14.3545, 108.0076],
    'Tỉnh Gia Lai': [13.9833, 108.0167],
    'Tỉnh Đắk Lắk': [12.6675, 108.0377],
    'Tỉnh Đắk Nông': [12.0047, 107.6877],
    'Tỉnh Lâm Đồng': [11.9404, 108.4583],
    'Tỉnh Bình Phước': [11.7510, 106.7234],
    'Tỉnh Tây Ninh': [11.3130, 106.0987],
    'Tỉnh Bình Dương': [11.3254, 106.4770],
    'Tỉnh Đồng Nai': [10.9574, 106.8429],
    'Tỉnh Bà Rịa - Vũng Tàu': [10.3460, 107.0843],
    'Tỉnh Long An': [10.6599, 106.2076],
    'Tỉnh Tiền Giang': [10.3548, 106.3648],
    'Tỉnh Bến Tre': [10.2405, 106.3753],
    'Tỉnh Trà Vinh': [9.9346, 106.3457],
    'Tỉnh Vĩnh Long': [10.2530, 105.9722],
    'Tỉnh Đồng Tháp': [10.5177, 105.6323],
    'Tỉnh An Giang': [10.5216, 105.1258],
    'Tỉnh Kiên Giang': [9.9581, 105.1311],
    'Thành phố Cần Thơ': [10.0452, 105.7469],
    'Tỉnh Hậu Giang': [9.7840, 105.4710],
    'Tỉnh Sóc Trăng': [9.6004, 105.9718],
    'Tỉnh Bạc Liêu': [9.2942, 105.7271],
    'Tỉnh Cà Mau': [9.1769, 105.1528],
  };

  // Tìm city trong mapping - kiểm tra cả key đầy đủ và tên ngắn
  if (city) {
    for (const [key, coords] of Object.entries(cityCoordinates)) {
      const shortName = key.replace('Tỉnh ', '').replace('Thành phố ', '');
      if (city === key || city.includes(shortName) || key.includes(city)) {
        // Thêm một chút random offset dựa trên district để không trùng nhau hoàn toàn
        const hash = district ? district.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) : 0;
        const offsetLat = (hash % 100 - 50) / 1000;
        const offsetLng = ((hash * 7) % 100 - 50) / 1000;
        return [coords[0] + offsetLat, coords[1] + offsetLng];
      }
    }
  }

  // Mặc định trả về tọa độ trung tâm Việt Nam
  return [16.0583, 108.2772];
};

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

const Map = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [center] = useState([16.0583, 106.2772]); // Trung tâm Việt Nam (điều chỉnh)
  const [zoom] = useState(6); // Zoom level để hiển thị toàn bộ Việt Nam
  const [mapType, setMapType] = useState('standard'); // standard, satellite, terrain
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  useEffect(() => {
    fetchReports();
    
    // Kiểm tra nếu có query parameter selectLocation hoặc pickLocation
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('selectLocation') === 'true' || urlParams.get('pickLocation') === 'true') {
      setIsSelectingLocation(true);
    }
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getAll();
      console.log('Fetched reports:', response.data?.length || 0);
      const reportsData = response.data || [];
      // Log để debug
      const reportsWithCoords = reportsData.filter(r => r.latitude && r.longitude);
      const reportsWithoutCoords = reportsData.filter(r => !r.latitude || !r.longitude);
      console.log('Reports with coordinates:', reportsWithCoords.length);
      console.log('Reports without coordinates:', reportsWithoutCoords.length);
      if (reportsWithCoords.length > 0) {
        console.log('Sample report with coords:', reportsWithCoords[0]);
      }
      setReports(reportsData);
    } catch (error) {
      console.error('Error fetching reports:', error);
      console.error('Error response:', error.response);
    } finally {
      setLoading(false);
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
      html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 3px 12px rgba(0,0,0,0.4); cursor: pointer;"></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  const handleMapClick = (latlng) => {
    if (isSelectingLocation) {
      setClickedPosition(latlng);
      // Không tắt isSelectingLocation ngay, để user có thể xem và xác nhận
    }
  };

  const confirmLocation = () => {
    if (clickedPosition) {
      // Check if we're in selectLocation mode (from weather card)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('selectLocation') === 'true') {
        // Save location to localStorage
        localStorage.setItem('selectedWeatherLocation', JSON.stringify({
          lat: clickedPosition.lat,
          lng: clickedPosition.lng
        }));
        // Navigate back to home
        navigate('/');
        return;
      }
      
      // Legacy support: Nếu được mở từ window khác (window.opener), gọi callback của parent window
      if (window.opener && window.opener.onLocationSelected) {
        window.opener.onLocationSelected(clickedPosition.lat, clickedPosition.lng);
        window.close();
      } 
      // Nếu không có opener, thử gọi trực tiếp (cho trường hợp cùng window)
      else if (window.onLocationSelected) {
        window.onLocationSelected(clickedPosition.lat, clickedPosition.lng);
      }
    }
    setIsSelectingLocation(false);
    setClickedPosition(null);
  };

  const getTileLayerUrl = () => {
    switch (mapType) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileLayerAttribution = () => {
    switch (mapType) {
      case 'satellite':
        return '&copy; <a href="https://www.esri.com/">Esri</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      case 'terrain':
        return '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
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
              <span className="stat-label">Có tọa độ:</span>
              <span className="stat-value">
                {reports.filter((r) => r.latitude != null && r.longitude != null).length}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Hiển thị trên map:</span>
              <span className="stat-value">
                {reports.filter((report) => {
                  if (report.latitude != null && report.longitude != null) {
                    const lat = parseFloat(report.latitude);
                    const lng = parseFloat(report.longitude);
                    return !isNaN(lat) && !isNaN(lng) && 
                           lat >= 5 && lat <= 25 && 
                           lng >= 100 && lng <= 112;
                  }
                  return report.city || report.district;
                }).length}
              </span>
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
          {/* Map Controls */}
          <div className="map-controls">
            <button 
              className="map-control-btn"
              onClick={() => setShowLayerControl(!showLayerControl)}
              title="Chọn loại bản đồ"
            >
              <FiLayers />
            </button>
            {showLayerControl && (
              <div className="layer-control-panel">
                <button 
                  className={mapType === 'standard' ? 'active' : ''}
                  onClick={() => { setMapType('standard'); setShowLayerControl(false); }}
                >
                  Bản đồ chuẩn
                </button>
                <button 
                  className={mapType === 'satellite' ? 'active' : ''}
                  onClick={() => { setMapType('satellite'); setShowLayerControl(false); }}
                >
                  Vệ tinh
                </button>
                <button 
                  className={mapType === 'terrain' ? 'active' : ''}
                  onClick={() => { setMapType('terrain'); setShowLayerControl(false); }}
                >
                  Địa hình
                </button>
              </div>
            )}
            {isSelectingLocation && (
              <div className="location-picker-hint">
                <FiMapPin /> Click trên bản đồ để chọn vị trí
                <button onClick={() => {
                  // Check if we came from weather card
                  const urlParams = new URLSearchParams(window.location.search);
                  if (urlParams.get('selectLocation') === 'true') {
                    navigate('/'); // Navigate back to home
                  } else {
                    setIsSelectingLocation(false);
                  }
                }} className="cancel-pick-btn">
                  <FiX />
                </button>
              </div>
            )}
          </div>

          <MapContainer
            center={center}
            zoom={zoom}
            minZoom={5.5}
            maxZoom={18}
            style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            maxBounds={[
              [8.0, 102.0],   // Southwest: Cà Mau - Kiên Giang
              [23.5, 109.6]   // Northeast: Hà Giang - Quảng Bình
            ]}
            maxBoundsViscosity={1.0}
            scrollWheelZoom={true}
            worldCopyJump={false}
            boundsOptions={{ padding: [20, 20] }}
          >
            <FitVietnamBounds />
            <MapClickHandler onMapClick={handleMapClick} />
            <TileLayer
              url={getTileLayerUrl()}
              attribution={getTileLayerAttribution()}
              noWrap={true}
              className="map-tiles"
            />
            {clickedPosition && isSelectingLocation && (
              <Marker 
                position={[clickedPosition.lat, clickedPosition.lng]}
                icon={L.divIcon({
                  className: 'location-picker-marker',
                  html: `<div style="background-color: #4a90e2; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.4); cursor: pointer;"></div>`,
                  iconSize: [40, 40],
                  iconAnchor: [20, 20],
                })}
              >
                <Popup autoClose={false} closeOnClick={false}>
                  <div style={{ textAlign: 'center', minWidth: '200px' }}>
                    <p><strong>Vị trí đã chọn</strong></p>
                    <p style={{ fontSize: '12px', color: '#666', margin: '8px 0' }}>
                      {clickedPosition.lat.toFixed(6)}, {clickedPosition.lng.toFixed(6)}
                    </p>
                    <button 
                      onClick={confirmLocation}
                      style={{ 
                        marginTop: '10px', 
                        padding: '8px 16px', 
                        fontSize: '14px',
                        background: '#4a90e2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      <FiCheck style={{ display: 'inline', marginRight: '5px' }} /> Xác nhận
                    </button>
                  </div>
                </Popup>
              </Marker>
            )}
            {reports
              .filter((report) => {
                // Ưu tiên: có tọa độ hợp lệ
                if (report.latitude != null && report.longitude != null) {
                  const lat = parseFloat(report.latitude);
                  const lng = parseFloat(report.longitude);
                  // Kiểm tra tọa độ hợp lệ (trong phạm vi Việt Nam mở rộng)
                  // Mở rộng phạm vi để bao gồm cả các vùng biên giới
                  return !isNaN(lat) && !isNaN(lng) && 
                         lat >= 5 && lat <= 25 && 
                         lng >= 100 && lng <= 112;
                }
                // Fallback: nếu không có tọa độ nhưng có địa điểm, vẫn hiển thị
                return report.city || report.district;
              })
              .map((report) => {
                // Ưu tiên dùng tọa độ từ database
                let coords;
                if (report.latitude != null && report.longitude != null) {
                  const lat = parseFloat(report.latitude);
                  const lng = parseFloat(report.longitude);
                  if (!isNaN(lat) && !isNaN(lng)) {
                    coords = [lat, lng];
                  } else {
                    // Tọa độ không hợp lệ, dùng fallback
                    coords = getLocationCoordinates(report.city, report.district);
                  }
                } else {
                  // Không có tọa độ, tính từ địa điểm
                  coords = getLocationCoordinates(report.city, report.district);
                }
                
                const markerColor = getMarkerColor(report.status, report.severity);
                const customIcon = createCustomIcon(markerColor);
                
                return (
                  <Marker
                    key={report.id}
                    position={coords}
                    icon={customIcon}
                    eventHandlers={{
                      click: () => setSelectedReport(report),
                    }}
                  >
                    <Popup className="marker-popup">
                      <h3>{report.title}</h3>
                      <p><strong>Loại:</strong> {report.incidentTypeName}</p>
                      <p><strong>Địa điểm:</strong> {
                        [report.ward, report.district, report.city]
                          .filter(Boolean)
                          .join(', ') || 
                        (report.latitude && report.longitude 
                          ? `${report.latitude.toFixed(4)}, ${report.longitude.toFixed(4)}` 
                          : 'N/A')
                      }</p>
                      <p><strong>Trạng thái:</strong> {report.status}</p>
                    </Popup>
                  </Marker>
                );
              })}
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