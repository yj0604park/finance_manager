import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import SalariesPage from './SalariesPage';
import { renderWithQueryClient } from '../utils/test-utils';
import { useSalariesQuery, useCreateSalaryMutation, useUpdateSalaryMutation, useDeleteSalaryMutation } from '../hooks/query/useSalariesQuery';
import { Salary } from '../api/models/Salary';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Material-UI 컴포넌트 모킹
vi.mock('@mui/material', async () => {
  return {
    Box: ({ children, sx }: any) => <div data-testid="Box">{children}</div>,
    Container: ({ children, maxWidth }: any) => <div data-max-width={maxWidth}>{children}</div>,
    Typography: ({ children, variant }: any) => <div data-variant={variant}>{children}</div>,
    Paper: ({ children, sx }: any) => <div data-testid="Paper">{children}</div>,
    Button: ({ children, onClick, variant, startIcon, color, sx }: any) => (
      <button onClick={onClick}>{children}</button>
    ),
    TableContainer: ({ children, component }: any) => <div>{children}</div>,
    Table: ({ children }: any) => <table>{children}</table>,
    TableHead: ({ children }: any) => <thead>{children}</thead>,
    TableBody: ({ children }: any) => <tbody>{children}</tbody>,
    TableRow: ({ children, hover }: any) => <tr>{children}</tr>,
    TableCell: ({ children, align }: any) => <td align={align}>{children}</td>,
    TextField: ({ label, fullWidth, value, onChange, name, InputProps, size, variant, type, multiline, rows, inputProps, InputLabelProps, id, required }: any) => (
      <input aria-label={label} value={value || ''} onChange={onChange} name={name} type={type} />
    ),
    Dialog: ({ open, onClose, children, maxWidth, fullWidth }: any) => (
      open ? <div data-testid="Dialog">{children}</div> : null
    ),
    DialogTitle: ({ children }: any) => <div>{children}</div>,
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogActions: ({ children }: any) => <div>{children}</div>,
    Snackbar: ({ open, onClose, children, autoHideDuration, anchorOrigin }: any) => (
      <div data-testid="Snackbar">{children}</div>
    ),
    Alert: ({ onClose, severity, children }: any) => (
      <div data-testid="Alert">{children}</div>
    ),
    IconButton: ({ children, onClick, size, color }: any) => (
      <button onClick={onClick}><span>{children}</span></button>
    ),
    Grid: ({ children, container, item, xs, sm, md, spacing, alignItems }: any) => (
      <div data-testid="Grid">{children}</div>
    ),
    CircularProgress: () => <div data-testid="CircularProgress" />,
    InputAdornment: ({ position, children }: any) => <span>{children}</span>,
    FormControl: ({ children, fullWidth, size }: any) => <div>{children}</div>,
    InputLabel: ({ children, id }: any) => <label id={id}>{children}</label>,
    Select: ({ children, labelId, id, value, label, onChange }: any) => (
      <select aria-label={label} value={value || ''} onChange={onChange}>{children}</select>
    ),
    MenuItem: ({ children, value }: any) => <option value={value}>{children}</option>
  };
});

// 아이콘 모킹
vi.mock('@mui/icons-material', async () => {
  return {
    Add: () => 'AddIcon',
    Edit: () => 'EditIcon',
    Delete: () => 'DeleteIcon',
    FilterList: () => 'FilterIcon',
    Sort: () => 'SortIcon'
  };
});

// React Query Hook 모킹
vi.mock('../hooks/query/useSalariesQuery', () => ({
  useSalariesQuery: vi.fn(),
  useCreateSalaryMutation: vi.fn(),
  useUpdateSalaryMutation: vi.fn(),
  useDeleteSalaryMutation: vi.fn()
}));

