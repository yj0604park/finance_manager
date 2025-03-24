import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Typography, Container, Grid, Paper,
  Card, CardContent, CardActions, Divider, Stack, Tooltip,
  Avatar
} from '@mui/material';
import { AccountBalanceWallet, Logout, AccountBalance, CreditCard } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
          borderBottom: '1px solid #e0e0e0',
          pb: 2
        }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={{ bgcolor: 'primary.main', width: 46, height: 46 }}>
              <AccountBalanceWallet />
            </Avatar>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
              금융 대시보드
            </Typography>
          </Stack>
          <Tooltip title="로그아웃">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              startIcon={<Logout />}
              sx={{
                borderRadius: 2,
                px: 2
              }}
            >
              로그아웃
            </Button>
          </Tooltip>
        </Box>

        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          금융 정보 관리
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 250,
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8,
                },
              }}
            >
              <CardContent sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <AccountBalance />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    은행 관리
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  등록된 은행 계좌 정보를 조회하고 관리합니다.
                </Typography>
                <Typography variant="body2" color="primary" sx={{ mt: 'auto' }}>
                  은행 데이터를 관리하고 계좌를 추가하세요.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1
                  }}
                  onClick={() => navigate('/banks')}
                >
                  은행 목록
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card
              elevation={3}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: 250,
                borderRadius: 3,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8,
                },
              }}
            >
              <CardContent sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1
              }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>
                    <CreditCard />
                  </Avatar>
                  <Typography variant="h6" fontWeight="bold">
                    거래 관리
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  금융 거래 내역을 조회하고 분석합니다.
                </Typography>
                <Typography variant="body2" color="secondary" sx={{ mt: 'auto' }}>
                  준비 중인 기능입니다.
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  variant="contained"
                  fullWidth
                  color="secondary"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    py: 1
                  }}
                  disabled
                >
                  준비 중
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
