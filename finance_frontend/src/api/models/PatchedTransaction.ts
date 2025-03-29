/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TransactionTypeEnum } from './TransactionTypeEnum';
export type PatchedTransaction = {
    readonly id?: number;
    date?: string;
    time?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    amount?: string;
    balance?: string;
    note?: string;
    transaction_type?: TransactionTypeEnum;
    is_reviewed?: boolean;
    account?: number;
    retailer?: number | null;
    linked_transaction?: number | null;
};
