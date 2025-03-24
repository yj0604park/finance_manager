/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedRetailer } from '../models/PatchedRetailer';
import type { Retailer } from '../models/Retailer';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ReatilersService {
    /**
     * @returns Retailer
     * @throws ApiError
     */
    public static reatilersList(): CancelablePromise<Array<Retailer>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reatilers/',
        });
    }
    /**
     * @param requestBody
     * @returns Retailer
     * @throws ApiError
     */
    public static reatilersCreate(
        requestBody: Retailer,
    ): CancelablePromise<Retailer> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/reatilers/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this retailer.
     * @returns Retailer
     * @throws ApiError
     */
    public static reatilersRetrieve(
        id: number,
    ): CancelablePromise<Retailer> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/reatilers/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this retailer.
     * @param requestBody
     * @returns Retailer
     * @throws ApiError
     */
    public static reatilersUpdate(
        id: number,
        requestBody: Retailer,
    ): CancelablePromise<Retailer> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/reatilers/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this retailer.
     * @param requestBody
     * @returns Retailer
     * @throws ApiError
     */
    public static reatilersPartialUpdate(
        id: number,
        requestBody?: PatchedRetailer,
    ): CancelablePromise<Retailer> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/reatilers/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this retailer.
     * @returns void
     * @throws ApiError
     */
    public static reatilersDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/reatilers/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
