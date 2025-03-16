// 토큰 저장
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// 토큰 가져오기
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// 토큰 삭제 (로그아웃)
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// 로그인 상태 확인
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

// API 요청에 사용할 인증 헤더
export const getAuthHeader = (): Record<string, string> => {
  const token = getAuthToken();
  return token ? { Authorization: `Token ${token}` } : {};
}; 