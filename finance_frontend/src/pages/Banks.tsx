import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, CircularProgress,
  Alert, Card, Chip, Avatar, Stack, IconButton, Tooltip, Divider
} from '@mui/material';
import { ArrowBack, AccountBalance, PriceCheck, Flag } from '@mui/icons-material';
import { BanksService } from '../api/services/BanksService';
import type { Bank } from '../api/models/Bank';
import { useAuth } from '../contexts/AuthContext';
import { banksStyles } from '../styles/pageStyles';
import { headerContainerStyle, headerAvatarStyle, headerTitleStyle, loadingContainerStyle } from '../styles/commonStyles';

const Banks = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      setError('');

      try {
        console.log('인증 토큰으로 요청:', token);
        const data = await BanksService.banksList();
        console.log('은행 데이터 응답:', data);
        setBanks(data);
      } catch (err: any) {
        console.error('은행 목록 조회 오류:', err);

        // 오류 메시지 처리 개선
        let errorMessage = '은행 목록을 불러오는 중 오류가 발생했습니다.';

        if (err.status === 401) {
          errorMessage = '인증 토큰이 유효하지 않습니다. 다시 로그인해주세요.';
        } else if (err.status === 403) {
          errorMessage = '접근 권한이 없습니다.';
        } else if (err.status === 404) {
          errorMessage = '요청한 리소스를 찾을 수 없습니다.';
        } else if (err.status >= 500) {
          errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
        }

        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, [token]);

  // 은행 데이터가 없을 때 보여줄 컴포넌트
  const EmptyBanksView = () => (
    <Card
      elevation={2}
      sx={banksStyles.emptyCard}
    >
      <AccountBalance sx={banksStyles.emptyIcon} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        등록된 은행이 없습니다
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        은행을 등록하면 여기에 표시됩니다
      </Typography>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={banksStyles.container}>
        <Box sx={headerContainerStyle}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar sx={headerAvatarStyle}>
              <AccountBalance />
            </Avatar>
            <Typography variant="h4" component="h1" sx={headerTitleStyle}>
              은행 목록
            </Typography>
          </Stack>
          <Box>
            <Tooltip title="대시보드로 돌아가기">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate('/dashboard')}
                startIcon={<ArrowBack />}
                sx={banksStyles.backButton}
              >
                대시보드
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={banksStyles.alert}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={loadingContainerStyle}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            {banks.length > 0 ? (
              <Card elevation={3} sx={banksStyles.tableCard}>
                <TableContainer>
                  <Table aria-label="은행 목록 테이블">
                    <TableHead sx={{ backgroundColor: 'primary.main' }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          ID
                        </TableCell>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          이름
                        </TableCell>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          잔액
                        </TableCell>
                        <TableCell
                          sx={{
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        >
                          국가
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {banks.map((bank) => (
                        <TableRow
                          key={bank.id}
                          hover
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <TableCell sx={{ fontWeight: 'medium' }}>
                            {bank.id}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Avatar
                                sx={banksStyles.avatar}
                              >
                                {bank.name.substring(0, 2).toUpperCase()}
                              </Avatar>
                              <Typography variant="body1" fontWeight="medium">
                                {bank.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<PriceCheck />}
                              label={bank.amount}
                              variant="outlined"
                              color="primary"
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={<Flag />}
                              label={bank.country || '미지정'}
                              size="small"
                              color="secondary"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            ) : (
              <EmptyBanksView />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default Banks;
