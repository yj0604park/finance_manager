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
  Autocomplete,
} from '@mui/material';
import { Transaction } from '../../api/models/Transaction';
import { TransactionTypeEnum } from '../../api/models/TransactionTypeEnum';
import { Account } from '../../api/models/Account';
import { Item } from '../../api/models/Item';
import { Retailer } from '../../api/models/Retailer';

/**
 * 거래 추가 및 수정을 위한 모달 컴포넌트
 * transaction prop 유무에 따라 수정/추가 모드로 동작합니다.
 */
interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (transaction: Partial<Transaction>) => void;
  transaction?: Transaction;
  accounts: Account[];
  items: Item[];
  retailers: Retailer[];
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  transaction,
  accounts,
  items,
  retailers,
}) => {
  const [formData, setFormData] = useState<Partial<Transaction>>({
    date: new Date().toISOString().split('T')[0],
    account: accounts[0]?.id || 0,
    transaction_type: TransactionTypeEnum.WITHDRAW,
    amount: '0',
    note: '',
    retailer: null,
  });
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date.split('T')[0],
        account: transaction.account,
        transaction_type: transaction.transaction_type,
        amount: transaction.amount,
        note: transaction.note || '',
        retailer: transaction.retailer || null,
      });

      // 선택된 품목이 있으면 설정
      if (transaction.retailer) {
        const selectedRetailer = retailers.find((r) => r.id === transaction.retailer);
        if (selectedRetailer) {
          // 여기서 품목 관련 설정을 할 수 있음 (현재는 품목과 판매처 간 직접적인 연결이 없음)
        }
      }
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        account: accounts[0]?.id || 0,
        transaction_type: TransactionTypeEnum.WITHDRAW,
        amount: '0',
        note: '',
        retailer: null,
      });
      setSelectedItem(null);
    }
  }, [transaction, accounts, items, retailers]);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
      | { target: { name?: string; value: unknown } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleRetailerChange = (event: React.SyntheticEvent, value: Retailer | null) => {
    setFormData((prev) => ({
      ...prev,
      retailer: value ? value.id : null,
    }));
  };

  const handleItemChange = (event: React.SyntheticEvent, value: Item | null) => {
    setSelectedItem(value);
    // 품목을 선택했을 때 메모에 품목 이름 추가
    if (value) {
      setFormData((prev) => ({
        ...prev,
        note: prev.note ? `${prev.note} - ${value.name}` : value.name,
      }));
    }
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
              <Select name="account" value={formData.account} onChange={handleChange} label="계좌">
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
                name="transaction_type"
                value={formData.transaction_type}
                onChange={handleChange}
                label="유형"
              >
                <MenuItem value={TransactionTypeEnum.DEPOSIT}>수입</MenuItem>
                <MenuItem value={TransactionTypeEnum.WITHDRAW}>지출</MenuItem>
              </Select>
            </FormControl>

            {/* 판매처 선택 */}
            <Autocomplete
              options={retailers}
              getOptionLabel={(option) => option.name}
              value={retailers.find((r) => r.id === formData.retailer) || null}
              onChange={handleRetailerChange}
              renderInput={(params) => <TextField {...params} label="판매처" fullWidth />}
            />

            {/* 품목 선택 */}
            <Autocomplete
              options={items}
              getOptionLabel={(option) => option.name}
              value={selectedItem}
              onChange={handleItemChange}
              renderInput={(params) => <TextField {...params} label="품목" fullWidth />}
            />

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

export default TransactionFormModal;
