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
import {
  Add as AddIcon,
} from '@mui/icons-material';
import { Bank } from '../../api/models/Bank';
import { Account } from '../../api/models/Account';
import { CountryEnum } from '../../api/models/CountryEnum';
import BankRow from './BankRow';
interface BankListProps {
  banks: Bank[];
  accounts: Account[];
  onEdit: (bank: Bank) => void;
  onDelete: (bank: Bank) => void;
  onAdd: () => void;
  onAddAccount: (bank: Bank) => void;
}

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
