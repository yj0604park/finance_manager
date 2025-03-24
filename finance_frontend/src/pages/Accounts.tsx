import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import AccountList from '../components/accounts/AccountList';
import AccountModal from '../components/accounts/AccountModal';
import { Account } from '../api/models/Account';
import { Bank } from '../api/models/Bank';
import { AccountsService } from '../api/services/AccountsService';
import { BanksService } from '../api/services/BanksService';

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await AccountsService.accountsList();
      setAccounts(response);
    } catch (err) {
      setError('계좌 목록을 불러오는데 실패했습니다.');
      console.error('계좌 목록 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBanks = async () => {
    try {
      const response = await BanksService.banksList();
      setBanks(response);
    } catch (err) {
      console.error('은행 목록 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchAccounts();
    fetchBanks();
  }, []);

  const handleAdd = () => {
    setSelectedAccount(undefined);
    setModalOpen(true);
  };

  const handleEdit = (account: Account) => {
    setSelectedAccount(account);
    setModalOpen(true);
  };

  const handleDelete = async (account: Account) => {
    if (window.confirm('정말로 이 계좌를 삭제하시겠습니까?')) {
      try {
        await AccountsService.accountsDestroy(account.id);
        setSnackbar({
          open: true,
          message: '계좌가 삭제되었습니다.',
          severity: 'success',
        });
        fetchAccounts();
      } catch (err) {
        setSnackbar({
          open: true,
          message: '계좌 삭제에 실패했습니다.',
          severity: 'error',
        });
        console.error('계좌 삭제 실패:', err);
      }
    }
  };

  const handleSubmit = async (accountData: Partial<Account>) => {
    try {
      if (selectedAccount) {
        await AccountsService.accountsUpdate(selectedAccount.id, accountData as Account);
        setSnackbar({
          open: true,
          message: '계좌가 수정되었습니다.',
          severity: 'success',
        });
      } else {
        await AccountsService.accountsCreate(accountData as Account);
        setSnackbar({
          open: true,
          message: '계좌가 추가되었습니다.',
          severity: 'success',
        });
      }
      setModalOpen(false);
      fetchAccounts();
    } catch (err) {
      setSnackbar({
        open: true,
        message: selectedAccount ? '계좌 수정에 실패했습니다.' : '계좌 추가에 실패했습니다.',
        severity: 'error',
      });
      console.error('계좌 저장 실패:', err);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ my: 4 }}>
        <AccountList
          accounts={accounts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
        <AccountModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          account={selectedAccount}
          banks={banks}
        />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Accounts;
