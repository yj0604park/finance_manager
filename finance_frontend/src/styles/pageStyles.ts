import { SxProps, Theme } from '@mui/material';

// 로그인 페이지 스타일
export const loginStyles = {
  container: {
    mt: 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '60vh',
    justifyContent: 'center'
  } as SxProps<Theme>,

  card: {
    p: 5,
    width: '100%',
    borderRadius: 2,
    backgroundColor: 'white',
    transition: 'all 0.3s',
    '&:hover': {
      boxShadow: 12
    }
  } as SxProps<Theme>,

  avatarBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    mb: 3
  } as SxProps<Theme>,

  avatar: {
    m: 1,
    bgcolor: 'primary.main',
    width: 56,
    height: 56
  } as SxProps<Theme>,

  divider: {
    width: '80%',
    my: 2
  } as SxProps<Theme>,

  submitButton: {
    mt: 2,
    mb: 2,
    py: 1.2,
    fontSize: '1rem',
    fontWeight: 'bold',
    borderRadius: 2,
    boxShadow: 4,
    '&:hover': {
      boxShadow: 6,
      transform: 'scale(1.01)'
    }
  } as SxProps<Theme>,
};

// 대시보드 페이지 스타일
export const dashboardStyles = {
  container: {
    my: 4
  } as SxProps<Theme>,

  logoutButton: {
    borderRadius: 2,
    px: 2
  } as SxProps<Theme>,

  sectionTitle: {
    mb: 3
  } as SxProps<Theme>,
};

// 은행 목록 페이지 스타일
export const banksStyles = {
  container: {
    my: 4
  } as SxProps<Theme>,

  backButton: {
    borderRadius: 2
  } as SxProps<Theme>,

  alert: {
    mb: 3,
    borderRadius: 2,
    fontWeight: 'medium'
  } as SxProps<Theme>,

  emptyCard: {
    p: 4,
    textAlign: 'center',
    borderRadius: 2,
    backgroundColor: '#f9f9f9'
  } as SxProps<Theme>,

  emptyIcon: {
    fontSize: 60,
    color: 'text.secondary',
    opacity: 0.5,
    mb: 2
  } as SxProps<Theme>,

  tableCard: {
    borderRadius: 2,
    overflow: 'hidden'
  } as SxProps<Theme>,

  avatar: {
    width: 32,
    height: 32,
    bgcolor: 'primary.light',
    fontSize: '0.75rem'
  } as SxProps<Theme>,
};
