import { apiService } from '../utils/api';
import { LoginCredentials, LoginResponse, ApiResponse } from '../types/auth.types';
import { AxiosResponse } from 'axios';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<ApiResponse<LoginResponse>> = await apiService.auth.adminLogin(credentials);
      const { data } = response;
      
      console.log('Server response:', data);

      if (!data?.data?.token) {
        throw new Error(data?.message || 'Invalid response format');
      }

      const userData = data.data;
      localStorage.setItem("adminToken", userData.token);
      localStorage.setItem("adminUser", JSON.stringify(userData.user));
      localStorage.setItem("adminAuthenticated", "true");
      const expiry = new Date().getTime() + (60 * 60 * 1000);
      localStorage.setItem("tokenExpiry", expiry.toString());

      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("tokenExpiry");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminAuthenticated");
  }
};