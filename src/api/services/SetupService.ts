/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InitDashboardReqDto } from '../models/InitDashboardReqDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SetupService {
    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static setupControllerInitializeSetup(
        requestBody: InitDashboardReqDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/setup/init',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
