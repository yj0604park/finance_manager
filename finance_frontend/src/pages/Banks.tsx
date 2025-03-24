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

const Banks = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBanks = async () => {
      setLoading(true);
      try {
        const data = await BanksService.banksList();
        setBanks(data);
      } catch (err) {
        console.error('은행 목록 조회 오류:', err);
        setError('은행 목록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBanks();
  }, []);

  // 은행 데이터가 없을 때 보여줄 컴포넌트
  const EmptyBanksView = () => (
    <Card
      elevation={2}
      sx={{
        p: 4,
        textAlign: 'center',
        borderRadius: 2,
        backgroundColor: '#f9f9f9'
      }}
    >
      <AccountBalance sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
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
              <AccountBalance />
            </Avatar>
            <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
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
                sx={{ borderRadius: 2 }}
              >
                대시보드
              </Button>
            </Tooltip>
          </Box>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              fontWeight: 'medium'
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 8
          }}>
            <CircularProgress size={60} thickness={4} />
          </Box>
        ) : (
          <>
            {banks.length > 0 ? (
              <Card elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
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
                                sx={{
                                  width: 32,
                                  height: 32,
                                  bgcolor: 'primary.light',
                                  fontSize: '0.75rem'
                                }}
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
