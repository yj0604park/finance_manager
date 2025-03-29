import { SalariesService } from '../services/SalariesService';
import { Salary } from '../models/Salary';
import { PatchedSalary } from '../models/PatchedSalary';

/**
 * 급여 API 래퍼 클래스
 * 자동 생성된 서비스에 대한 타입 안전한 인터페이스 제공
 */
export class SalariesWrapper {
  /**
   * 모든 급여 정보 가져오기
   */
  static async getAll(): Promise<Salary[]> {
    try {
      return await SalariesService.salariesList();
    } catch (error) {
      console.error('Failed to fetch salaries', error);
      throw error;
    }
  }

  /**
   * 특정 급여 정보 가져오기
   */
  static async getById(id: number): Promise<Salary> {
    try {
      return await SalariesService.salariesRetrieve(id);
    } catch (error) {
      console.error(`Failed to fetch salary with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 새 급여 정보 생성
   */
  static async create(data: Salary): Promise<Salary> {
    try {
      return await SalariesService.salariesCreate(data);
    } catch (error) {
      console.error('Failed to create salary', error);
      throw error;
    }
  }

  /**
   * 급여 정보 업데이트
   */
  static async update(id: number, data: Salary): Promise<Salary> {
    try {
      return await SalariesService.salariesUpdate(id, data);
    } catch (error) {
      console.error(`Failed to update salary with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 급여 정보 부분 업데이트
   */
  static async partialUpdate(id: number, data: PatchedSalary): Promise<Salary> {
    try {
      return await SalariesService.salariesPartialUpdate(id, data);
    } catch (error) {
      console.error(`Failed to partially update salary with id ${id}`, error);
      throw error;
    }
  }

  /**
   * 급여 정보 삭제
   */
  static async delete(id: number): Promise<void> {
    try {
      await SalariesService.salariesDestroy(id);
    } catch (error) {
      console.error(`Failed to delete salary with id ${id}`, error);
      throw error;
    }
  }
}
