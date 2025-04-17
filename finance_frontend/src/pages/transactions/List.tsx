import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ClearAll as ClearAllIcon,
} from '@mui/icons-material';
import { Transaction } from '../../api/models/Transaction';
import { TransactionTypeEnum } from '../../api/models/TransactionTypeEnum';
import { TransactionsService } from '../../api/services/TransactionsService';
import { ItemsService } from '../../api/services/ItemsService';
import { RetailersService } from '../../api/services/RetailersService';
import { Item } from '../../api/models/Item';
import { Retailer } from '../../api/models/Retailer';
import TransactionFormModal from '../../components/transactions/TransactionFormModal';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useLocation } from 'react-router-dom';
import { useTransactionsQuery, useTransactionQuery, useDeleteTransactionMutation } from '../../hooks/query/useTransactionsQuery';
import { useAccounts } from '../../hooks/api/useAccounts';
import { useBanks } from '../../hooks/api/useBanks';

const TransactionList: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bankIdFromUrl = queryParams.get('bankId');
  const accountIdFromUrl = queryParams.get('accountId');
  const transactionIdFromUrl = queryParams.get('transactionId');

  // React Query를 사용하여 데이터 가져오기
  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    error: transactionsError
  } = useTransactionsQuery();

  const {
    data: accounts = [],
    isLoading: accountsLoading
  } = useAccounts();

  const {
    data: banks = [],
    isLoading: banksLoading
  } = useBanks();

  // Items와 Retailers 데이터를 위한 상태 추가
  const [items, setItems] = useState<Item[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [retailersLoading, setRetailersLoading] = useState(true);

  const deleteTransactionMutation = useDeleteTransactionMutation();

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>();

  // 필터링 상태 추가
  const [selectedBankId, setSelectedBankId] = useState<string>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // ID가 있는 경우 해당 트랜잭션 조회 (편집용)
  const { data: transactionDetail } = useTransactionQuery(
    transactionIdFromUrl ? parseInt(transactionIdFromUrl) : undefined
  );

  // Items와 Retailers 데이터 로드
  const fetchItems = async () => {
    try {
      setItemsLoading(true);
      const response = await ItemsService.itemsList();
      setItems(response);
    } catch (err) {
      console.error('항목 목록 조회 실패:', err);
    } finally {
      setItemsLoading(false);
    }
  };

  const fetchRetailers = async () => {
    try {
      setRetailersLoading(true);
      const response = await RetailersService.retailersList();
      setRetailers(response);
    } catch (err) {
      console.error('판매처 목록 조회 실패:', err);
    } finally {
      setRetailersLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchRetailers();
  }, []);

  // handleEdit 함수를 useCallback으로 선언하여 의존성 문제 해결
  const handleEdit = useCallback(async (id: number) => {
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
  }, [transactions, setSelectedTransaction, setModalOpen, setSnackbar]);

  useEffect(() => {
    // URL에서 bankId와 accountId를 가져와서 필터 설정
    if (bankIdFromUrl) {
      setSelectedBankId(bankIdFromUrl);
    }
    if (accountIdFromUrl) {
      setSelectedAccountId(accountIdFromUrl);
    }

    // ID가 URL에 있고 transactionDetail이 있으면 편집 모달 열기
    if (transactionIdFromUrl && transactionDetail) {
      setSelectedTransaction(transactionDetail);
      setModalOpen(true);
    }
  }, [bankIdFromUrl, accountIdFromUrl, transactionIdFromUrl, transactionDetail]);

  // 필터링된 거래 내역을 메모이제이션 - accounts를 의존성에서 제거
  const memoizedFilteredTransactions = useMemo(() => {
    if (!transactions || !transactions.length) return [];

    // accounts가 로드되지 않았으면 필터링하지 않음
    if (!accounts || accounts.length === 0) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.note?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.amount.includes(searchTerm) ||
        transaction.date.includes(searchTerm);

      // 은행 필터링
      let matchesBank = selectedBankId === 'all';
      if (!matchesBank) {
        // 타입 안전성을 위해 타입 단언 사용
        const accountsArray = accounts as any[];
        const account = accountsArray.find(a => a.id === transaction.account);
        if (account) {
          matchesBank = account.bank.toString() === selectedBankId;
        }
      }

      // 계좌 필터링
      const matchesAccount =
        selectedAccountId === 'all' || transaction.account.toString() === selectedAccountId;

      return matchesSearch && matchesBank && matchesAccount;
    });
    // accounts를 의존성 배열에서 제거
  }, [transactions, searchTerm, selectedBankId, selectedAccountId]);

  // 필터링된 거래 내역과 페이지 업데이트
  useEffect(() => {
    setFilteredTransactions(memoizedFilteredTransactions);
    setPage(0);
  }, [memoizedFilteredTransactions]);

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
        await deleteTransactionMutation.mutateAsync(id);
        setSnackbar({
          open: true,
          message: '거래 내역이 삭제되었습니다.',
          severity: 'success',
        });
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
    if (transactionsLoading || accountsLoading || banksLoading || itemsLoading || retailersLoading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (transactionsError) {
      return (
        <Alert
          severity="error"
          sx={{ my: 2 }}
        >
          거래 내역을 불러오는데 실패했습니다. 나중에 다시 시도해 주세요.
        </Alert>
      );
    }

    if (filteredTransactions.length === 0) {
      return (
        <Paper sx={{ p: 3, mt: 2, textAlign: 'center' }}>
          <Typography>거래 내역이 없습니다.</Typography>
        </Paper>
      );
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
    <Container>
      <Box sx={{ my: 2 }}>
        <Typography variant="h5" gutterBottom>
          거래 내역 관리
        </Typography>

        {/* 필터링 및 검색 UI */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="bank-select-label">은행</InputLabel>
                <Select
                  labelId="bank-select-label"
                  value={selectedBankId}
                  label="은행"
                  onChange={handleBankChange}
                >
                  <MenuItem value="all">전체 은행</MenuItem>
                  {banks.map((bank) => (
                    <MenuItem key={bank.id} value={bank.id.toString()}>
                      {bank.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="account-select-label">계좌</InputLabel>
                <Select
                  labelId="account-select-label"
                  value={selectedAccountId}
                  label="계좌"
                  onChange={handleAccountChange}
                  disabled={selectedBankId === 'all' && filteredAccounts.length === 0}
                >
                  <MenuItem value="all">전체 계좌</MenuItem>
                  {filteredAccounts.map((account) => (
                    <MenuItem key={account.id} value={account.id.toString()}>
                      {account.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="검색어를 입력하세요"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={1}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                onClick={handleClearFilters}
                startIcon={<ClearAllIcon />}
              >
                초기화
              </Button>
            </Grid>
            <Grid item xs={6} sm={1}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAdd}
                startIcon={<AddIcon />}
              >
                추가
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* 거래 내역 테이블 */}
        {renderTransactionList()}
      </Box>

      {/* 거래 내역 폼 모달 */}
      <TransactionFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        transaction={selectedTransaction}
        accounts={accounts}
        items={items}
        retailers={retailers}
      />

      {/* 알림 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TransactionList;
