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
import { CountryEnum } from '../../api/models/CountryEnum';

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
        <TableCell>{bank.country}</TableCell>
        <TableCell>
          <Box display="flex" gap={1}>
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit(bank)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" onClick={() => onDelete(bank)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Account">
              <IconButton size="small" onClick={() => onAddAccount(bank)}>
                <AddIcon />
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
                    <TableCell align="right">잔액</TableCell>
                    <TableCell>통화</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bankAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>{account.name}</TableCell>
                      <TableCell>{account.account_type}</TableCell>
                      <TableCell>{account.amount}</TableCell>
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

const BankList: React.FC<BankListProps> = ({
  banks,
  accounts,
  onEdit,
  onDelete,
  onAdd,
  onAddAccount,
}) => {
  const [openRows, setOpenRows] = React.useState<Record<number, boolean>>({});

  // 은행을 국가별로 그룹화하고 각 국가 내에서 은행명으로 정렬
  const groupedBanks = React.useMemo(() => {
    const groups: Record<CountryEnum, Bank[]> = {} as Record<CountryEnum, Bank[]>;

    // 먼저 모든 은행을 국가별로 그룹화
    banks.forEach(bank => {
      if (!groups[bank.country!]) {
        groups[bank.country!] = [];
      }
      groups[bank.country!].push(bank);
    });

    // 각 국가별로 은행을 이름순으로 정렬
    Object.keys(groups).forEach(country => {
      groups[country as CountryEnum].sort((a, b) => a.name.localeCompare(b.name));
    });

    // 국가를 알파벳 순으로 정렬
    const sortedGroups = Object.entries(groups).sort(([countryA], [countryB]) =>
      countryA.localeCompare(countryB)
    );

    return Object.fromEntries(sortedGroups);
  }, [banks]);

  const handleToggle = (bankId: number) => {
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
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(groupedBanks).map(([country, countryBanks]) => (
              <React.Fragment key={country}>
                <TableRow>
                  <TableCell colSpan={4}>
                    <Typography variant="h6" component="div">
                      {country}
                    </Typography>
                  </TableCell>
                </TableRow>
                {countryBanks.map((bank) => (
                  <BankRow
                    key={bank.id}
                    bank={bank}
                    accounts={accounts}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onAddAccount={onAddAccount}
                    open={openRows[bank.id] || false}
                    onToggle={() => handleToggle(bank.id)}
                  />
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BankList;
