/**
 * 모델 어댑터 유틸리티
 *
 * 이 파일은 내부 모델(types/models)과 API 모델(api/models) 간의
 * 타입 변환을 위한 유틸리티 함수들을 제공합니다.
 */

import { Bank as InternalBank } from '../types/models';
import { Bank as ApiBank } from '../api/models/Bank';
import { Account as InternalAccount } from '../types/models';
import { Account as ApiAccount } from '../api/models/Account';

/**
 * 내부 Bank 모델을 API Bank 모델로 변환
 */
export const bankToApiModel = (bank: Partial<InternalBank>): Partial<ApiBank> => {
  if (!bank) return {};

  return {
    ...bank,
    amount: '0', // API 모델에서 필요한 필드 추가
  } as Partial<ApiBank>;
};

/**
 * API Bank 모델을 내부 Bank 모델로 변환
 */
export const apiBankToModel = (apiBank: Partial<ApiBank>): Partial<InternalBank> => {
  if (!apiBank) return {};

  // 필요한 필드만 추출
  const { id, name, country } = apiBank;

  return {
    id,
    name,
    country: country!,
  } as Partial<InternalBank>;
};

/**
 * 내부 Bank 모델 배열을 API Bank 모델 배열로 변환
 */
export const banksToApiModels = (banks: InternalBank[]): ApiBank[] => {
  return banks.map(bank => bankToApiModel(bank) as ApiBank);
};

/**
 * API Bank 모델 배열을 내부 Bank 모델 배열로 변환
 */
export const apiBanksToModels = (apiBanks: ApiBank[]): InternalBank[] => {
  return apiBanks.map(apiBank => apiBankToModel(apiBank) as InternalBank);
};

/**
 * 내부 Account 모델을 API Account 모델로 변환
 */
export const accountToApiModel = (account: Partial<InternalAccount>): Partial<ApiAccount> => {
  if (!account) return {};

  return {
    ...account,
  } as Partial<ApiAccount>;
};

/**
 * API Account 모델을 내부 Account 모델로 변환
 */
export const apiAccountToModel = (apiAccount: Partial<ApiAccount>): Partial<InternalAccount> => {
  if (!apiAccount) return {};

  return {
    ...apiAccount,
  } as Partial<InternalAccount>;
};

/**
 * 내부 Account 모델 배열을 API Account 모델 배열로 변환
 */
export const accountsToApiModels = (accounts: InternalAccount[]): ApiAccount[] => {
  return accounts.map(account => accountToApiModel(account) as ApiAccount);
};

/**
 * API Account 모델 배열을 내부 Account 모델 배열로 변환
 */
export const apiAccountsToModels = (apiAccounts: ApiAccount[]): InternalAccount[] => {
  return apiAccounts.map(apiAccount => apiAccountToModel(apiAccount) as InternalAccount);
};
