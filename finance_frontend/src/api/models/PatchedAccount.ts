/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountTypeEnum } from './AccountTypeEnum';
import type { CurrencyToEnum } from './CurrencyToEnum';
export type PatchedAccount = {
    readonly id?: number;
    nickname?: string | null;
    readonly amount?: string;
    currency?: CurrencyToEnum;
    name?: string;
    account_type?: AccountTypeEnum;
    readonly last_update?: string | null;
    readonly last_transaction?: string | null;
    readonly first_transaction?: string | null;
    readonly first_added?: boolean;
    is_active?: boolean;
    bank?: number;
};

