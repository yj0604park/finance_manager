import { vi } from 'vitest';
import { mockSalaries } from './salaries';

// 모킹된 Hook 반환값
export const mockQueryResult = {
  data: mockSalaries,
  isLoading: false,
  isSuccess: true,
  error: null
};

export const mockMutationResult = {
  mutate: vi.fn(),
  mutateAsync: vi.fn(),
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  reset: vi.fn()
};
