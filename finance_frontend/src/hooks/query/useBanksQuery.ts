import {
  useBanks,
  useBank,
  useCreateBank,
  useUpdateBank,
  useDeleteBank,
  BANKS_QUERY_KEY
} from '../api/useBanks';
import { BankFilterParams } from '../../types/api';
import { Bank } from '../../types/models';

// 쿼리 키
export const banksKeys = {
  all: [BANKS_QUERY_KEY] as const,
  lists: () => [...banksKeys.all, 'list'] as const,
  list: (filters: BankFilterParams) => [...banksKeys.lists(), filters] as const,
  details: () => [...banksKeys.all, 'detail'] as const,
  detail: (id: number) => [...banksKeys.details(), id] as const,
};

/**
 * 은행 목록 조회 쿼리 훅
 * @param params 필터링 파라미터 (클라이언트 측 필터링에만 사용됨)
 * @deprecated - 새로운 useBanks 훅 사용을 권장
 */
export const useBanksQuery = (params?: BankFilterParams) => {
  const { data, ...rest } = useBanks();

  // 필터링된 데이터 반환
  return {
    ...rest,
    data: data && params ? filterBanks(data, params) : data,
  };
};

// 클라이언트 측 필터링 함수
const filterBanks = (banks: Bank[], params: BankFilterParams): Bank[] => {
  if (!params) return banks;

  return banks.filter(bank => {
    let match = true;
    if (params.country !== undefined && bank.country !== params.country) {
      match = false;
    }
    // 여기에 추가 필터 조건 적용 가능
    return match;
  });
};

/**
 * 은행 상세 조회 쿼리 훅
 * @param id 은행 ID
 * @deprecated - 새로운 useBank 훅 사용을 권장
 */
export const useBankQuery = (id: number) => {
  return useBank(id);
};

/**
 * 은행 생성 뮤테이션 훅
 * @deprecated - 새로운 useCreateBank 훅 사용을 권장
 */
export const useCreateBankMutation = () => {
  return useCreateBank();
};

/**
 * 은행 수정 뮤테이션 훅
 * @deprecated - 새로운 useUpdateBank 훅 사용을 권장
 */
export const useUpdateBankMutation = () => {
  return useUpdateBank();
};

/**
 * 은행 삭제 뮤테이션 훅
 * @deprecated - 새로운 useDeleteBank 훅 사용을 권장
 */
export const useDeleteBankMutation = () => {
  return useDeleteBank();
};
