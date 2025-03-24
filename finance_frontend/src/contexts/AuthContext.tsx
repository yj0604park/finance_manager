import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getAuthToken, setAuthToken as saveAuthToken, removeAuthToken as clearAuthToken, isAuthenticated as checkAuth } from '../utils/auth';
import { setAuthToken as setApiAuthToken, clearAuthToken as clearApiAuthToken } from '../api/client';

interface User {
  email: string;
  id?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(checkAuth());
  const [user, setUser] = useState<User | null>(null);

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

      // 로컬 스토리지에서 사용자 정보 복원 (예: 이메일)
      const userEmail = localStorage.getItem('user_email');
      if (userEmail) {
        setUser({ email: userEmail });
      }
    }
  }, []);

  const login = (newToken: string, email: string) => {
    saveAuthToken(newToken);
    setApiAuthToken(newToken); // API 클라이언트에 토큰 설정
    setToken(newToken);

    // 사용자 정보 저장
    setUser({ email });
    localStorage.setItem('user_email', email);
  };

  const logout = () => {
    clearAuthToken();
    clearApiAuthToken(); // API 클라이언트 토큰 제거
    setToken(null);
    setUser(null);
    localStorage.removeItem('user_email');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
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
