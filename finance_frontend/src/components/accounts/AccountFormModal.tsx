import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { Account } from '../../api/models/Account';
import { CurrencyToEnum } from '../../api/models/CurrencyToEnum';
import { Bank } from '../../api/models/Bank';

/**
 * 계좌 추가 및 수정을 위한 모달 컴포넌트
 * account prop 유무에 따라 수정/추가 모드로 동작합니다.
 */
interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (account: Partial<Account>) => void;
  account?: Account;
  banks: Bank[];
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  account,
  banks,
}) => {
  const [formData, setFormData] = useState<Partial<Account>>({
    name: '',
    nickname: '',
    amount: '0',
    currency: CurrencyToEnum.KRW,
    bank: banks[0]?.id || 0,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        nickname: account.nickname || '',
        amount: account.amount,
        currency: account.currency || CurrencyToEnum.KRW,
        bank: account.bank,
      });
    } else {
      setFormData({
        name: '',
        nickname: '',
        amount: '0',
        currency: CurrencyToEnum.KRW,
        bank: banks[0]?.id || 0,
      });
    }
  }, [account, banks]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{account ? '계좌 수정' : '계좌 추가'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="계좌명"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="별칭"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              select
              label="은행"
              name="bank"
              value={formData.bank}
              onChange={handleChange}
              required
              fullWidth
            >
              {banks.map((bank) => (
                <MenuItem key={bank.id} value={bank.id}>
                  {bank.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="잔액"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              select
              label="통화"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              fullWidth
            >
              {Object.values(CurrencyToEnum).map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained" color="primary">
            {account ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountFormModal;