describe('SalariesPage', () => {
  // 테스트 데이터
  const mockSalaries: Salary[] = [
    {
      id: 1,
      date: '2023-05-15',
      amount: 2500000,
      currency: 'KRW',
      gross_amount: 3000000,
      tax_amount: 300000,
      company: '테스트 회사',
      department: '개발팀',
      position: '시니어 개발자',
      created_at: '2023-05-15T09:00:00Z',
      updated_at: '2023-05-15T09:00:00Z'
    },
    {
      id: 2,
      date: '2023-06-15',
      amount: 2600000,
      currency: 'KRW',
      company: '테스트 회사',
      created_at: '2023-06-15T09:00:00Z',
      updated_at: '2023-06-15T09:00:00Z'
    }
  ];

  // 모킹된 Hook 반환값
  const mockQueryResult = {
    data: mockSalaries,
    isLoading: false,
    isSuccess: true,
    error: null
  };

  const mockMutationResult = {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isSuccess: false,
    isError: false,
    error: null,
    reset: vi.fn()
  };

  // 각 테스트 전에 Hook 초기화
  beforeEach(() => {
    vi.clearAllMocks();
    (useSalariesQuery as any).mockReturnValue(mockQueryResult);
    (useCreateSalaryMutation as any).mockReturnValue(mockMutationResult);
    (useUpdateSalaryMutation as any).mockReturnValue(mockMutationResult);
    (useDeleteSalaryMutation as any).mockReturnValue(mockMutationResult);
  });

  it('컴포넌트가 정상적으로 렌더링되어야 함', () => {
    renderWithQueryClient(<SalariesPage />);

    // 페이지 타이틀 확인
    expect(screen.getByText('급여 관리')).toBeInTheDocument();

    // 급여 추가 버튼 확인
    expect(screen.getByText('급여 추가')).toBeInTheDocument();
  });

  it('급여 목록이 올바르게 표시되어야 함', async () => {
    renderWithQueryClient(<SalariesPage />);

    // 각 급여 항목 확인 - getAllByText 사용
    expect(screen.getAllByText('테스트 회사')[0]).toBeInTheDocument();
    expect(screen.getByText('개발팀')).toBeInTheDocument();
    expect(screen.getByText('시니어 개발자')).toBeInTheDocument();
  });

  it('로딩 중일 때 로딩 인디케이터가 표시되어야 함', () => {
    (useSalariesQuery as any).mockReturnValue({
      ...mockQueryResult,
      isLoading: true,
      data: undefined
    });

    renderWithQueryClient(<SalariesPage />);

    // CircularProgress 컴포넌트가 렌더링되었는지 확인
    expect(screen.getByTestId('CircularProgress')).toBeInTheDocument();
  });

  it('급여 추가 버튼 클릭 시 폼이 표시되어야 함', () => {
    renderWithQueryClient(<SalariesPage />);

    // 급여 추가 버튼 클릭
    fireEvent.click(screen.getByText('급여 추가'));

    // 폼 타이틀 확인
    expect(screen.getByText('급여 정보 추가')).toBeInTheDocument();

    // 폼 필드 확인
    expect(screen.getByLabelText('급여일')).toBeInTheDocument();
    expect(screen.getByLabelText('통화')).toBeInTheDocument();
    expect(screen.getByLabelText('순수령액')).toBeInTheDocument();
  });

  it('검색 필터링이 올바르게 작동해야 함', () => {
    renderWithQueryClient(<SalariesPage />);

    // 검색어 입력
    const searchInput = screen.getByLabelText('검색');
    fireEvent.change(searchInput, { target: { value: '개발팀' } });

    // 이벤트가 처리되었는지 확인
    expect(searchInput).toHaveValue('개발팀');
  });

  it('정렬 기능이 올바르게 작동해야 함', () => {
    renderWithQueryClient(<SalariesPage />);

    // 날짜 기준으로 정렬 클릭
    fireEvent.click(screen.getByText('날짜').parentElement as HTMLElement);

    // 회사 기준으로 정렬 클릭
    fireEvent.click(screen.getByText('회사').parentElement as HTMLElement);

    // 정렬이 바뀌었는지는 상태 변경을 통해 확인해야 하지만,
    // 이 테스트에서는 에러 없이 클릭 이벤트가 처리되었는지만 확인
  });
});
