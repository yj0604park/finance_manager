import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 현재 경로를 state로 전달하여 로그인 후 원래 페이지로 돌아갈 수 있게 함
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}; 