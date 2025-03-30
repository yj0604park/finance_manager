import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/**
 * React Query 클라이언트를 포함한 테스트 래퍼
 */
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      gcTime: 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

type CustomRenderOptions = {
  queryClient?: QueryClient;
} & Omit<RenderOptions, 'wrapper'>;

/**
 * React Query가 포함된 상태로 컴포넌트를 렌더링하는 함수
 * @param ui 렌더링할 React 요소
 * @param options 렌더링 옵션
 */
export function renderWithQueryClient(
  ui: ReactElement,
  { queryClient = createTestQueryClient(), ...renderOptions }: CustomRenderOptions = {}
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * 비동기 작업이 완료될 때까지 대기
 */
export const waitForAsyncEvents = () => new Promise(resolve => setTimeout(resolve, 0));

/**
 * 모든 Promise가 해결될 때까지 대기
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve));
