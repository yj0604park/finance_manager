/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedRetailer } from '../models/PatchedRetailer';
import type { Retailer } from '../models/Retailer';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RetailersService {
  /**
   * @returns Retailer
   * @throws ApiError
   */
  public static retailersList(): CancelablePromise<Array<Retailer>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/retailers/',
    });
  }
  /**
   * @param requestBody
   * @returns Retailer
   * @throws ApiError
   */
  public static retailersCreate(
    requestBody: Retailer,
  ): CancelablePromise<Retailer> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/retailers/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this retailer.
   * @returns Retailer
   * @throws ApiError
   */
  public static retailersRetrieve(
    id: number,
  ): CancelablePromise<Retailer> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/retailers/{id}/',
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
  public static retailersUpdate(
    id: number,
    requestBody: Retailer,
  ): CancelablePromise<Retailer> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/retailers/{id}/',
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
  public static retailersPartialUpdate(
    id: number,
    requestBody?: PatchedRetailer,
  ): CancelablePromise<Retailer> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/retailers/{id}/',
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
  public static retailersDestroy(
    id: number,
  ): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/retailers/{id}/',
      path: {
        'id': id,
      },
    });
  }
}
