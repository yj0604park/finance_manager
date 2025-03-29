/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

/**
 * 아이템(물건) 모델
 */
export interface Item {
  id: number;
  name: string;
  description?: string;
  category?: string;
  purchase_date?: string;
  created_at: string;
  updated_at: string;
  user: number;
}

/**
 * 아이템 생성 DTO
 */
export interface CreateItemDto {
  name: string;
  description?: string;
  category?: string;
  purchase_date?: string;
}

/**
 * 아이템 수정 DTO
 */
export interface UpdateItemDto {
  id: number;
  name?: string;
  description?: string;
  category?: string;
  purchase_date?: string;
}
