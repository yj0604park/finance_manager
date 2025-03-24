import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, setAuthToken as saveAuthToken, removeAuthToken as clearAuthToken, isAuthenticated as checkAuth } from '../utils/auth';
import { setAuthToken as setApiAuthToken, clearAuthToken as clearApiAuthToken } from '../api/client';

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

  // 컴포넌트 마운트 시 토큰 상태 초기화
  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken) {
      setToken(storedToken);
      setApiAuthToken(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    saveAuthToken(newToken);
    setApiAuthToken(newToken); // API 클라이언트에 토큰 설정
    setToken(newToken);
  };

  const logout = () => {
    clearAuthToken();
    clearApiAuthToken(); // API 클라이언트 토큰 제거
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
