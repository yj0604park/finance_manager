import { BanksService } from '../services/BanksService';
import {
  BankFilterParams
} from '../../types/api';
import {
  Bank,
  CreateBankDto,
  UpdateBankDto
} from '../../types/models';
import {
  convertApiToBank,
  convertApiBanksToInternalList,
  convertBankToApi
} from '../../utils/typeConverters';

/**
 * 은행 API 클라이언트
 * 생성된 서비스에 대한 타입 추상화 래퍼
 */
export class BanksClient {
  /**
   * 은행 목록 조회
   * @param _params 필터링 파라미터 (현재 사용되지 않음)
   */
  public static async getAll(_params?: BankFilterParams): Promise<Bank[]> {
    try {
      // 현재는 필터링 파라미터를 지원하지 않지만 향후 확장성을 위해 준비
      const response = await BanksService.banksList();
      return convertApiBanksToInternalList(response);
    } catch (error) {
      console.error('Failed to fetch banks', error);
      throw error;
    }
  }

  /**
   * 은행 상세 조회
   * @param id 은행 ID
   */
  public static async getById(id: number): Promise<Bank> {
    try {
      const response = await BanksService.banksRetrieve(id);
      return convertApiToBank(response);
    } catch (error) {
      console.error(`Failed to fetch bank with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 은행 생성
   * @param data 생성할 은행 데이터
   */
  public static async create(data: CreateBankDto): Promise<Bank> {
    try {
      const apiData = convertBankToApi(data);
      const response = await BanksService.banksCreate(apiData as any);
      return convertApiToBank(response);
    } catch (error) {
      console.error('Failed to create bank', error);
      throw error;
    }
  }

  /**
   * 은행 수정
   * @param id 은행 ID
   * @param data 수정할 은행 데이터
   */
  public static async update(id: number, data: UpdateBankDto): Promise<Bank> {
    try {
      const apiData = convertBankToApi({ ...data, id });
      const response = await BanksService.banksUpdate(id, apiData as any);
      return convertApiToBank(response);
    } catch (error) {
      console.error(`Failed to update bank with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 은행 삭제
   * @param id 은행 ID
   */
  public static async delete(id: number): Promise<void> {
    try {
      return await BanksService.banksDestroy(id);
    } catch (error) {
      console.error(`Failed to delete bank with id ${id}`, error);
      throw error;
    }
  }
}
