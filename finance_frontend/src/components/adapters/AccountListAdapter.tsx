import React from 'react';
import AccountList from '../accounts/AccountList';
import { Bank as InternalBank, Account as InternalAccount } from '../../types/models';
import { Account as ApiAccount } from '../../api/models/Account';
import { banksToApiModels, accountsToApiModels } from '../../utils/modelAdapters';

// 어댑터 컴포넌트 props 정의
interface AccountListAdapterProps {
  accounts: InternalAccount[];
  banks: InternalBank[];
  onAdd: () => void;
  onEdit: (account: InternalAccount) => void;
  onDelete: (account: InternalAccount) => void;
}

/**
 * 계좌 목록 어댑터 컴포넌트
 *
 * 내부 모델과 API 모델 간의 타입 변환을 처리합니다.
 */
const AccountListAdapter: React.FC<AccountListAdapterProps> = ({
  accounts,
  banks,
  onAdd,
  onEdit,
  onDelete
}) => {
  // 내부 모델을 API 모델로 변환
  const apiAccounts = accountsToApiModels(accounts);
  const apiBanks = banksToApiModels(banks);

  // API 모델 사용 컴포넌트에 전달할 핸들러들
  const handleEdit = (apiAccount: ApiAccount) => {
    // API 모델을 받아서 해당하는 내부 모델 찾기
    const internalAccount = accounts.find(a => a.id === apiAccount.id);
    if (internalAccount) {
      onEdit(internalAccount);
    }
  };

  const handleDelete = (apiAccount: ApiAccount) => {
    const internalAccount = accounts.find(a => a.id === apiAccount.id);
    if (internalAccount) {
      onDelete(internalAccount);
    }
  };

  return (
    <AccountList
      accounts={apiAccounts}
      banks={apiBanks}
      onAdd={onAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
};

export default AccountListAdapter;
