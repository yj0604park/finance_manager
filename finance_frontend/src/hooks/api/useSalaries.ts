import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SalariesWrapper } from '../../api/wrappers';
import { Salary } from '../../api/models/Salary';
import { PatchedSalary } from '../../api/models/PatchedSalary';

// 쿼리 키 상수
export const SALARIES_QUERY_KEY = 'salaries';

/**
 * 모든 급여 정보를 가져오는 훅
 */
export function useSalaries() {
  return useQuery({
    queryKey: [SALARIES_QUERY_KEY],
    queryFn: () => SalariesWrapper.getAll(),
  });
}

/**
 * 특정 ID의 급여 정보를 가져오는 훅
 */
export function useSalary(id?: number) {
  return useQuery({
    queryKey: [SALARIES_QUERY_KEY, id],
    queryFn: () => SalariesWrapper.getById(id!),
    enabled: !!id,
  });
}

/**
 * 새 급여 정보를 생성하는 훅
 */
export function useCreateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Salary) => SalariesWrapper.create(data),
    onSuccess: () => {
      // 급여 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [SALARIES_QUERY_KEY] });
    },
  });
}

/**
 * 급여 정보를 업데이트하는 훅
 */
export function useUpdateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Salary }) =>
      SalariesWrapper.update(id, data),
    onSuccess: (updatedSalary) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [SALARIES_QUERY_KEY] });
      // 개별 항목 캐시 업데이트
      queryClient.setQueryData(
        [SALARIES_QUERY_KEY, updatedSalary.id],
        updatedSalary
      );
    },
  });
}

/**
 * 급여 정보를 부분 업데이트하는 훅
 */
export function usePartialUpdateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PatchedSalary }) =>
      SalariesWrapper.partialUpdate(id, data),
    onSuccess: (updatedSalary) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [SALARIES_QUERY_KEY] });
      // 개별 항목 캐시 업데이트
      queryClient.setQueryData(
        [SALARIES_QUERY_KEY, updatedSalary.id],
        updatedSalary
      );
    },
  });
}

/**
 * 급여 정보를 삭제하는 훅
 */
export function useDeleteSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SalariesWrapper.delete(id),
    onSuccess: (_data, id) => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [SALARIES_QUERY_KEY] });
      // 개별 항목 캐시 제거
      queryClient.removeQueries({ queryKey: [SALARIES_QUERY_KEY, id] });
    },
  });
}
