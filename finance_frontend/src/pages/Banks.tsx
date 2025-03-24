import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import BankList from '../components/banks/BankList';
import BankModal from '../components/banks/BankModal';
import { BanksService } from '../api/services/BanksService';
import { Bank } from '../api/models/Bank';

const Banks: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>();
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
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

  useEffect(() => {
    fetchBanks();
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

  const handleSubmit = async (bankData: Partial<Bank>) => {
    try {
      if (selectedBank) {
        await BanksService.banksUpdate(selectedBank.id, bankData);
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
        const newBank = await BanksService.banksCreate(bankData);
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
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <BankModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        bank={selectedBank}
      />
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
