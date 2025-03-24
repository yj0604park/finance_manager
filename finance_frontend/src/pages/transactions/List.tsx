import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Grid
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { Transaction } from '../../api/models/Transaction';
import { TransactionsService } from '../../api/services/TransactionsService';
import { AccountsService } from '../../api/services/AccountsService';
import { ItemsService } from '../../api/services/ItemsService';
import { Account } from '../../api/models/Account';
import { Item } from '../../api/models/Item';
import TransactionFormModal from '../../components/transactions/TransactionFormModal';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
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
      setFilteredTransactions(response);
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

    // URL 파라미터에서 거래 ID 확인
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      const id = Number(editId);
      if (!isNaN(id)) {
        handleEdit(id);
      }
    }
  }, []);

  useEffect(() => {
    const filtered = transactions.filter(transaction =>
      transaction.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.includes(searchTerm) ||
      transaction.date.includes(searchTerm)
    );
    setFilteredTransactions(filtered);
    setPage(0);
  }, [searchTerm, transactions]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말로 이 거래 내역을 삭제하시겠습니까?')) {
      try {
        await TransactionsService.transactionsDestroy(id);
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

  const handleAdd = () => {
    setSelectedTransaction(undefined);
    setModalOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setSelectedTransaction(transaction);
        setModalOpen(true);
      } else {
        const response = await TransactionsService.transactionsRetrieve(id);
        setSelectedTransaction(response);
        setModalOpen(true);
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: '거래 내역을 불러오는데 실패했습니다.',
        severity: 'error',
      });
      console.error('거래 내역 불러오기 실패:', err);
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

      // URL 파라미터 제거
      if (window.history.replaceState) {
        const url = window.location.href.split('?')[0];
        window.history.replaceState({}, document.title, url);
      }
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
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          거래 내역
        </Typography>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="거래내역 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              새 거래 추가
            </Button>
          </Grid>
        </Grid>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>날짜</TableCell>
                  <TableCell>계좌</TableCell>
                  <TableCell>내용</TableCell>
                  <TableCell align="right">금액</TableCell>
                  <TableCell>유형</TableCell>
                  <TableCell>잔액</TableCell>
                  <TableCell align="center">작업</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTransactions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.date), 'yyyy-MM-dd', { locale: ko })}
                      </TableCell>
                      <TableCell>{transaction.account}</TableCell>
                      <TableCell>{transaction.note || '-'}</TableCell>
                      <TableCell align="right">
                        {Number(transaction.amount).toLocaleString('ko-KR')}원
                      </TableCell>
                      <TableCell>
                        {transaction.transaction_type || '-'}
                      </TableCell>
                      <TableCell>
                        {transaction.balance ? Number(transaction.balance).toLocaleString('ko-KR') + '원' : '-'}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(transaction.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {filteredTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      거래 내역이 없습니다.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTransactions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="페이지당 행 수:"
            labelDisplayedRows={({ from, to, count }) =>
              `${count}개 중 ${from}-${to}`
            }
          />
        </Paper>

        <TransactionFormModal
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

export default TransactionList;
