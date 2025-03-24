import { SxProps, Theme } from '@mui/material';

// 앱바 스타일
export const appBarStyle: SxProps<Theme> = {
  backgroundColor: 'primary.main',
  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
};

// 로고 아바타 스타일
export const logoAvatarStyle = (): SxProps<Theme> => ({
  backgroundColor: 'white',
  color: 'primary.main',
  width: 36,
  height: 36,
});

// 로고 텍스트 스타일
export const logoTypographyStyle = (isMobile: boolean): SxProps<Theme> => ({
  fontWeight: 'bold',
  color: 'white',
  fontSize: isMobile ? '1.1rem' : '1.3rem',
  fontFamily: '"Roboto", "Noto Sans KR", sans-serif',
});

// 헤더 사용자 칩 스타일
export const userChipStyle: SxProps<Theme> = {
  color: 'white',
  borderColor: 'rgba(255, 255, 255, 0.5)',
  '& .MuiChip-avatar': {
    bgcolor: 'secondary.main',
    color: 'white',
  }
};

// 메인 컨텐츠 래퍼 스타일
export const mainContentWrapperStyle = (
  isAuthenticated: boolean,
  drawerWidth: number,
  theme: Theme
): SxProps<Theme> => ({
  flexGrow: 1,
  width: isAuthenticated ? { md: `calc(100% - ${drawerWidth}px)` } : '100%',
  p: { xs: 2, md: 3 },
  minHeight: 'calc(100vh - 64px)',
  backgroundColor: 'background.default',
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
});

// 메인 컨텐츠 박스 스타일
export const mainContentBoxStyle = (isAuthenticated: boolean): SxProps<Theme> => ({
  backgroundColor: 'white',
  borderRadius: 2,
  p: { xs: 2, md: 3 },
  boxShadow: isAuthenticated ? '0px 3px 15px rgba(0,0,0,0.05)' : 'none',
  minHeight: 'calc(100vh - 120px)',
});

// 메인 컨테이너 스타일
export const mainContainerStyle: SxProps<Theme> = {
  mt: 4,
  mb: 8,
  minHeight: 'calc(100vh - 64px)'
};

// 컨텐츠 박스 스타일
export const contentBoxStyle = (isMobile: boolean, isAuthenticated: boolean): SxProps<Theme> => ({
  backgroundColor: 'white',
  borderRadius: 2,
  px: isMobile ? 2 : 4,
  py: 3,
  boxShadow: isAuthenticated ? '0px 3px 15px rgba(0,0,0,0.05)' : 'none',
});

// 앱 루트 박스 스타일
export const appRootBoxStyle: SxProps<Theme> = {
  minHeight: '100vh',
  minWidth: '100vw',
  width: '100%',
  backgroundColor: 'background.default',
  display: 'flex',
  flexDirection: 'column',
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  overflow: 'hidden'
};
