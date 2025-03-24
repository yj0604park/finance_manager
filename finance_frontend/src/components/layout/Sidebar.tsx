import {
  Article as ArticleIcon,
  AccountBalance as BankIcon,
  BarChart as BarChartIcon,
  CreditCard as CardIcon,
  Dashboard as DashboardIcon,
  ExpandLess, ExpandMore,
  ExitToApp as LogoutIcon,
  AttachMoney as MoneyIcon,
  Settings as SettingsIcon,
  Receipt as TransactionIcon
} from '@mui/icons-material';
import {
  Box,
  Collapse, Divider,
  Drawer,
  List, ListItem, ListItemButton, ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// 네비게이션 항목 인터페이스
interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  disabled?: boolean;
  children?: NavItem[];
}

// 네비게이션 항목 설정
const navItems: NavItem[] = [
  {
    title: '대시보드',
    path: '/dashboard',
    icon: <DashboardIcon />
  },
  {
    title: '은행 관리',
    path: '/banks',
    icon: <BankIcon />
  },
  {
    title: '계좌 관리',
    path: '/accounts',
    icon: <CardIcon />
  },
  {
    title: '거래',
    path: '/transactions',
    icon: <TransactionIcon />,
    children: [
      {
        title: '거래 내역',
        path: '/transactions/list',
        icon: <ArticleIcon />
      },
      {
        title: '거래 분석',
        path: '/transactions/analysis',
        icon: <BarChartIcon />
      }
    ]
  },
  {
    title: '카드',
    path: '/cards',
    icon: <CardIcon />
  },
  {
    title: '자산 관리',
    path: '/assets',
    icon: <MoneyIcon />
  },
  {
    title: '설정',
    path: '/settings',
    icon: <SettingsIcon />
  }
];

// Sidebar 속성 인터페이스
interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
  drawerWidth: number;
}

const Sidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth }: SidebarProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { logout, user } = useAuth();

  // 앱바 높이 정의
  const appBarHeight = 64; // MUI의 기본 AppBar 높이

  // 열린 하위 메뉴 상태 관리
  const [openSubMenus, setOpenSubMenus] = useState<{ [key: string]: boolean }>({});

  // 하위 메뉴 토글 함수
  const handleToggleSubMenu = (path: string) => {
    setOpenSubMenus(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  // 네비게이션 아이템 클릭 핸들러
  const handleNavItemClick = (path: string, disabled: boolean | undefined) => {
    if (disabled) return;
    navigate(path);
    if (isMobile) {
      handleDrawerToggle();
    }
  };

  // 네비게이션 아이템이 현재 활성화되어 있는지 확인
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // 네비게이션 아이템 렌더링 함수
  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => (
      <React.Fragment key={item.path}>
        <ListItem
          disablePadding
          sx={{
            display: 'block',
            opacity: item.disabled ? 0.5 : 1
          }}
        >
          <ListItemButton
            onClick={() => {
              if (item.children) {
                handleToggleSubMenu(item.path);
              } else {
                handleNavItemClick(item.path, item.disabled);
              }
            }}
            sx={{
              minHeight: 48,
              px: 2.5,
              py: 1.5,
              backgroundColor: isActive(item.path) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.08)',
              },
              borderLeft: isActive(item.path) ? `4px solid ${theme.palette.primary.main}` : 'none',
              color: isActive(item.path) ? 'primary.main' : 'inherit',
            }}
            disabled={item.disabled}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                color: isActive(item.path) ? 'primary.main' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              primaryTypographyProps={{
                fontWeight: isActive(item.path) ? 'bold' : 'normal',
                color: isActive(item.path) ? 'primary.main' : 'inherit',
              }}
            />
            {item.children && (
              openSubMenus[item.path] ? <ExpandLess /> : <ExpandMore />
            )}
          </ListItemButton>
        </ListItem>

        {item.children && (
          <Collapse in={openSubMenus[item.path]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => (
                <ListItemButton
                  key={child.path}
                  onClick={() => handleNavItemClick(child.path, child.disabled || item.disabled)}
                  sx={{
                    pl: 6,
                    minHeight: 40,
                    backgroundColor: isActive(child.path) ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    },
                  }}
                  disabled={child.disabled || item.disabled}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 2,
                      color: isActive(child.path) ? 'primary.main' : 'inherit',
                    }}
                  >
                    {child.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={child.title}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: isActive(child.path) ? 'bold' : 'normal',
                      color: isActive(child.path) ? 'primary.main' : 'inherit',
                    }}
                  />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    ));
  };

  // 드로어 컨텐츠
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 메뉴 항목 */}
      <Box sx={{ mt: 1, flexGrow: 1 }}>
        <List sx={{ pt: 1 }}>
          {renderNavItems(navItems)}
        </List>
      </Box>

      {/* 로그아웃 버튼 */}
      {user && (
        <Box sx={{ p: 2 }}>
          <Divider sx={{ mb: 1 }} />
          <Tooltip title="로그아웃">
            <ListItemButton
              onClick={logout}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="로그아웃" />
            </ListItemButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* 모바일 드로어 */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // 모바일 성능 향상을 위해
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            boxShadow: 3,
            top: `${appBarHeight}px`, // 앱바 높이만큼 아래로 배치
            height: `calc(100% - ${appBarHeight}px)` // 앱바 높이를 뺀 높이로 설정
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 데스크톱 드로어 */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
            top: `${appBarHeight}px`, // 앱바 높이만큼 아래로 배치
            height: `calc(100% - ${appBarHeight}px)` // 앱바 높이를 뺀 높이로 설정
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
