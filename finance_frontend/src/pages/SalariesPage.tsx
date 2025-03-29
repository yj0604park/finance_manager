import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  IconButton,
  Grid,
  CircularProgress,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { useSalariesQuery, useCreateSalaryMutation, useUpdateSalaryMutation, useDeleteSalaryMutation } from '../hooks/query/useSalariesQuery';
import { Salary, CreateSalaryDto, UpdateSalaryDto } from '../api/models/Salary';

// 정렬 옵션 타입
type SortOption = {
  field: keyof Salary | '';
  direction: 'asc' | 'desc';
};

const SalariesPage: React.FC = () => {
  // 상태 관리
  const [openForm, setOpenForm] = useState(false);
  const [selectedSalaryId, setSelectedSalaryId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CreateSalaryDto>({
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    currency: 'KRW',
    gross_amount: 0,
    tax_amount: 0,
    insurance_amount: 0,
    pension_amount: 0,
    bonus: 0,
    company: '',
    department: '',
    position: '',
    note: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning',
  });

  // 필터 및 정렬 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>({ field: 'date', direction: 'desc' });
  const [filterYear, setFilterYear] = useState<string>('');

  // 쿼리 및 뮤테이션 훅 사용
  const { data: salaries, isLoading } = useSalariesQuery();
  const createSalaryMutation = useCreateSalaryMutation();
  const updateSalaryMutation = useUpdateSalaryMutation();
  const deleteSalaryMutation = useDeleteSalaryMutation();

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      currency: 'KRW',
      gross_amount: 0,
      tax_amount: 0,
      insurance_amount: 0,
      pension_amount: 0,
      bonus: 0,
      company: '',
      department: '',
      position: '',
      note: '',
    });
    setSelectedSalaryId(null);
  };

  // 폼 열기
  const handleOpenForm = (salary?: Salary) => {
    if (salary) {
      setSelectedSalaryId(salary.id);
      setFormData({
        date: salary.date,
        amount: salary.amount,
        currency: salary.currency,
        gross_amount: salary.gross_amount || 0,
        tax_amount: salary.tax_amount || 0,
        insurance_amount: salary.insurance_amount || 0,
        pension_amount: salary.pension_amount || 0,
        bonus: salary.bonus || 0,
        company: salary.company || '',
        department: salary.department || '',
        position: salary.position || '',
        note: salary.note || '',
      });
    } else {
      resetForm();
    }
    setOpenForm(true);
  };

  // 폼 닫기
  const handleCloseForm = () => {
    setOpenForm(false);
    resetForm();
  };

  // 입력 필드 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericFields = ['amount', 'gross_amount', 'tax_amount', 'insurance_amount', 'pension_amount', 'bonus'];

    setFormData((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  // 셀렉트 필드 변경 처리
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 급여 저장 (생성 또는 수정)
  const handleSaveSalary = async () => {
    try {
      if (selectedSalaryId) {
        // 수정
        await updateSalaryMutation.mutateAsync({
          id: selectedSalaryId,
          data: formData as UpdateSalaryDto,
        });
        setSnackbar({
          open: true,
          message: '급여 정보가 성공적으로 수정되었습니다.',
          severity: 'success',
        });
      } else {
        // 생성
        await createSalaryMutation.mutateAsync(formData);
        setSnackbar({
          open: true,
          message: '급여 정보가 성공적으로 추가되었습니다.',
          severity: 'success',
        });
      }
      handleCloseForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: '작업 중 오류가 발생했습니다.',
        severity: 'error',
      });
      console.error('Salary save error:', error);
    }
  };

  // 급여 삭제
  const handleDeleteSalary = async (id: number) => {
    if (window.confirm('정말로 이 급여 정보를 삭제하시겠습니까?')) {
      try {
        await deleteSalaryMutation.mutateAsync(id);
        setSnackbar({
          open: true,
          message: '급여 정보가 성공적으로 삭제되었습니다.',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: '삭제 중 오류가 발생했습니다.',
          severity: 'error',
        });
        console.error('Salary delete error:', error);
      }
    }
  };

  // 스낵바 닫기
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // 검색어 변경 처리
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 정렬 변경 처리
  const handleSortChange = (field: keyof Salary) => {
    setSortOption((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // 연도 필터 변경 처리
  const handleYearFilterChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setFilterYear(e.target.value as string);
  };

  // 필터링 및 정렬된 급여 목록 가져오기
  const getFilteredAndSortedSalaries = () => {
    if (!salaries) return [];

    let filtered = [...salaries];

    // 연도 필터 적용
    if (filterYear) {
      filtered = filtered.filter((salary) => {
        const salaryYear = new Date(salary.date).getFullYear().toString();
        return salaryYear === filterYear;
      });
    }

    // 검색어 필터 적용
    if (searchTerm.trim()) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (salary) =>
          salary.company?.toLowerCase().includes(lowerCaseSearchTerm) ||
          salary.department?.toLowerCase().includes(lowerCaseSearchTerm) ||
          salary.position?.toLowerCase().includes(lowerCaseSearchTerm) ||
          salary.note?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // 정렬 적용
    if (sortOption.field) {
      filtered.sort((a, b) => {
        const fieldA = a[sortOption.field as keyof Salary];
        const fieldB = b[sortOption.field as keyof Salary];

        if (typeof fieldA === 'string' && typeof fieldB === 'string') {
          return sortOption.direction === 'asc'
            ? fieldA.localeCompare(fieldB)
            : fieldB.localeCompare(fieldA);
        }

        if (typeof fieldA === 'number' && typeof fieldB === 'number') {
          return sortOption.direction === 'asc' ? fieldA - fieldB : fieldB - fieldA;
        }

        return 0;
      });
    }

    return filtered;
  };

  // 사용 가능한 연도 목록 가져오기
  const getAvailableYears = () => {
    if (!salaries) return [];

    const years = salaries.map((salary) => new Date(salary.date).getFullYear());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  };

  // 포맷된 금액 출력
  const formatCurrency = (amount: number, currency: string) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  // 날짜 형식 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredSalaries = getFilteredAndSortedSalaries();
  const availableYears = getAvailableYears();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          급여 관리
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenForm()}
        >
          급여 추가
        </Button>
      </Box>

      {/* 필터 및 검색 영역 */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="검색"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel id="year-filter-label">연도 필터</InputLabel>
              <Select
                labelId="year-filter-label"
                id="year-filter"
                value={filterYear}
                label="연도 필터"
                onChange={handleYearFilterChange as any}
              >
                <MenuItem value="">모든 연도</MenuItem>
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year.toString()}>
                    {year}년
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="body2" color="textSecondary">
              {filteredSalaries.length}개의 급여 기록 표시 중
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSortChange('date')}>
                    날짜
                    {sortOption.field === 'date' && (
                      <SortIcon fontSize="small" sx={{ transform: sortOption.direction === 'asc' ? 'rotate(180deg)' : 'none' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'flex-end' }} onClick={() => handleSortChange('amount')}>
                    순수령액
                    {sortOption.field === 'amount' && (
                      <SortIcon fontSize="small" sx={{ transform: sortOption.direction === 'asc' ? 'rotate(180deg)' : 'none' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', justifyContent: 'flex-end' }} onClick={() => handleSortChange('gross_amount')}>
                    총액
                    {sortOption.field === 'gross_amount' && (
                      <SortIcon fontSize="small" sx={{ transform: sortOption.direction === 'asc' ? 'rotate(180deg)' : 'none' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSortChange('company')}>
                    회사
                    {sortOption.field === 'company' && (
                      <SortIcon fontSize="small" sx={{ transform: sortOption.direction === 'asc' ? 'rotate(180deg)' : 'none' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSortChange('department')}>
                    부서
                    {sortOption.field === 'department' && (
                      <SortIcon fontSize="small" sx={{ transform: sortOption.direction === 'asc' ? 'rotate(180deg)' : 'none' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => handleSortChange('position')}>
                    직책
                    {sortOption.field === 'position' && (
                      <SortIcon fontSize="small" sx={{ transform: sortOption.direction === 'asc' ? 'rotate(180deg)' : 'none' }} />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="center">작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSalaries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Box sx={{ py: 2 }}>
                      <Typography variant="body1">등록된 급여 정보가 없습니다.</Typography>
                      <Button
                        variant="text"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenForm()}
                        sx={{ mt: 1 }}
                      >
                        급여 추가하기
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSalaries.map((salary) => (
                  <TableRow key={salary.id} hover>
                    <TableCell>{formatDate(salary.date)}</TableCell>
                    <TableCell align="right">{formatCurrency(salary.amount, salary.currency)}</TableCell>
                    <TableCell align="right">
                      {salary.gross_amount ? formatCurrency(salary.gross_amount, salary.currency) : '-'}
                    </TableCell>
                    <TableCell>{salary.company || '-'}</TableCell>
                    <TableCell>{salary.department || '-'}</TableCell>
                    <TableCell>{salary.position || '-'}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => handleOpenForm(salary)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteSalary(salary.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* 급여 폼 다이얼로그 */}
      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="md" fullWidth>
        <DialogTitle>{selectedSalaryId ? '급여 정보 수정' : '급여 정보 추가'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="date"
                label="급여일"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="currency"
                label="통화"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                inputProps={{ maxLength: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="amount"
                label="순수령액"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formData.currency}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="gross_amount"
                label="총액(세전)"
                name="gross_amount"
                type="number"
                value={formData.gross_amount}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formData.currency}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="tax_amount"
                label="세금"
                name="tax_amount"
                type="number"
                value={formData.tax_amount}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formData.currency}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="insurance_amount"
                label="보험료"
                name="insurance_amount"
                type="number"
                value={formData.insurance_amount}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formData.currency}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                id="pension_amount"
                label="연금"
                name="pension_amount"
                type="number"
                value={formData.pension_amount}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formData.currency}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="bonus"
                label="보너스"
                name="bonus"
                type="number"
                value={formData.bonus}
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{formData.currency}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="company"
                label="회사"
                name="company"
                value={formData.company}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="department"
                label="부서"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="position"
                label="직책"
                name="position"
                value={formData.position}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="note"
                label="비고"
                name="note"
                multiline
                rows={3}
                value={formData.note}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>취소</Button>
          <Button
            onClick={handleSaveSalary}
            variant="contained"
            disabled={!formData.date || !formData.amount}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>

      {/* 알림 스낵바 */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SalariesPage;
