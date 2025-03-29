import { ApiResponse } from './common';
import { Account, Bank, Transaction } from './models';

/**
 * 은행 관련 API 응답 타입
 */
export interface BankResponse extends Bank { }
export type BanksListResponse = Bank[];
export type BankDetailResponse = ApiResponse<Bank>;
export type BankCreateResponse = ApiResponse<Bank>;
export type BankUpdateResponse = ApiResponse<Bank>;
export type BankDeleteResponse = ApiResponse<{ success: boolean }>;

/**
 * 계좌 관련 API 응답 타입
 */
export interface AccountResponse extends Account { }
export type AccountsListResponse = Account[];
export type AccountDetailResponse = ApiResponse<Account>;
export type AccountCreateResponse = ApiResponse<Account>;
export type AccountUpdateResponse = ApiResponse<Account>;
export type AccountDeleteResponse = ApiResponse<{ success: boolean }>;

/**
 * 거래내역 관련 API 응답 타입
 */
export interface TransactionResponse extends Transaction { }
export type TransactionsListResponse = Transaction[];
export type TransactionDetailResponse = ApiResponse<Transaction>;
export type TransactionCreateResponse = ApiResponse<Transaction>;
export type TransactionUpdateResponse = ApiResponse<Transaction>;
export type TransactionDeleteResponse = ApiResponse<{ success: boolean }>;

/**
 * 페이지네이션 API 요청 파라미터
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  search?: string;
}

/**
 * 은행 필터링 파라미터
 */
export interface BankFilterParams extends PaginationParams {
  country?: string;
}

/**
 * 계좌 필터링 파라미터
 */
export interface AccountFilterParams extends PaginationParams {
  bank?: number;
  currency?: string;
}

/**
 * 거래내역 필터링 파라미터
 */
export interface TransactionFilterParams extends PaginationParams {
  account?: number;
  startDate?: string;
  endDate?: string;
  type?: 'income' | 'expense' | 'transfer';
  category?: number;
  minAmount?: number;
  maxAmount?: number;
}
