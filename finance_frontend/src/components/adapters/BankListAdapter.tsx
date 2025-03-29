import React from 'react';
import BankList from '../banks/BankList';
import { Bank as InternalBank, Account as InternalAccount } from '../../types/models';
import { Bank as ApiBank } from '../../api/models/Bank';
import { banksToApiModels, accountsToApiModels } from '../../utils/modelAdapters';

// 어댑터 컴포넌트 props 정의
interface BankListAdapterProps {
  banks: InternalBank[];
  accounts: InternalAccount[];
  onAdd: () => void;
  onEdit: (bank: InternalBank) => void;
  onDelete: (bank: InternalBank) => void;
  onAddAccount: (bank: InternalBank) => void;
}

/**
 * 은행 목록 어댑터 컴포넌트
 *
 * 내부 모델과 API 모델 간의 타입 변환을 처리합니다.
 */
const BankListAdapter: React.FC<BankListAdapterProps> = ({
  banks,
  accounts,
  onAdd,
  onEdit,
  onDelete,
  onAddAccount
}) => {
  // 내부 모델을 API 모델로 변환
  const apiBanks = banksToApiModels(banks);
  const apiAccounts = accountsToApiModels(accounts);

  // API 모델 사용 컴포넌트에 전달할 핸들러들
  const handleEdit = (apiBank: ApiBank) => {
    // API 모델을 받아서 해당하는 내부 모델 찾기
    const internalBank = banks.find(b => b.id === apiBank.id);
    if (internalBank) {
      onEdit(internalBank);
    }
  };

  const handleDelete = (apiBank: ApiBank) => {
    const internalBank = banks.find(b => b.id === apiBank.id);
    if (internalBank) {
      onDelete(internalBank);
    }
  };

  const handleAddAccount = (apiBank: ApiBank) => {
    const internalBank = banks.find(b => b.id === apiBank.id);
    if (internalBank) {
      onAddAccount(internalBank);
    }
  };

  return (
    <BankList
      banks={apiBanks}
      accounts={apiAccounts}
      onAdd={onAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onAddAccount={handleAddAccount}
    />
  );
};

export default BankListAdapter;
