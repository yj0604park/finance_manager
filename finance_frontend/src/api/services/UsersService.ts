/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedUser } from '../models/PatchedUser';
import type { User } from '../models/User';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
  /**
   * @returns User
   * @throws ApiError
   */
  public static usersList(): CancelablePromise<Array<User>> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/users/',
    });
  }
  /**
   * @param id A unique integer value identifying this 사용자.
   * @returns User
   * @throws ApiError
   */
  public static usersRetrieve(id: number): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/users/{id}/',
      path: {
        id: id,
      },
    });
  }
  /**
   * @param id A unique integer value identifying this 사용자.
   * @param requestBody
   * @returns User
   * @throws ApiError
   */
  public static usersUpdate(id: number, requestBody?: User): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'PUT',
      url: '/api/users/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @param id A unique integer value identifying this 사용자.
   * @param requestBody
   * @returns User
   * @throws ApiError
   */
  public static usersPartialUpdate(id: number, requestBody?: PatchedUser): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'PATCH',
      url: '/api/users/{id}/',
      path: {
        id: id,
      },
      body: requestBody,
      mediaType: 'application/json',
    });
  }
  /**
   * @returns User
   * @throws ApiError
   */
  public static usersMeRetrieve(): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: 'GET',
      url: '/api/users/me/',
    });
  }
}
