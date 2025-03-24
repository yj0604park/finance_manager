/**
 * API client configuration and helper functions for the finance_backend API.
 * This file provides a centralized way to configure and use the API client.
 */

import { OpenAPI } from './core/OpenAPI';
import { AuthTokenService } from './services/AuthTokenService';
import { RestAuthService } from './services/RestAuthService';
import { AccountsService } from './services/AccountsService';
import { BanksService } from './services/BanksService';
import type { AuthToken } from './models/AuthToken';
import type { Login } from './models/Login';

// Configure the base URL from environment variables
// For development, it uses the VITE_API_BASE_URL environment variable
// or defaults to http://localhost:8000
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Set the base URL for the API client
OpenAPI.BASE = BASE_URL;

// Token storage key
const TOKEN_STORAGE_KEY = 'finance_api_token';

/**
 * Initialize the API client with authentication from local storage (if available)
 */
export function initializeApiClient(): void {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    setAuthToken(token);
  }
}

/**
 * Set the authentication token for API requests
 */
export function setAuthToken(token: string): void {
  if (!token) return;

  // 토큰 저장
  OpenAPI.TOKEN = token;

  // 인증 헤더 설정
  OpenAPI.HEADERS = {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
}

/**
 * Clear the authentication token
 */
export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  OpenAPI.TOKEN = undefined;
  OpenAPI.HEADERS = undefined;
}

/**
 * Login with email and password using the REST Auth endpoint
 */
export async function login(email: string, password: string): Promise<string> {
  try {
    // Try the REST Auth login first
    const loginData: Login = {
      email,
      password,
    };

    const response = await RestAuthService.restAuthLoginCreate(loginData);
    const token = response.key;

    // Save the token to localStorage and configure the API client
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setAuthToken(token);

    return token;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

/**
 * Alternative login method using the auth-token endpoint
 */
export async function loginWithAuthToken(email: string, password: string): Promise<string> {
  try {
    const authData: AuthToken = {
      email,
      password,
      token: '',
    };

    const response = await AuthTokenService.authTokenCreate(authData);
    const token = response.token;

    // Save the token to localStorage and configure the API client
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    setAuthToken(token);

    return token;
  } catch (error) {
    console.error('Auth token login failed:', error);
    throw error;
  }
}

/**
 * Logout the user
 */
export async function logout(): Promise<void> {
  try {
    // 토큰이 있을 때만 로그아웃 API 호출
    if (OpenAPI.TOKEN) {
      await RestAuthService.restAuthLogoutCreate();
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthToken();
  }
}

// Export commonly used services for direct import
export {
  AccountsService,
  BanksService
};

// Initialize the client when this module is imported
initializeApiClient();
