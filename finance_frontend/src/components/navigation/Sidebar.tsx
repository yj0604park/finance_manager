import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Typography, Avatar, Stack, Tooltip
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountBalance as BankIcon,
  Payments as PaymentsIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { logoTypographyStyle } from '../../styles/logoStyles';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth?: number;
}

const Sidebar: FC<SidebarProps> = ({
  open,
  onClose,
  drawerWidth = 240
}) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { name: '대시보드', icon: <DashboardIcon />, path: '/dashboard' },
    { name: '은행', icon: <BankIcon />, path: '/banks' },
    { name: '거래', icon: <PaymentsIcon />, path: '/transactions', disabled: true },
    { name: '설정', icon: <SettingsIcon />, path: '/settings', disabled: true },
  ];

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="persistent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'primary.main',
          color: 'white',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              ...logoTypographyStyle,
              color: 'white',
              fontSize: '1.5rem',
              textAlign: 'center'
            }}
          >
            My Finance
          </Typography>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Box sx={{ pt: 2, pb: 2 }}>
          <Stack
            direction="column"
            alignItems="center"
            spacing={1}
            sx={{ mb: 2 }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                bgcolor: 'secondary.main',
                border: '2px solid white'
              }}
            >
              {user?.email.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
              {user?.email}
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <List sx={{ flexGrow: 1, pt: 0 }}>
          {menuItems.map((item) => (
            <ListItem key={item.name} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                disabled={item.disabled}
                sx={{
                  py: 1.5,
                  borderRadius: '0 20px 20px 0',
                  mr: 1,
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  ...(isActive(item.path) && {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderLeft: '4px solid white',
                  }),
                }}
                selected={isActive(item.path)}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2 }}>
          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', mb: 1 }} />
          <Tooltip title="로그아웃">
            <ListItemButton
              onClick={logout}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="로그아웃" />
            </ListItemButton>
          </Tooltip>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
