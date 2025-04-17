import React from 'react';
import AccountFormModal from '../common/AccountFormModal';
import { Bank as InternalBank, Account as InternalAccount } from '../../types/models';
import { Bank as ApiBank } from '../../api/models/Bank';
import { Account as ApiAccount } from '../../api/models/Account';
import { bankToApiModel, banksToApiModels, accountToApiModel, apiAccountToModel } from '../../utils/modelAdapters';

// 어댑터 컴포넌트 props 정의
interface AccountFormModalAdapterProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (account: Partial<InternalAccount>) => void;
  account?: InternalAccount;
  bank?: InternalBank;
  banks?: InternalBank[];
}

/**
 * 계좌 폼 모달 어댑터 컴포넌트
 *
 * 내부 모델과 API 모델 간의 타입 변환을 처리합니다.
 */
const AccountFormModalAdapter: React.FC<AccountFormModalAdapterProps> = ({
  open,
  onClose,
  onSubmit,
  account,
  bank,
  banks
}) => {
  // 내부 모델을 API 모델로 변환
  const apiAccount = account ? accountToApiModel(account) as ApiAccount : undefined;
  const apiBank = bank ? bankToApiModel(bank) as ApiBank : undefined;
  const apiBanks = banks ? banksToApiModels(banks) : undefined;

  // API 모델로부터 폼 제출을 처리하는 핸들러
  const handleSubmit = (apiAccountData: Partial<ApiAccount>) => {
    // API 모델을 내부 모델로 변환하여 원래 핸들러에 전달
    const internalAccountData = apiAccountToModel(apiAccountData);
    onSubmit(internalAccountData);
  };

  return (
    <AccountFormModal
      open={open}
      onClose={onClose}
      onSubmit={handleSubmit}
      account={apiAccount}
      bank={apiBank}
      bankList={apiBanks || []}
    />
  );
};

export default AccountFormModalAdapter;
