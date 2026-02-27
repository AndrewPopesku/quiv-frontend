/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserWord } from '../models/UserWord';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DictionaryService {
    /**
     * @returns UserWord
     * @throws ApiError
     */
    public static dictionaryWordsList(): CancelablePromise<Array<UserWord>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/words/',
        });
    }
    /**
     * @param requestBody
     * @returns UserWord
     * @throws ApiError
     */
    public static dictionaryWordsCreate(
        requestBody: UserWord,
    ): CancelablePromise<UserWord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dictionary/words/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this user word.
     * @returns UserWord
     * @throws ApiError
     */
    public static dictionaryWordsRetrieve(
        id: number,
    ): CancelablePromise<UserWord> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/words/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this user word.
     * @returns void
     * @throws ApiError
     */
    public static dictionaryWordsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/dictionary/words/{id}/',
            path: {
                'id': id,
            },
        });
    }
    /**
     * @param id A unique integer value identifying this user word.
     * @param requestBody
     * @returns UserWord
     * @throws ApiError
     */
    public static dictionaryWordsResetMasteryCreate(
        id: number,
        requestBody: UserWord,
    ): CancelablePromise<UserWord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dictionary/words/{id}/reset-mastery/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param term Term to be translated
     * @returns UserWord
     * @throws ApiError
     */
    public static dictionaryWordsTranslateRetrieve(
        term?: string,
    ): CancelablePromise<UserWord> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/words/translate/',
            query: {
                'term': term,
            },
        });
    }
}
