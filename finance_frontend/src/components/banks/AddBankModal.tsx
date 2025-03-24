import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
  Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { AccountBalance, AttachMoney, Flag } from '@mui/icons-material';
import { BanksService } from '../../api/services/BanksService';
import { Bank } from '../../api/models/Bank';
import { CountryEnum } from '../../api/models/CountryEnum';

interface AddBankModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newBank: Bank) => void;
}

const AddBankModal = ({ open, onClose, onSuccess }: AddBankModalProps) => {
  // 폼 상태 관리
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [country, setCountry] = useState<CountryEnum | ''>('');

  // 유효성 검사 상태
  const [nameError, setNameError] = useState('');
  const [amountError, setAmountError] = useState('');

  // 제출 상태 관리
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 입력 필드 초기화
  const resetForm = () => {
    setName('');
    setAmount('');
    setCountry('');
    setNameError('');
    setAmountError('');
    setError('');
  };

  // 폼 제출 핸들러
  const handleSubmit = async () => {
    // 유효성 검사 초기화
    setNameError('');
    setAmountError('');
    setError('');

    // 기본 유효성 검사
    let isValid = true;

    if (!name.trim()) {
      setNameError('은행 이름을 입력해주세요');
      isValid = false;
    }

    if (!amount.trim()) {
      setAmountError('잔액을 입력해주세요');
      isValid = false;
    } else if (isNaN(Number(amount))) {
      setAmountError('유효한 숫자를 입력해주세요');
      isValid = false;
    }

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      // 새 은행 추가 API 호출
      // 참고: user 필드가 필요하지만 서버에서 현재 로그인한 사용자로 자동 설정되므로 0으로 임시값 설정
      const newBank = await BanksService.banksCreate({
        id: 0, // 새 은행이므로 임시 ID (서버에서 무시됨)
        name: name.trim(),
        amount: amount.trim(),
        country: country as CountryEnum || undefined,
        user: 0 // 임시값 (서버에서 현재 로그인한 사용자 ID로 설정됨)
      });

      // 성공 시 콜백 호출
      onSuccess(newBank);

      // 모달 닫기 및 폼 초기화
      resetForm();
      onClose();
    } catch (err: any) {
      console.error('은행 추가 오류:', err);

      // 오류 처리
      let errorMessage = '은행을 추가하는 중 오류가 발생했습니다.';

      if (err.status === 400) {
        errorMessage = '입력한 정보가 올바르지 않습니다.';
      } else if (err.status === 401) {
        errorMessage = '인증이 필요합니다. 다시 로그인해주세요.';
      } else if (err.status >= 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <AccountBalance color="primary" />
            <Typography variant="h6" component="span">
              새 은행 추가
            </Typography>
          </Stack>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="dense"
            label="은행 이름"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!nameError}
            helperText={nameError}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountBalance color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            label="잔액"
            fullWidth
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={!!amountError}
            helperText={amountError}
            disabled={isSubmitting}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AttachMoney color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel id="country-select-label">국가</InputLabel>
            <Select
              labelId="country-select-label"
              value={country}
              label="국가"
              onChange={(e) => setCountry(e.target.value as CountryEnum)}
              disabled={isSubmitting}
              startAdornment={
                <InputAdornment position="start">
                  <Flag color="action" />
                </InputAdornment>
              }
            >
              <MenuItem value="">
                <em>선택 안함</em>
              </MenuItem>
              <MenuItem value={CountryEnum.KOREA}>한국</MenuItem>
              <MenuItem value={CountryEnum.USA}>미국</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          color="inherit"
          disabled={isSubmitting}
        >
          취소
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
        >
          {isSubmitting ? '처리 중...' : '추가'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBankModal;
