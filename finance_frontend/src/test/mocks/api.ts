import { vi } from 'vitest';
import { Transaction } from '../../api/models/Transaction';
import { Account } from '../../api/models/Account';
import { Bank } from '../../api/models/Bank';
import { Retailer } from '../../api/models/Retailer';

// API 서비스 클래스들을 직접 가져오기 대신, 미리 모킹된 객체 생성
const mockTransactionsService = {
  transactionsList: vi.fn().mockResolvedValue([]),
  transactionsCreate: vi.fn(),
  transactionsUpdate: vi.fn(),
  transactionsDestroy: vi.fn(),
  transactionsRetrieve: vi.fn(),
};

const mockAccountsService = {
  accountsList: vi.fn().mockResolvedValue([]),
};

const mockBanksService = {
  banksList: vi.fn().mockResolvedValue([]),
};

const mockRetailersService = {
  retailersList: vi.fn().mockResolvedValue([]),
};

const mockItemsService = {
  itemsList: vi.fn().mockResolvedValue([]),
};

/**
 * API 서비스 모킹
 *
 * 테스트에서 사용할 API 서비스를 모킹합니다.
 * 이 함수는 자동으로 호이스팅되므로 파일 맨 위에 위치시키는 것이 중요합니다.
 */
export const setupApiMocks = () => {
  vi.mock('../../api/services/TransactionsService', () => ({
    TransactionsService: mockTransactionsService
  }));

  vi.mock('../../api/services/AccountsService', () => ({
    AccountsService: mockAccountsService
  }));

  vi.mock('../../api/services/BanksService', () => ({
    BanksService: mockBanksService
  }));

  vi.mock('../../api/services/RetailersService', () => ({
    RetailersService: mockRetailersService
  }));

  vi.mock('../../api/services/ItemsService', () => ({
    ItemsService: mockItemsService
  }));
};

/**
 * API 응답 모킹 데이터 설정
 *
 * API 서비스가 반환할 데이터를 설정합니다.
 */
export const mockApiData = (
  transactions: Transaction[] = [],
  accounts: Account[] = [],
  banks: Bank[] = [],
  retailers: Retailer[] = []
) => {
  // require 대신 미리 만들어둔 모킹 객체 사용
  mockTransactionsService.transactionsList.mockResolvedValue(transactions);
  mockAccountsService.accountsList.mockResolvedValue(accounts);
  mockBanksService.banksList.mockResolvedValue(banks);
  mockRetailersService.retailersList.mockResolvedValue(retailers);
};

/**
 * 모든 테스트 환경을 초기화
 */
export const resetTestEnv = () => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
};
