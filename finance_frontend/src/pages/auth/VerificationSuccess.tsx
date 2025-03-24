import { Box, Button, Container, Typography, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const VerificationSuccess = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            이메일 인증 완료
          </Typography>
          
          <Alert severity="success" sx={{ mb: 3 }}>
            이메일이 성공적으로 인증되었습니다. 이제 로그인할 수 있습니다.
          </Alert>
          
          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleLogin}
              sx={{ mt: 2 }}
            >
              로그인하기
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default VerificationSuccess; 