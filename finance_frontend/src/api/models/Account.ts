/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountTypeEnum } from './AccountTypeEnum';
import type { CurrencyToEnum } from './CurrencyToEnum';
export type Account = {
    readonly id: number;
    amount?: string;
    nickname?: string | null;
    is_active?: boolean;
    currency?: CurrencyToEnum;
    name: string;
    account_type?: AccountTypeEnum;
    last_update?: string | null;
    last_transaction?: string | null;
    first_transaction?: string | null;
    first_added?: boolean;
    bank: number;
};

