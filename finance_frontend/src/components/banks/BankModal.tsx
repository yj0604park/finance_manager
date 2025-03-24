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
} from '@mui/material';
import { Bank } from '../../api/models/Bank';
import { CountryEnum } from '../../api/models/CountryEnum';

interface BankModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bank: Partial<Bank>) => void;
  bank?: Bank;
}

const BankModal: React.FC<BankModalProps> = ({
  open,
  onClose,
  onSubmit,
  bank,
}) => {
  const [formData, setFormData] = useState<Partial<Bank>>({
    name: '',
    amount: '0',
    country: CountryEnum.KR,
  });

  useEffect(() => {
    if (bank) {
      setFormData({
        name: bank.name,
        amount: bank.amount,
        country: bank.country,
      });
    } else {
      setFormData({
        name: '',
        amount: '0',
        country: CountryEnum.KR,
      });
    }
  }, [bank]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{bank ? '은행 수정' : '은행 추가'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="은행명"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
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
              label="국가"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              fullWidth
            >
              {Object.values(CountryEnum).map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained" color="primary">
            {bank ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BankModal;
