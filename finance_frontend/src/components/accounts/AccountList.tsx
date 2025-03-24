import React from 'react';
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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Account } from '../../api/models/Account';
import { CurrencyToEnum } from '../../api/models/CurrencyToEnum';

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (account: Account) => void;
  onAdd: () => void;
}

const AccountList: React.FC<AccountListProps> = ({
  accounts,
  onEdit,
  onDelete,
  onAdd,
}) => {
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>계좌명</TableCell>
              <TableCell>별칭</TableCell>
              <TableCell>통화</TableCell>
              <TableCell align="right">잔액</TableCell>
              <TableCell>상태</TableCell>
              <TableCell align="right">마지막 업데이트</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>{account.name}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AccountList;
