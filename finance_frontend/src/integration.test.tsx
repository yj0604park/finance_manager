import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// router mock
vi.mock('react-router-dom', () => {
  const originalModule = vi.importActual('react-router-dom');
  return {
    ...originalModule,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/', search: '' }),
    useParams: () => ({}),
  };
});

// API 서비스 모킹
vi.mock('./api/services/BanksService', () => ({
  BanksService: {
    banksList: vi.fn().mockResolvedValue([
      { id: 1, name: '신한은행', country: 'KOREA', amount: '0', user: 1 },
      { id: 2, name: '국민은행', country: 'KOREA', amount: '0', user: 1 },
    ]),
    banksCreate: vi.fn().mockImplementation((data) =>
      Promise.resolve({ ...data, id: Math.floor(Math.random() * 1000) })),
    banksUpdate: vi.fn().mockImplementation((id, data) =>
      Promise.resolve({ ...data, id })),
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
    accountsCreate: vi.fn().mockImplementation((data) =>
      Promise.resolve({ ...data, id: Math.floor(Math.random() * 1000) })),
    accountsUpdate: vi.fn().mockImplementation((id, data) =>
      Promise.resolve({ ...data, id })),
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
    transactionsCreate: vi.fn().mockImplementation((data) =>
      Promise.resolve({ ...data, id: Math.floor(Math.random() * 1000) })),
    transactionsUpdate: vi.fn().mockImplementation((id, data) =>
      Promise.resolve({ ...data, id })),
    transactionsDestroy: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('./api/services/RetailersService', () => ({
  RetailersService: {
    retailersList: vi.fn().mockResolvedValue([
      { id: 1, name: '슈퍼마켓', retailer_type: 'STORE', user: 1 },
      { id: 2, name: '커피숍', retailer_type: 'STORE', user: 1 },
    ]),
    retailersCreate: vi.fn().mockImplementation((data) =>
      Promise.resolve({ ...data, id: Math.floor(Math.random() * 1000) })),
    retailersUpdate: vi.fn().mockImplementation((id, data) =>
      Promise.resolve({ ...data, id })),
    retailersDestroy: vi.fn().mockResolvedValue({}),
  },
}));

// 인증 모킹
vi.mock('./contexts/AuthContext', () => ({
  useAuth: vi.fn().mockReturnValue({
    isAuthenticated: true,
    user: { id: 1, username: 'testuser' },
    login: vi.fn(),
    logout: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('금융 내역 관리 시스템 통합 테스트', () => {
  test('사용자 흐름: 계좌 목록 조회 > 계좌 선택 > 거래 내역 조회', async () => {
    render(<App />);

    // 계좌 목록 페이지가 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText('계좌 목록')).toBeInTheDocument();
    });

    // 계좌 목록이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('급여통장')).toBeInTheDocument();
      expect(screen.getByText('비상금통장')).toBeInTheDocument();
    });

    // 첫 번째 계좌 클릭
    fireEvent.click(screen.getByText('급여통장'));

    // 거래 내역 페이지로 이동 확인
    await waitFor(() => {
      expect(screen.getByText('거래 내역')).toBeInTheDocument();
    });

    // 해당 계좌의 거래 내역이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
      expect(screen.getByText('월급')).toBeInTheDocument();
    });
  });

  test('사용자 흐름: 은행 목록 조회 > 은행별 계좌 필터링', async () => {
    render(<App />);

    // 은행 목록 페이지가 로드되는지 확인
    await waitFor(() => {
      expect(screen.getByText('은행 목록')).toBeInTheDocument();
    });

    // 은행 목록이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('신한은행')).toBeInTheDocument();
      expect(screen.getByText('국민은행')).toBeInTheDocument();
    });

    // 신한은행 클릭
    fireEvent.click(screen.getByText('신한은행'));

    // 계좌 목록 페이지로 이동하고 신한은행으로 필터링되는지 확인
    await waitFor(() => {
      expect(screen.getByText('계좌 목록')).toBeInTheDocument();
      expect(screen.getByText('급여통장')).toBeInTheDocument();
      expect(screen.getByText('비상금통장')).toBeInTheDocument();
    });
  });

  test('사용자 흐름: 거래 내역 검색 및 필터링', async () => {
    render(<App />);

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

    // 검색 결과가 필터링되는지 확인
    await waitFor(() => {
      expect(screen.queryByText('슈퍼마켓 구매')).not.toBeInTheDocument();
      expect(screen.getByText('월급')).toBeInTheDocument();
    });

    // 필터 초기화
    fireEvent.click(screen.getByText('초기화'));

    // 모든 거래 내역이 다시 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('슈퍼마켓 구매')).toBeInTheDocument();
      expect(screen.getByText('월급')).toBeInTheDocument();
    });
  });

  test('사용자 흐름: 판매처 관리', async () => {
    render(<App />);

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

    // 판매처 추가 모달이 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('판매처 추가')).toBeInTheDocument();
      expect(screen.getByLabelText('판매처 이름')).toBeInTheDocument();
    });
  });
});
