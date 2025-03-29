/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Bank } from '../models/Bank';
import type { PatchedBank } from '../models/PatchedBank';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class BanksService {
  /**
   * @returns Bank
   * @throws ApiError
   */
  public static banksList(): CancelablePromise<Array<Bank>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/banks/',
    });
  }
  /**
   * @param requestBody
   * @returns Bank
   * @throws ApiError
   */
  public static banksCreate(requestBody: Bank): CancelablePromise<Bank> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/banks/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this bank.
   * @returns Bank
   * @throws ApiError
   */
  public static banksRetrieve(id: number): CancelablePromise<Bank> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/banks/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A unique integer value identifying this bank.
   * @param requestBody
   * @returns Bank
   * @throws ApiError
   */
  public static banksUpdate(id: number, requestBody: Bank): CancelablePromise<Bank> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/banks/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this bank.
   * @param requestBody
   * @returns Bank
   * @throws ApiError
   */
  public static banksPartialUpdate(id: number, requestBody?: PatchedBank): CancelablePromise<Bank> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/banks/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this bank.
   * @returns void
   * @throws ApiError
   */
  public static banksDestroy(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/banks/{id}/',
      path: {
        id: id,
      },
    });
  }
}
