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
  FormHelperText,
} from '@mui/material';
import { Account } from '../../api/models/Account';
import { CurrencyToEnum } from '../../api/models/CurrencyToEnum';
import { Bank } from '../../api/models/Bank';
import { validateAccountForm, getFormHelperText, hasFieldError, ValidationResult } from '../../utils/validations';

/**
 * 계좌 추가 및 수정을 위한 모달 컴포넌트
 * 은행 관리와 계좌 관리 페이지에서 공통으로 사용됩니다.
 */
interface AccountFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (accountData: Partial<Account>) => void;
  account?: Account;
  banks?: Bank[];
  bank?: Bank; // 은행 관리 페이지에서 특정 은행 선택 시 사용
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  account,
  banks = [],
  bank,
}) => {
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState<Partial<Account>>({
    name: '',
    nickname: '',
    amount: '0',
    currency: CurrencyToEnum.KRW,
    bank: bank?.id || banks[0]?.id || 0,
  });

  // 검증 결과 상태
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: []
  });

  // 폼 제출 시도 여부 상태
  const [submitted, setSubmitted] = useState(false);

  // 모달이 열릴 때와 account, bank가 변경될 때만 폼 데이터 초기화
  useEffect(() => {
    if (!open) return; // 모달이 닫혀있으면 초기화하지 않음

    if (account) {
      // 계좌 수정 모드
      setFormData({
        name: account.name,
        nickname: account.nickname || '',
        amount: account.amount,
        currency: account.currency || CurrencyToEnum.KRW,
        bank: account.bank,
      });
    } else {
      // 계좌 추가 모드
      setFormData({
        name: '',
        nickname: '',
        amount: '0',
        currency: CurrencyToEnum.KRW,
        bank: bank?.id || banks[0]?.id || 0,
      });
    }

    // 모달이 새로 열릴 때 검증 상태 초기화
    setValidationResult({ isValid: true, errors: [] });
    setSubmitted(false);
  }, [open, account, bank]);

  // banks 배열이 처음 로드될 때만 실행되는 별도의 useEffect
  useEffect(() => {
    if (!open || account || banks.length === 0) return;

    // bank가 없고, banks 배열이 처음 로드되었을 때만 bank 값 설정
    if (!bank && formData.bank === 0) {
      setFormData(prev => ({
        ...prev,
        bank: banks[0]?.id || 0
      }));
    }
  }, [banks, open]);

  // 폼 데이터 변경 시 유효성 검사
  useEffect(() => {
    if (submitted) {
      const result = validateAccountForm(formData);
      setValidationResult(result);
    }
  }, [formData, submitted]);

  // 폼 입력값 변경 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  // 폼 제출 처리
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const result = validateAccountForm(formData);
    setValidationResult(result);

    if (result.isValid) {
      onSubmit(formData);
    }
  };

  // 모달이 닫힐 때 폼 초기화
  const handleClose = () => {
    onClose();
    // onClose 이후 상태 초기화는 useEffect에서 open 상태 변화로 처리됨
  };

  // 모달 제목 결정
  const getModalTitle = () => {
    if (account) {
      return '계좌 수정';
    } else if (bank) {
      return `${bank.name} - 계좌 추가`;
    } else {
      return '계좌 추가';
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{getModalTitle()}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="계좌명"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
              error={hasFieldError(validationResult, '계좌명')}
              helperText={getFormHelperText(validationResult, '계좌명')}
            />
            <TextField
              label="별칭"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              fullWidth
              error={hasFieldError(validationResult, '별칭')}
              helperText={getFormHelperText(validationResult, '별칭')}
            />

            {/* 은행 선택 필드 - 특정 은행이 주어지지 않았고 은행 목록이 있을 때만 표시 */}
            {!bank && banks.length > 0 && (
              <TextField
                select
                label="은행"
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                required
                fullWidth
                error={hasFieldError(validationResult, '은행')}
                helperText={getFormHelperText(validationResult, '은행')}
              >
                {banks.map((b) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.name}
                  </MenuItem>
                ))}
              </TextField>
            )}

            {/* 계좌 관리 페이지에서는 잔액도 수정 가능 */}
            {!bank && (
              <TextField
                label="잔액"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                fullWidth
                error={hasFieldError(validationResult, '잔액')}
                helperText={getFormHelperText(validationResult, '잔액')}
              />
            )}

            {/* 통화 선택 필드 */}
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

            {/* 폼 수준의 에러 표시 */}
            {submitted && !validationResult.isValid && validationResult.errors.length > 0 && (
              <FormHelperText error>
                입력 양식에 오류가 있습니다. 수정 후 다시 시도해주세요.
              </FormHelperText>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button type="submit" variant="contained" color="primary">
            {account ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountFormModal;
