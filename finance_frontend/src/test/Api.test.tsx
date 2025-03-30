import { vi, describe, it, expect, beforeEach } from 'vitest';
import { TransactionsService } from '../api/services/TransactionsService';
import { Transaction } from '../api/models/Transaction';
import { TransactionTypeEnum } from '../api/models/TransactionTypeEnum';

// API 서비스 모킹
vi.mock('../api/services/TransactionsService', () => ({
  TransactionsService: {
    transactionsList: vi.fn(),
    transactionsRetrieve: vi.fn(),
    transactionsCreate: vi.fn(),
    transactionsUpdate: vi.fn(),
    transactionsDestroy: vi.fn()
  }
}));

describe('거래내역 API 테스트', () => {
  // 목(Mock) 응답 데이터
  const mockTransactions: Transaction[] = [
    {
      id: 1,
      date: '2023-03-01',
      created_at: '2023-03-01T09:00:00Z',
      updated_at: '2023-03-01T09:00:00Z',
      amount: '10000',
      account: 1,
      transaction_type: TransactionTypeEnum.ETC_EXPENSE,
      note: '테스트 거래내역'
    },
    {
      id: 2,
      date: '2023-03-02',
      created_at: '2023-03-02T09:00:00Z',
      updated_at: '2023-03-02T09:00:00Z',
      amount: '20000',
      account: 2,
      transaction_type: TransactionTypeEnum.SALARY,
      note: '테스트 거래내역 2'
    }
  ];

  const mockTransaction: Transaction = {
    id: 5,
    date: '2023-03-05',
    created_at: '2023-03-05T09:00:00Z',
    updated_at: '2023-03-05T09:00:00Z',
    amount: '10000',
    account: 2,
    transaction_type: TransactionTypeEnum.ETC_EXPENSE,
    note: '테스트 거래내역 상세'
  };

  const mockCreatedTransaction: Transaction = {
    id: 999,
    date: '2023-03-15',
    created_at: '2023-03-15T09:00:00Z',
    updated_at: '2023-03-15T09:00:00Z',
    amount: '50000',
    account: 2,
    transaction_type: TransactionTypeEnum.ETC_EXPENSE,
    note: '새 트랜잭션'
  };

  // 각 테스트 전에 모킹 설정 초기화
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(TransactionsService.transactionsList).mockResolvedValue(mockTransactions);
    vi.mocked(TransactionsService.transactionsRetrieve).mockResolvedValue(mockTransaction);
    vi.mocked(TransactionsService.transactionsCreate).mockResolvedValue(mockCreatedTransaction);
  });

  it('트랜잭션 목록을 가져올 수 있다', async () => {
    // API 호출
    const transactions = await TransactionsService.transactionsList();

    // 검증
    expect(TransactionsService.transactionsList).toHaveBeenCalledTimes(1);
    expect(transactions).toHaveLength(2);
    expect(transactions[0].id).toBe(1);
    expect(transactions[0].amount).toBe('10000');
  });

  it('트랜잭션 상세 정보를 가져올 수 있다', async () => {
    // API 호출
    const transaction = await TransactionsService.transactionsRetrieve(5);

    // 검증
    expect(TransactionsService.transactionsRetrieve).toHaveBeenCalledWith(5);
    expect(transaction.id).toBe(5);
    expect(transaction.amount).toBe('10000');
  });

  it('트랜잭션을 생성할 수 있다', async () => {
    // 새 트랜잭션 데이터
    const newTransaction: Partial<Transaction> = {
      date: '2023-03-15',
      amount: '50000',
      account: 2,
      note: '새 트랜잭션'
    };

    // API 호출
    const result = await TransactionsService.transactionsCreate(newTransaction as Transaction);

    // 검증
    expect(TransactionsService.transactionsCreate).toHaveBeenCalledWith(newTransaction);
    expect(result.id).toBe(999);
    expect(result.amount).toBe('50000');
    expect(result.date).toBe('2023-03-15');
  });
});
