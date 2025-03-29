/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { User } from './User';

/**
 * 급여 모델
 */
export interface Salary {
  id: number;
  date: string; // ISO 형식의 날짜 ("YYYY-MM-DD")
  amount: number; // 순수령액
  currency: string; // 통화 (예: KRW, USD)
  gross_amount?: number; // 총액(세전)
  tax_amount?: number; // 세금
  insurance_amount?: number; // 보험
  pension_amount?: number; // 연금
  bonus?: number; // 보너스
  company?: string; // 회사명
  department?: string; // 부서
  position?: string; // 직책
  note?: string; // 메모
  created_at?: string; // 생성일
  updated_at?: string; // 수정일
  user?: User; // 사용자
}

/**
 * 급여 생성 DTO
 */
export interface CreateSalaryDto {
  date: string;
  amount: number;
  currency: string;
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
 * 급여 수정 DTO
 */
export interface UpdateSalaryDto {
  date?: string;
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
