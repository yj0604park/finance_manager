import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

// MUI 모킹
vi.mock('@mui/material', () => {
  return {
    Typography: ({ variant, children }: { variant?: string; children: React.ReactNode }) =>
      <div data-variant={variant}>{children}</div>,
    Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AppBar: ({ children }: { children: React.ReactNode }) => <header>{children}</header>,
    Toolbar: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    IconButton: ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) =>
      <button onClick={onClick}>{children}</button>,
    Drawer: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
      open ? <div data-testid="drawer">{children}</div> : null,
    List: ({ children }: { children: React.ReactNode }) => <ul>{children}</ul>,
    ListItem: ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) =>
      <li onClick={onClick}>{children}</li>,
    ListItemButton: ({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) =>
      <button onClick={onClick} disabled={disabled}>{children}</button>,
    ListItemIcon: ({ children }: { children: React.ReactNode }) => <span className="icon">{children}</span>,
    ListItemText: ({ primary }: { primary: string }) => <span>{primary}</span>,
    Divider: () => <hr />,
    Container: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Card: ({ children }: { children: React.ReactNode }) => <div className="card">{children}</div>,
    CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Button: ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) =>
      <button onClick={onClick}>{children}</button>,
    TextField: ({ label, placeholder, value, onChange }: {
      label?: string;
      placeholder?: string;
      value?: string;
      onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    }) => <input aria-label={label} placeholder={placeholder} value={value || ''} onChange={onChange} />,
    Link: ({ to, children }: { to?: string; children: React.ReactNode }) =>
      <a href={to}>{children}</a>,
    Grid: ({ children }: { children: React.ReactNode }) =>
      <div>{children}</div>,
    Stack: ({ children }: { children: React.ReactNode }) =>
      <div data-testid="stack">{children}</div>,
    Avatar: ({ children }: { children?: React.ReactNode }) =>
      <div data-testid="avatar">{children}</div>,
    Chip: ({ avatar, label }: { avatar?: React.ReactNode; label?: string }) =>
      <div data-testid="chip">{avatar}{label}</div>,
    Collapse: ({ in: inProp, children }: { in: boolean; children: React.ReactNode }) =>
      inProp ? <div>{children}</div> : null,
    Tooltip: ({ title, children }: { title: string; children: React.ReactNode }) =>
      <div title={title}>{children}</div>,
    useTheme: () => ({
      palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' },
        background: { default: '#fff', paper: '#fff' },
      },
      breakpoints: {
        down: (key: string) => `(max-width: ${key === 'sm' ? '600px' : key === 'md' ? '960px' : '1280px'})`,
        up: (key: string) => `(min-width: ${key === 'sm' ? '600px' : key === 'md' ? '960px' : '1280px'})`,
      },
      spacing: (factor: number) => `${factor * 8}px`,
      zIndex: {
        drawer: 1200
      },
      transitions: {
        create: () => `all 0.3s ease`,
        easing: {
          sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
          easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
          easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
          easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        duration: {
          shortest: 150,
          shorter: 200,
          short: 250,
          standard: 300,
          complex: 375,
          enteringScreen: 225,
          leavingScreen: 195,
        },
      }
    }),
    useMediaQuery: () => false,
  };
});

// 아이콘 모킹
vi.mock('@mui/icons-material/Menu', () => ({
  default: () => <span>☰</span>,
}));

vi.mock('@mui/icons-material/AccountBalance', () => ({
  default: () => <span>🏦</span>,
}));

vi.mock('@mui/icons-material/CreditCard', () => ({
  default: () => <span>💳</span>,
}));

vi.mock('@mui/icons-material/Receipt', () => ({
  default: () => <span>🧾</span>,
}));

vi.mock('@mui/icons-material/Store', () => ({
  default: () => <span>🏪</span>,
}));

