import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

    // 계좌명이 모두 표시되는지 확인
    expect(screen.getByText('급여통장')).toBeInTheDocument();
    expect(screen.getByText('비상금통장')).toBeInTheDocument();
    expect(screen.getByText('투자통장')).toBeInTheDocument();

    // 은행명이 올바르게 표시되는지 확인
    expect(screen.getAllByText('신한은행')).toHaveLength(2); // 두 계좌가 신한은행
    expect(screen.getByText('국민은행')).toBeInTheDocument(); // 한 계좌가 국민은행
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

    // 신한은행으로 필터링
    const bankFilterSelect = screen.getByLabelText('은행 필터');
    fireEvent.change(bankFilterSelect, { target: { value: '1' } }); // 신한은행 ID

    // 신한은행 계좌만 표시되는지 확인
    await waitFor(() => {
      expect(screen.getByText('급여통장')).toBeInTheDocument();
      expect(screen.getByText('비상금통장')).toBeInTheDocument();
      expect(screen.queryByText('투자통장')).not.toBeInTheDocument(); // 국민은행 계좌는 없어야 함
    });

    // 국민은행으로 필터링
    fireEvent.change(bankFilterSelect, { target: { value: '2' } }); // 국민은행 ID

    // 국민은행 계좌만 표시되는지 확인
    await waitFor(() => {
      expect(screen.queryByText('급여통장')).not.toBeInTheDocument(); // 신한은행 계좌는 없어야 함
      expect(screen.queryByText('비상금통장')).not.toBeInTheDocument(); // 신한은행 계좌는 없어야 함
      expect(screen.getByText('투자통장')).toBeInTheDocument();
    });
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
    expect(screen.queryByText('급여통장')).not.toBeInTheDocument(); // 신한은행 계좌는 없어야 함
    expect(screen.queryByText('비상금통장')).not.toBeInTheDocument(); // 신한은행 계좌는 없어야 함
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
    fireEvent.click(screen.getByRole('button', { name: '계좌 추가' }));

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

    // 첫 번째 계좌의 수정 버튼 클릭
    fireEvent.click(screen.getAllByRole('button', { name: '수정' })[0]);

    // onEdit 함수가 호출되었는지 확인
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

    // 첫 번째 계좌의 삭제 버튼 클릭
    fireEvent.click(screen.getAllByRole('button', { name: '삭제' })[0]);

    // onDelete 함수가 호출되었는지 확인
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
    fireEvent.click(screen.getByText('급여통장'));

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

    // 첫 번째 계좌의 거래 내역 버튼 클릭
    fireEvent.click(screen.getAllByRole('button', { name: '거래 내역' })[0]);

    // navigate 함수가 올바른 경로로 호출되었는지 확인
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/transactions/list?accountId=1');
  });
});
