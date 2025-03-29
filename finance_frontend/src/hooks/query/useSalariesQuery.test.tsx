import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SalariesClient } from '../../api/clients/SalariesClient';
import {
  useSalariesQuery,
  useSalaryQuery,
  useCreateSalaryMutation,
  useUpdateSalaryMutation,
  useDeleteSalaryMutation,
  salariesKeys
} from './useSalariesQuery';
import { Salary, CreateSalaryDto, UpdateSalaryDto } from '../../api/models/Salary';
import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// SalariesClient 메서드를 모킹
vi.mock('../../api/clients/SalariesClient', () => ({
  SalariesClient: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  }
}));

// 테스트용 래퍼 생성
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function TestWrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
};

describe('useSalariesQuery', () => {
  const mockSalary: Salary = {
    id: 1,
    date: '2023-05-15',
    amount: 2500000,
    currency: 'KRW',
    gross_amount: 3000000,
    tax_amount: 300000,
    insurance_amount: 150000,
    pension_amount: 50000,
    company: '테스트 회사',
    department: '개발팀',
    position: '시니어 개발자',
    created_at: '2023-05-15T09:00:00Z',
    updated_at: '2023-05-15T09:00:00Z'
  };

  const mockSalaries: Salary[] = [
    mockSalary,
    {
      ...mockSalary,
      id: 2,
      date: '2023-06-15',
      amount: 2600000
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('모든 급여 목록을 성공적으로 조회해야 함', async () => {
    (SalariesClient.getAll as any).mockResolvedValue(mockSalaries);

    const { result } = renderHook(() => useSalariesQuery(), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(SalariesClient.getAll).toHaveBeenCalledTimes(1);
    expect(result.current.data).toEqual(mockSalaries);
  });

  it('필터링 함수가 있으면 데이터를 필터링해야 함', async () => {
    (SalariesClient.getAll as any).mockResolvedValue(mockSalaries);

    // 회사명이 '테스트 회사'인 급여만 필터링
    const filterFn = (salary: Salary) => salary.company === '테스트 회사';

    const { result } = renderHook(() => useSalariesQuery(filterFn), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(SalariesClient.getAll).toHaveBeenCalledTimes(1);
    expect(result.current.data?.length).toBe(2); // 모든 데이터가 조건을 만족
  });
});

describe('useSalaryQuery', () => {
  const mockSalary: Salary = {
    id: 1,
    date: '2023-05-15',
    amount: 2500000,
    currency: 'KRW',
    company: '테스트 회사',
    created_at: '2023-05-15T09:00:00Z',
    updated_at: '2023-05-15T09:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('특정 ID의 급여 정보를 조회해야 함', async () => {
    (SalariesClient.getById as any).mockResolvedValue(mockSalary);

    const { result } = renderHook(() => useSalaryQuery(1), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(SalariesClient.getById).toHaveBeenCalledWith(1);
    expect(result.current.data).toEqual(mockSalary);
  });

  it('ID가 없으면 쿼리를 실행하지 않아야 함', async () => {
    const { result } = renderHook(() => useSalaryQuery(null), {
      wrapper: createWrapper()
    });

    expect(result.current.isLoading).toBe(false);
    expect(SalariesClient.getById).not.toHaveBeenCalled();
  });
});

describe('useCreateSalaryMutation', () => {
  const mockCreateDto: CreateSalaryDto = {
    date: '2023-05-15',
    amount: 2500000,
    currency: 'KRW',
    company: '테스트 회사'
  };

  const mockCreatedSalary: Salary = {
    id: 1,
    date: '2023-05-15',
    amount: 2500000,
    currency: 'KRW',
    company: '테스트 회사',
    created_at: '2023-05-15T09:00:00Z',
    updated_at: '2023-05-15T09:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('급여 정보를 성공적으로 생성해야 함', async () => {
    (SalariesClient.create as any).mockResolvedValue(mockCreatedSalary);

    const { result } = renderHook(() => useCreateSalaryMutation(), {
      wrapper: createWrapper()
    });

    result.current.mutate(mockCreateDto);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(SalariesClient.create).toHaveBeenCalledWith(mockCreateDto);
  });
});

describe('useUpdateSalaryMutation', () => {
  const mockUpdateDto: UpdateSalaryDto = {
    amount: 2600000
  };

  const mockUpdatedSalary: Salary = {
    id: 1,
    date: '2023-05-15',
    amount: 2600000,
    currency: 'KRW',
    company: '테스트 회사',
    created_at: '2023-05-15T09:00:00Z',
    updated_at: '2023-05-16T09:00:00Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('급여 정보를 성공적으로 수정해야 함', async () => {
    (SalariesClient.update as any).mockResolvedValue(mockUpdatedSalary);

    const { result } = renderHook(() => useUpdateSalaryMutation(), {
      wrapper: createWrapper()
    });

    result.current.mutate({ id: 1, data: mockUpdateDto });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(SalariesClient.update).toHaveBeenCalledWith(1, mockUpdateDto);
  });
});

describe('useDeleteSalaryMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('급여 정보를 성공적으로 삭제해야 함', async () => {
    (SalariesClient.delete as any).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteSalaryMutation(), {
      wrapper: createWrapper()
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(SalariesClient.delete).toHaveBeenCalledWith(1);
  });
});

describe('salariesKeys', () => {
  it('쿼리 키가 올바르게 생성되어야 함', () => {
    expect(salariesKeys.all).toEqual(['salaries']);
    expect(salariesKeys.lists()).toEqual(['salaries', 'list']);
    expect(salariesKeys.list({ status: 'active' })).toEqual(['salaries', 'list', { status: 'active' }]);
    expect(salariesKeys.details()).toEqual(['salaries', 'detail']);
    expect(salariesKeys.detail(1)).toEqual(['salaries', 'detail', 1]);
  });
});
