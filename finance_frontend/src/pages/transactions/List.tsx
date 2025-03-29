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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  ClearAll as ClearAllIcon,
} from '@mui/icons-material';
import { Transaction } from '../../api/models/Transaction';
import { TransactionTypeEnum } from '../../api/models/TransactionTypeEnum';
import { TransactionsService } from '../../api/services/TransactionsService';
import { AccountsService } from '../../api/services/AccountsService';
import { ItemsService } from '../../api/services/ItemsService';
import { RetailersService } from '../../api/services/RetailersService';
import { BanksService } from '../../api/services/BanksService';
import { Account } from '../../api/models/Account';
import { Item } from '../../api/models/Item';
import { Retailer } from '../../api/models/Retailer';
import { Bank } from '../../api/models/Bank';
import TransactionFormModal from '../../components/transactions/TransactionFormModal';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useLocation } from 'react-router-dom';

const TransactionList: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bankIdFromUrl = queryParams.get('bankId');
  const accountIdFromUrl = queryParams.get('accountId');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

  // 필터링 상태 추가
  const [selectedBankId, setSelectedBankId] = useState<string>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

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

  const fetchBanks = async () => {
    try {
      const response = await BanksService.banksList();
      setBanks(response);
    } catch (err) {
      console.error('은행 목록 조회 실패:', err);
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
      const response = await RetailersService.retailersList();
      setRetailers(response);
    } catch (err) {
      console.error('판매처 목록 조회 실패:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccounts();
    fetchBanks();
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

    // URL에서 bankId와 accountId를 가져와서 필터 설정
    if (bankIdFromUrl) {
      setSelectedBankId(bankIdFromUrl);
    }
    if (accountIdFromUrl) {
      setSelectedAccountId(accountIdFromUrl);
    }
  }, [bankIdFromUrl, accountIdFromUrl]);

  useEffect(() => {
    // 검색어, 은행, 계좌 기준으로 필터링
    const filtered = transactions.filter((transaction) => {
      const matchesSearch =
        transaction.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.includes(searchTerm) ||
        transaction.date.includes(searchTerm);

      // 은행 필터링
      const matchesBank =
        selectedBankId === 'all' ||
        accounts.find((a) => a.id === transaction.account)?.bank.toString() === selectedBankId;

      // 계좌 필터링
      const matchesAccount =
        selectedAccountId === 'all' || transaction.account.toString() === selectedAccountId;

      return matchesSearch && matchesBank && matchesAccount;
    });

    setFilteredTransactions(filtered);
    setPage(0);
  }, [searchTerm, transactions, selectedBankId, selectedAccountId, accounts]);

  // 은행 선택 시 계좌 ID를 초기화
  useEffect(() => {
    if (selectedBankId !== 'all') {
      setSelectedAccountId('all');
    }
  }, [selectedBankId]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleBankChange = (event: SelectChangeEvent<string>) => {
    setSelectedBankId(event.target.value);
  };

  const handleAccountChange = (event: SelectChangeEvent<string>) => {
    setSelectedAccountId(event.target.value);
  };

  const handleClearFilters = () => {
    setSelectedBankId('all');
    setSelectedAccountId('all');
    setSearchTerm('');
  };

  const getBankNameById = (accountId: number) => {
    const account = accounts.find((a) => a.id === accountId);
    if (!account) return '알 수 없음';

    const bank = banks.find((b) => b.id === account.bank);
    return bank ? bank.name : '알 수 없음';
  };

  // 선택된 은행에 속한 계좌만 필터링
  const filteredAccounts =
    selectedBankId === 'all'
      ? accounts
      : accounts.filter((account) => account.bank.toString() === selectedBankId);

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
      const transaction = transactions.find((t) => t.id === id);
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
        await TransactionsService.transactionsUpdate(
          selectedTransaction.id,
          transactionData as Transaction
        );
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
        message: selectedTransaction
          ? '거래 내역 수정에 실패했습니다.'
          : '거래 내역 추가에 실패했습니다.',
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
                <TableCell>은행</TableCell>
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
                      <TableCell>{getBankNameById(transaction.account)}</TableCell>
                      <TableCell>{account?.name || '알 수 없음'}</TableCell>
                      <TableCell>
                        {transaction.transaction_type === TransactionTypeEnum.DEPOSIT
                          ? '수입'
                          : transaction.transaction_type === TransactionTypeEnum.WITHDRAW
                            ? '지출'
                            : transaction.transaction_type}
                      </TableCell>
                      <TableCell>{retailer?.name || '-'}</TableCell>
                      <TableCell>{transaction.note || '-'}</TableCell>
                      <TableCell align="right">
                        {parseFloat(transaction.amount).toLocaleString()}원
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(transaction.id)}
                          color="primary"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(transaction.id)}
                          color="error"
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="페이지당 행 수:"
        />
      </>
    );
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h1" gutterBottom>
              거래 내역
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{ ml: 1 }}
            >
              거래 추가
            </Button>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="검색어를 입력하세요"
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
          <Grid item xs={12} md={6} sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="bank-filter-label">은행</InputLabel>
              <Select
                labelId="bank-filter-label"
                value={selectedBankId}
                label="은행"
                onChange={handleBankChange}
              >
                <MenuItem value="all">모든 은행</MenuItem>
                {banks.map((bank) => (
                  <MenuItem key={bank.id} value={bank.id.toString()}>
                    {bank.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="account-filter-label">계좌</InputLabel>
              <Select
                labelId="account-filter-label"
                value={selectedAccountId}
                label="계좌"
                onChange={handleAccountChange}
              >
                <MenuItem value="all">모든 계좌</MenuItem>
                {filteredAccounts.map((account) => (
                  <MenuItem key={account.id} value={account.id.toString()}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" startIcon={<ClearAllIcon />} onClick={handleClearFilters}>
              초기화
            </Button>
          </Grid>
        </Grid>

        {renderTransactionList()}

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
