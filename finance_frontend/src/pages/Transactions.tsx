import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Alert, Snackbar } from '@mui/material';
import TransactionList from '../components/transactions/TransactionList';
import TransactionModal from '../components/transactions/TransactionModal';
import { Transaction } from '../api/models/Transaction';
import { Account } from '../api/models/Account';
import { Item } from '../api/models/Item';
import { TransactionsService } from '../api/services/TransactionsService';
import { AccountsService } from '../api/services/AccountsService';
import { ItemsService } from '../api/services/ItemsService';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await TransactionsService.transactionsList();
      setTransactions(response);
    } catch (err) {
      setError('거래 내역을 불러오는데 실패했습니다.');
      console.error('거래 내역 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const response = await AccountsService.accountsList();
      setAccounts(response);
    } catch (err) {
      console.error('계좌 목록 조회 실패:', err);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await ItemsService.itemsList();
      setItems(response);
    } catch (err) {
      console.error('항목 목록 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    fetchItems();
  }, []);

  const handleAdd = () => {
    setSelectedTransaction(undefined);
    setModalOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const handleDelete = async (transaction: Transaction) => {
    if (window.confirm('정말로 이 거래 내역을 삭제하시겠습니까?')) {
      try {
        await TransactionsService.transactionsDestroy(transaction.id);
        setSnackbar({
          open: true,
          message: '거래 내역이 삭제되었습니다.',
          severity: 'success',
        });
        fetchTransactions();
      } catch (err) {
        setSnackbar({
          open: true,
          message: '거래 내역 삭제에 실패했습니다.',
          severity: 'error',
        });
        console.error('거래 내역 삭제 실패:', err);
      }
    }
  };

  const handleSubmit = async (transactionData: Partial<Transaction>) => {
    try {
      if (selectedTransaction) {
        await TransactionsService.transactionsUpdate(selectedTransaction.id, transactionData as Transaction);
        setSnackbar({
          open: true,
          message: '거래 내역이 수정되었습니다.',
          severity: 'success',
        });
      } else {
        await TransactionsService.transactionsCreate(transactionData as Transaction);
        setSnackbar({
          open: true,
          message: '거래 내역이 추가되었습니다.',
          severity: 'success',
        });
      }
      setModalOpen(false);
      fetchTransactions();
    } catch (err) {
      setSnackbar({
        open: true,
        message: selectedTransaction ? '거래 내역 수정에 실패했습니다.' : '거래 내역 추가에 실패했습니다.',
        severity: 'error',
      });
      console.error('거래 내역 저장 실패:', err);
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
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
        <TransactionModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          transaction={selectedTransaction}
          accounts={accounts}
          items={items}
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

export default Transactions;
