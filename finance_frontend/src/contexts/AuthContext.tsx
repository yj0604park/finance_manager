import { useState, useEffect, ReactNode, useContext } from 'react';
import {
  getAuthToken,
  setAuthToken as saveAuthToken,
  removeAuthToken as clearAuthToken,
  isAuthenticated as checkAuth,
} from '../utils/auth';
import {
  setAuthToken as setApiAuthToken,
  clearAuthToken as clearApiAuthToken,
} from '../api/client';
import { AuthContext, User, AuthContextType } from './auth-context-types';

/**
 * 인증 컨텍스트를 사용하기 위한 훅
 *
 * 이 훅은 애플리케이션 전체에서 인증 상태와 관련 기능에 접근할 수 있게 해줍니다.
 * AuthProvider 내부에서만 사용해야 합니다.
 *
 * @returns AuthContextType - 인증 상태와 기능이 포함된 객체
 * @throws Error - AuthProvider 밖에서 사용할 경우 오류를 발생시킵니다
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다');
  }

  return context;
};

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
