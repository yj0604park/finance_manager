/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Exchange } from '../models/Exchange';
import type { PatchedExchange } from '../models/PatchedExchange';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ExchangesService {
  /**
   * @returns Exchange
   * @throws ApiError
   */
  public static exchangesList(): CancelablePromise<Array<Exchange>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/exchanges/',
    });
  }
  /**
   * @param requestBody
   * @returns Exchange
   * @throws ApiError
   */
  public static exchangesCreate(requestBody: Exchange): CancelablePromise<Exchange> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/exchanges/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this exchange.
   * @returns Exchange
   * @throws ApiError
   */
  public static exchangesRetrieve(id: number): CancelablePromise<Exchange> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/exchanges/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A unique integer value identifying this exchange.
   * @param requestBody
   * @returns Exchange
   * @throws ApiError
   */
  public static exchangesUpdate(id: number, requestBody: Exchange): CancelablePromise<Exchange> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/exchanges/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this exchange.
   * @param requestBody
   * @returns Exchange
   * @throws ApiError
   */
  public static exchangesPartialUpdate(
    id: number,
    requestBody?: PatchedExchange
  ): CancelablePromise<Exchange> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/exchanges/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this exchange.
   * @returns void
   * @throws ApiError
   */
  public static exchangesDestroy(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/exchanges/{id}/',
      path: {
        id: id,
      },
    });
  }
}
