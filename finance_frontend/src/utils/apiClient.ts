import { API_CONFIG } from '../constants/api';
import { getAuthHeader } from './auth';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';

interface ApiOptions {
  requireAuth?: boolean;
  customHeaders?: Record<string, string>;
}

/**
 * API 요청을 처리하는 범용 함수
 */
export async function apiRequest<T = any>(
  url: string, 
  method: HttpMethod = 'GET', 
  data?: any, 
  options: ApiOptions = { requireAuth: false }
): Promise<T> {
  const headers = {
    ...API_CONFIG.HEADERS,
    ...(options.requireAuth ? getAuthHeader() : {}),
    ...(options.customHeaders || {})
  };

  const config: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };

  if (data && (method !== 'GET' && method !== 'HEAD')) {
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      responseData.detail || 
      responseData.message || 
      responseData.error || 
      '요청을 처리하는 중 오류가 발생했습니다.'
    );
    throw Object.assign(error, { statusCode: response.status, data: responseData });
  }

  return responseData;
}

/**
 * API 요청 함수들
 */
export const api = {
  get: <T = any>(url: string, options?: ApiOptions) => 
    apiRequest<T>(url, 'GET', undefined, options),
  
  post: <T = any>(url: string, data?: any, options?: ApiOptions) => 
    apiRequest<T>(url, 'POST', data, options),
  
  put: <T = any>(url: string, data?: any, options?: ApiOptions) => 
    apiRequest<T>(url, 'PUT', data, options),
  
  patch: <T = any>(url: string, data?: any, options?: ApiOptions) => 
    apiRequest<T>(url, 'PATCH', data, options),
  
  delete: <T = any>(url: string, options?: ApiOptions) => 
    apiRequest<T>(url, 'DELETE', undefined, options)
}; 