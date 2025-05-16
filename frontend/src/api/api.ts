import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is due to an expired token and we haven't tried refreshing yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
        localStorage.setItem('token', response.data.access);
        
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/token/', { username, password }),
  
  register: (userData: any) => 
    api.post('/register/', userData),
  
  refreshToken: (refreshToken: string) => 
    api.post('/token/refresh/', { refresh: refreshToken }),
};

// User API
export const userAPI = {
  getCurrentUser: () => 
    api.get('/users/me/'),
  
  getUsers: () => 
    api.get('/users/'),
  
  approveUser: (userId: number) => 
    api.patch(`/users/${userId}/approve/`),
  
  rejectUser: (userId: number) => 
    api.patch(`/users/${userId}/reject/`),
};

// Organization API
export const organizationAPI = {
  createOrganization: (data: any) => 
    api.post('/organizations/', data),
  
  getOrganization: (id: number) => 
    api.get(`/organizations/${id}/`),
  
  updateOrganization: (id: number, data: any) => 
    api.patch(`/organizations/${id}/`, data),
};

// Cargo Request API
export const cargoAPI = {
  createRequest: (data: any) => 
    api.post('/cargo-requests/', data),
  
  getRequests: (status?: string) => {
    let url = '/cargo-requests/';
    if (status) {
      url += `?status=${status}`;
    }
    return api.get(url);
  },
  
  getRequest: (id: number) => 
    api.get(`/cargo-requests/${id}/`),
  
  updateRequest: (id: number, data: any) => 
    api.patch(`/cargo-requests/${id}/`, data),
  
  updateStatus: (id: number, status: string) => 
    api.patch(`/cargo-requests/${id}/update_status/`, { status }),
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: () => 
    api.get('/analytics/'),
};

export default api; 