/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AccountSnapshot } from '../models/AccountSnapshot';
import type { PatchedAccountSnapshot } from '../models/PatchedAccountSnapshot';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AccountSnapshotsService {
    /**
     * @returns AccountSnapshot
     * @throws ApiError
     */
    public static accountSnapshotsList(): CancelablePromise<Array<AccountSnapshot>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/account-snapshots/',
        });
    }
    /**
     * @param requestBody
     * @returns AccountSnapshot
     * @throws ApiError
     */
    public static accountSnapshotsCreate(
        requestBody: AccountSnapshot,
    ): CancelablePromise<AccountSnapshot> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/account-snapshots/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this account snapshot.
     * @returns AccountSnapshot
     * @throws ApiError
     */
    public static accountSnapshotsRetrieve(
        id: number,
    ): CancelablePromise<AccountSnapshot> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/account-snapshots/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this account snapshot.
     * @param requestBody
     * @returns AccountSnapshot
     * @throws ApiError
     */
    public static accountSnapshotsUpdate(
        id: number,
        requestBody: AccountSnapshot,
    ): CancelablePromise<AccountSnapshot> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/account-snapshots/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this account snapshot.
     * @param requestBody
     * @returns AccountSnapshot
     * @throws ApiError
     */
    public static accountSnapshotsPartialUpdate(
        id: number,
        requestBody?: PatchedAccountSnapshot,
    ): CancelablePromise<AccountSnapshot> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/account-snapshots/{id}/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this account snapshot.
     * @returns void
     * @throws ApiError
     */
    public static accountSnapshotsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/account-snapshots/{id}/',
            path: {
                'id': id,
            },
        });
    }
}
