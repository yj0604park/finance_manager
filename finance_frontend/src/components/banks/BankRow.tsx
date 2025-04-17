import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Typography,
  Box,
  Collapse,
  Link,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  AddCard as AddCardIcon,
} from '@mui/icons-material';

import { Bank } from '../../api/models/Bank';
import { Account } from '../../api/models/Account';

interface BankRowProps {
  bank: Bank;
  accounts: Account[];
  onEdit: (bank: Bank) => void;
  onDelete: (bank: Bank) => void;
  onAddAccount: (bank: Bank) => void;
  open: boolean;
  onToggle: () => void;
}

const BankRow: React.FC<BankRowProps> = ({
  bank,
  accounts,
  onEdit,
  onDelete,
  onAddAccount,
  open,
  onToggle,
}) => {
  const navigate = useNavigate();
  const bankAccounts = accounts.filter((account) => account.bank === bank.id);

  const handleBankNameClick = () => {
    navigate(`/accounts?bankId=${bank.id}`);
  };

  const handleEdit = () => {
    onEdit(bank);
  };

  const handleDelete = () => {
    onDelete(bank);
  };

  const handleAddAccount = () => {
    onAddAccount(bank);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={onToggle} disabled={bankAccounts.length === 0}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Link
            component="button"
            variant="body2"
            onClick={handleBankNameClick}
            sx={{
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline', cursor: 'pointer' },
            }}
          >
            {bank.name}
          </Link>
        </TableCell>
        <TableCell>
          <Box display="flex" gap={1}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Account">
              <IconButton size="small" onClick={handleAddAccount}>
                <AddCardIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Accounts
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>계좌명</TableCell>
                    <TableCell>별칭</TableCell>
                    <TableCell>계좌 유형</TableCell>
                    <TableCell align="right">잔액</TableCell>
                    <TableCell>통화</TableCell>
                    <TableCell>수정/삭제</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.nickname}</TableCell>
                      <TableCell>{account.account_type}</TableCell>
                      <TableCell align="right">{account.amount}</TableCell>
                      <TableCell>{account.currency}</TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="Edit">
                            <IconButton size="small">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small">
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default BankRow;
