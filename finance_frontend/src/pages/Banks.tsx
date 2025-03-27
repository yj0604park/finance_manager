import React, { useState, useEffect } from 'react';
import { Container, Typography, Alert, Snackbar } from '@mui/material';
import BankList from '../components/banks/BankList';
import BankFormModal from '../components/banks/BankFormModal';
import AccountFormModal from '../components/banks/AccountFormModal';
import { BanksService } from '../api/services/BanksService';
import { AccountsService } from '../api/services/AccountsService';
import { Bank } from '../api/models/Bank';
import { Account } from '../api/models/Account';
import { CurrencyToEnum } from '../api/models/CurrencyToEnum';

const Banks: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>();
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [selectedBankForAccount, setSelectedBankForAccount] = useState<Bank | undefined>();
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const response = await BanksService.banksList();
      setBanks(response);
    } catch (err) {
      setError('은행 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching banks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await AccountsService.accountsList();
      setAccounts(response);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  useEffect(() => {
    fetchBanks();
    fetchAccounts();
  }, []);

  const handleAdd = () => {
    setSelectedBank(undefined);
    setModalOpen(true);
  };

  const handleEdit = (bank: Bank) => {
    setSelectedBank(bank);
    setModalOpen(true);
  };

  const handleDelete = async (bank: Bank) => {
    if (window.confirm('정말로 이 은행을 삭제하시겠습니까?')) {
      try {
        await BanksService.banksDestroy(bank.id);
        setBanks(banks.filter((b) => b.id !== bank.id));
        setNotification({
          open: true,
          message: '은행이 삭제되었습니다.',
          severity: 'success',
        });
      } catch (err) {
        setNotification({
          open: true,
          message: '은행 삭제에 실패했습니다.',
          severity: 'error',
        });
        console.error('Error deleting bank:', err);
      }
    }
  };

  const handleAddAccount = (bank: Bank) => {
    setSelectedBankForAccount(bank);
    setAccountModalOpen(true);
  };

  const handleAccountSubmit = async (accountData: {
    name: string;
    amount: string;
    currency?: CurrencyToEnum;
    nickname?: string;
    bank: number;
  }) => {
    try {
      const newAccount = await AccountsService.accountsCreate(accountData as Account);
      setAccounts([...accounts, newAccount]);
      setNotification({
        open: true,
        message: '계좌가 추가되었습니다.',
        severity: 'success',
      });
      setAccountModalOpen(false);
    } catch (err) {
      setNotification({
        open: true,
        message: '계좌 추가에 실패했습니다.',
        severity: 'error',
      });
      console.error('Error adding account:', err);
    }
  };

  const handleSubmit = async (bankData: Partial<Bank>) => {
    try {
      if (selectedBank) {
        await BanksService.banksUpdate(selectedBank.id, bankData as Bank);
        setBanks(
          banks.map((b) =>
            b.id === selectedBank.id ? { ...b, ...bankData } : b
          )
        );
        setNotification({
          open: true,
          message: '은행이 수정되었습니다.',
          severity: 'success',
        });
      } else {
        const newBank = await BanksService.banksCreate(bankData as Bank);
        setBanks([...banks, newBank]);
        setNotification({
          open: true,
          message: '은행이 추가되었습니다.',
          severity: 'success',
        });
      }
      setModalOpen(false);
    } catch (err) {
      setNotification({
        open: true,
        message: selectedBank
          ? '은행 수정에 실패했습니다.'
          : '은행 추가에 실패했습니다.',
        severity: 'error',
      });
      console.error('Error submitting bank:', err);
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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <BankList
        banks={banks}
        accounts={accounts}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddAccount={handleAddAccount}
      />
      <BankFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        bank={selectedBank}
      />
      {selectedBankForAccount && (
        <AccountFormModal
          open={accountModalOpen}
          onClose={() => setAccountModalOpen(false)}
          onSubmit={handleAccountSubmit}
          bank={selectedBankForAccount}
        />
      )}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Banks;
