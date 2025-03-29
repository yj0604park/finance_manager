import { useContext } from 'react';
import { AuthContext, AuthContextType } from './auth-context-types';

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
