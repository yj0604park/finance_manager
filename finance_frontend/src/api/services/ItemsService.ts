/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Item } from '../models/Item';
import type { PatchedItem } from '../models/PatchedItem';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemsService {
    /**
     * @returns Item
     * @throws ApiError
     */
    public static itemsList(): CancelablePromise<Array<Item>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/items/',
        });
    }
    /**
     * @param requestBody
     * @returns Item
     * @throws ApiError
     */
    public static itemsCreate(
        requestBody: Item,
    ): CancelablePromise<Item> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/items/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this item.
     * @returns Item
     * @throws ApiError
     */
    public static itemsRetrieve(
        id: number,
    ): CancelablePromise<Item> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/items/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this item.
     * @param requestBody
     * @returns Item
     * @throws ApiError
     */
    public static itemsUpdate(
        id: number,
        requestBody: Item,
    ): CancelablePromise<Item> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/items/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this item.
     * @param requestBody
     * @returns Item
     * @throws ApiError
     */
    public static itemsPartialUpdate(
        id: number,
        requestBody?: PatchedItem,
    ): CancelablePromise<Item> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/items/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this item.
     * @returns void
     * @throws ApiError
     */
    public static itemsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/items/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
