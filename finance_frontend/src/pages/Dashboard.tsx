import React, { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, Box } from '@mui/material';
import { AccountBalance as BankIcon, CreditCard as CardIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';
import ChartCard from '../components/dashboard/ChartCard';
import SummaryCard from '../components/dashboard/SummaryCard';
import { AccountsService } from '../api/services/AccountsService';
import { TransactionsService } from '../api/services/TransactionsService';
import { Account } from '../api/models/Account';
import { Transaction } from '../api/models/Transaction';

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsResponse, transactionsResponse] = await Promise.all([
          AccountsService.accountsList(),
          TransactionsService.transactionsList(),
        ]);

        setAccounts(accountsResponse);
        setRecentTransactions(transactionsResponse.slice(0, 5)); // 최근 5개만 표시
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 샘플 데이터 (실제 API 연동 전까지 사용)
  const monthlyData = [
    { name: '1월', income: 5000000, expense: 3000000 },
    { name: '2월', income: 5500000, expense: 3200000 },
    { name: '3월', income: 4800000, expense: 3500000 },
    { name: '4월', income: 5200000, expense: 3100000 },
    { name: '5월', income: 5800000, expense: 3400000 },
    { name: '6월', income: 6000000, expense: 3600000 },
  ];

  const categoryData = [
    { name: '식비', value: 35 },
    { name: '주거', value: 25 },
    { name: '교통', value: 15 },
    { name: '의료', value: 10 },
    { name: '기타', value: 15 },
  ];

  const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.amount), 0);
  const monthlyIncome = monthlyData[monthlyData.length - 1].income;
  const monthlyExpense = monthlyData[monthlyData.length - 1].expense;

  if (loading) {
    return (
      <Container>
        <Typography>로딩 중...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* 요약 카드 */}
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="총 자산"
            value={`${totalBalance.toLocaleString()}원`}
            icon={<BankIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="이번 달 수입"
            value={`${monthlyIncome.toLocaleString()}원`}
            icon={<TrendingUpIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="이번 달 지출"
            value={`${monthlyExpense.toLocaleString()}원`}
            icon={<TrendingDownIcon />}
            color="#d32f2f"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <SummaryCard
            title="순수입"
            value={`${(monthlyIncome - monthlyExpense).toLocaleString()}원`}
            icon={<CardIcon />}
            color="#ed6c02"
          />
        </Grid>

        {/* 차트 */}
        <Grid item xs={12} md={8}>
          <ChartCard
            title="월별 수입/지출 추이"
            type="line"
            data={monthlyData}
            height={400}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ChartCard
            title="카테고리별 지출"
            type="pie"
            data={categoryData}
            height={400}
          />
        </Grid>

        {/* 최근 거래 내역 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              최근 거래 내역
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px' }}>날짜</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>설명</th>
                    <th style={{ textAlign: 'right', padding: '8px' }}>금액</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td style={{ padding: '8px' }}>
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '8px' }}>{transaction.note || '거래 내역'}</td>
                      <td style={{ textAlign: 'right', padding: '8px' }}>
                        {parseFloat(transaction.amount).toLocaleString()}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
