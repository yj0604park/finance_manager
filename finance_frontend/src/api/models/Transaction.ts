/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionTypeEnum } from './TransactionTypeEnum';
export type Transaction = {
  readonly id: number;
  date: string;
  time?: string;
  readonly created_at: string;
  readonly updated_at: string;
  amount: string;
  balance?: string | null;
  note?: string | null;
  transaction_type?: TransactionTypeEnum;
  is_reviewed?: boolean;
  user: number;
  account: number;
  retailer?: number | null;
  linked_transaction?: number | null;
};
