/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyStats } from '../models/DailyStats';
import type { Language } from '../models/Language';
import type { WordOfTheDay } from '../models/WordOfTheDay';
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
    /**
     * @returns DailyStats
     * @throws ApiError
     */
    public static activityStatsRetrieve(): CancelablePromise<DailyStats> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/stats/',
        });
    }
    /**
     * @param date The user's local date in YYYY-MM-DD format
     * @returns WordOfTheDay
     * @throws ApiError
     */
    public static activityWordOfTheDayRetrieve(
        date: string,
    ): CancelablePromise<WordOfTheDay> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/activity/word-of-the-day/',
            query: {
                'date': date,
            },
        });
    }
}
