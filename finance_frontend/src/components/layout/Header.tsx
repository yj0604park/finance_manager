import {
  AppBar, Toolbar, Typography, Box,
  Avatar, Stack, IconButton, Button, Chip
} from '@mui/material';
import { AccountBalanceWallet, Menu as MenuIcon, Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import {
  appBarStyle,
  logoAvatarStyle,
  logoTypographyStyle,
  userChipStyle
} from '../../styles/layoutStyles';

interface HeaderProps {
  isAuthenticated: boolean;
  isMobile: boolean;
  handleDrawerToggle: () => void;
}

const Header = ({ isAuthenticated, isMobile, handleDrawerToggle }: HeaderProps) => {
  const { user } = useAuth();

  return (
    <AppBar
      position="fixed"
      elevation={3}
      sx={{
        ...appBarStyle,
        width: '100%',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ py: isMobile ? 1 : 1.5 }}>
        {(isMobile || isAuthenticated) && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            sx={{
              ...logoAvatarStyle(),
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <AccountBalanceWallet fontSize="small" />
          </Avatar>
          <Typography
            variant="h6"
            component="div"
            sx={logoTypographyStyle(isMobile)}
          >
            금융 관리 시스템
          </Typography>
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        {isAuthenticated ? (
          <Chip
            avatar={<Avatar>{user?.email?.charAt(0).toUpperCase() || 'U'}</Avatar>}
            label={user?.email || '사용자'}
            variant="outlined"
            sx={userChipStyle}
          />
        ) : (
          <Button
            color="inherit"
            startIcon={<LoginIcon />}
            onClick={() => {
              window.location.href = '/login';
            }}
          >
            로그인
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
