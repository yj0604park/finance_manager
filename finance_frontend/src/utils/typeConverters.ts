import { Bank as ApiBankModel } from '../api/models/Bank';
import { Account as ApiAccountModel } from '../api/models/Account';
import { Bank, Account } from '../types/models';

/**
 * API 응답의 은행 모델을 내부 은행 모델로 변환
 * @param apiBank API에서 받은 은행 모델
 */
export const convertApiToBank = (apiBank: ApiBankModel): Bank => {
  return {
    id: apiBank.id,
    name: apiBank.name,
    country: apiBank.country!
  };
};

/**
 * 내부 은행 모델을 API 요청 모델로 변환
 * @param bank 내부 은행 모델
 */
export const convertBankToApi = (bank: Partial<Bank>): Partial<ApiBankModel> => {
  return {
    id: bank.id,
    name: bank.name,
    country: bank.country,
    amount: '0' // API 모델에 필요한 필드
  };
};

/**
 * API 응답의 은행 모델 배열을 내부 은행 모델 배열로 변환
 * @param apiBanks API에서 받은 은행 모델 배열
 */
export const convertApiBanksToInternalList = (apiBanks: ApiBankModel[]): Bank[] => {
  return apiBanks.map(convertApiToBank);
};

/**
 * API 응답의 계좌 모델을 내부 계좌 모델로 변환
 * @param apiAccount API에서 받은 계좌 모델
 */
export const convertApiToAccount = (apiAccount: ApiAccountModel): Account => {
  return {
    id: apiAccount.id,
    name: apiAccount.name,
    amount: apiAccount.amount || '0',
    bank: apiAccount.bank,
    currency: apiAccount.currency,
    nickname: apiAccount.nickname,
  };
};

/**
 * 내부 계좌 모델을 API 요청 모델로 변환
 * @param account 내부 계좌 모델
 */
export const convertAccountToApi = (account: Partial<Account>): Partial<ApiAccountModel> => {
  return {
    id: account.id,
    name: account.name,
    amount: account.amount,
    bank: account.bank,
    currency: account.currency,
    nickname: account.nickname,
  };
};

/**
 * API 응답의 계좌 모델 배열을 내부 계좌 모델 배열로 변환
 * @param apiAccounts API에서 받은 계좌 모델 배열
 */
export const convertApiAccountsToInternalList = (apiAccounts: ApiAccountModel[]): Account[] => {
  return apiAccounts.map(convertApiToAccount);
};
