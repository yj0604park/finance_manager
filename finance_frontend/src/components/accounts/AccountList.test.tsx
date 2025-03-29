import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import AccountList from './AccountList';
import { Account } from '../../api/models/Account';
import { Bank } from '../../api/models/Bank';
import { CurrencyToEnum } from '../../api/models/CurrencyToEnum';
import { CountryEnum } from '../../api/models/CountryEnum';

// Mock useNavigate 훅
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// MUI 모킹을 재정의
vi.mock('@mui/material', () => {
  return {
    Typography: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Typography">{children}</div>,
    Box: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Box">{children}</div>,
    Card: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Card">{children}</div>,
    CardContent: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="CardContent">{children}</div>,
    Stack: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Stack">{children}</div>,
    Button: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <button data-testid="Button">{children}</button>,
    Snackbar: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Snackbar">{children}</div>,
    Alert: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Alert">{children}</div>,
    Dialog: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Dialog">{children}</div>,
    DialogTitle: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="DialogTitle">{children}</div>,
    DialogContent: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="DialogContent">{children}</div>,
    DialogActions: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="DialogActions">{children}</div>,
    TextField: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="TextField">{children}</div>,
    FormControl: ({ children, ...props }: { children?: React.ReactNode; label?: string;[key: string]: any }) => {
      if (props.label) {
        return <div role="form" aria-label={props.label}>{children}</div>;
      }
      return <div data-testid="FormControl">{children}</div>;
    },
    InputLabel: ({ id, children }: { id: string; children: React.ReactNode }) =>
      <label id={id} htmlFor="bank-filter">{children}</label>,
    Select: ({ labelId, id, value, label, onChange, children }: {
      labelId?: string;
      id?: string;
      value?: any;
      label?: string;
      onChange?: any;
      children?: React.ReactNode
    }) => (
      <select aria-label={label} id={id} value={value} onChange={onChange}>
        {children}
      </select>
    ),
    MenuItem: ({ value, children }: { value: any; children: React.ReactNode }) =>
      <option value={value}>{children}</option>,
    FormControlLabel: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="FormControlLabel">{children}</div>,
    Checkbox: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Checkbox">{children}</div>,
    Link: ({ children, component, onClick }: {
      children: React.ReactNode;
      component?: any;
      onClick?: () => void
    }) => (
      <a href="#" onClick={onClick}>{children}</a>
    ),
    Grid: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Grid">{children}</div>,
    Chip: ({ label, color }: { label: string; color?: string }) =>
      <span data-color={color}>{label}</span>,
    InputAdornment: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="InputAdornment">{children}</div>,
    Tooltip: ({ title, children }: { title: string; children: React.ReactNode }) =>
      <div title={title}>{children}</div>,
    IconButton: ({ onClick, color, 'aria-label': ariaLabel, children }: {
      onClick?: () => void;
      color?: string;
      'aria-label'?: string;
      children?: React.ReactNode
    }) => (
      <button onClick={onClick} aria-label={ariaLabel || ""}>
        {children || ''}
      </button>
    ),
    Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
    TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
    TableCell: ({ align, colSpan, children }: {
      align?: 'left' | 'center' | 'right' | 'justify' | 'char';
      colSpan?: number;
      children: React.ReactNode
    }) =>
      <td align={align} colSpan={colSpan}>{children}</td>,
    TableContainer: ({ component, children }: { component?: any; children: React.ReactNode }) =>
      <div>{children}</div>,
    TableHead: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
    TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
    Paper: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => <div data-testid="Paper">{children}</div>,
  };
});

