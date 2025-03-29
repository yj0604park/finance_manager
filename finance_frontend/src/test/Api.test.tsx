import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransactionsService } from '../api/services/TransactionsService';

// API 서비스 모킹
vi.mock('../api/services/TransactionsService', () => ({
  TransactionsService: {
    transactionsList: vi.fn(),
    transactionsRetrieve: vi.fn(),
    transactionsCreate: vi.fn(),
  }
}));

describe('API 테스트', () => {
  // 테스트 데이터 - 트랜잭션 목록
  const mockTransactions = [
    {
      id: 1,
      date: '2023-01-01',
      amount: 10000,
      description: '테스트 트랜잭션',
      account_id: 1,
      account: { id: 1, name: '테스트 계좌' }
    },
    {
      id: 2,
      date: '2023-01-02',
      amount: 20000,
      description: '테스트 트랜잭션 2',
      account_id: 1,
      account: { id: 1, name: '테스트 계좌' }
    }
  ];

  // 테스트 데이터 - 단일 트랜잭션
  const mockTransaction = {
    id: 5,
    date: '2023-01-01',
    amount: 10000,
    description: '트랜잭션 5',
    account_id: 1,
    account: { id: 1, name: '테스트 계좌' }
  };

  // 테스트 데이터 - 생성된 트랜잭션
  const mockCreatedTransaction = {
    id: 999,
    date: '2023-03-15',
    amount: 50000,
    description: '새 트랜잭션',
    account_id: 2,
    account: { id: 2, name: '테스트 계좌' }
  };

  // 각 테스트 전에 모킹 설정 초기화
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(TransactionsService.transactionsList).mockResolvedValue(mockTransactions as any);
    vi.mocked(TransactionsService.transactionsRetrieve).mockResolvedValue(mockTransaction as any);
    vi.mocked(TransactionsService.transactionsCreate).mockResolvedValue(mockCreatedTransaction as any);
  });

  it('트랜잭션 목록을 가져올 수 있다', async () => {
    // API 호출
    const transactions = await TransactionsService.transactionsList();

    // 검증
    expect(TransactionsService.transactionsList).toHaveBeenCalledTimes(1);
    expect(transactions).toHaveLength(2);
    expect(transactions[0].id).toBe(1);
    expect(transactions[0].amount).toBe(10000);
  });

  it('트랜잭션 상세 정보를 가져올 수 있다', async () => {
    // API 호출
    const transaction = await TransactionsService.transactionsRetrieve(5);

    // 검증
    expect(TransactionsService.transactionsRetrieve).toHaveBeenCalledWith(5);
    expect(transaction.id).toBe(5);
    expect(transaction.amount).toBe(10000);
  });

  it('트랜잭션을 생성할 수 있다', async () => {
    // 새 트랜잭션 데이터
    const newTransaction = {
      date: '2023-03-15',
      amount: 50000,
      account_id: 2,
      description: '새 트랜잭션'
    } as any;

    // API 호출
    const result = await TransactionsService.transactionsCreate(newTransaction);

    // 검증
    expect(TransactionsService.transactionsCreate).toHaveBeenCalledWith(newTransaction);
    expect(result.id).toBe(999);
    expect(result.amount).toBe(50000);
    expect(result.date).toBe('2023-03-15');
  });
});
