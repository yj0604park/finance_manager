import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Container,
  Alert, Avatar, InputAdornment, IconButton, Card, Divider
} from '@mui/material';
import { Visibility, VisibilityOff, LockOutlined, AccountCircle } from '@mui/icons-material';
import { RestAuthService } from '../api/services/RestAuthService';
import { useAuth } from '../contexts/AuthContext';
import { loginStyles } from '../styles/pageStyles';

// ApiError 인터페이스 정의
interface ApiError {
  url: string;
  status: number;
  statusText: string;
  body: {
    non_field_errors?: string[];
    [key: string]: any;
  };
  request: {
    method: string;
    url: string;
    body: any;
    mediaType: string;
  };
  name: string;
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await RestAuthService.restAuthLoginCreate({
        email,
        password,
      });

      login(response.key, email);
      navigate('/dashboard');
    } catch (err) {
      console.error('로그인 오류:', err);

      if (err && typeof err === 'object' && 'name' in err && err.name === 'ApiError') {
        const apiError = err as ApiError;

        if (apiError.body && apiError.body.non_field_errors && apiError.body.non_field_errors.length > 0) {
          // API에서 반환된 실제 에러 메시지 표시
          setError(apiError.body.non_field_errors[0]);
        } else {
          setError(`요청 오류: ${apiError.status} ${apiError.statusText}`);
        }
      } else {
        setError('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={loginStyles.container}>
        <Card elevation={8} sx={loginStyles.card}>
          <Box sx={loginStyles.avatarBox}>
            <Avatar sx={loginStyles.avatar}>
              <LockOutlined fontSize="large" />
            </Avatar>
            <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom>
              로그인
            </Typography>
            <Divider sx={loginStyles.divider} />
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2, fontWeight: 'medium' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle color="primary" />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlined color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={loginStyles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;
