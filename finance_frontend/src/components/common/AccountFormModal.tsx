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
import { AccountTypeEnum } from '../../api/models/AccountTypeEnum';
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
  bank?: Bank; // 은행 관리 페이지에서 특정 은행 선택 시 사용
  bankList?: Bank[]; // 계좌 관리 페이지에서 은행 선택 시 사용
}

const AccountFormModal: React.FC<AccountFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  account,
  bank,
  bankList = [],
}) => {
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState<Partial<Account>>({
    name: '',
    nickname: '',
    currency: CurrencyToEnum.KRW,
    account_type: AccountTypeEnum.CHECKING_ACCOUNT,
    bank: bank?.id || (bankList.length > 0 ? bankList[0].id : 0),
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
        currency: account.currency || CurrencyToEnum.KRW,
        account_type: account.account_type || AccountTypeEnum.CHECKING_ACCOUNT,
        bank: account.bank,
      });
    } else {
      // 계좌 추가 모드
      setFormData({
        name: '',
        nickname: '',
        currency: CurrencyToEnum.KRW,
        account_type: AccountTypeEnum.CHECKING_ACCOUNT,
        bank: bank?.id || (bankList.length > 0 ? bankList[0].id : 0),
      });
    }

    // 모달이 새로 열릴 때 검증 상태 초기화
    setValidationResult({ isValid: true, errors: [] });
    setSubmitted(false);
  }, [open, account, bank, bankList]);

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
            {!bank && bankList.length > 0 && (
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
                {bankList.map((b: Bank) => (
                  <MenuItem key={b.id} value={b.id}>
                    {b.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
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
            <TextField
              select
              label="계좌 유형"
              name="account_type"
              value={formData.account_type}
              onChange={handleChange}
              fullWidth
            >
              {Object.entries(AccountTypeEnum).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {value === AccountTypeEnum.CHECKING_ACCOUNT && '입출금'}
                  {value === AccountTypeEnum.SAVINGS_ACCOUNT && '저금'}
                  {value === AccountTypeEnum.INSTALLMENT_SAVING && '적금'}
                  {value === AccountTypeEnum.TIME_DEPOSIT && '예금'}
                  {value === AccountTypeEnum.CREDIT_CARD && '신용카드'}
                  {value === AccountTypeEnum.STOCK && '주식'}
                  {value === AccountTypeEnum.LOAN && '대출'}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="통화"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              fullWidth
              error={hasFieldError(validationResult, '통화')}
              helperText={getFormHelperText(validationResult, '통화')}
            >
              {Object.entries(CurrencyToEnum).map(([key, value]) => (
                <MenuItem key={key} value={value}>
                  {value}
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
