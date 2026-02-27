/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Language } from '../models/Language';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActivityService {
    /**
     * @returns Language
     * @throws ApiError
     */
    public static activityLanguagesList(): CancelablePromise<Array<Language>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/languages/',
        });
    }
}
