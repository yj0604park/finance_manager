import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { setupMaterialUIMocks, setupMuiIconsMocks } from './test/mocks/mui';
import { setupRouterMocks } from './test/mocks/components';

// 모든 테스트 전 설정
beforeAll(() => {
  // Material UI 컴포넌트 모킹
  setupMaterialUIMocks();
  setupMuiIconsMocks();

  // 라우터 모킹
  setupRouterMocks();

  console.log('[테스트] 테스트 환경이 초기화되었습니다.');
});

// 각 테스트 사이에 모킹 상태 리셋
afterEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '<div></div>';
});

// Date Picker 모킹
vi.mock('@mui/x-date-pickers/LocalizationProvider', () => ({
  LocalizationProvider: vi.fn(),
}));

vi.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: vi.fn(),
}));

vi.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
  AdapterDateFns: vi.fn(),
}));

// Apollo Client 모킹
vi.mock('@apollo/client', () => {
  return {
    ApolloProvider: vi.fn(),
    useQuery: vi.fn(),
    useMutation: vi.fn().mockReturnValue([vi.fn(), { loading: false }]),
  };
});
