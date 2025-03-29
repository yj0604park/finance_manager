import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  QueryFunctionContext,
} from '@tanstack/react-query';
import { SalariesClient } from '../../api/clients/SalariesClient';
import { Salary, CreateSalaryDto, UpdateSalaryDto } from '../../api/models/Salary';
import { FilterFunction } from '../../types/filter';

/**
 * 급여 데이터를 위한 쿼리 키
 */
export const salariesKeys = {
  all: ['salaries'] as const,
  lists: () => [...salariesKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...salariesKeys.lists(), { ...filters }] as const,
  details: () => [...salariesKeys.all, 'detail'] as const,
  detail: (id: number) => [...salariesKeys.details(), id] as const,
};

/**
 * 급여 목록을 조회하는 쿼리 훅
 * @param filterFn 클라이언트 측 필터링 함수 (선택사항)
 */
export const useSalariesQuery = (filterFn?: (salary: Salary) => boolean) => {
  return useQuery({
    queryKey: salariesKeys.lists(),
    queryFn: async () => {
      const data = await SalariesClient.getAll();
      return filterFn ? data.filter(filterFn) : data;
    },
  });
};

/**
 * 특정 급여 상세 정보를 조회하는 쿼리 훅
 * @param id 급여 ID
 */
export const useSalaryQuery = (id: number | null) => {
  return useQuery({
    queryKey: salariesKeys.detail(id || 0),
    queryFn: () => SalariesClient.getById(id as number),
    enabled: !!id, // ID가 있을 때만 쿼리 실행
  });
};

/**
 * 새로운 급여 추가 뮤테이션 훅
 */
export const useCreateSalaryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSalaryDto) => SalariesClient.create(data),
    onSuccess: () => {
      // 급여 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: salariesKeys.lists() });
    },
  });
};

/**
 * 급여 정보 수정 뮤테이션 훅
 */
export const useUpdateSalaryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSalaryDto }) =>
      SalariesClient.update(id, data),
    onSuccess: (updatedSalary) => {
      // 특정 급여 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: salariesKeys.detail(updatedSalary.id)
      });
      // 급여 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: salariesKeys.lists()
      });
    },
  });
};

/**
 * 급여 삭제 뮤테이션 훅
 */
export const useDeleteSalaryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SalariesClient.delete(id),
    onSuccess: (_data, id) => {
      // 특정 급여 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: salariesKeys.detail(id)
      });
      // 급여 목록 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: salariesKeys.lists()
      });
    },
  });
};
