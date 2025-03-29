import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BanksWrapper } from '../../api/wrappers';
import type { Bank, CreateBankDto, UpdateBankDto } from '../../types/models';

// 쿼리 키 상수
export const BANKS_QUERY_KEY = 'banks';

/**
 * 은행 목록을 가져오는 훅
 */
export const useBanks = () => {
  return useQuery({
    queryKey: [BANKS_QUERY_KEY],
    queryFn: () => BanksWrapper.getAll()
  });
};

/**
 * 특정 은행을 가져오는 훅
 */
export const useBank = (id: number) => {
  return useQuery({
    queryKey: [BANKS_QUERY_KEY, id],
    queryFn: () => BanksWrapper.getById(id),
    enabled: !!id // id가 존재할 때만 쿼리 실행
  });
};

/**
 * 은행 생성 훅
 */
export const useCreateBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBankDto) => BanksWrapper.create(data),
    onSuccess: () => {
      // 은행 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [BANKS_QUERY_KEY] });
    }
  });
};

/**
 * 은행 업데이트 훅
 */
export const useUpdateBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBankDto }) =>
      BanksWrapper.update(id, data),
    onSuccess: (updated: Bank) => {
      // 은행 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [BANKS_QUERY_KEY] });
      // 특정 은행 캐시 업데이트
      queryClient.setQueryData([BANKS_QUERY_KEY, updated.id], updated);
    }
  });
};

/**
 * 은행 삭제 훅
 */
export const useDeleteBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => BanksWrapper.delete(id),
    onSuccess: (_, id) => {
      // 은행 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [BANKS_QUERY_KEY] });
      // 특정 은행 캐시 제거
      queryClient.removeQueries({ queryKey: [BANKS_QUERY_KEY, id] });
    }
  });
};