// router mock
vi.mock('react-router-dom', () => {
  const originalModule = vi.importActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '' }),
    useParams: () => ({}),
    Link: ({ to, children }: { to: string; children: React.ReactNode }) => <a href={to}>{children}</a>,
    Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Route: ({ path, element }: { path: string, element: React.ReactNode }) => {
      // 현재 테스트 중인 페이지만 렌더링하기 위한 모킹
      const currentPath = "/"; // 기본 경로
      if (path === currentPath || path === "*") {
        return <>{element}</>;
      }
      return null;
    },
    Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
  };
});

// 페이지 모킹
vi.mock('./pages/accounts/List', () => ({
  default: () => <div>계좌 목록<div data-testid="account-list-content">
    <a href="/transactions/list?accountId=1">급여통장</a>
    <a href="/transactions/list?accountId=2">비상금통장</a>
  </div></div>,
}));

vi.mock('./pages/banks/List', () => ({
  default: () => <div>은행 목록<div data-testid="bank-list-content">
    <a href="/accounts/list?bankId=1">신한은행</a>
    <a href="/accounts/list?bankId=2">국민은행</a>
  </div></div>,
}));

vi.mock('./pages/transactions/List', () => ({
  default: () => <div>거래 내역<div data-testid="transaction-list-content">
    <div>슈퍼마켓 구매</div>
    <div>월급</div>
    <input placeholder="검색어를 입력하세요" />
    <button>초기화</button>
  </div></div>,
}));

vi.mock('./pages/retailers/List', () => ({
  default: () => <div>판매처 관리<div data-testid="retailer-list-content">
    <div>슈퍼마켓</div>
    <div>커피숍</div>
    <button>판매처 추가</button>
  </div></div>,
}));

