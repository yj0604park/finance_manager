import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TransactionList from './List';
import { Transaction } from '../../api/models/Transaction';
import { Account } from '../../api/models/Account';
import { Bank } from '../../api/models/Bank';
import { Retailer } from '../../api/models/Retailer';
import { TransactionTypeEnum } from '../../api/models/TransactionTypeEnum';
import { CurrencyToEnum } from '../../api/models/CurrencyToEnum';
import { CountryEnum } from '../../api/models/CountryEnum';

// API 서비스 모킹 - 호이스팅 문제 방지를 위해 vi.mock을 먼저 선언
vi.mock('../../api/services/TransactionsService', () => ({
  TransactionsService: {
    transactionsList: vi.fn().mockResolvedValue([]),
    transactionsCreate: vi.fn(),
    transactionsUpdate: vi.fn(),
    transactionsDestroy: vi.fn(),
    transactionsRetrieve: vi.fn(),
  }
}));

vi.mock('../../api/services/AccountsService', () => ({
  AccountsService: {
    accountsList: vi.fn().mockResolvedValue([]),
  }
}));

vi.mock('../../api/services/BanksService', () => ({
  BanksService: {
    banksList: vi.fn().mockResolvedValue([]),
  }
}));

vi.mock('../../api/services/RetailersService', () => ({
  RetailersService: {
    retailersList: vi.fn().mockResolvedValue([]),
  }
}));

// 모달 모킹
vi.mock('../../components/transactions/TransactionFormModal', () => ({
  default: vi.fn().mockReturnValue(<div data-testid="mock-transaction-modal" />),
}));

// MUI 모킹을 재정의
vi.mock('@mui/material', () => {
  return {
    Typography: ({ variant, children }: { variant?: string; children: React.ReactNode }) =>
      <div data-variant={variant}>{children}</div>,
    Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Stack: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Button: ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) =>
      <button onClick={onClick}>{children}</button>,
    Snackbar: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => {
      if (props['aria-label']) {
        return <div role="button" aria-label={props['aria-label']}>{children}</div>;
      }
      return <div data-testid="Snackbar">{children}</div>;
    },
    Alert: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => {
      if (props['aria-label']) {
        return <div role="button" aria-label={props['aria-label']}>{children}</div>;
      }
      return <div data-testid="Alert">{children}</div>;
    },
    Dialog: ({ open, children }: { open?: boolean; children: React.ReactNode }) =>
      open ? <div>{children}</div> : null,
    DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    DialogActions: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TextField: ({ label, placeholder, value, onChange, InputProps }: {
      label?: string;
      placeholder?: string;
      value?: string;
      onChange?: (e: any) => void;
      InputProps?: any;
    }) => (
      <input
        placeholder={placeholder}
        aria-label={label}
        value={value || ''}
        onChange={onChange}
      />
    ),
    FormControl: ({ fullWidth, children, label }: {
      fullWidth?: boolean;
      children: React.ReactNode;
      label?: string;
    }) => {
      if (label) {
        return <div role="form" aria-label={label}>{children}</div>;
      }
      return <div>{children}</div>;
    },
    InputLabel: ({ id, children }: { id: string; children: React.ReactNode }) =>
      <label id={id}>{children}</label>,
    Select: ({ labelId, value, label, onChange, children }: {
      labelId?: string;
      value?: any;
      label?: string;
      onChange?: (e: any) => void;
      children: React.ReactNode
    }) => (
      <select aria-label={label} value={value || ''} onChange={onChange}>
        {children}
      </select>
    ),
    MenuItem: ({ value, children }: { value: any; children: React.ReactNode }) =>
      <option value={value}>{children}</option>,
    Grid: ({ children, ...props }: { children?: React.ReactNode;[key: string]: any }) => {
      if (props['aria-label']) {
        return <div role="button" aria-label={props['aria-label']}>{children}</div>;
      }
      return <div data-testid="Grid">{children}</div>;
    },
    IconButton: ({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) =>
      <button onClick={onClick}>{children}</button>,
    Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
    TableBody: ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>,
    TableCell: ({ align, children }: {
      align?: 'left' | 'center' | 'right' | 'justify' | 'char';
      children: React.ReactNode
    }) => <td align={align}>{children}</td>,
    TableContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TableHead: ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>,
    TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
    Paper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Container: ({ children, maxWidth }: { children: React.ReactNode; maxWidth?: string }) =>
      <div data-max-width={maxWidth}>{children}</div>,
    InputAdornment: ({ position, children }: { position?: string; children: React.ReactNode }) =>
      <div data-position={position}>{children}</div>,
  };
});

