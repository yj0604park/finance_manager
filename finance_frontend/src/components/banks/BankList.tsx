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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { Bank } from '../../api/models/Bank';

interface BankListProps {
  banks: Bank[];
  onEdit: (bank: Bank) => void;
  onDelete: (bank: Bank) => void;
  onAdd: () => void;
}

const BankList: React.FC<BankListProps> = ({ banks, onEdit, onDelete, onAdd }) => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">은행 목록</Typography>
        <Tooltip title="은행 추가">
          <IconButton onClick={onAdd} color="primary">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>은행명</TableCell>
              <TableCell>국가</TableCell>
              <TableCell align="right">잔액</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banks.map((bank) => (
              <TableRow key={bank.id}>
                <TableCell>{bank.name}</TableCell>
                <TableCell>{bank.country}</TableCell>
                <TableCell align="right">
                  {parseFloat(bank.amount).toLocaleString()}원
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="수정">
                    <IconButton
                      size="small"
                      onClick={() => onEdit(bank)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="삭제">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(bank)}
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

export default BankList;
