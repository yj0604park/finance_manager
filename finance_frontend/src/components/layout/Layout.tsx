import { ReactNode, useState } from 'react';
import {
  AppBar, Toolbar, Typography, Box,
  useTheme, useMediaQuery, Avatar, Stack, IconButton, Button
} from '@mui/material';
import { AccountBalanceWallet, Menu as MenuIcon, Login as LoginIcon, Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import {
  appBarStyle,
  logoAvatarStyle,
  logoTypographyStyle
} from '../../styles/layoutStyles';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

// 드로어 너비 설정
const DRAWER_WIDTH = 240;

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 모바일에서 사이드바 열림/닫힘 상태 관리
  const [mobileOpen, setMobileOpen] = useState(false);

  // 모바일에서 사이드바 토글 함수
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* 앱바 - 전체 너비를 차지하도록 수정 */}
      <AppBar
        position="fixed"
        elevation={3}
        sx={{
          ...appBarStyle,
          width: '100%',  // 전체 너비로 변경
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
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={() => {
                // 로그아웃 함수 호출
                logout();
              }}
            >
              로그아웃
            </Button>
          ) : (
            <Button
              color="inherit"
              startIcon={<LoginIcon />}
              onClick={() => {
                // 로그인 페이지로 이동 또는 로그인 모달 오픈
                window.location.href = '/login';
              }}
            >
              로그인
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', pt: { xs: 7, md: 8 } }}>
        {/* 사이드바 - 앱바 아래에 위치하도록 변경 */}
        {isAuthenticated && (
          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
            drawerWidth={DRAWER_WIDTH}
          />
        )}

        {/* 메인 콘텐츠 영역 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: isAuthenticated ? { md: `calc(100% - ${DRAWER_WIDTH}px)` } : '100%',
            p: { xs: 2, md: 3 },
            minHeight: 'calc(100vh - 64px)',  // 앱바 높이(64px)를 고려한 최소 높이
            backgroundColor: 'background.default',
            transition: theme.transitions.create('margin', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Box
            sx={{
              backgroundColor: 'white',
              borderRadius: 2,
              p: { xs: 2, md: 3 },
              boxShadow: isAuthenticated ? '0px 3px 15px rgba(0,0,0,0.05)' : 'none',
              minHeight: 'calc(100vh - 120px)', // 앱바와 여백을 고려한 높이
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
