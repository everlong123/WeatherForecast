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
};

export const reportAPI = {
  getAll: () => api.get('/reports'),
  getMyReports: () => api.get('/reports/my-reports'),
  getById: (id) => api.get(`/reports/${id}`),
  create: (data) => api.post('/reports', data),
  update: (id, data) => api.put(`/reports/${id}`, data),
  delete: (id) => api.delete(`/reports/${id}`),
  // Admin endpoints
  updateReport: (id, data) => api.put(`/admin/reports/${id}`, data),
  deleteReport: (id) => api.delete(`/admin/reports/${id}`),
};

export const weatherAPI = {
  getCurrent: (lat, lng) => api.get('/weather/current', { params: { lat, lng } }),
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

export const adminAPI = {
  approveReport: (id, comment) =>
    api.put(`/admin/reports/${id}/approve`, null, { params: { comment } }),
  rejectReport: (id, comment) =>
    api.put(`/admin/reports/${id}/reject`, null, { params: { comment } }),
  resolveReport: (id, comment) =>
    api.put(`/admin/reports/${id}/resolve`, null, { params: { comment } }),
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

