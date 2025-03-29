import { renderHook, waitFor } from '@testing-library/react';
import { SalariesWrapper } from '../../api/wrappers/SalariesWrapper';
import {
  useSalariesQuery,
  useSalaryQuery,
  useCreateSalaryMutation,
  useUpdateSalaryMutation,
  useDeleteSalaryMutation,
} from './useSalariesQuery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, expect, describe, it, beforeEach } from 'vitest';

// 테스트 데이터
const mockSalaries = [{ id: 1, date: '2023-01-01', net_pay: '1000000', gross_pay: '1200000', tax_withheld: '100000', deduction: '100000', adjustment: '0', currency: 'KRW', created_at: '', updated_at: '', gross_pay_detail: {}, adjustment_detail: {}, tax_withheld_detail: {}, deduction_detail: {} }];
const mockSalary = mockSalaries[0];
const mockCreatedSalary = { ...mockSalary, id: 2 };
const mockUpdatedSalary = { ...mockSalary, net_pay: '1100000' };

// SalariesWrapper 메서드를 모킹
vi.mock('../../api/wrappers/SalariesWrapper', () => ({
  SalariesWrapper: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    partialUpdate: vi.fn(),
    delete: vi.fn(),
  },
}));

// React Query 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Salaries Query Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('useSalariesQuery', () => {
    it('모든 급여 목록을 반환해야 함', async () => {
      // SalariesWrapper.getAll 메서드가 모의 데이터를 반환하도록 설정
      (SalariesWrapper.getAll as any).mockResolvedValue(mockSalaries);

      const { result } = renderHook(() => useSalariesQuery(), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSalaries);
      expect(SalariesWrapper.getAll).toHaveBeenCalledTimes(1);
    });

    it('필터 함수를 적용하여 필터링된 급여 목록을 반환해야 함', async () => {
      (SalariesWrapper.getAll as any).mockResolvedValue(mockSalaries);

      const filterFn = (salary: any) => salary.id === 1;

      const { result } = renderHook(() => useSalariesQuery(filterFn), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSalaries);
      expect(SalariesWrapper.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('useSalaryQuery', () => {
    it('특정 ID로 급여 정보를 가져와야 함', async () => {
      (SalariesWrapper.getById as any).mockResolvedValue(mockSalary);

      const { result } = renderHook(() => useSalaryQuery(1), {
        wrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockSalary);
      expect(SalariesWrapper.getById).toHaveBeenCalledWith(1);
    });

    it('ID가 null이면 쿼리를 실행하지 않아야 함', async () => {
      const { result } = renderHook(() => useSalaryQuery(null), {
        wrapper,
      });

      expect(result.current.isLoading).toBe(false);
      expect(SalariesWrapper.getById).not.toHaveBeenCalled();
    });
  });

  describe('useCreateSalaryMutation', () => {
    it('새 급여 정보를 생성해야 함', async () => {
      (SalariesWrapper.create as any).mockResolvedValue(mockCreatedSalary);

      const { result } = renderHook(() => useCreateSalaryMutation(), {
        wrapper,
      });

      const mockCreateData = { date: '2023-01-02', net_pay: '900000', gross_pay: '1000000' };

      result.current.mutate(mockCreateData as any);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockCreatedSalary);
      expect(SalariesWrapper.create).toHaveBeenCalledWith(mockCreateData);
    });
  });

  describe('useUpdateSalaryMutation', () => {
    it('기존 급여 정보를 수정해야 함', async () => {
      (SalariesWrapper.update as any).mockResolvedValue(mockUpdatedSalary);

      const { result } = renderHook(() => useUpdateSalaryMutation(), {
        wrapper,
      });

      const mockUpdateData = { net_pay: '1100000' };

      result.current.mutate({ id: 1, data: mockUpdateData as any });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toEqual(mockUpdatedSalary);
      expect(SalariesWrapper.update).toHaveBeenCalledWith(1, mockUpdateData);
    });
  });

  describe('useDeleteSalaryMutation', () => {
    it('급여 정보를 삭제해야 함', async () => {
      (SalariesWrapper.delete as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteSalaryMutation(), {
        wrapper,
      });

      result.current.mutate(1);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(SalariesWrapper.delete).toHaveBeenCalledWith(1);
    });
  });
});
