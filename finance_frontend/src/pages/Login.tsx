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
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
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
