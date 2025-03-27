import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Bank } from '../../api/models/Bank';
import { CurrencyToEnum } from '../../api/models/CurrencyToEnum';

interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (accountData: {
    name: string;
    currency?: CurrencyToEnum;
    nickname?: string;
    bank: number;
  }) => void;
  bank: Bank;
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  bank,
}) => {
  const [name, setName] = useState('');
  const [currency, setCurrency] = useState<CurrencyToEnum>(CurrencyToEnum.KRW);
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      currency,
      nickname,
      bank: bank.id,
    });
    setName('');
    setCurrency(CurrencyToEnum.KRW);
    setNickname('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{bank.name} - 계좌 추가</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="계좌명"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="별칭"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>통화</InputLabel>
              <Select
                value={currency}
                label="통화"
                onChange={(e) => setCurrency(e.target.value as CurrencyToEnum)}
              >
                <MenuItem value={CurrencyToEnum.KRW}>원화 (KRW)</MenuItem>
                <MenuItem value={CurrencyToEnum.USD}>달러 (USD)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained" color="primary">
            추가
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountFormModal;
