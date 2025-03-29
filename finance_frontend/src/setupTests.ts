import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { setupMaterialUIMocks, setupMuiIconsMocks } from './test/mocks/mui';
import { setupRouterMocks } from './test/mocks/components';

// jest-dom은 DOM 노드에 대한 어설션을 위한 커스텀 jest 매처를 추가합니다.
// 이를 통해 expect(element).toHaveTextContent(/react/i)와 같은 어설션이 가능합니다.
// 자세한 정보: https://github.com/testing-library/jest-dom

// 전역 fetch 모킹
// @ts-ignore
global.fetch = vi.fn();

// intersectionObserver 모킹 (React Testing Library에서 필요)
class IntersectionObserverMock {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor() {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
}

// 전역 IntersectionObserver 설정
(global as any).IntersectionObserver = IntersectionObserverMock;

// ResizeObserver 모킹
class ResizeObserverMock {
  constructor() {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

(global as any).ResizeObserver = ResizeObserverMock;

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

// 테스트 사이에 모든 모킹을 초기화하는 전역 설정
beforeEach(() => {
  vi.clearAllMocks();
});

// 테스트 환경에서 console.error, console.warn 억제 (필요한 경우)
// vi.spyOn(console, 'error').mockImplementation(() => {});
// vi.spyOn(console, 'warn').mockImplementation(() => {});
