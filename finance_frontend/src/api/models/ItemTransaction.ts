/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ItemTransaction = {
    readonly id: number;
    date: string;
    time?: string;
    readonly created_at: string;
    readonly updated_at: string;
    purchase_price: string;
    quantity: string;
    tax?: string | null;
    fee?: string | null;
    subsidy?: string | null;
    note?: string;
    item: number;
    transaction?: number | null;
};

