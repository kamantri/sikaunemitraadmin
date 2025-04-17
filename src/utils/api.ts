import axios from 'axios';
import { API_CONFIG } from '../config/api.config';

const api = axios.create({
  baseURL: `${API_CONFIG.HOST_URL}${API_CONFIG.BASE_URL}`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || API_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
    return Promise.reject({ message });
  }
);

export const apiService = {
  auth: {
    adminLogin: (data: { email: string; password: string }) => 
      api.post(API_CONFIG.AUTH.ADMIN_LOGIN, data),
    
    userLogin: (data: { email: string; password: string }) => 
      api.post(API_CONFIG.AUTH.USER_LOGIN, data),
    
    adminRegister: (data: any) => 
      api.post(API_CONFIG.AUTH.ADMIN_REGISTER, data),
    
    userRegister: (data: any) => 
      api.post(API_CONFIG.AUTH.USER_REGISTER, data)
  },
  
  users: {
    getAll: () => api.get(API_CONFIG.ENDPOINTS.USERS),
    getById: (id: string) => api.get(`${API_CONFIG.ENDPOINTS.USERS}/${id}`),
    update: (id: string, data: any) => api.put(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, data),
    delete: (id: string) => api.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`)
  },

  courses: {
    getAll: () => api.get(API_CONFIG.ENDPOINTS.COURSES),
    getById: (id: string) => api.get(`${API_CONFIG.ENDPOINTS.COURSES}/${id}`),
    create: (data: any) => api.post(API_CONFIG.ENDPOINTS.COURSES, data),
    update: (id: string, data: any) => api.put(`${API_CONFIG.ENDPOINTS.COURSES}/${id}`, data),
    delete: (id: string) => api.delete(`${API_CONFIG.ENDPOINTS.COURSES}/${id}`)
  }
};