import { BaseEntity } from './common';
import { CountryEnum } from '../api/models/CountryEnum';
import { CurrencyToEnum } from '../api/models/CurrencyToEnum';

/**
 * 은행 모델 인터페이스
 */
export interface Bank extends BaseEntity {
  name: string;
  country: CountryEnum;
  logo?: string;
}

/**
 * 계좌 모델 인터페이스
 */
export interface Account extends BaseEntity {
  name: string;
  amount: string;
  bank: number;
  currency?: CurrencyToEnum;
  nickname?: string | null;
  user: number;
  bankName?: string | null; // 화면 표시용
}

/**
 * 거래내역 모델 인터페이스
 */
export interface Transaction extends BaseEntity {
  account: number;
  amount: string;
  description: string;
  date: string;
  category?: number | null;
  type: 'income' | 'expense' | 'transfer';
}

/**
 * 카테고리 모델 인터페이스
 */
export interface Category extends BaseEntity {
  name: string;
  type: 'income' | 'expense';
  color?: string | null;
  icon?: string | null;
}

/**
 * 은행 생성 DTO
 */
export type CreateBankDto = Omit<Bank, 'id'>;

/**
 * 은행 업데이트 DTO
 */
export type UpdateBankDto = Partial<Omit<Bank, 'id'>>;

/**
 * 계좌 생성 DTO
 */
export type CreateAccountDto = Omit<Account, 'id' | 'bankName'>;

/**
 * 계좌 업데이트 DTO
 */
export type UpdateAccountDto = Partial<Omit<Account, 'id' | 'bankName'>>;
