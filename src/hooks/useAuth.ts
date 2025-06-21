import { useState } from 'react';
import { apiService } from '../utils/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface UseAuthReturn {
  login: (credentials: LoginCredentials) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.auth.adminLogin(credentials);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // You can also store user data if needed
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect or handle successful login
      window.location.href = '/dashboard'; // or use React Router navigation
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};