// 아이콘 모킹
vi.mock('@mui/icons-material/Add', () => ({
  default: () => <span>+</span>,
}));

vi.mock('@mui/icons-material/Edit', () => ({
  default: () => <span>✎</span>,
}));

vi.mock('@mui/icons-material/Delete', () => ({
  default: () => <span>🗑</span>,
}));

vi.mock('@mui/icons-material/Search', () => ({
  default: () => <span>🔍</span>,
}));

// 모킹된 모듈에서 서비스 가져오기
import { TransactionsService } from '../../api/services/TransactionsService';
import { AccountsService } from '../../api/services/AccountsService';
import { BanksService } from '../../api/services/BanksService';
import { RetailersService } from '../../api/services/RetailersService';

describe('TransactionList 컴포넌트 테스트', () => {
  const mockBanks: Bank[] = [
    { id: 1, name: '신한은행', country: CountryEnum.KOREA, amount: '0', user: 1 },
    { id: 2, name: '국민은행', country: CountryEnum.KOREA, amount: '0', user: 1 },
  ];

  const mockAccounts: Account[] = [
    {
      id: 1,
      name: '급여통장',
      bank: 1,
      amount: '1000000',
      currency: CurrencyToEnum.KRW,
      is_active: true,
      user: 1,
      nickname: '',
    },
    {
      id: 2,
      name: '비상금통장',
      bank: 1,
      amount: '5000000',
      currency: CurrencyToEnum.KRW,
      is_active: true,
      user: 1,
      nickname: '비상금',
    },
    {
      id: 3,
      name: '투자통장',
      bank: 2,
      amount: '3000000',
      currency: CurrencyToEnum.KRW,
      is_active: true,
      user: 1,
      nickname: '',
    },
  ];

  const mockRetailers: Retailer[] = [
    { id: 1, name: '슈퍼마켓', user: 1 },
    { id: 2, name: '커피숍', user: 1 },
  ];

  const mockTransactions: Transaction[] = [
    {
      id: 1,
      account: 1,
      transaction_type: TransactionTypeEnum.WITHDRAW,
      amount: '10000',
      balance: '990000',
      date: '2023-05-01',
      note: '슈퍼마켓 구매',
      retailer: 1,
      user: 1,
      is_reviewed: false,
      created_at: '2023-05-01T10:00:00Z',
      updated_at: '2023-05-01T10:00:00Z',
    },
    {
      id: 2,
      account: 1,
      transaction_type: TransactionTypeEnum.WITHDRAW,
      amount: '5000',
      balance: '985000',
      date: '2023-05-02',
      note: '커피',
      retailer: 2,
      user: 1,
      is_reviewed: false,
      created_at: '2023-05-02T14:30:00Z',
      updated_at: '2023-05-02T14:30:00Z',
    },
    {
      id: 3,
      account: 2,
      transaction_type: TransactionTypeEnum.DEPOSIT,
      amount: '100000',
      balance: '5100000',
      date: '2023-05-03',
      note: '월급',
      retailer: null,
      user: 1,
      is_reviewed: false,
      created_at: '2023-05-03T09:15:00Z',
      updated_at: '2023-05-03T09:15:00Z',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div></div>';

    // API 응답 모킹
    (TransactionsService.transactionsList as any).mockResolvedValue(mockTransactions);
    (AccountsService.accountsList as any).mockResolvedValue(mockAccounts);
    (BanksService.banksList as any).mockResolvedValue(mockBanks);
    (RetailersService.retailersList as any).mockResolvedValue(mockRetailers);
  });

  const renderWithRouter = (initialEntry = '/transactions/list') => {
    return render(
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/transactions/list" element={<TransactionList />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('거래 내역 페이지가 올바르게 렌더링된다', async () => {
    renderWithRouter();

    // 제목이 표시되는지 확인
    expect(await screen.findByText('거래 내역')).toBeInTheDocument();

    // 필터링 컴포넌트가 표시되는지 확인
    expect(screen.getByLabelText('은행')).toBeInTheDocument();
    expect(screen.getByLabelText('계좌')).toBeInTheDocument();

    // 거래 추가 버튼이 표시되는지 확인
    expect(screen.getByText('거래 추가')).toBeInTheDocument();
  });

  test('거래 내역이 올바르게 표시된다', async () => {
    renderWithRouter();

    // 거래 내역이 로드되어 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
      expect(screen.getByText('커피')).toBeInTheDocument();
      expect(screen.getByText('월급')).toBeInTheDocument();
    });
  });

  test('검색 기능이 올바르게 작동한다', async () => {
    renderWithRouter();

    // 거래 내역 로드 대기
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
    });

    // 검색어 입력
    const searchInput = screen.getByPlaceholderText('검색어를 입력하세요');
    fireEvent.change(searchInput, { target: { value: '커피' } });

    // '커피'가 포함된 거래만 표시되는지 확인
    await waitFor(() => {
      expect(screen.queryByText('슈퍼마켓 구매')).not.toBeInTheDocument();
      expect(screen.getByText('커피')).toBeInTheDocument();
      expect(screen.queryByText('월급')).not.toBeInTheDocument();
    });
  });

  test('은행 필터링이 올바르게 작동한다', async () => {
    renderWithRouter();

    // 거래 내역 로드 대기
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
    });

    // 국민은행(id: 2)으로 필터링
    const bankSelect = screen.getByLabelText('은행');
    fireEvent.change(bankSelect, { target: { value: '2' } });

    // 국민은행 계좌의 거래만 표시되는지 확인
    await waitFor(() => {
      expect(screen.queryByText('슈퍼마켓 구매')).not.toBeInTheDocument();
      expect(screen.queryByText('커피')).not.toBeInTheDocument();
      // 국민은행 계좌의 거래가 없으므로 아무것도 표시되지 않아야 함
    });
  });

  test('계좌 필터링이 올바르게 작동한다', async () => {
    renderWithRouter();

    // 거래 내역 로드 대기
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
    });

    // 비상금통장(id: 2)으로 필터링
    const accountSelect = screen.getByLabelText('계좌');
    fireEvent.change(accountSelect, { target: { value: '2' } });

    // 비상금통장의 거래만 표시되는지 확인
    await waitFor(() => {
      expect(screen.queryByText('슈퍼마켓 구매')).not.toBeInTheDocument();
      expect(screen.queryByText('커피')).not.toBeInTheDocument();
      expect(screen.getByText('월급')).toBeInTheDocument();
    });
  });

  test('URL 파라미터에 따라 초기 필터링이 적용된다', async () => {
    renderWithRouter('/transactions/list?accountId=2');

    // 거래 내역 로드 대기
    await waitFor(() => {
      expect(screen.getByText('월급')).toBeInTheDocument();
    });

    // 비상금통장(id: 2)의 거래만 표시되는지 확인
    expect(screen.queryByText('슈퍼마켓 구매')).not.toBeInTheDocument();
    expect(screen.queryByText('커피')).not.toBeInTheDocument();
  });

  test('거래 추가 버튼이 클릭되면 모달이 표시된다', async () => {
    renderWithRouter();

    // 거래 내역 로드 대기
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
    });

    // 거래 추가 버튼 클릭
    fireEvent.click(screen.getByText('거래 추가'));

    // 모달이 표시되는지 확인
    expect(screen.getByTestId('mock-transaction-modal')).toBeInTheDocument();
  });

  test('필터 초기화 버튼이 올바르게 작동한다', async () => {
    renderWithRouter();

    // 거래 내역 로드 대기
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
    });

    // 필터 적용
    const accountSelect = screen.getByLabelText('계좌');
    fireEvent.change(accountSelect, { target: { value: '2' } });

    // 비상금통장의 거래만 표시되는지 확인
    await waitFor(() => {
      expect(screen.queryByText('슈퍼마켓 구매')).not.toBeInTheDocument();
      expect(screen.getByText('월급')).toBeInTheDocument();
    });

    // 필터 초기화 버튼 클릭
    fireEvent.click(screen.getByText('필터 초기화'));

    // 모든 거래가 다시 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
      expect(screen.getByText('커피')).toBeInTheDocument();
      expect(screen.getByText('월급')).toBeInTheDocument();
    });
  });
});
