import { vi } from 'vitest';
import React from 'react';

/**
 * 라우터 모킹
 *
 * react-router-dom의 훅과 컴포넌트를 모킹합니다.
 */
export const setupRouterMocks = () => {
  const mockNavigate = vi.fn();

  vi.mock('react-router-dom', async () => {
    const actual = await import('react-router-dom');
    return {
      ...actual,
      useNavigate: () => mockNavigate,
      useParams: () => ({}),
      useLocation: () => ({ search: '' }),
      Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
        <a href={to}>{children}</a>
      )
    };
  });

  return mockNavigate;
};

/**
 * 트랜잭션 모달 모킹
 *
 * 트랜잭션 폼 모달을 모킹합니다.
 */
export const setupTransactionModalMock = () => {
  vi.mock('../../components/transactions/TransactionFormModal', () => ({
    default: vi.fn().mockReturnValue(<div data-testid="mock-transaction-modal" />),
  }));
};

/**
 * 계좌 모달 모킹
 *
 * 계좌 폼 모달을 모킹합니다.
 */
export const setupAccountModalMock = () => {
  vi.mock('../../components/accounts/AccountFormModal', () => ({
    default: vi.fn().mockReturnValue(<div data-testid="mock-account-modal" />),
  }));
};
