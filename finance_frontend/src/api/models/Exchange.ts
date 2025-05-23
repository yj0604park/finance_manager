/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyToEnum } from './CurrencyToEnum';
import type { ExchangeBrokerEnum } from './ExchangeBrokerEnum';
export type Exchange = {
    readonly id: number;
    date: string;
    time?: string;
    readonly created_at: string;
    readonly updated_at: string;
    amount_from: string;
    amount_to: string;
    currency_from?: CurrencyToEnum;
    currency_to?: CurrencyToEnum;
    exchange_ratio?: string | null;
    exchange_broker?: ExchangeBrokerEnum;
    transaction_from: number;
    transaction_to: number;
};

