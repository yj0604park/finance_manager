import { OpenAPI } from '../core/OpenAPI';
import { Salary, CreateSalaryDto, UpdateSalaryDto } from '../models/Salary';

/**
 * 급여 관련 API 클라이언트
 */
export class SalariesClient {
  /**
   * 모든 급여 기록을 가져옵니다.
   * @returns 모든 급여 기록 목록
   */
  public static async getAll(): Promise<Salary[]> {
    const response = await fetch(`${OpenAPI.BASE}/salaries`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAPI.TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`급여 데이터를 가져오는데 실패했습니다: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 특정 ID의 급여 기록을 가져옵니다.
   * @param id 급여 기록 ID
   * @returns 급여 기록 정보
   */
  public static async getById(id: number): Promise<Salary> {
    const response = await fetch(`${OpenAPI.BASE}/salaries/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAPI.TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`급여 데이터를 가져오는데 실패했습니다: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 새로운 급여 기록을 생성합니다.
   * @param data 생성할 급여 데이터
   * @returns 생성된 급여 기록
   */
  public static async create(data: CreateSalaryDto): Promise<Salary> {
    const response = await fetch(`${OpenAPI.BASE}/salaries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAPI.TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`급여 데이터를 생성하는데 실패했습니다: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 기존 급여 기록을 수정합니다.
   * @param id 수정할 급여 기록 ID
   * @param data 수정할 데이터
   * @returns 수정된 급여 기록
   */
  public static async update(id: number, data: UpdateSalaryDto): Promise<Salary> {
    const response = await fetch(`${OpenAPI.BASE}/salaries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAPI.TOKEN}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`급여 데이터를 수정하는데 실패했습니다: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * 급여 기록을 삭제합니다.
   * @param id 삭제할 급여 기록 ID
   */
  public static async delete(id: number): Promise<void> {
    const response = await fetch(`${OpenAPI.BASE}/salaries/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OpenAPI.TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`급여 데이터를 삭제하는데 실패했습니다: ${response.status} ${response.statusText}`);
    }
  }
}
