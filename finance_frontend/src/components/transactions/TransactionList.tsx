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
import { Transaction } from '../../api/models/Transaction';
import { TransactionTypeEnum } from '../../api/models/TransactionTypeEnum';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onAdd: () => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  onAdd,
}) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">거래 내역</Typography>
        <Tooltip title="거래 추가">
          <IconButton onClick={onAdd} color="primary">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>날짜</TableCell>
              <TableCell>계좌</TableCell>
              <TableCell>유형</TableCell>
              <TableCell>항목</TableCell>
              <TableCell>메모</TableCell>
              <TableCell align="right">금액</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {new Date(transaction.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{transaction.account_name}</TableCell>
                <TableCell>
                  <Chip
                    label={transaction.type === TransactionTypeEnum.INCOME ? '수입' : '지출'}
                    color={transaction.type === TransactionTypeEnum.INCOME ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>{transaction.item_name}</TableCell>
                <TableCell>{transaction.note || '-'}</TableCell>
                <TableCell align="right">
                  {parseFloat(transaction.amount).toLocaleString()}원
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="수정">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(transaction)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="삭제">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(transaction)}
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

export default TransactionList;
