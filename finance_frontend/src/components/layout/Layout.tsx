import { ReactNode, useState } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

interface LayoutProps {
  children: ReactNode;
}

// 드로어 너비 설정
const DRAWER_WIDTH = 240;

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
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
      <Header
        isAuthenticated={isAuthenticated}
        isMobile={isMobile}
        handleDrawerToggle={handleDrawerToggle}
      />

      <Box sx={{ display: 'flex', pt: { xs: 7, md: 8 } }}>
        {isAuthenticated && (
          <Sidebar
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
            drawerWidth={DRAWER_WIDTH}
          />
        )}

        <MainContent isAuthenticated={isAuthenticated} drawerWidth={DRAWER_WIDTH}>
          {children}
        </MainContent>
      </Box>
    </Box>
  );
};
