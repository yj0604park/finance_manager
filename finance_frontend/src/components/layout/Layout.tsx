import { ReactNode } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Box,
  useTheme, useMediaQuery, Avatar, Stack
} from '@mui/material';
import { AccountBalanceWallet } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import {
  appBarStyle,
  logoAvatarStyle,
  logoTypographyStyle,
  mainContainerStyle,
  contentBoxStyle
} from '../../styles/layoutStyles';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <AppBar
        position="static"
        elevation={3}
        sx={appBarStyle}
      >
        <Toolbar sx={{ py: isMobile ? 1 : 1.5 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              sx={logoAvatarStyle(theme)}
            >
              <AccountBalanceWallet fontSize="small" />
            </Avatar>
            <Typography
              variant="h6"
              component="div"
              sx={logoTypographyStyle(theme, isMobile)}
            >
              금융 관리 시스템
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        sx={mainContainerStyle}
      >
        <Box
          sx={contentBoxStyle(theme, isMobile, isAuthenticated)}
        >
          {children}
        </Box>
      </Container>
    </>
  );
};
