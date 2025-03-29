import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid2,
  Link,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Receipt as ReceiptIcon } from '@mui/icons-material';
import { Account } from '../../api/models/Account';
import { CurrencyToEnum } from '../../api/models/CurrencyToEnum';
import { Bank } from '../../api/models/Bank';

interface AccountListProps {
  accounts: Account[];
  banks: Bank[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onAdd: () => void;
  defaultBankId?: string | null;
}

const AccountList: React.FC<AccountListProps> = ({
  accounts,
  banks,
  onEdit,
  onDelete,
  onAdd,
  defaultBankId,
}) => {
  const navigate = useNavigate();
  const [selectedBankId, setSelectedBankId] = useState<string>('all');

  useEffect(() => {
    if (defaultBankId) {
      setSelectedBankId(defaultBankId);
    }
  }, [defaultBankId]);

  const filteredAccounts = selectedBankId === 'all'
    ? accounts
    : accounts.filter(account => account.bank === parseInt(selectedBankId));

  const getBankName = (bankId: number) => {
    const bank = banks.find(b => b.id === bankId);
    return bank ? bank.name : '알 수 없는 은행';
  };

  const handleViewTransactions = (accountId: number) => {
    navigate(`/transactions/list?accountId=${accountId}`);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">계좌 목록</Typography>
        <Tooltip title="계좌 추가">
          <IconButton onClick={onAdd} color="primary">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Grid2 container spacing={2} sx={{ mb: 2 }}>
        <Grid2 size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="bank-filter-label">은행 필터</InputLabel>
            <Select
              labelId="bank-filter-label"
              id="bank-filter"
              value={selectedBankId}
              label="은행 필터"
              onChange={(e) => setSelectedBankId(e.target.value as string)}
            >
              <MenuItem value="all">모든 은행</MenuItem>
              {banks.map((bank) => (
                <MenuItem key={bank.id} value={bank.id.toString()}>
                  {bank.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
      </Grid2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>계좌명</TableCell>
              <TableCell>은행</TableCell>
              <TableCell>별칭</TableCell>
              <TableCell>통화</TableCell>
              <TableCell align="right">잔액</TableCell>
              <TableCell>상태</TableCell>
              <TableCell align="right">마지막 업데이트</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  표시할 계좌가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <Link
                      component="button"
                      variant="body2"
                      onClick={() => handleViewTransactions(account.id)}
                      sx={{
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline', cursor: 'pointer' }
                      }}
                    >
                      {account.name}
                    </Link>
                  </TableCell>
                  <TableCell>{getBankName(account.bank)}</TableCell>
                  <TableCell>{account.nickname || '-'}</TableCell>
                  <TableCell>{account.currency || CurrencyToEnum.KRW}</TableCell>
                  <TableCell align="right">
                    {parseFloat(account.amount).toLocaleString()}원
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={account.is_active ? '활성' : '비활성'}
                      color={account.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    {account.last_update
                      ? new Date(account.last_update).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="거래 내역">
                      <IconButton
                        size="small"
                        onClick={() => handleViewTransactions(account.id)}
                        color="info"
                      >
                        <ReceiptIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="수정">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(account)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="삭제">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(account)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AccountList;
