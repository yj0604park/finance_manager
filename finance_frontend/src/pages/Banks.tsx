import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, CircularProgress,
  Alert, Card, Chip, Avatar, Stack, IconButton, Tooltip, Divider,
  Snackbar
} from '@mui/material';
import { Add, AccountBalance, PriceCheck, Flag, Refresh } from '@mui/icons-material';
import { BanksService } from '../api/services/BanksService';
import type { Bank } from '../api/models/Bank';
import { useAuth } from '../contexts/AuthContext';
import { banksStyles } from '../styles/pageStyles';
import { headerContainerStyle, headerAvatarStyle, headerTitleStyle, loadingContainerStyle, contentCardStyle } from '../styles/commonStyles';
import AddBankModal from '../components/banks/AddBankModal';

const Banks = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { token } = useAuth();

  // 은행 추가 모달 상태
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 알림 상태
  const [notification, setNotification] = useState('');

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

  useEffect(() => {
    fetchBanks();
  }, [token]);

  // 모달 열기/닫기 핸들러
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  // 은행 추가 성공 핸들러
  const handleAddSuccess = (newBank: Bank) => {
    // 목록에 새 은행 추가
    setBanks(prevBanks => [newBank, ...prevBanks]);

    // 성공 알림 표시
    setNotification('은행이 성공적으로 추가되었습니다.');
  };

  // 알림 닫기 핸들러
  const handleCloseNotification = () => {
    setNotification('');
  };

  // 새로고침 핸들러
  const handleRefresh = () => {
    fetchBanks();
  };

  // 은행 데이터가 없을 때 보여줄 컴포넌트
  const EmptyBanksView = () => (
    <Card
      elevation={3}
      sx={banksStyles.emptyCard}
    >
      <AccountBalance sx={banksStyles.emptyIcon} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        등록된 은행이 없습니다
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        은행을 등록하면 여기에 표시됩니다
      </Typography>
      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mt: 2 }}
        onClick={handleOpenAddModal}
      >
        은행 추가
      </Button>
    </Card>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={headerContainerStyle}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={headerAvatarStyle}>
            <AccountBalance />
          </Avatar>
          <Typography variant="h4" component="h1" sx={headerTitleStyle}>
            은행 목록
          </Typography>
        </Stack>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<Refresh />}
            sx={{ borderRadius: 2 }}
            onClick={handleRefresh}
            disabled={loading}
          >
            새로고침
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            sx={{ borderRadius: 2 }}
            onClick={handleOpenAddModal}
          >
            은행 추가
          </Button>
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
            <Card elevation={3} sx={{ ...contentCardStyle, mt: 2 }}>
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

      {/* 은행 추가 모달 */}
      <AddBankModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSuccess={handleAddSuccess}
      />

      {/* 알림 스낵바 */}
      <Snackbar
        open={!!notification}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
        message={notification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Banks;
