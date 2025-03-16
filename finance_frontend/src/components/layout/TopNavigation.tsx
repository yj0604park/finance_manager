import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const TopNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
          Financial Management
        </Typography>
        <Box>
          {isAuthenticated ? (
            <Button 
              color="inherit" 
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          ) : (
            <Button 
              color="primary" 
              variant="contained"
              onClick={() => navigate('/login')}
            >
              로그인
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 