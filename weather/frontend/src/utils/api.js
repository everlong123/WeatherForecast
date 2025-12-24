import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  getUserStats: () => api.get('/auth/me/stats'),
  updateProfile: (profileData) => api.put('/auth/me', profileData),
};

export const reportAPI = {
  getAll: () => api.get('/reports'),
  getMyReports: () => api.get('/reports/my-reports'),
  getById: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
  vote: (id, voteType, latitude, longitude) => api.post(`/reports/${id}/vote`, { 
    voteType, 
    latitude, 
    longitude 
  }),
  // Admin endpoints
  updateReport: (id, data) => api.put(`/admin/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/admin/reports/${id}`),
};

export const weatherAPI = {
  getCurrent: (lat, lng, city, district, ward) => {
    const params = {};
    if (lat && lng) {
      params.lat = lat;
      params.lng = lng;
    }
    if (city) params.city = city;
    if (district) params.district = district;
    if (ward) params.ward = ward;
    return api.get('/weather/current', { params });
  },
  getForecast: (lat, lng, hoursAhead = 24) => 
    api.get('/weather/forecast', { params: { lat, lng, hoursAhead } }),
  getHistory: (lat, lng) => api.get('/weather/history', { params: { lat, lng } }),
  fetch: (lat, lng, city, district, ward) =>
    api.post('/weather/fetch', null, {
      params: { lat, lng, city, district, ward },
    }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
};

export const incidentTypeAPI = {
  getAll: () => api.get('/incident-types'),
};

export const locationAPI = {
  getCoordinates: (city, district, ward) => 
    api.get('/locations/coordinates', { params: { city, district, ward } }),
  getLocationFromCoordinates: (lat, lng) =>
    api.get('/locations/reverse', { params: { lat, lng } }),
};

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    // Endpoint upload không dùng prefix /api (được WebConfig loại trừ)
    return axios.post('http://localhost:8080/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export const adminAPI = {
  approveReport: (id) =>
    api.put(`/admin/reports/${id}/approve`),
  rejectReport: (id) =>
    api.put(`/admin/reports/${id}/reject`),
  resolveReport: (id) =>
    api.put(`/admin/reports/${id}/resolve`),
  hideReport: (id) => api.put(`/admin/reports/${id}/hide`),
  unhideReport: (id) => api.put(`/admin/reports/${id}/unhide`),
  getAllReports: () => api.get('/admin/reports'),
  getAllUsers: () => api.get('/admin/users'),
  toggleUserStatus: (id) => api.put(`/admin/users/${id}/toggle`),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  createUser: (data) => api.post('/admin/users', data),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  createAlert: (data) => api.post('/admin/alerts', data),
  updateAlert: (id, data) => api.put(`/admin/alerts/${id}`, data),
  deleteAlert: (id) => api.delete(`/admin/alerts/${id}`),
  getAllAlerts: () => api.get('/admin/alerts'),
  getStats: () => api.get('/admin/stats'),
  getActions: () => api.get('/admin/actions'),
  // Incident Types
  getIncidentTypes: () => api.get('/admin/incident-types'),
  createIncidentType: (data) => api.post('/admin/incident-types', data),
  updateIncidentType: (id, data) => api.put(`/admin/incident-types/${id}`, data),
  deleteIncidentType: (id) => api.delete(`/admin/incident-types/${id}`),
};

export default api;