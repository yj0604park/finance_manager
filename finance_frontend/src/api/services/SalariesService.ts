/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedSalary } from '../models/PatchedSalary';
import type { Salary } from '../models/Salary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SalariesService {
    /**
     * @returns Salary
     * @throws ApiError
     */
    public static salariesList(): CancelablePromise<Array<Salary>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/salaries/',
        });
    }
    /**
     * @param requestBody
     * @returns Salary
     * @throws ApiError
     */
    public static salariesCreate(
        requestBody: Salary,
    ): CancelablePromise<Salary> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/salaries/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this salary.
     * @returns Salary
     * @throws ApiError
     */
    public static salariesRetrieve(
        id: number,
    ): CancelablePromise<Salary> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/salaries/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this salary.
     * @param requestBody
     * @returns Salary
     * @throws ApiError
     */
    public static salariesUpdate(
        id: number,
        requestBody: Salary,
    ): CancelablePromise<Salary> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/salaries/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this salary.
     * @param requestBody
     * @returns Salary
     * @throws ApiError
     */
    public static salariesPartialUpdate(
        id: number,
        requestBody?: PatchedSalary,
    ): CancelablePromise<Salary> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/salaries/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this salary.
     * @returns void
     * @throws ApiError
     */
    public static salariesDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/salaries/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
