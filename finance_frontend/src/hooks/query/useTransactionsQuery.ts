import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TransactionsService } from '../../api/services/TransactionsService';
import { Transaction } from '../../api/models/Transaction';
import { TransactionFilters, FilterFunction } from '../../types/filter';

// 쿼리 키
export const transactionsKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionsKeys.all, 'list'] as const,
  list: (filters: TransactionFilters) => [...transactionsKeys.lists(), filters] as const,
  details: () => [...transactionsKeys.all, 'detail'] as const,
  detail: (id: number) => [...transactionsKeys.details(), id] as const,
};

/**
 * 거래 내역 목록 조회 쿼리 훅
 * @param params 필터링 파라미터
 * @param filterFn 추가 필터링 함수 (클라이언트 측 필터링)
 */
export const useTransactionsQuery = (params?: TransactionFilters, filterFn?: FilterFunction<Transaction>) => {
  return useQuery({
    queryKey: transactionsKeys.list(params || {}),
    queryFn: async () => {
      const transactions = await TransactionsService.transactionsList();

      // 클라이언트 측 필터링 적용 (필요한 경우)
      if (filterFn) {
        return transactions.filter(filterFn);
      }

      // 응답이 빈 배열이더라도 에러로 처리하지 않고 그대로 반환
      return transactions;
    },
    // 데이터가 없더라도 성공으로 처리 (빈 배열도 정상 응답으로 간주)
    retry: 0, // 실패 시 재시도하지 않음 (global 설정 덮어씀)
    // notifyOnChangeProps: ['data', 'error'], // 불필요한 리렌더링 방지
  });
};

/**
 * 거래 내역 상세 조회 쿼리 훅
 * @param id 거래 내역 ID
 */
export const useTransactionQuery = (id?: number) => {
  return useQuery({
    queryKey: transactionsKeys.detail(id || 0),
    queryFn: () => TransactionsService.transactionsRetrieve(id!),
    enabled: !!id, // id가 유효할 때만 쿼리 실행
    retry: 1,
  });
};

/**
 * 거래 내역 생성 뮤테이션 훅
 */
export const useCreateTransactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Transaction) => TransactionsService.transactionsCreate(data),
    onSuccess: () => {
      // 거래 내역 목록 쿼리 무효화하여 다시 불러오기
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
    },
  });
};

/**
 * 거래 내역 수정 뮤테이션 훅
 */
export const useUpdateTransactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Transaction }) =>
      TransactionsService.transactionsUpdate(id, data),
    onSuccess: (_, variables) => {
      // 해당 거래 내역 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: transactionsKeys.detail(variables.id) });
      // 목록 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
    },
  });
};

/**
 * 거래 내역 삭제 뮤테이션 훅
 */
export const useDeleteTransactionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => TransactionsService.transactionsDestroy(id),
    onSuccess: (_, id) => {
      // 해당 거래 내역 상세 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: transactionsKeys.detail(id) });
      // 목록 쿼리도 무효화
      queryClient.invalidateQueries({ queryKey: transactionsKeys.lists() });
    },
  });
};
