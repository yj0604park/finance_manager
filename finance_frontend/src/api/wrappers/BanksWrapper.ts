import { BanksService } from '../services/BanksService';
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
import { Bank as ApiBank } from '../models/Bank';

/**
 * 은행 API 래퍼 클래스
 * 자동 생성된 서비스에 대한 타입 안전한 인터페이스 제공
 */
export class BanksWrapper {
  /**
   * 모든 은행 가져오기
   */
  static async getAll(): Promise<Bank[]> {
    try {
      const response = await BanksService.banksList();
      return convertApiBanksToInternalList(response);
    } catch (error) {
      console.error('Failed to fetch banks', error);
      throw error;
    }
  }

  /**
   * 특정 은행 정보 가져오기
   */
  static async getById(id: number): Promise<Bank> {
    try {
      const response = await BanksService.banksRetrieve(id);
      return convertApiToBank(response);
    } catch (error) {
      console.error(`Failed to fetch bank with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 새 은행 생성
   */
  static async create(data: CreateBankDto): Promise<Bank> {
    try {
      const apiData = convertBankToApi(data);
      const response = await BanksService.banksCreate(apiData as ApiBank);
      return convertApiToBank(response);
    } catch (error) {
      console.error('Failed to create bank', error);
      throw error;
    }
  }

  /**
   * 은행 정보 업데이트
   */
  static async update(id: number, data: UpdateBankDto): Promise<Bank> {
    try {
      const apiData = convertBankToApi({ ...data, id });
      const response = await BanksService.banksUpdate(id, apiData as ApiBank);
      return convertApiToBank(response);
    } catch (error) {
      console.error(`Failed to update bank with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 은행 삭제
   */
  static async delete(id: number): Promise<void> {
    try {
      await BanksService.banksDestroy(id);
    } catch (error) {
      console.error(`Failed to delete bank with id ${id}`, error);
      throw error;
    }
  }
}
