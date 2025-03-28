/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { CurrencyToEnum } from './CurrencyToEnum';
export type Account = {
  readonly id: number;
  amount: string;
  currency?: CurrencyToEnum;
  name: string;
  nickname?: string | null;
  last_update?: string | null;
  last_transaction?: string | null;
  first_transaction?: string | null;
  first_added?: boolean;
  is_active?: boolean;
  user: number;
  bank: number;
};
