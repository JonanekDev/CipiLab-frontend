/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { StatusResponseDto } from '../models/StatusResponseDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class StatusService {
    /**
     * @returns StatusResponseDto
     * @throws ApiError
     */
    public static statusControllerGetStatus(): CancelablePromise<StatusResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/status',
        });
    }
}
