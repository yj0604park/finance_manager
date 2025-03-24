import { ReactNode } from 'react';
import { Box, useTheme } from '@mui/material';
import {
  mainContentWrapperStyle,
  mainContentBoxStyle
} from '../../styles/layoutStyles';

interface MainContentProps {
  children: ReactNode;
  isAuthenticated: boolean;
  drawerWidth: number;
}

const MainContent = ({ children, isAuthenticated, drawerWidth }: MainContentProps) => {
  const theme = useTheme();

  return (
    <Box
      component="main"
      sx={mainContentWrapperStyle(isAuthenticated, drawerWidth, theme)}
    >
      <Box sx={mainContentBoxStyle(isAuthenticated)}>
        {children}
      </Box>
    </Box>
  );
};

export default MainContent;
