import {
  useAccounts,
  useAccount,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  ACCOUNTS_QUERY_KEY
} from '../api/useAccounts';
import { AccountFilterParams } from '../../types/api';
import { Account } from '../../types/models';

// 쿼리 키
export const accountsKeys = {
  all: [ACCOUNTS_QUERY_KEY] as const,
  lists: () => [...accountsKeys.all, 'list'] as const,
  list: (filters: AccountFilterParams) => [...accountsKeys.lists(), filters] as const,
  details: () => [...accountsKeys.all, 'detail'] as const,
  detail: (id: number) => [...accountsKeys.details(), id] as const,
  byBank: (bankId: number) => [...accountsKeys.lists(), { bankId }] as const,
};

/**
 * 계좌 목록 조회 쿼리 훅
 * @param params 필터링 파라미터 (클라이언트 측 필터링에만 사용됨)
 * @deprecated - 새로운 useAccounts 훅 사용을 권장
 */
export const useAccountsQuery = (params?: AccountFilterParams) => {
  const { data, ...rest } = useAccounts();

  // 필터링된 데이터 반환
  return {
    ...rest,
    data: data && params ? filterAccounts(data, params) : data,
  };
};

// 클라이언트 측 필터링 함수
const filterAccounts = (accounts: Account[], params: AccountFilterParams): Account[] => {
  if (!params) return accounts;

  return accounts.filter(account => {
    let match = true;
    if (params.bank !== undefined && account.bank !== params.bank) {
      match = false;
    }
    // 여기에 추가 필터 조건 적용 가능
    return match;
  });
};

/**
 * 특정 은행의 계좌 목록 조회 쿼리 훅
 * @param bankId 은행 ID
 * @deprecated - 새로운 useAccounts 훅과 필터링 사용을 권장
 */
export const useAccountsByBankQuery = (bankId: number) => {
  const { data, ...rest } = useAccounts();

  return {
    ...rest,
    data: data && bankId ? data.filter(account => account.bank === bankId) : undefined,
  };
};

/**
 * 계좌 상세 조회 쿼리 훅
 * @param id 계좌 ID
 * @deprecated - 새로운 useAccount 훅 사용을 권장
 */
export const useAccountQuery = (id: number) => {
  return useAccount(id);
};

/**
 * 계좌 생성 뮤테이션 훅
 * @deprecated - 새로운 useCreateAccount 훅 사용을 권장
 */
export const useCreateAccountMutation = () => {
  return useCreateAccount();
};

/**
 * 계좌 수정 뮤테이션 훅
 * @deprecated - 새로운 useUpdateAccount 훅 사용을 권장
 */
export const useUpdateAccountMutation = () => {
  return useUpdateAccount();
};

/**
 * 계좌 삭제 뮤테이션 훅
 * @deprecated - 새로운 useDeleteAccount 훅 사용을 권장
 */
export const useDeleteAccountMutation = () => {
  const deleteAccount = useDeleteAccount();

  // 인터페이스 호환성을 위해 mutationFn 수정
  return {
    ...deleteAccount,
    mutate: (accountToDelete: { id: number; bankId?: number }) =>
      deleteAccount.mutate(accountToDelete.id),
    mutateAsync: (accountToDelete: { id: number; bankId?: number }) =>
      deleteAccount.mutateAsync(accountToDelete.id)
  };
};
