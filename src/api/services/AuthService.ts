/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginReqDto } from '../models/LoginReqDto';
import type { LoginResDto } from '../models/LoginResDto';
import type { TokenRefreshReqDto } from '../models/TokenRefreshReqDto';
import type { TokenRefreshResDto } from '../models/TokenRefreshResDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * @param requestBody
     * @returns LoginResDto
     * @throws ApiError
     */
    public static authControllerLogin(
        requestBody: LoginReqDto,
    ): CancelablePromise<LoginResDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns TokenRefreshResDto
     * @throws ApiError
     */
    public static authControllerRefresh(
        requestBody: TokenRefreshReqDto,
    ): CancelablePromise<TokenRefreshResDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static authControllerLogout(
        requestBody: TokenRefreshReqDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
