import { useContext } from 'react';
import { AuthContext, AuthContextType } from './auth-context-types';

/**
 * 인증 컨텍스트를 사용하기 위한 훅
 *
 * 이 훅은 AuthProvider 내부에서만 사용할 수 있습니다.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
