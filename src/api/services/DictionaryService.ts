/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Definition } from '../models/Definition';
import type { Language } from '../models/Language';
import type { NuancedRelatedWord } from '../models/NuancedRelatedWord';
import type { UserDefinition } from '../models/UserDefinition';
import type { UserWord } from '../models/UserWord';
import type { UserWordList } from '../models/UserWordList';
import type { WordBasic } from '../models/WordBasic';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DictionaryService {
    /**
     * @returns Language
     * @throws ApiError
     */
    public static dictionaryLanguagesList(): CancelablePromise<Array<Language>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/languages/',
        });
    }
    /**
     * @returns UserWordList
     * @throws ApiError
     */
    public static dictionaryUserWordsList(): CancelablePromise<Array<UserWordList>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/user_words/',
        });
    }
    /**
     * @param requestBody
     * @returns UserWord
     * @throws ApiError
     */
    public static dictionaryUserWordsCreate(
        requestBody: UserWord,
    ): CancelablePromise<UserWord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dictionary/user_words/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this user word.
     * @returns void
     * @throws ApiError
     */
    public static dictionaryUserWordsDestroy(
        id: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/dictionary/user_words/{id}/',
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
    public static dictionaryUserWordsResetMasteryCreate(
        id: number,
        requestBody: UserWord,
    ): CancelablePromise<UserWord> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dictionary/user_words/{id}/reset-mastery/',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param userWordPk
     * @returns UserDefinition
     * @throws ApiError
     */
    public static dictionaryUserWordsLearnedDefinitionsList(
        userWordPk: number,
    ): CancelablePromise<Array<UserDefinition>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/user_words/{user_word_pk}/learned_definitions/',
            path: {
                'user_word_pk': userWordPk,
            },
        });
    }
    /**
     * @param userWordPk
     * @param requestBody
     * @returns UserDefinition
     * @throws ApiError
     */
    public static dictionaryUserWordsLearnedDefinitionsCreate(
        userWordPk: number,
        requestBody: UserDefinition,
    ): CancelablePromise<UserDefinition> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/dictionary/user_words/{user_word_pk}/learned_definitions/',
            path: {
                'user_word_pk': userWordPk,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param id A unique integer value identifying this user definition.
     * @param userWordPk
     * @returns void
     * @throws ApiError
     */
    public static dictionaryUserWordsLearnedDefinitionsDestroy(
        id: number,
        userWordPk: number,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/dictionary/user_words/{user_word_pk}/learned_definitions/{id}/',
            path: {
                'id': id,
                'user_word_pk': userWordPk,
            },
        });
    }
    /**
     * @param wordPk
     * @returns Definition
     * @throws ApiError
     */
    public static dictionaryWordsDefinitionsLookupRetrieve(
        wordPk: number,
    ): CancelablePromise<Definition> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/words/{word_pk}/definitions/lookup/',
            path: {
                'word_pk': wordPk,
            },
        });
    }
    /**
     * @param wordPk
     * @returns NuancedRelatedWord
     * @throws ApiError
     */
    public static dictionaryWordsNuancesLookupRetrieve(
        wordPk: number,
    ): CancelablePromise<NuancedRelatedWord> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/words/{word_pk}/nuances/lookup/',
            path: {
                'word_pk': wordPk,
            },
        });
    }
    /**
     * @param wordPk
     * @param definitionPk
     * @returns MovieClip[]
     * @throws ApiError
     */
    public static dictionaryWordsDefinitionsClipsList(
        wordPk: number,
        definitionPk: number,
    ): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/words/{word_pk}/definitions/{definition_pk}/clips/',
            path: {
                'word_pk': wordPk,
                'definition_pk': definitionPk,
            },
        });
    }
    /**
     * @param term Term to be looked up
     * @returns WordBasic
     * @throws ApiError
     */
    public static dictionaryWordsLookupRetrieve(
        term?: string,
    ): CancelablePromise<WordBasic> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dictionary/words/lookup/',
            query: {
                'term': term,
            },
        });
    }
}
