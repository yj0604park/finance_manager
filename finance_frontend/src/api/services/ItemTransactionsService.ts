/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemTransaction } from '../models/ItemTransaction';
import type { PatchedItemTransaction } from '../models/PatchedItemTransaction';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ItemTransactionsService {
  /**
   * @returns ItemTransaction
   * @throws ApiError
   */
  public static itemTransactionsList(): CancelablePromise<Array<ItemTransaction>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/item-transactions/',
    });
  }
  /**
   * @param requestBody
   * @returns ItemTransaction
   * @throws ApiError
   */
  public static itemTransactionsCreate(
    requestBody: ItemTransaction
  ): CancelablePromise<ItemTransaction> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/item-transactions/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this item transaction.
   * @returns ItemTransaction
   * @throws ApiError
   */
  public static itemTransactionsRetrieve(id: number): CancelablePromise<ItemTransaction> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/item-transactions/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A unique integer value identifying this item transaction.
   * @param requestBody
   * @returns ItemTransaction
   * @throws ApiError
   */
  public static itemTransactionsUpdate(
    id: number,
    requestBody: ItemTransaction
  ): CancelablePromise<ItemTransaction> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/item-transactions/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this item transaction.
   * @param requestBody
   * @returns ItemTransaction
   * @throws ApiError
   */
  public static itemTransactionsPartialUpdate(
    id: number,
    requestBody?: PatchedItemTransaction
  ): CancelablePromise<ItemTransaction> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/item-transactions/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this item transaction.
   * @returns void
   * @throws ApiError
   */
  public static itemTransactionsDestroy(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/item-transactions/{id}/',
      path: {
        id: id,
      },
    });
  }
}
