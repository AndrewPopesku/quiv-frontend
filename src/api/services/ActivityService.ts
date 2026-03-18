/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DailyStats } from '../models/DailyStats';
import type { WordOfTheDay } from '../models/WordOfTheDay';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ActivityService {
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
     * @param date Date for which to retrieve the word of the day (YYYY-MM-DD)
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
