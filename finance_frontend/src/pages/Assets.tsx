import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Divider,
  Paper,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`assets-tabpanel-${index}`}
      aria-labelledby={`assets-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `assets-tab-${index}`,
    'aria-controls': `assets-tabpanel-${index}`,
  };
};

const Assets: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // 샘플 자산 데이터 (API 연동 전까지 사용)
  const assets = [
    {
      id: '1',
      name: '예금',
      amount: 10000000,
      rate: 2.5,
      type: '현금성 자산',
    },
    {
      id: '2',
      name: '주식',
      amount: 15000000,
      rate: 0,
      type: '투자 자산',
    },
    {
      id: '3',
      name: '펀드',
      amount: 5000000,
      rate: 3.2,
      type: '투자 자산',
    },
    {
      id: '4',
      name: '부동산',
      amount: 250000000,
      rate: 0,
      type: '실물 자산',
    },
  ];

  // 자산 분류별 차트 데이터
  const pieData = [
    { name: '현금성 자산', value: 10000000, color: '#1976d2' },
    { name: '투자 자산', value: 20000000, color: '#2e7d32' },
    { name: '실물 자산', value: 250000000, color: '#ed6c02' },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ko-KR') + '원';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          자산 관리
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }}>
          새 자산 추가
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : assets.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
          등록된 자산이 없습니다. 새 자산을 추가해 보세요.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {/* 자산 요약 차트 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  자산 분포
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => formatCurrency(value)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 자산 총액 */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  자산 총액
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                  <MoneyIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                  <Typography variant="h4" component="div">
                    {formatCurrency(assets.reduce((sum, asset) => sum + asset.amount, 0))}
                  </Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1">월 예상 수익:</Typography>
                  <Typography
                    variant="body1"
                    color="success.main"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <TrendingUpIcon sx={{ mr: 0.5 }} />
                    {formatCurrency(
                      assets
                        .filter((asset) => asset.rate > 0)
                        .reduce((sum, asset) => sum + (asset.amount * asset.rate) / 100 / 12, 0)
                    )}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 자산 탭 */}
          <Grid item xs={12}>
            <Paper sx={{ borderRadius: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="자산 유형 탭">
                  <Tab label="전체 자산" {...a11yProps(0)} />
                  <Tab label="현금성 자산" {...a11yProps(1)} />
                  <Tab label="투자 자산" {...a11yProps(2)} />
                  <Tab label="실물 자산" {...a11yProps(3)} />
                </Tabs>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Grid container spacing={2}>
                  {assets.map((asset) => (
                    <Grid item xs={12} sm={6} md={4} key={asset.id}>
                      <Card
                        sx={{
                          borderRadius: 2,
                          transition: 'transform 0.3s, box-shadow 0.3s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 6,
                          },
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {asset.name}
                          </Typography>
                          <Typography variant="body1" color="text.secondary" gutterBottom>
                            금액: {formatCurrency(asset.amount)}
                          </Typography>
                          {asset.rate > 0 && (
                            <Typography variant="body2" color="success.main" gutterBottom>
                              수익률: {asset.rate}%
                            </Typography>
                          )}
                          <Typography variant="body2" color="text.secondary">
                            유형: {asset.type}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={2}>
                  {assets
                    .filter((asset) => asset.type === '현금성 자산')
                    .map((asset) => (
                      <Grid item xs={12} sm={6} md={4} key={asset.id}>
                        <Card sx={{ borderRadius: 2 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {asset.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                              금액: {formatCurrency(asset.amount)}
                            </Typography>
                            {asset.rate > 0 && (
                              <Typography variant="body2" color="success.main" gutterBottom>
                                수익률: {asset.rate}%
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Grid container spacing={2}>
                  {assets
                    .filter((asset) => asset.type === '투자 자산')
                    .map((asset) => (
                      <Grid item xs={12} sm={6} md={4} key={asset.id}>
                        <Card sx={{ borderRadius: 2 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {asset.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                              금액: {formatCurrency(asset.amount)}
                            </Typography>
                            {asset.rate > 0 && (
                              <Typography variant="body2" color="success.main" gutterBottom>
                                수익률: {asset.rate}%
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </TabPanel>

              <TabPanel value={tabValue} index={3}>
                <Grid container spacing={2}>
                  {assets
                    .filter((asset) => asset.type === '실물 자산')
                    .map((asset) => (
                      <Grid item xs={12} sm={6} md={4} key={asset.id}>
                        <Card sx={{ borderRadius: 2 }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {asset.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                              금액: {formatCurrency(asset.amount)}
                            </Typography>
                            {asset.rate > 0 && (
                              <Typography variant="body2" color="success.main" gutterBottom>
                                수익률: {asset.rate}%
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default Assets;
