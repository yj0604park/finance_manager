import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BanksClient } from '../../api/clients/BanksClient';
import { CreateBankDto, UpdateBankDto } from '../../types/models';
import { BankFilterParams } from '../../types/api';

// 쿼리 키
export const banksKeys = {
  all: ['banks'] as const,
  lists: () => [...banksKeys.all, 'list'] as const,
  list: (filters: BankFilterParams) => [...banksKeys.lists(), filters] as const,
  details: () => [...banksKeys.all, 'detail'] as const,
  detail: (id: number) => [...banksKeys.details(), id] as const,
};

/**
 * 은행 목록 조회 쿼리 훅
 * @param params 필터링 파라미터 (클라이언트 측 필터링에만 사용됨)
 */
export const useBanksQuery = (params?: BankFilterParams) => {
  return useQuery({
    queryKey: banksKeys.list(params || {}),
    queryFn: async () => {
      // BanksClient.getAll은 매개변수를 받지 않음
      // params는 쿼리 키와 클라이언트 측 필터링에만 사용
      return await BanksClient.getAll();
    },
  });
};

/**
 * 은행 상세 조회 쿼리 훅
 * @param id 은행 ID
 */
export const useBankQuery = (id: number) => {
  return useQuery({
    queryKey: banksKeys.detail(id),
    queryFn: () => BanksClient.getById(id),
    enabled: !!id, // id가 유효할 때만 쿼리 실행
  });
};

/**
 * 은행 생성 뮤테이션 훅
 */
export const useCreateBankMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBankDto) => BanksClient.create(data),
    onSuccess: () => {
      // 은행 목록 쿼리 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
    },
  });
};

/**
 * 은행 수정 뮤테이션 훅
 */
export const useUpdateBankMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBankDto }) =>
      BanksClient.update(id, data),
    onSuccess: (updatedBank) => {
      // 수정된 은행 상세 쿼리 업데이트
      queryClient.setQueryData(banksKeys.detail(updatedBank.id), updatedBank);
      // 은행 목록 쿼리 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
    },
  });
};

/**
 * 은행 삭제 뮤테이션 훅
 */
export const useDeleteBankMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => BanksClient.delete(id),
    onSuccess: (_, id) => {
      // 삭제된 은행 상세 쿼리 무효화
      queryClient.removeQueries({ queryKey: banksKeys.detail(id) });
      // 은행 목록 쿼리 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: banksKeys.lists() });
    },
  });
};
