import { apiService } from '../utils/api';
import { LoginCredentials, LoginResponse, ApiResponse } from '../types/auth.types';
import { AxiosResponse } from 'axios';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    console.log('authService.login called with credentials:', credentials);

    try {
      const response: AxiosResponse<ApiResponse<LoginResponse>> = await apiService.auth.adminLogin(credentials);
      const { data } = response;

      if (!data?.success || !data.data?.token || !data.data?.email || !data.data?.id) {
        console.error("Unexpected response format:", data);
        throw new Error("Invalid login response");
      }

      const userData = data.data;

      localStorage.setItem("adminToken", userData.token);
      localStorage.setItem("adminUser", JSON.stringify({ id: userData.id, email: userData.email }));
      localStorage.setItem("adminAuthenticated", "true");

      const expiry = new Date().getTime() + 60 * 60 * 1000;
      localStorage.setItem("tokenExpiry", expiry.toString());

      return userData;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
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