// Grid2 모킹
vi.mock('@mui/material/Grid2', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Material UI 아이콘 모킹
vi.mock('@mui/icons-material/ArrowBack', () => ({
  default: () => <span>←</span>,
}));

vi.mock('@mui/icons-material/Add', () => ({
  default: () => <span>+</span>,
}));

vi.mock('@mui/icons-material/Edit', () => ({
  default: () => <span>✎</span>,
}));

vi.mock('@mui/icons-material/Delete', () => ({
  default: () => <span>🗑</span>,
}));

vi.mock('@mui/icons-material/Receipt', () => ({
  default: () => <span>🧾</span>,
}));

describe('AccountList 컴포넌트 테스트', () => {
  const mockBanks: Bank[] = [
    { id: 1, name: '신한은행', country: CountryEnum.KOREA, amount: '0', user: 1 },
    { id: 2, name: '국민은행', country: CountryEnum.KOREA, amount: '0', user: 1 },
  ];

  const mockAccounts: Account[] = [
    {
      id: 1,
      name: '급여통장',
      bank: 1, // 신한은행
      amount: '1000000',
      currency: CurrencyToEnum.KRW,
      is_active: true,
      user: 1,
      nickname: '',
    },
    {
      id: 2,
      name: '비상금통장',
      bank: 1, // 신한은행
      amount: '5000000',
      currency: CurrencyToEnum.KRW,
      is_active: true,
      user: 1,
      nickname: '비상금',
    },
    {
      id: 3,
      name: '투자통장',
      bank: 2, // 국민은행
      amount: '3000000',
      currency: CurrencyToEnum.KRW,
      is_active: true,
      user: 1,
      nickname: '',
    },
  ];

  const mockHandlers = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
    onAdd: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // 테스트를 위한 HTML 구조 재설정
    document.body.innerHTML = '<div></div>';
  });

  test('계좌 목록이 올바르게 렌더링된다', () => {
    render(
      <AccountList
        accounts={mockAccounts}
        banks={mockBanks}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onAdd={mockHandlers.onAdd}
      />
    );

    // 제목 확인
    expect(screen.getByText('계좌 목록')).toBeInTheDocument();

    // 계좌 정보가 렌더링되었는지 확인
    mockAccounts.forEach((account) => {
      expect(screen.getByText(account.name)).toBeInTheDocument();
    });

    // 은행명이 표시됐는지 확인
    expect(screen.getAllByText('신한은행', { exact: false })).toHaveLength(3);
    expect(screen.getAllByText('국민은행', { exact: false })).toHaveLength(2);
  });

  test('은행별 필터링이 작동한다', async () => {
    render(
      <AccountList
        accounts={mockAccounts}
        banks={mockBanks}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onAdd={mockHandlers.onAdd}
      />
    );

    // 은행 필터 선택
    const bankFilterSelect = screen.getByLabelText('은행 필터');
    expect(bankFilterSelect).toBeInTheDocument();

    // 신한은행 필터링
    fireEvent.change(bankFilterSelect, { target: { value: '1' } });

    // 신한은행 계좌만 표시되는지 확인
    expect(screen.getByText('급여통장')).toBeInTheDocument();
    expect(screen.getByText('비상금통장')).toBeInTheDocument();
    expect(screen.queryByText('투자통장')).not.toBeInTheDocument();

    // 국민은행 필터링
    fireEvent.change(bankFilterSelect, { target: { value: '2' } });

    // 국민은행 계좌만 표시되는지 확인
    expect(screen.queryByText('급여통장')).not.toBeInTheDocument();
    expect(screen.queryByText('비상금통장')).not.toBeInTheDocument();
    expect(screen.getByText('투자통장')).toBeInTheDocument();
  });

  test('URL에서 가져온 bankId로 초기 필터링이 적용된다', () => {
    render(
      <AccountList
        accounts={mockAccounts}
        banks={mockBanks}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onAdd={mockHandlers.onAdd}
        defaultBankId="2" // 국민은행 ID
      />
    );

    // 국민은행 계좌만 표시되는지 확인
    expect(screen.queryByText('급여통장')).not.toBeInTheDocument();
    expect(screen.queryByText('비상금통장')).not.toBeInTheDocument();
    expect(screen.getByText('투자통장')).toBeInTheDocument();
  });

  test('계좌 추가 버튼이 클릭되면 onAdd 함수가 호출된다', () => {
    render(
      <AccountList
        accounts={mockAccounts}
        banks={mockBanks}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onAdd={mockHandlers.onAdd}
      />
    );

    // 계좌 추가 버튼 클릭
    const addButton = screen.getByText('+');
    fireEvent.click(addButton);

    // onAdd 함수가 호출되었는지 확인
    expect(mockHandlers.onAdd).toHaveBeenCalledTimes(1);
  });

  test('수정 버튼이 클릭되면 onEdit 함수가 호출된다', () => {
    render(
      <AccountList
        accounts={mockAccounts}
        banks={mockBanks}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onAdd={mockHandlers.onAdd}
      />
    );

    // 수정 버튼들 (✎ 아이콘) 찾기
    const editButtons = screen.getAllByText('✎');

    // 첫 번째 계좌의 수정 버튼 클릭
    fireEvent.click(editButtons[0]);

    // onEdit 함수가 올바르게 호출되었는지 확인
    expect(mockHandlers.onEdit).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockAccounts[0]);
  });

  test('삭제 버튼이 클릭되면 onDelete 함수가 호출된다', () => {
    render(
      <AccountList
        accounts={mockAccounts}
        banks={mockBanks}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onAdd={mockHandlers.onAdd}
      />
    );

    // 삭제 버튼들 (🗑 아이콘) 찾기
    const deleteButtons = screen.getAllByText('🗑');

    // 첫 번째 계좌의 삭제 버튼 클릭
    fireEvent.click(deleteButtons[0]);

    // onDelete 함수가 올바르게 호출되었는지 확인
    expect(mockHandlers.onDelete).toHaveBeenCalledTimes(1);
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockAccounts[0]);
  });

  test('계좌명을 클릭하면 해당 계좌의 거래 내역 페이지로 이동한다', () => {
    render(
      <AccountList
        accounts={mockAccounts}
        banks={mockBanks}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onAdd={mockHandlers.onAdd}
      />
    );

    // 첫 번째 계좌명 클릭
    const accountLinks = screen.getAllByText('급여통장');
    fireEvent.click(accountLinks[0]);

    // navigate 함수가 올바른 경로로 호출되었는지 확인
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/transactions/list?accountId=1');
  });

  test('거래 내역 버튼을 클릭하면 해당 계좌의 거래 내역 페이지로 이동한다', () => {
    render(
      <AccountList
        accounts={mockAccounts}
        banks={mockBanks}
        onEdit={mockHandlers.onEdit}
        onDelete={mockHandlers.onDelete}
        onAdd={mockHandlers.onAdd}
      />
    );

    // 거래 내역 버튼들 (🧾 아이콘) 찾기
    const transactionButtons = screen.getAllByText('🧾');

    // 첫 번째 계좌의 거래 내역 버튼 클릭
    fireEvent.click(transactionButtons[0]);

    // navigate 함수가 올바른 경로로 호출되었는지 확인
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/transactions/list?accountId=1');
  });
});
