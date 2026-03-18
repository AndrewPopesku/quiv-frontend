/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Analysis } from '../models/Analysis';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PracticeService {
    /**
     * @param requestBody
     * @returns Analysis
     * @throws ApiError
     */
    public static practiceAnalyzeCreate(
        requestBody: Analysis,
    ): CancelablePromise<Analysis> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/practice/analyze/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
