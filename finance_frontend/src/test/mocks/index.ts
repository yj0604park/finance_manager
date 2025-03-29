import { vi } from 'vitest';
import { setupMaterialUIMocks, setupMuiIconsMocks } from './mui';
import { setupApiMocks, mockApiData } from './api';
import { setupRouterMocks, setupTransactionModalMock, setupAccountModalMock } from './components';

// Material UI 모킹
export { setupMaterialUIMocks, setupMuiIconsMocks } from './mui';

// API 서비스 모킹
export { setupApiMocks, mockApiData } from './api';

// 컴포넌트 모킹
export { setupRouterMocks, setupTransactionModalMock, setupAccountModalMock } from './components';

/**
 * 테스트 모킹 세팅
 *
 * 테스트에 필요한 모든 모킹을 한번에 설정합니다.
 * 모든 vi.mock 호출은 파일 최상단에서 호이스팅되어 실행됩니다.
 */
export const setupTestMocks = () => {
  // API 서비스 모킹
  setupApiMocks();

  // Material UI 모킹
  setupMaterialUIMocks();
  setupMuiIconsMocks();
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
