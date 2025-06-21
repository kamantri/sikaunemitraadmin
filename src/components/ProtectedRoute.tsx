import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const [isAllowed, setIsAllowed] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    setIsAllowed(checkAuth());
  }, []);

  if (isAllowed === null) return null; // or loading indicator

  if (!isAllowed) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkAuth } = useAuth();
  const [isBlocked, setIsBlocked] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    setIsBlocked(checkAuth());
  }, []);

  if (isBlocked === null) return null; // or loading indicator

  if (isBlocked) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
