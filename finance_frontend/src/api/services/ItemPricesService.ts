/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemPrice } from '../models/ItemPrice';
import type { PatchedItemPrice } from '../models/PatchedItemPrice';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemPricesService {
    /**
     * @returns ItemPrice
     * @throws ApiError
     */
    public static itemPricesList(): CancelablePromise<Array<ItemPrice>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/item-prices/',
        });
    }
    /**
     * @param requestBody
     * @returns ItemPrice
     * @throws ApiError
     */
    public static itemPricesCreate(
        requestBody: ItemPrice,
    ): CancelablePromise<ItemPrice> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/item-prices/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this item price.
     * @returns ItemPrice
     * @throws ApiError
     */
    public static itemPricesRetrieve(
        id: number,
    ): CancelablePromise<ItemPrice> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/item-prices/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this item price.
     * @param requestBody
     * @returns ItemPrice
     * @throws ApiError
     */
    public static itemPricesUpdate(
        id: number,
        requestBody: ItemPrice,
    ): CancelablePromise<ItemPrice> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/item-prices/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this item price.
     * @param requestBody
     * @returns ItemPrice
     * @throws ApiError
     */
    public static itemPricesPartialUpdate(
        id: number,
        requestBody?: PatchedItemPrice,
    ): CancelablePromise<ItemPrice> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/item-prices/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this item price.
     * @returns void
     * @throws ApiError
     */
    public static itemPricesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/item-prices/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
