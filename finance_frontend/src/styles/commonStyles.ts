import { SxProps, Theme } from '@mui/material';

// 헤더 영역 스타일
export const headerContainerStyle: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 4,
  borderBottom: '1px solid #e0e0e0',
  pb: 2
};

// 헤더 아바타 스타일
export const headerAvatarStyle: SxProps<Theme> = {
  bgcolor: 'primary.main',
  width: 46,
  height: 46
};

// 헤더 타이틀 스타일
export const headerTitleStyle: SxProps<Theme> = {
  fontWeight: 'bold',
  color: 'primary.main'
};

// 컨텐츠 카드 스타일
export const contentCardStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: 300,
  borderRadius: 3,
  transition: 'transform 0.3s, box-shadow 0.3s',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: 8,
  },
};

// 카드 컨텐츠 스타일
export const cardContentStyle: SxProps<Theme> = {
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1
};

// 카드 액션 스타일
export const cardActionStyle: SxProps<Theme> = {
  p: 2,
  pt: 0
};

// 카드 내 아이콘 헤더 스타일
export const cardIconHeaderStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  mb: 2
};

// 메인 버튼 스타일
export const mainButtonStyle: SxProps<Theme> = {
  borderRadius: 2,
  py: 1,
  fontWeight: 'medium',
  boxShadow: 2,
  '&:hover': {
    boxShadow: 4,
  }
};

// 로딩 컨테이너 스타일
export const loadingContainerStyle: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  p: 8
};

// 테이블 헤더 셀 스타일
export const tableHeaderCellStyle: SxProps<Theme> = {
  color: 'white',
  fontWeight: 'bold'
};

// 테이블 헤드 스타일
export const tableHeadStyle: SxProps<Theme> = {
  backgroundColor: 'primary.main'
};

// 테이블 행 스타일
export const tableRowStyle: SxProps<Theme> = {
  '&:last-child td, &:last-child th': { border: 0 },
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
};
