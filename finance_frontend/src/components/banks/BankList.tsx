import React from 'react';
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
  Collapse,
  Link,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { Bank } from '../../api/models/Bank';
import { Account } from '../../api/models/Account';

interface BankListProps {
  banks: Bank[];
  accounts: Account[];
  onEdit: (bank: Bank) => void;
  onDelete: (bank: Bank) => void;
  onAdd: () => void;
  onAddAccount: (bank: Bank) => void;
}

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

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
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
        <TableCell>{bank.country}</TableCell>
        <TableCell align="right">{parseFloat(bank.amount).toLocaleString()}원</TableCell>
        <TableCell align="center">
          <Tooltip title="계좌 추가">
            <IconButton
              size="small"
              onClick={() => onAddAccount(bank)}
              color="primary"
              sx={{ mr: 1 }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="수정">
            <IconButton size="small" onClick={() => onEdit(bank)} color="primary" sx={{ mr: 1 }}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="삭제">
            <IconButton size="small" onClick={() => onDelete(bank)} color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>계좌명</TableCell>
                    <TableCell>별칭</TableCell>
                    <TableCell align="right">잔액</TableCell>
                    <TableCell>통화</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.nickname || '-'}</TableCell>
                      <TableCell align="right">
                        {parseFloat(account.amount).toLocaleString()}
                      </TableCell>
                      <TableCell>{account.currency}</TableCell>
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

const BankList: React.FC<BankListProps> = ({
  banks,
  accounts,
  onEdit,
  onDelete,
  onAdd,
  onAddAccount,
}) => {
  const [openRows, setOpenRows] = React.useState<{ [key: number]: boolean }>({});
  const [allOpen, setAllOpen] = React.useState(true);

  // 초기 상태 설정: 모든 은행의 계좌를 보여줌
  React.useEffect(() => {
    const initialOpenRows: { [key: number]: boolean } = {};
    banks.forEach((bank) => {
      const hasAccounts = accounts.some((account) => account.bank === bank.id);
      initialOpenRows[bank.id] = hasAccounts;
    });
    setOpenRows(initialOpenRows);
  }, [banks, accounts]);

  const handleToggleAll = () => {
    const newOpenRows: { [key: number]: boolean } = {};
    banks.forEach((bank) => {
      const hasAccounts = accounts.some((account) => account.bank === bank.id);
      newOpenRows[bank.id] = hasAccounts && !allOpen;
    });
    setOpenRows(newOpenRows);
    setAllOpen(!allOpen);
  };

  const handleToggleRow = (bankId: number) => {
    setOpenRows((prev) => ({
      ...prev,
      [bankId]: !prev[bankId],
    }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">은행 목록</Typography>
        </Box>
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
              <TableCell>
                <Tooltip title={allOpen ? '모두 접기' : '모두 열기'}>
                  <IconButton onClick={handleToggleAll} size="small">
                    {allOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>은행명</TableCell>
              <TableCell>국가</TableCell>
              <TableCell align="right">잔액</TableCell>
              <TableCell align="center">작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {banks.map((bank) => (
              <BankRow
                key={bank.id}
                bank={bank}
                accounts={accounts}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddAccount={onAddAccount}
                open={openRows[bank.id] || false}
                onToggle={() => handleToggleRow(bank.id)}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BankList;
