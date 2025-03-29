import { AccountsService } from '../services/AccountsService';
import {
  AccountFilterParams
} from '../../types/api';
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
 * 계좌 API 클라이언트
 * 생성된 서비스에 대한 타입 추상화 래퍼
 */
export class AccountsClient {
  /**
   * 계좌 목록 조회
   * @param _params 필터링 파라미터 (현재 사용되지 않음)
   */
  public static async getAll(_params?: AccountFilterParams): Promise<Account[]> {
    try {
      // 현재는 필터링 파라미터를 지원하지 않지만 향후 확장성을 위해 준비
      const response = await AccountsService.accountsList();
      return convertApiAccountsToInternalList(response);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
      throw error;
    }
  }

  /**
   * 계좌 상세 조회
   * @param id 계좌 ID
   */
  public static async getById(id: number): Promise<Account> {
    try {
      const response = await AccountsService.accountsRetrieve(id);
      return convertApiToAccount(response);
    } catch (error) {
      console.error(`Failed to fetch account with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 계좌 생성
   * @param data 생성할 계좌 데이터
   */
  public static async create(data: CreateAccountDto): Promise<Account> {
    try {
      const apiData = convertAccountToApi(data);
      const response = await AccountsService.accountsCreate(apiData as any);
      return convertApiToAccount(response);
    } catch (error) {
      console.error('Failed to create account', error);
      throw error;
    }
  }

  /**
   * 계좌 수정
   * @param id 계좌 ID
   * @param data 수정할 계좌 데이터
   */
  public static async update(id: number, data: UpdateAccountDto): Promise<Account> {
    try {
      const apiData = convertAccountToApi({ ...data, id });
      const response = await AccountsService.accountsUpdate(id, apiData as any);
      return convertApiToAccount(response);
    } catch (error) {
      console.error(`Failed to update account with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 계좌 삭제
   * @param id 계좌 ID
   */
  public static async delete(id: number): Promise<void> {
    try {
      return await AccountsService.accountsDestroy(id);
    } catch (error) {
      console.error(`Failed to delete account with id ${id}`, error);
      throw error;
    }
  }
}
