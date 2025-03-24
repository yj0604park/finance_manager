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
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Transaction } from '../../api/models/Transaction';
import { TransactionTypeEnum } from '../../api/models/TransactionTypeEnum';
import { Account } from '../../api/models/Account';
import { Item } from '../../api/models/Item';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: Partial<Transaction>) => void;
  transaction?: Transaction;
  accounts: Account[];
  items: Item[];
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
  onSubmit,
  transaction,
  accounts,
  items,
}) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    account: accounts[0]?.id || 0,
    type: TransactionTypeEnum.EXPENSE,
    item: items[0]?.id || 0,
    amount: '0',
    note: '',
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date.split('T')[0],
        account: transaction.account,
        type: transaction.type,
        item: transaction.item,
        amount: transaction.amount,
        note: transaction.note || '',
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        account: accounts[0]?.id || 0,
        type: TransactionTypeEnum.EXPENSE,
        item: items[0]?.id || 0,
        amount: '0',
        note: '',
      });
    }
  }, [transaction, accounts, items]);

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
        <DialogTitle>{transaction ? '거래 수정' : '거래 추가'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="날짜"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth required>
              <InputLabel>계좌</InputLabel>
              <Select
                name="account"
                value={formData.account}
                onChange={handleChange}
                label="계좌"
              >
                {accounts.map((account) => (
                  <MenuItem key={account.id} value={account.id}>
                    {account.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>유형</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="유형"
              >
                <MenuItem value={TransactionTypeEnum.INCOME}>수입</MenuItem>
                <MenuItem value={TransactionTypeEnum.EXPENSE}>지출</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth required>
              <InputLabel>항목</InputLabel>
              <Select
                name="item"
                value={formData.item}
                onChange={handleChange}
                label="항목"
              >
                {items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="금액"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="메모"
              name="note"
              value={formData.note}
              onChange={handleChange}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained" color="primary">
            {transaction ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransactionModal;
