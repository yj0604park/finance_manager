/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BlankEnum } from './BlankEnum';
import type { CurrencyToEnum } from './CurrencyToEnum';
import type { NullEnum } from './NullEnum';
export type PatchedAccountSnapshot = {
    readonly id?: number;
    date?: string;
    time?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    currency?: (CurrencyToEnum | BlankEnum | NullEnum) | null;
    user?: number;
    account?: number | null;
    bank?: number | null;
    item?: number | null;
};
