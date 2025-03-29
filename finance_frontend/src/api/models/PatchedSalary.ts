/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyToEnum } from './CurrencyToEnum';
export type PatchedSalary = {
  readonly id?: number;
  date?: string;
  time?: string;
  readonly created_at?: string;
  readonly updated_at?: string;
  currency?: CurrencyToEnum;
  gross_pay?: string;
  adjustment?: string;
  tax_withheld?: string;
  deduction?: string;
  net_pay?: string;
  gross_pay_detail?: any;
  adjustment_detail?: any;
  tax_withheld_detail?: any;
  deduction_detail?: any;
  user?: number;
  transaction?: number;
};
