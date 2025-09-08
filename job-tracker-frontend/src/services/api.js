import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/token/', credentials),
  register: (userData) => api.post('/auth/register/', userData),
  refreshToken: (refresh) => api.post('/token/refresh/', { refresh }),
};

// Applications API
export const applicationsAPI = {
  getAll: (params) => api.get('/applications/', { params }),
  create: (data) => api.post('/applications/', data),
  update: (id, data) => api.put(`/applications/${id}/`, data),
  delete: (id) => api.delete(`/applications/${id}/`),
  getById: (id) => api.get(`/applications/${id}/`),
};

export default api;