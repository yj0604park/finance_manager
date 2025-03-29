/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */

import type { AuthToken } from '../models/AuthToken';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthTokenService {
  /**
   * @param formData
   * @returns AuthToken
   * @throws ApiError
   */
  public static authTokenCreate(formData: AuthToken): CancelablePromise<AuthToken> {
    return __request(OpenAPI, {
      method: 'POST',
      url: '/api/auth-token/',
      formData: formData,
      mediaType: 'application/x-www-form-urlencoded',
    });
  }
}
