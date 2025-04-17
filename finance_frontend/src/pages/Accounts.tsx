import React from 'react';
import { Container } from '@mui/material';
import { Account } from '../types/models';
import ConfirmDialog from '../components/common/ConfirmDialog';
import NotificationSnackbar from '../components/common/NotificationSnackbar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { useModal } from '../hooks/useModal';
import { useNotification } from '../hooks/useNotification';
import { useBanks } from '../hooks/api/useBanks';
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount
} from '../hooks/api/useAccounts';
import AccountListAdapter from '../components/adapters/AccountListAdapter';
import AccountFormModalAdapter from '../components/adapters/AccountFormModalAdapter';
import { apiAccountsToModels } from '../utils/modelAdapters';
import { convertBankToApi } from '../utils/typeConverters';

const Accounts: React.FC = () => {
  // React Query 훅 사용
  const { data: apiAccounts, isLoading, isError, error } = useAccounts();
  const { data: apiBanks = [] } = useBanks();
  const createAccountMutation = useCreateAccount();
  const updateAccountMutation = useUpdateAccount();
  const deleteAccountMutation = useDeleteAccount();

  const { notification, showNotification, hideNotification } = useNotification();

  // 모달 상태 관리 훅 사용
  const accountModal = useModal<Account | null>();
  const confirmModal = useModal<{ account: Account; type: 'delete' }>();

  // API 응답을 내부 모델로 변환
  const accounts = apiAccounts ? apiAccountsToModels(apiAccounts) : [];
  const banks = apiBanks.map(bank => {
    const modelBank = convertBankToApi(bank);
    return {
      id: modelBank.id!,
      name: modelBank.name!,
      country: modelBank.country!
    };
  });

  // 계좌 추가/수정 처리
  const handleAccountSubmit = async (accountData: Partial<Account>) => {
    try {
      if (accountModal.data) {
        // 수정
        await updateAccountMutation.mutateAsync({
          id: accountModal.data.id!,
          data: accountData
        });
        showNotification('계좌가 수정되었습니다.', 'success');
      } else {
        // 추가
        const createData = {
          ...accountData,
        };
        await createAccountMutation.mutateAsync(createData as Account);
        showNotification('계좌가 추가되었습니다.', 'success');
      }
      accountModal.closeModal();
    } catch (err) {
      showNotification(
        accountModal.data ? '계좌 수정에 실패했습니다.' : '계좌 추가에 실패했습니다.',
        'error'
      );
      console.error('Error submitting account:', err);
    }
  };

  // 계좌 삭제 확인
  const handleConfirmDelete = async () => {
    if (!confirmModal.data) return;

    try {
      await deleteAccountMutation.mutateAsync(confirmModal.data.account.id!);
      showNotification('계좌가 삭제되었습니다.', 'success');
    } catch (err) {
      showNotification('계좌 삭제에 실패했습니다.', 'error');
      console.error('Error deleting account:', err);
    } finally {
      confirmModal.closeModal();
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={error?.message || '계좌 목록을 불러오는데 실패했습니다.'} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* 어댑터 컴포넌트를 통해 데이터 변환 처리 */}
      <AccountListAdapter
        accounts={accounts}
        banks={banks}
        onAdd={() => accountModal.openModal(null)}
        onEdit={(account) => accountModal.openModal(account)}
        onDelete={(account) => confirmModal.openModal({ account, type: 'delete' })}
      />

      {/* 계좌 폼 모달 */}
      <AccountFormModalAdapter
        open={accountModal.isOpen}
        onClose={accountModal.closeModal}
        onSubmit={handleAccountSubmit}
        account={accountModal.data || undefined}
        banks={banks}
      />

      {/* 삭제 확인 대화상자 */}
      <ConfirmDialog
        open={confirmModal.isOpen && !!confirmModal.data}
        title="계좌 삭제"
        message="정말로 이 계좌를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        onConfirm={handleConfirmDelete}
        onCancel={confirmModal.closeModal}
        severity="error"
      />

      {/* 알림 */}
      <NotificationSnackbar
        notification={notification}
        onClose={hideNotification}
      />
    </Container>
  );
};

export default Accounts;
