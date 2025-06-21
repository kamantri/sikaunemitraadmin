import axios from "axios";
import { API_CONFIG } from "../config/api.config";
import { UserData } from "@/models/User";

const api = axios.create({
  baseURL: `${API_CONFIG.HOST_URL}${API_CONFIG.BASE_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Add timeout
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject({ message: "Request timeout" });
    }
    const message =
      error.response?.data?.message ||
      (error.response?.status === 404
        ? "Endpoint not found"
        : API_CONFIG.ERROR_MESSAGES.SERVER_ERROR);
    return Promise.reject({ message });
  }
);

// Add interceptor to include token in requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  console.log("Token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  auth: {
    adminLogin: (data: { email: string; password: string }) =>
      api.post(API_CONFIG.AUTH.ADMIN_LOGIN, data),

    userLogin: (data: { email: string; password: string }) =>
      api.post(API_CONFIG.AUTH.USER_LOGIN, data),

    adminRegister: (data: any) =>
      api.post(API_CONFIG.AUTH.ADMIN_REGISTER, data),

    userRegister: (data: any) => api.post(API_CONFIG.AUTH.USER_REGISTER, data),
  },

  users: {
    getAll: async () => {
      const response = await api.get<{ data: UserData[] }>(
        API_CONFIG.ENDPOINTS.USERS.GET_ALL
      );
      return response.data;
    },
    getById: (id: string) => api.get(`${API_CONFIG.ENDPOINTS.USERS}/${id}`),

    update: (id: string, data: any) =>
      api.put(API_CONFIG.ENDPOINTS.USERS.UPDATE.replace(":id", id), data),

    delete: (id: string) => api.delete(`${API_CONFIG.ENDPOINTS.USERS}/${id}`),
  },

  courses: {
    getAll: () => api.get(API_CONFIG.ENDPOINTS.COURSES),
    getById: (id: string) => api.get(`${API_CONFIG.ENDPOINTS.COURSES}/${id}`),
    create: (data: any) => api.post(API_CONFIG.ENDPOINTS.COURSES, data),
    update: (id: string, data: any) =>
      api.put(`${API_CONFIG.ENDPOINTS.COURSES}/${id}`, data),
    delete: (id: string) => api.delete(`${API_CONFIG.ENDPOINTS.COURSES}/${id}`),
  },
};
