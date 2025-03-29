/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyToEnum } from './CurrencyToEnum';
export type PatchedItemPrice = {
    readonly id?: number;
    date?: string;
    time?: string;
    readonly created_at?: string;
    readonly updated_at?: string;
    currency?: CurrencyToEnum;
    price?: string;
    source?: string;
    note?: string;
    item?: number;
};
