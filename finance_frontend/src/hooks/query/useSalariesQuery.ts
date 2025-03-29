import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  QueryFunctionContext,
} from '@tanstack/react-query';
// SalariesClient 대신 기본 제공되는 훅 사용
import {
  useSalaries,
  useSalary,
  useCreateSalary,
  useUpdateSalary,
  useDeleteSalary,
  SALARIES_QUERY_KEY
} from '../api/useSalaries';
import { Salary } from '../../api/models/Salary';
import { FilterFunction } from '../../types/filter';

/**
 * 급여 데이터를 위한 쿼리 키
 * @deprecated - 새로운 useSalaries 훅에서 SALARIES_QUERY_KEY 사용을 권장
 */
export const salariesKeys = {
  all: [SALARIES_QUERY_KEY] as const,
  lists: () => [...salariesKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...salariesKeys.lists(), { ...filters }] as const,
  details: () => [...salariesKeys.all, 'detail'] as const,
  detail: (id: number) => [...salariesKeys.details(), id] as const,
};

/**
 * 급여 목록을 조회하는 쿼리 훅
 * @param filterFn 클라이언트 측 필터링 함수 (선택사항)
 * @deprecated - 새로운 useSalaries 훅 사용을 권장
 */
export const useSalariesQuery = (filterFn?: (salary: Salary) => boolean) => {
  const { data, ...rest } = useSalaries();

  // 필터링된 데이터 반환
  return {
    ...rest,
    data: data && filterFn ? data.filter(filterFn) : data,
  };
};

/**
 * 특정 급여 상세 정보를 조회하는 쿼리 훅
 * @param id 급여 ID
 * @deprecated - 새로운 useSalary 훅 사용을 권장
 */
export const useSalaryQuery = (id: number | null) => {
  return useSalary(id || undefined);
};

/**
 * 새로운 급여 추가 뮤테이션 훅
 * @deprecated - 새로운 useCreateSalary 훅 사용을 권장
 */
export const useCreateSalaryMutation = () => {
  return useCreateSalary();
};

/**
 * 급여 정보 수정 뮤테이션 훅
 * @deprecated - 새로운 useUpdateSalary 훅 사용을 권장
 */
export const useUpdateSalaryMutation = () => {
  return useUpdateSalary();
};

/**
 * 급여 삭제 뮤테이션 훅
 * @deprecated - 새로운 useDeleteSalary 훅 사용을 권장
 */
export const useDeleteSalaryMutation = () => {
  return useDeleteSalary();
};
