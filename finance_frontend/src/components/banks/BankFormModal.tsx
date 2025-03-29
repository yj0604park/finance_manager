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
import { Bank } from '../../api/models/Bank';
import { CountryEnum } from '../../api/models/CountryEnum';
import { validateBankForm, getFormHelperText, hasFieldError, ValidationResult } from '../../utils/validations';

/**
 * 은행 추가 및 수정을 위한 모달 컴포넌트
 * bank prop 유무에 따라 수정/추가 모드로 동작합니다.
 */
interface BankFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (bank: Partial<Bank>) => void;
  bank?: Bank;
}

const BankFormModal: React.FC<BankFormModalProps> = ({ open, onClose, onSubmit, bank }) => {
  const [formData, setFormData] = useState<Partial<Bank>>({
    name: '',
    country: CountryEnum.KOREA,
  });

  // 검증 결과 상태
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: true,
    errors: []
  });

  // 폼 제출 시도 여부 상태
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (bank) {
      setFormData({
        name: bank.name,
        country: bank.country,
      });
    } else {
      setFormData({
        name: '',
        country: CountryEnum.KOREA,
      });
    }

    // 모달이 새로 열릴 때 검증 상태 초기화
    setValidationResult({ isValid: true, errors: [] });
    setSubmitted(false);
  }, [bank, open]);

  // 폼 데이터 변경 시 유효성 검사
  useEffect(() => {
    if (submitted) {
      const result = validateBankForm(formData);
      setValidationResult(result);
    }
  }, [formData, submitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const result = validateBankForm(formData);
    setValidationResult(result);

    if (result.isValid) {
      onSubmit(formData);
    }
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
              error={hasFieldError(validationResult, '은행명')}
              helperText={getFormHelperText(validationResult, '은행명')}
            />
            <TextField
              select
              label="국가"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              fullWidth
              error={hasFieldError(validationResult, '국가')}
              helperText={getFormHelperText(validationResult, '국가')}
            >
              {Object.values(CountryEnum).map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
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
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="contained" color="primary">
            {bank ? '수정' : '추가'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BankFormModal;
