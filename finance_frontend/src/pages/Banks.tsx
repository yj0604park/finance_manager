import React from 'react';
import { Container } from '@mui/material';
import { Bank } from '../types/models';
import { Account } from '../types/models';
import ConfirmDialog from '../components/common/ConfirmDialog';
import NotificationSnackbar from '../components/common/NotificationSnackbar';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { useModal } from '../hooks/useModal';
import { useNotification } from '../hooks/useNotification';
import {
  useBanksQuery,
  useCreateBankMutation,
  useUpdateBankMutation,
  useDeleteBankMutation
} from '../hooks/query/useBanksQuery';
import { useAccountsQuery, useCreateAccountMutation } from '../hooks/query/useAccountsQuery';
import BankListAdapter from '../components/adapters/BankListAdapter';
import BankFormModalAdapter from '../components/adapters/BankFormModalAdapter';
import AccountFormModalAdapter from '../components/adapters/AccountFormModalAdapter';
import { convertBankToApi } from '../utils/typeConverters';

const Banks: React.FC = () => {
  // React Query 훅 사용
  const { data: apiBanks, isLoading, isError, error } = useBanksQuery();
  const { data: accounts = [] } = useAccountsQuery();
  const createBankMutation = useCreateBankMutation();
  const updateBankMutation = useUpdateBankMutation();
  const deleteBankMutation = useDeleteBankMutation();
  const createAccountMutation = useCreateAccountMutation();

  const { notification, showNotification, hideNotification } = useNotification();

  // 모달 상태 관리 훅 사용
  const bankModal = useModal<Bank | undefined>();
  const accountModal = useModal<Bank | undefined>();
  const confirmModal = useModal<{ bank: Bank; type: 'delete' }>();

  // API 응답을 내부 모델로 변환
  const banks = apiBanks ? apiBanks.map(bank => {
    const modelBank = convertBankToApi(bank);
    return {
      id: modelBank.id!,
      name: modelBank.name!,
      country: modelBank.country!
    };
  }) : [];

  // 은행 추가/수정 처리
  const handleBankSubmit = async (bankData: Partial<Bank>) => {
    try {
      if (bankModal.data) {
        // 수정
        await updateBankMutation.mutateAsync({
          id: bankModal.data.id!,
          data: bankData
        });
        showNotification('은행이 수정되었습니다.', 'success');
      } else {
        // 추가
        const createData = {
          ...bankData,
          name: bankData.name || '',
          country: bankData.country
        };
        await createBankMutation.mutateAsync(createData as Bank);
        showNotification('은행이 추가되었습니다.', 'success');
      }
      bankModal.closeModal();
    } catch (err) {
      showNotification(
        bankModal.data ? '은행 수정에 실패했습니다.' : '은행 추가에 실패했습니다.',
        'error'
      );
      console.error('Error submitting bank:', err);
    }
  };

  // 계좌 추가 처리
  const handleAccountSubmit = async (accountData: Partial<Account>) => {
    try {
      const createData = {
        ...accountData,
        user: 1 // user 필드가 필요한 경우 기본값 설정
      };
      await createAccountMutation.mutateAsync(createData as Account);
      showNotification('계좌가 추가되었습니다.', 'success');
      accountModal.closeModal();
    } catch (err) {
      showNotification('계좌 추가에 실패했습니다.', 'error');
      console.error('Error adding account:', err);
    }
  };

  // 은행 삭제 확인
  const handleConfirmDelete = async () => {
    if (!confirmModal.data) return;

    try {
      await deleteBankMutation.mutateAsync(confirmModal.data.bank.id!);
      showNotification('은행이 삭제되었습니다.', 'success');
    } catch (err) {
      showNotification('은행 삭제에 실패했습니다.', 'error');
      console.error('Error deleting bank:', err);
    } finally {
      confirmModal.closeModal();
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message={error?.message || '은행 목록을 불러오는데 실패했습니다.'} />;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* 어댑터 컴포넌트를 통해 데이터 변환 처리 */}
      <BankListAdapter
        banks={banks}
        accounts={accounts}
        onAdd={() => bankModal.openModal(undefined)}
        onEdit={(bank) => bankModal.openModal(bank)}
        onDelete={(bank) => confirmModal.openModal({ bank, type: 'delete' })}
        onAddAccount={(bank) => accountModal.openModal(bank)}
      />

      {/* 은행 추가/수정 모달 */}
      <BankFormModalAdapter
        open={bankModal.isOpen}
        onClose={bankModal.closeModal}
        onSubmit={handleBankSubmit}
        bank={bankModal.data !== null ? bankModal.data : undefined}
      />

      {/* 계좌 추가 모달 */}
      {accountModal.data && (
        <AccountFormModalAdapter
          open={accountModal.isOpen}
          onClose={accountModal.closeModal}
          onSubmit={handleAccountSubmit}
          bank={accountModal.data}
          banks={banks}
        />
      )}

      {/* 삭제 확인 대화상자 */}
      <ConfirmDialog
        open={confirmModal.isOpen && !!confirmModal.data}
        title="은행 삭제"
        message="정말로 이 은행을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
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

export default Banks;
