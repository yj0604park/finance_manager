import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OpenAPI } from '../core/OpenAPI';
import { SalariesClient } from './SalariesClient';
import { Salary, CreateSalaryDto, UpdateSalaryDto } from '../models/Salary';

// 전역 fetch 모킹
global.fetch = vi.fn();

describe('SalariesClient', () => {
  // 테스트 전에 fetch와 OpenAPI 설정을 초기화
  beforeEach(() => {
    vi.resetAllMocks();
    (global.fetch as any).mockClear();
    OpenAPI.BASE = 'http://test-api';
    OpenAPI.TOKEN = 'test-token';
  });

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

  const mockCreateSalaryDto: CreateSalaryDto = {
    date: '2023-05-15',
    amount: 2500000,
    currency: 'KRW',
    gross_amount: 3000000,
    tax_amount: 300000,
    insurance_amount: 150000,
    pension_amount: 50000,
    company: '테스트 회사',
    department: '개발팀',
    position: '시니어 개발자'
  };

  const mockUpdateSalaryDto: UpdateSalaryDto = {
    amount: 2600000
  };

  describe('getAll', () => {
    it('모든 급여 데이터를 성공적으로 조회해야 함', async () => {
      // fetch 응답 모킹
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSalaries
      });

      const result = await SalariesClient.getAll();

      // fetch가 올바른 URL과 매개변수로 호출되었는지 검증
      expect(global.fetch).toHaveBeenCalledWith('http://test-api/salaries', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      });

      // 결과가 예상과 일치하는지 검증
      expect(result).toEqual(mockSalaries);
    });

    it('API 오류가 발생하면 에러를 던져야 함', async () => {
      // fetch 응답 모킹 - 오류 상황
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: '서버 오류'
      });

      // 예외가 발생하는지 검증
      await expect(SalariesClient.getAll()).rejects.toThrow('급여 데이터를 가져오는데 실패했습니다: 500 서버 오류');
    });
  });

  describe('getById', () => {
    it('특정 ID의 급여 데이터를 성공적으로 조회해야 함', async () => {
      // fetch 응답 모킹
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSalary
      });

      const result = await SalariesClient.getById(1);

      // fetch가 올바른 URL과 매개변수로 호출되었는지 검증
      expect(global.fetch).toHaveBeenCalledWith('http://test-api/salaries/1', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      });

      // 결과가 예상과 일치하는지 검증
      expect(result).toEqual(mockSalary);
    });
  });

  describe('create', () => {
    it('새로운 급여 데이터를 성공적으로 생성해야 함', async () => {
      // fetch 응답 모킹
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockSalary
      });

      const result = await SalariesClient.create(mockCreateSalaryDto);

      // fetch가 올바른 URL과 매개변수로 호출되었는지 검증
      expect(global.fetch).toHaveBeenCalledWith('http://test-api/salaries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify(mockCreateSalaryDto)
      });

      // 결과가 예상과 일치하는지 검증
      expect(result).toEqual(mockSalary);
    });
  });

  describe('update', () => {
    it('기존 급여 데이터를 성공적으로 수정해야 함', async () => {
      const updatedSalary = { ...mockSalary, amount: 2600000 };

      // fetch 응답 모킹
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => updatedSalary
      });

      const result = await SalariesClient.update(1, mockUpdateSalaryDto);

      // fetch가 올바른 URL과 매개변수로 호출되었는지 검증
      expect(global.fetch).toHaveBeenCalledWith('http://test-api/salaries/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        },
        body: JSON.stringify(mockUpdateSalaryDto)
      });

      // 결과가 예상과 일치하는지 검증
      expect(result).toEqual(updatedSalary);
    });
  });

  describe('delete', () => {
    it('급여 데이터를 성공적으로 삭제해야 함', async () => {
      // fetch 응답 모킹
      (global.fetch as any).mockResolvedValueOnce({
        ok: true
      });

      await SalariesClient.delete(1);

      // fetch가 올바른 URL과 매개변수로 호출되었는지 검증
      expect(global.fetch).toHaveBeenCalledWith('http://test-api/salaries/1', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-token'
        }
      });
    });
  });
});
