import { vi } from 'vitest';
import { setupMaterialUIMocks, setupMuiIconsMocks } from './mui';
import { mockApiData as _mockApiData, setupApiMocks as _setupApiMocks } from './api';

// Material UI 모킹
export { setupMaterialUIMocks, setupMuiIconsMocks } from './mui';

// 컴포넌트 모킹
export { setupRouterMocks, setupTransactionModalMock, setupAccountModalMock, mockNavigate } from './components';

// API 모킹
export const mockApiData = _mockApiData;
export const setupApiMocks = _setupApiMocks;

/**
 * 테스트 모킹 세팅
 *
 * 테스트에 필요한 모든 모킹을 한번에 설정합니다.
 */
export const setupTestMocks = () => {
  // Material UI 모킹
  setupMaterialUIMocks();
  setupMuiIconsMocks();

  // API 모킹
  _setupApiMocks();
};

/**
 * 테스트 유틸리티 함수
 *
 * 테스트에 필요한 유틸리티 함수들을 제공합니다.
 */
export const resetTestEnv = () => {
  // DOM 초기화
  document.body.innerHTML = '<div></div>';

  // 모든 모킹 초기화
  vi.clearAllMocks();
};

/**
 * API 모킹 헬퍼 함수
 *
 * 개별 테스트 파일에서 API 모킹을 쉽게 설정할 수 있도록 도와주는 유틸리티 함수
 * 이 함수는 setupApiMocks와 충돌하므로 필요할 때만 사용하세요.
 */
export const setupCustomApiMocks = <T extends Record<string, unknown>>(services: T): T => {
  // 모킹 초기화
  vi.clearAllMocks();

  // 서비스가 없으면 그대로 반환
  if (!services) return services;

  // 각 서비스의 모든 메서드 모킹 설정
  Object.entries(services).forEach(([serviceName, mockImplementation]) => {
    if (mockImplementation && typeof mockImplementation === 'object') {
      Object.entries(mockImplementation as Record<string, unknown>).forEach(([methodName, mockFn]) => {
        if (typeof mockFn === 'function') {
          const service = services[serviceName];
          if (service && typeof service === 'object' && methodName in service) {
            Object.defineProperty(service, methodName, {
              value: vi.fn(mockFn as (...args: unknown[]) => unknown)
            });
          }
        }
      });
    }
  });

  return services;
};
