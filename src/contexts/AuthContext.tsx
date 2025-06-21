import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  checkAuth: () => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType); // <== updated here

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (!token || !tokenExpiry) {
      setIsAuthenticated(false);
      return false;
    }

    const isExpired = new Date().getTime() > parseInt(tokenExpiry);
    if (isExpired) {
      localStorage.clear(); // simplified
      setIsAuthenticated(false);
      return false;
    }

    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    localStorage.clear(); // simplified
    setIsAuthenticated(false);
    navigate('/');
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 1000 * 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
