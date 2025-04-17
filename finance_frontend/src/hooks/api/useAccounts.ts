import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountsWrapper } from '../../api/wrappers';
import type { Account, CreateAccountDto, UpdateAccountDto } from '../../types/models';

// 쿼리 키 상수
export const ACCOUNTS_QUERY_KEY = 'accounts';

/**
 * 계좌 목록을 가져오는 훅
 */
export const useAccounts = () => {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY],
    queryFn: () => AccountsWrapper.getAll()
  });
};

/**
 * 특정 계좌를 가져오는 훅
 */
export const useAccount = (id: number) => {
  return useQuery({
    queryKey: [ACCOUNTS_QUERY_KEY, id],
    queryFn: () => AccountsWrapper.getById(id),
    enabled: !!id // id가 존재할 때만 쿼리 실행
  });
};

/**
 * 계좌 생성 훅
 */
export const useCreateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountDto) => AccountsWrapper.create(data),
    onSuccess: () => {
      // 계좌 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
    }
  });
};

/**
 * 계좌 업데이트 훅
 */
export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAccountDto }) => {
      return AccountsWrapper.update(id, data);
    },
    onSuccess: (updated: Account) => {
      // 계좌 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      // 특정 계좌 캐시 업데이트
      queryClient.setQueryData([ACCOUNTS_QUERY_KEY, updated.id], updated);
    }
  });
};

/**
 * 계좌 삭제 훅
 */
export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AccountsWrapper.delete(id),
    onSuccess: (_, id) => {
      // 계좌 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEY] });
      // 특정 계좌 캐시 제거
      queryClient.removeQueries({ queryKey: [ACCOUNTS_QUERY_KEY, id] });
    }
  });
};
