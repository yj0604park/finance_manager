import { Salary } from './Salary';

/**
 * 급여 생성 DTO
 * (이전 API 버전과의 호환성을 위한 인터페이스)
 */
export interface CreateSalaryDto {
  date: string;
  amount?: number;
  currency?: string;
  gross_amount?: number;
  tax_amount?: number;
  insurance_amount?: number;
  pension_amount?: number;
  bonus?: number;
  company?: string;
  department?: string;
  position?: string;
  note?: string;
}

/**
 * 급여 업데이트 DTO
 * (이전 API 버전과의 호환성을 위한 인터페이스)
 */
export interface UpdateSalaryDto extends Partial<CreateSalaryDto> { }