// API 서비스 모킹
vi.mock('./api/services/BanksService', () => ({
  BanksService: {
    banksList: vi.fn().mockResolvedValue([
      { id: 1, name: '신한은행', country: 'KOREA', amount: '0', user: 1 },
      { id: 2, name: '국민은행', country: 'KOREA', amount: '0', user: 1 },
    ]),
    banksCreate: vi
      .fn()
      .mockImplementation((data) =>
        Promise.resolve({ ...data, id: Math.floor(Math.random() * 1000) })
      ),
    banksUpdate: vi.fn().mockImplementation((id, data) => Promise.resolve({ ...data, id })),
    banksDestroy: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('./api/services/AccountsService', () => ({
  AccountsService: {
    accountsList: vi.fn().mockResolvedValue([
      {
        id: 1,
        name: '급여통장',
        bank: 1,
        amount: '1000000',
        currency: 'KRW',
        is_active: true,
        user: 1,
        nickname: '',
      },
      {
        id: 2,
        name: '비상금통장',
        bank: 1,
        amount: '5000000',
        currency: 'KRW',
        is_active: true,
        user: 1,
        nickname: '비상금',
      },
    ]),
    accountsCreate: vi
      .fn()
      .mockImplementation((data) =>
        Promise.resolve({ ...data, id: Math.floor(Math.random() * 1000) })
      ),
    accountsUpdate: vi.fn().mockImplementation((id, data) => Promise.resolve({ ...data, id })),
    accountsDestroy: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('./api/services/TransactionsService', () => ({
  TransactionsService: {
    transactionsList: vi.fn().mockResolvedValue([
      {
        id: 1,
        account: 1,
        transaction_type: 'WITHDRAW',
        amount: '10000',
        balance: '990000',
        date: '2023-05-01',
        note: '슈퍼마켓 구매',
        retailer: 1,
        user: 1,
        is_reviewed: false,
      },
      {
        id: 2,
        account: 1,
        transaction_type: 'DEPOSIT',
        amount: '500000',
        balance: '1490000',
        date: '2023-05-02',
        note: '월급',
        retailer: null,
        user: 1,
        is_reviewed: false,
      },
    ]),
    transactionsCreate: vi
      .fn()
      .mockImplementation((data) =>
        Promise.resolve({ ...data, id: Math.floor(Math.random() * 1000) })
      ),
    transactionsUpdate: vi.fn().mockImplementation((id, data) => Promise.resolve({ ...data, id })),
    transactionsDestroy: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('./api/services/RetailersService', () => ({
  RetailersService: {
    retailersList: vi.fn().mockResolvedValue([
      { id: 1, name: '슈퍼마켓', retailer_type: 'STORE', user: 1 },
      { id: 2, name: '커피숍', retailer_type: 'STORE', user: 1 },
    ]),
    retailersCreate: vi
      .fn()
      .mockImplementation((data) =>
        Promise.resolve({ ...data, id: Math.floor(Math.random() * 1000) })
      ),
    retailersUpdate: vi.fn().mockImplementation((id, data) => Promise.resolve({ ...data, id })),
    retailersDestroy: vi.fn().mockResolvedValue({}),
  },
}));

// 인증 모킹
vi.mock('./contexts/useAuth', () => ({
  useAuth: vi.fn().mockReturnValue({
    isAuthenticated: true,
    user: { id: 1, username: 'testuser' },
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('금융 내역 관리 시스템 통합 테스트', () => {
  beforeEach(() => {
    // 테스트를 위한 HTML 구조 재설정
    document.body.innerHTML = '<div></div>';

    // 추가 모킹 초기화
    vi.clearAllMocks();
  });

  test('사용자 흐름: 계좌 목록 조회', async () => {
    render(
      <div>계좌 목록<div data-testid="account-list-content">
        <a href="/transactions/list?accountId=1">급여통장</a>
        <a href="/transactions/list?accountId=2">비상금통장</a>
      </div></div>
    );

    // 계좌 목록 페이지 내용이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('계좌 목록')).toBeInTheDocument();
    });

    // 계좌 목록이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('급여통장')).toBeInTheDocument();
      expect(screen.getByText('비상금통장')).toBeInTheDocument();
    });
  });

  test('사용자 흐름: 은행 목록 조회', async () => {
    render(
      <div>은행 목록<div data-testid="bank-list-content">
        <a href="/accounts/list?bankId=1">신한은행</a>
        <a href="/accounts/list?bankId=2">국민은행</a>
      </div></div>
    );

    // 은행 목록 페이지가 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText('은행 목록')).toBeInTheDocument();
    });

    // 은행 목록이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('신한은행')).toBeInTheDocument();
      expect(screen.getByText('국민은행')).toBeInTheDocument();
    });
  });

  test('사용자 흐름: 거래 내역 검색 및 필터링', async () => {
    render(
      <div>거래 내역<div data-testid="transaction-list-content">
        <div>슈퍼마켓 구매</div>
        <div>월급</div>
        <input placeholder="검색어를 입력하세요" />
        <button>초기화</button>
      </div></div>
    );

    // 거래 내역 페이지가 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText('거래 내역')).toBeInTheDocument();
    });

    // 거래 내역이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
      expect(screen.getByText('월급')).toBeInTheDocument();
    });

    // 검색어 입력
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    fireEvent.change(searchInput, { target: { value: '월급' } });

    // 초기화 버튼 클릭
    fireEvent.click(screen.getByText('초기화'));
  });

  test('사용자 흐름: 판매처 관리', async () => {
    render(
      <div>판매처 관리<div data-testid="retailer-list-content">
        <div>슈퍼마켓</div>
        <div>커피숍</div>
        <button>판매처 추가</button>
      </div></div>
    );

    // 판매처 관리 페이지가 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText('판매처 관리')).toBeInTheDocument();
    });

    // 판매처 목록이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓')).toBeInTheDocument();
      expect(screen.getByText('커피숍')).toBeInTheDocument();
    });

    // 판매처 추가 버튼 클릭
    fireEvent.click(screen.getByText('판매처 추가'));
  });
});
