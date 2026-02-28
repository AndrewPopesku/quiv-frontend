/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PracticeService {
    /**
     * @param text Text to analyze
     * @returns any No response body
     * @throws ApiError
     */
    public static practiceAnalyzeCreate(
        text?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/practice/analyze/',
            query: {
                'text': text,
            },
        });
    }
}
