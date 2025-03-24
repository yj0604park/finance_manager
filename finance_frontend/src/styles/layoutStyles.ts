import { SxProps, Theme } from '@mui/material';

// 앱바 스타일
export const appBarStyle: SxProps<Theme> = {
  background: 'linear-gradient(90deg, #1976d2 0%, #1565c0 100%)',
};

// 메인 로고 아바타 스타일
export const logoAvatarStyle = (): SxProps<Theme> => ({
  bgcolor: 'white',
  color: 'primary.main',
  width: 36,
  height: 36,
  boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
});

// 로고 타이포그래피 스타일
export const logoTypographyStyle = (isMobile: boolean): SxProps<Theme> => ({
  flexGrow: 1,
  fontWeight: 'bold',
  fontSize: isMobile ? '1.1rem' : '1.25rem',
  letterSpacing: '0.5px',
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
