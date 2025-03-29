/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryEnum } from './CategoryEnum';
import type { RetailerTypeEnum } from './RetailerTypeEnum';
export type Retailer = {
    readonly id: number;
    name: string;
    retailer_type?: RetailerTypeEnum;
    category?: CategoryEnum;
};

