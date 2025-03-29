import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountsClient } from '../../api/clients/AccountsClient';
import { CreateAccountDto, UpdateAccountDto } from '../../types/models';
import { AccountFilterParams } from '../../types/api';

// 쿼리 키
export const accountsKeys = {
  all: ['accounts'] as const,
  lists: () => [...accountsKeys.all, 'list'] as const,
  list: (filters: AccountFilterParams) => [...accountsKeys.lists(), filters] as const,
  details: () => [...accountsKeys.all, 'detail'] as const,
  detail: (id: number) => [...accountsKeys.details(), id] as const,
  byBank: (bankId: number) => [...accountsKeys.lists(), { bankId }] as const,
};

/**
 * 계좌 목록 조회 쿼리 훅
 * @param params 필터링 파라미터
 */
export const useAccountsQuery = (params?: AccountFilterParams) => {
  return useQuery({
    queryKey: accountsKeys.list(params || {}),
    queryFn: () => AccountsClient.getAll(params),
  });
};

/**
 * 특정 은행의 계좌 목록 조회 쿼리 훅
 * @param bankId 은행 ID
 */
export const useAccountsByBankQuery = (bankId: number) => {
  return useQuery({
    queryKey: accountsKeys.byBank(bankId),
    queryFn: () => AccountsClient.getAll({ bank: bankId }),
    enabled: !!bankId, // bankId가 유효할 때만 쿼리 실행
  });
};

/**
 * 계좌 상세 조회 쿼리 훅
 * @param id 계좌 ID
 */
export const useAccountQuery = (id: number) => {
  return useQuery({
    queryKey: accountsKeys.detail(id),
    queryFn: () => AccountsClient.getById(id),
    enabled: !!id, // id가 유효할 때만 쿼리 실행
  });
};

/**
 * 계좌 생성 뮤테이션 훅
 */
export const useCreateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAccountDto) => AccountsClient.create(data),
    onSuccess: (newAccount) => {
      // 계좌 목록 쿼리 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });

      // 해당 은행의 계좌 목록도 무효화
      if (newAccount.bank) {
        queryClient.invalidateQueries({ queryKey: accountsKeys.byBank(newAccount.bank) });
      }
    },
  });
};

/**
 * 계좌 수정 뮤테이션 훅
 */
export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAccountDto }) =>
      AccountsClient.update(id, data),
    onSuccess: (updatedAccount) => {
      // 수정된 계좌 상세 쿼리 업데이트
      queryClient.setQueryData(accountsKeys.detail(updatedAccount.id), updatedAccount);

      // 계좌 목록 쿼리 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });

      // 해당 은행의 계좌 목록도 무효화
      if (updatedAccount.bank) {
        queryClient.invalidateQueries({ queryKey: accountsKeys.byBank(updatedAccount.bank) });
      }
    },
  });
};

/**
 * 계좌 삭제 뮤테이션 훅
 */
export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (accountToDelete: { id: number; bankId?: number }) =>
      AccountsClient.delete(accountToDelete.id),
    onSuccess: (_, accountToDelete) => {
      // 삭제된 계좌 상세 쿼리 무효화
      queryClient.removeQueries({ queryKey: accountsKeys.detail(accountToDelete.id) });

      // 계좌 목록 쿼리 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: accountsKeys.lists() });

      // 해당 은행의 계좌 목록도 무효화
      if (accountToDelete.bankId) {
        queryClient.invalidateQueries({ queryKey: accountsKeys.byBank(accountToDelete.bankId) });
      }
    },
  });
};
