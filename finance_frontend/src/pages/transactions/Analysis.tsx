import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Grid,
  Paper,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, sub } from 'date-fns';
import { ko } from 'date-fns/locale';
import { TransactionsService } from '../../api/services/TransactionsService';
import { Transaction } from '../../api/models/Transaction';
import { TransactionTypeEnum } from '../../api/models/TransactionTypeEnum';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

// 차트 색상 정의
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// 수입/지출 타입 구분
const INCOME_TYPES = [
  TransactionTypeEnum.DEPOSIT,
  TransactionTypeEnum.SALARY,
  TransactionTypeEnum.BONUS,
  TransactionTypeEnum.INTEREST_INCOME,
  TransactionTypeEnum.STOCK_INCOME,
  TransactionTypeEnum.RENT_INCOME,
  TransactionTypeEnum.DIVIDEND,
  TransactionTypeEnum.ETC_INCOME,
];

const EXPENSE_TYPES = [
  TransactionTypeEnum.WITHDRAW,
  TransactionTypeEnum.DAILY_NECESSITY,
  TransactionTypeEnum.GROCERY,
  TransactionTypeEnum.MEMBERSHIP,
  TransactionTypeEnum.SERVICE,
  TransactionTypeEnum.EAT_OUT,
  TransactionTypeEnum.CLOTHING,
  TransactionTypeEnum.PRESENT,
  TransactionTypeEnum.CAR,
  TransactionTypeEnum.HOUSING,
  TransactionTypeEnum.LEISURE,
  TransactionTypeEnum.MEDICAL,
  TransactionTypeEnum.PARENTING,
  TransactionTypeEnum.INTEREST_EXPENSE,
  TransactionTypeEnum.ETC_EXPENSE,
];

const TransactionAnalysis: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [period, setPeriod] = useState<string>('month');

  // 1. 거래 목록 조회
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      // 여기서는 API에서 필터링 기능을 제공한다고 가정
      const response = await TransactionsService.transactionsList();

      // 클라이언트에서 날짜 필터링 (서버에서 필터링하는 것이 더 효율적)
      const filteredData = response.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      setTransactions(filteredData);
    } catch (err) {
      setError('거래 내역을 불러오는데 실패했습니다.');
      console.error('거래 내역 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  // 2. 기간 변경 시 데이터 새로 불러오기
  useEffect(() => {
    fetchTransactions();
  }, [startDate, endDate]);

  // 3. 기간 선택 핸들러
  const handlePeriodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPeriod = event.target.value;
    setPeriod(selectedPeriod);

    const today = new Date();

    switch (selectedPeriod) {
      case 'week':
        setStartDate(sub(today, { days: 7 }));
        setEndDate(today);
        break;
      case 'month':
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
        break;
      case 'quarter':
        setStartDate(sub(today, { months: 3 }));
        setEndDate(today);
        break;
      case 'year':
        setStartDate(startOfYear(today));
        setEndDate(endOfYear(today));
        break;
      default:
        // 기본값은 현재 월
        setStartDate(startOfMonth(today));
        setEndDate(endOfMonth(today));
    }
  };

  // 4. 총 수입 계산
  const calculateTotalIncome = () => {
    return transactions
      .filter(
        (transaction) =>
          transaction.transaction_type && INCOME_TYPES.includes(transaction.transaction_type)
      )
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  };

  // 5. 총 지출 계산
  const calculateTotalExpense = () => {
    return transactions
      .filter(
        (transaction) =>
          transaction.transaction_type && EXPENSE_TYPES.includes(transaction.transaction_type)
      )
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
  };

  // 6. 수지 균형 (순이익) 계산
  const calculateNetIncome = () => {
    return calculateTotalIncome() - calculateTotalExpense();
  };

  // 7. 일별 거래 데이터 준비
  const prepareDailyData = () => {
    const dailyData: { [key: string]: { date: string; income: number; expense: number } } = {};

    transactions.forEach((transaction) => {
      const date = transaction.date.split('T')[0]; // YYYY-MM-DD 형식

      if (!dailyData[date]) {
        dailyData[date] = { date, income: 0, expense: 0 };
      }

      if (transaction.transaction_type && INCOME_TYPES.includes(transaction.transaction_type)) {
        dailyData[date].income += Number(transaction.amount);
      } else if (
        transaction.transaction_type &&
        EXPENSE_TYPES.includes(transaction.transaction_type)
      ) {
        dailyData[date].expense += Number(transaction.amount);
      }
    });

    return Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));
  };

  // 8. 거래 유형별 비율 데이터 준비
  const prepareTypeData = () => {
    const typeData: { name: string; value: number }[] = [
      { name: '수입', value: calculateTotalIncome() },
      { name: '지출', value: calculateTotalExpense() },
    ];

    return typeData;
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <Container
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
      >
        <CircularProgress />
      </Container>
    );
  }

  // 에러 표시
  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          거래 분석
        </Typography>

        {/* 필터 섹션 */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                label="기간 선택"
                value={period}
                onChange={handlePeriodChange}
              >
                <MenuItem value="week">최근 1주일</MenuItem>
                <MenuItem value="month">이번 달</MenuItem>
                <MenuItem value="quarter">최근 3개월</MenuItem>
                <MenuItem value="year">올해</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <DatePicker
                label="시작일"
                value={startDate}
                onChange={(newValue) => newValue && setStartDate(newValue)}
                format="yyyy-MM-dd"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <DatePicker
                label="종료일"
                value={endDate}
                onChange={(newValue) => newValue && setEndDate(newValue)}
                format="yyyy-MM-dd"
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button variant="contained" color="primary" fullWidth onClick={fetchTransactions}>
                조회
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* 요약 정보 */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  총 수입
                </Typography>
                <Typography variant="h5" component="div" color="primary">
                  {calculateTotalIncome().toLocaleString('ko-KR')}원
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  총 지출
                </Typography>
                <Typography variant="h5" component="div" color="error">
                  {calculateTotalExpense().toLocaleString('ko-KR')}원
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  순이익
                </Typography>
                <Typography
                  variant="h5"
                  component="div"
                  color={calculateNetIncome() >= 0 ? 'primary' : 'error'}
                >
                  {calculateNetIncome().toLocaleString('ko-KR')}원
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* 차트 섹션 */}
        <Grid container spacing={4}>
          {/* 일별 수입/지출 차트 */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                일별 수입/지출 추이
              </Typography>
              <Box sx={{ height: 400, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={prepareDailyData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" name="수입" fill="#0088FE" />
                    <Bar dataKey="expense" name="지출" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* 수입/지출 비율 파이 차트 */}
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                수입/지출 비율
              </Typography>
              <Box sx={{ height: 400, mt: 2 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={prepareTypeData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {prepareTypeData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString('ko-KR')}원`} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TransactionAnalysis;
