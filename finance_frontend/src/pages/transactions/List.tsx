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
import { TransactionTypeEnum } from '../../api/models/TransactionTypeEnum';
import { TransactionsService } from '../../api/services/TransactionsService';
import { AccountsService } from '../../api/services/AccountsService';
import { ItemsService } from '../../api/services/ItemsService';
import { ReatilersService } from '../../api/services/ReatilersService';
import { Account } from '../../api/models/Account';
import { Item } from '../../api/models/Item';
import { Retailer } from '../../api/models/Retailer';
import TransactionFormModal from '../../components/transactions/TransactionFormModal';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
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

  const fetchRetailers = async () => {
    try {
      const response = await ReatilersService.reatilersList();
      setRetailers(response);
    } catch (err) {
      console.error('판매처 목록 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    fetchItems();
    fetchRetailers();

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

  // 거래 내역 목록 렌더링
  const renderTransactionList = () => {
    if (loading) {
      return <Typography>로딩 중...</Typography>;
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (filteredTransactions.length === 0) {
      return <Typography>거래 내역이 없습니다.</Typography>;
    }

    return (
      <>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>날짜</TableCell>
                <TableCell>계좌</TableCell>
                <TableCell>유형</TableCell>
                <TableCell>판매처</TableCell>
                <TableCell>메모</TableCell>
                <TableCell align="right">금액</TableCell>
                <TableCell align="center">액션</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((transaction) => {
                  const account = accounts.find((a) => a.id === transaction.account);
                  const retailer = retailers.find((r) => r.id === transaction.retailer);
                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {format(new Date(transaction.date), 'yyyy-MM-dd', { locale: ko })}
                      </TableCell>
                      <TableCell>{account?.name || '알 수 없음'}</TableCell>
                      <TableCell>
                        {transaction.transaction_type === TransactionTypeEnum.DEPOSIT
                          ? '수입'
                          : transaction.transaction_type === TransactionTypeEnum.WITHDRAW
                            ? '지출'
                            : transaction.transaction_type}
                      </TableCell>
                      <TableCell>{retailer?.name || ''}</TableCell>
                      <TableCell>{transaction.note}</TableCell>
                      <TableCell align="right">
                        {new Intl.NumberFormat('ko-KR').format(
                          parseFloat(transaction.amount)
                        )}
                        원
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEdit(transaction.id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지당 행"
        />
      </>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            거래 내역
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            거래 추가
          </Button>
        </Box>

        <Box mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="검색..."
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
          </Grid>
        </Box>

        {renderTransactionList()}
      </Box>

      <TransactionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        transaction={selectedTransaction}
        accounts={accounts}
        items={items}
        retailers={retailers}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TransactionList;
