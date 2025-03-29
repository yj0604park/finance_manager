import { createContext } from 'react';

/**
 * 사용자 정보 타입
 */
export interface User {
  email: string;
  id?: string;
}

/**
 * 인증 컨텍스트 타입
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string, email: string) => void;
  logout: () => void;
}

/**
 * 인증 컨텍스트
 *
 * AuthProvider에서 사용하고 useAuth에서 접근합니다.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
