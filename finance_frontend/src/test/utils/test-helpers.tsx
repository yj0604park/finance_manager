import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from '../../styles/theme';
import React from 'react';

/**
 * 테스트 유틸리티 - 컴포넌트 렌더링 헬퍼
 *
 * 테스트에 필요한 프로바이더들을 포함하여 컴포넌트를 렌더링합니다.
 */
export function renderWithProviders(ui: React.ReactElement, options = {}) {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </MemoryRouter>,
    options
  );
}

/**
 * API 서비스 모킹 헬퍼
 *
 * 특정 API 서비스의 메서드를 모킹합니다.
 */
export function mockApiService<T, K extends keyof T>(
  service: T,
  methodName: K,
  mockImplementation: (...args: unknown[]) => unknown
) {
  const mockedService = vi.mocked(service);
  mockedService[methodName] = vi.fn(mockImplementation) as unknown as T[K];
  return service;
}

/**
 * 테스트 데이터 생성 헬퍼
 *
 * 지정된 형태의 테스트 데이터를 개수만큼 생성합니다.
 */
export function generateTestData<T>(
  count: number,
  generator: (index: number) => T
): T[] {
  return Array.from({ length: count }, (_, index) => generator(index));
}

/**
 * 모킹 클리어 헬퍼
 */
export function resetMocks() {
  vi.resetAllMocks();
  document.body.innerHTML = '<div></div>';
}
