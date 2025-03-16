import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, setAuthToken as saveAuthToken, removeAuthToken as clearAuthToken, isAuthenticated as checkAuth } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());

  useEffect(() => {
    // 토큰 변경 시 인증 상태 업데이트
    setIsAuthenticated(!!token);
  }, [token]);

  const login = (newToken: string) => {
    saveAuthToken(newToken);
    setToken(newToken);
  };

  const logout = () => {
    clearAuthToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 