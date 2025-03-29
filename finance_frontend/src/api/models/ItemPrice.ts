/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CurrencyToEnum } from './CurrencyToEnum';

/**
 * 아이템 가격 모델
 */
export interface ItemPrice {
  id: number;
  item: number;
  price: number;
  currency: string;
  date: string;
  source?: string;
  note?: string;
  created_at: string;
  updated_at: string;
  user: number;
}

/**
 * 아이템 가격 생성 DTO
 */
export interface CreateItemPriceDto {
  item: number;
  price: number;
  currency: string;
  date: string;
  source?: string;
  note?: string;
}

/**
 * 아이템 가격 수정 DTO
 */
export interface UpdateItemPriceDto {
  id: number;
  price?: number;
  currency?: string;
  date?: string;
  source?: string;
  note?: string;
}
