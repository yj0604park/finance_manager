/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PatchedTransaction } from '../models/PatchedTransaction';
import type { Transaction } from '../models/Transaction';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TransactionsService {
  /**
   * @returns Transaction
   * @throws ApiError
   */
  public static transactionsList(): CancelablePromise<Array<Transaction>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/transactions/',
    });
  }
  /**
   * @param requestBody
   * @returns Transaction
   * @throws ApiError
   */
  public static transactionsCreate(requestBody: Transaction): CancelablePromise<Transaction> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/transactions/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this transaction.
   * @returns Transaction
   * @throws ApiError
   */
  public static transactionsRetrieve(id: number): CancelablePromise<Transaction> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/transactions/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A unique integer value identifying this transaction.
   * @param requestBody
   * @returns Transaction
   * @throws ApiError
   */
  public static transactionsUpdate(
    id: number,
    requestBody: Transaction
  ): CancelablePromise<Transaction> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/transactions/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this transaction.
   * @param requestBody
   * @returns Transaction
   * @throws ApiError
   */
  public static transactionsPartialUpdate(
    id: number,
    requestBody?: PatchedTransaction
  ): CancelablePromise<Transaction> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/transactions/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this transaction.
   * @returns void
   * @throws ApiError
   */
  public static transactionsDestroy(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/transactions/{id}/',
      path: {
        id: id,
      },
    });
  }
}
