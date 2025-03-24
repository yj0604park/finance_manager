// API 기본 URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// 인증 관련 엔드포인트
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth-token/`,
  REGISTER: `${API_BASE_URL}/api/register/`,
  VERIFY_EMAIL: `${API_BASE_URL}/rest-auth/registration/verify-email/`,
  CONFIRM_EMAIL: `${API_BASE_URL}/rest-auth/registration/account-confirm-email/`,
};

// 기타 API 엔드포인트들은 필요에 따라 추가
export const API_ENDPOINTS = {
  TRANSACTIONS: `${API_BASE_URL}/api/transactions/`,
  BANKS: `${API_BASE_URL}/api/banks/`,
  ACCOUNTS: `${API_BASE_URL}/api/accounts/`,
  // 추가 엔드포인트...
};

// API 호출 기본 설정
export const API_CONFIG = {
  HEADERS: {
    'Content-Type': 'application/json',
  },
}; 