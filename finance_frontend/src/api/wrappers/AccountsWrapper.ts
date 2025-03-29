import { AccountsService } from '../services/AccountsService';
import { Account as ApiAccount } from '../models/Account';
import {
  Account,
  CreateAccountDto,
  UpdateAccountDto
} from '../../types/models';
import {
  convertApiToAccount,
  convertApiAccountsToInternalList,
  convertAccountToApi
} from '../../utils/typeConverters';

/**
 * 계좌 API 래퍼 클래스
 * 자동 생성된 서비스에 대한 타입 안전한 인터페이스 제공
 */
export class AccountsWrapper {
  /**
   * 모든 계좌 가져오기
   */
  static async getAll(): Promise<Account[]> {
    try {
      const response = await AccountsService.accountsList();
      return convertApiAccountsToInternalList(response);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
      throw error;
    }
  }

  /**
   * 특정 계좌 정보 가져오기
   */
  static async getById(id: number): Promise<Account> {
    try {
      const response = await AccountsService.accountsRetrieve(id);
      return convertApiToAccount(response);
    } catch (error) {
      console.error(`Failed to fetch account with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 새 계좌 생성
   */
  static async create(data: CreateAccountDto): Promise<Account> {
    try {
      const apiData = convertAccountToApi(data);
      const response = await AccountsService.accountsCreate(apiData as ApiAccount);
      return convertApiToAccount(response);
    } catch (error) {
      console.error('Failed to create account', error);
      throw error;
    }
  }

  /**
   * 계좌 정보 업데이트
   */
  static async update(id: number, data: UpdateAccountDto): Promise<Account> {
    try {
      const apiData = convertAccountToApi({ ...data, id });
      const response = await AccountsService.accountsUpdate(id, apiData as ApiAccount);
      return convertApiToAccount(response);
    } catch (error) {
      console.error(`Failed to update account with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 계좌 삭제
   */
  static async delete(id: number): Promise<void> {
    try {
      await AccountsService.accountsDestroy(id);
    } catch (error) {
      console.error(`Failed to delete account with id ${id}`, error);
      throw error;
    }
  }
}
