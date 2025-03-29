/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { PatchedSalary } from '../models/PatchedSalary';
import type { Salary } from '../models/Salary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class IncomesService {
  /**
   * @returns Salary
   * @throws ApiError
   */
  public static incomesList(): CancelablePromise<Array<Salary>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/incomes/',
    });
  }
  /**
   * @param requestBody
   * @returns Salary
   * @throws ApiError
   */
  public static incomesCreate(requestBody: Salary): CancelablePromise<Salary> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/incomes/',
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this salary.
   * @returns Salary
   * @throws ApiError
   */
  public static incomesRetrieve(id: number): CancelablePromise<Salary> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/incomes/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A unique integer value identifying this salary.
   * @param requestBody
   * @returns Salary
   * @throws ApiError
   */
  public static incomesUpdate(id: number, requestBody: Salary): CancelablePromise<Salary> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/incomes/{id}/',
      path: {
        id: id,
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
  public static incomesPartialUpdate(
    id: number,
    requestBody?: PatchedSalary
  ): CancelablePromise<Salary> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/incomes/{id}/',
      path: {
        id: id,
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
  public static incomesDestroy(id: number): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: 'DELETE',
      url: '/api/incomes/{id}/',
      path: {
        id: id,
      },
    });
  }
}
