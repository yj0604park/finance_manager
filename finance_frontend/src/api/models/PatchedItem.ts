/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyToEnum } from './CurrencyToEnum';
import type { ItemTypeEnum } from './ItemTypeEnum';
export type PatchedItem = {
    readonly id?: number;
    currency?: CurrencyToEnum;
    name?: string;
    code?: string | null;
    item_type?: ItemTypeEnum;
    user?: number;
};
