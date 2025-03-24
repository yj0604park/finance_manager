import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Paper, Alert, Button, CircularProgress } from '@mui/material';
import { AUTH_ENDPOINTS } from '../../constants/api';
import { api } from '../../utils/apiClient';

export const EmailVerification = () => {
  const { key } = useParams<{ key: string }>();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('이메일 인증을 처리 중입니다...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Send verification request to the backend
        await api.post(AUTH_ENDPOINTS.VERIFY_EMAIL, { key });
        
        setStatus('success');
        setMessage('이메일이 성공적으로 인증되었습니다.');
        // Redirect to success page after a short delay
        setTimeout(() => {
          navigate('/verification-success');
        }, 1500);
      } catch (error) {
        setStatus('error');
        if (error instanceof Error) {
          setMessage(error.message || '이메일 인증에 실패했습니다.');
          console.error('Email verification error:', error);
        } else {
          setMessage('이메일 인증 중 오류가 발생했습니다.');
        }
      }
    };

    if (key) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('유효하지 않은 인증 링크입니다.');
    }
  }, [key, navigate]);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            이메일 인증
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 3, mb: 3 }}>
            {status === 'loading' && (
              <>
                <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
                <Typography variant="body1" align="center">{message}</Typography>
              </>
            )}

            {status === 'success' && (
              <>
                <Alert severity="success" sx={{ mb: 3, width: '100%' }}>
                  {message}
                </Alert>
                <CircularProgress size={30} thickness={4} sx={{ mb: 2 }} />
                <Typography variant="body2" align="center">인증 완료 페이지로 이동 중...</Typography>
              </>
            )}

            {status === 'error' && (
              <>
                <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
                  {message}
                </Alert>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleRetry}
                  sx={{ mt: 2, mb: 2 }}
                >
                  다시 시도
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleLogin}
                >
                  로그인 페이지로 이동
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default EmailVerification; 