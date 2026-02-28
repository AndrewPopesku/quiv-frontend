/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PatchedUser } from '../models/PatchedUser';
import type { TokenObtainPair } from '../models/TokenObtainPair';
import type { TokenRefresh } from '../models/TokenRefresh';
import type { User } from '../models/User';
import type { UserRetrieve } from '../models/UserRetrieve';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UserService {
    /**
     * @returns void
     * @throws ApiError
     */
    public static userDeleteDestroy(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/user/delete/',
        });
    }
    /**
     * @returns UserRetrieve
     * @throws ApiError
     */
    public static userMeRetrieve(): CancelablePromise<UserRetrieve> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/me/',
        });
    }
    /**
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public static userMeUpdate(
        requestBody: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/user/me/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public static userMePartialUpdate(
        requestBody?: PatchedUser,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/user/me/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * @param requestBody
     * @returns User
     * @throws ApiError
     */
    public static userRegisterCreate(
        requestBody: User,
    ): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/register/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Takes a set of user credentials and returns an access and refresh JSON web
     * token pair to prove the authentication of those credentials.
     * @param requestBody
     * @returns TokenObtainPair
     * @throws ApiError
     */
    public static userTokenCreate(
        requestBody: TokenObtainPair,
    ): CancelablePromise<TokenObtainPair> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/token/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Takes a refresh type JSON web token and returns an access type JSON web
     * token if the refresh token is valid.
     * @param requestBody
     * @returns TokenRefresh
     * @throws ApiError
     */
    public static userTokenRefreshCreate(
        requestBody: TokenRefresh,
    ): CancelablePromise<TokenRefresh> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/token/refresh/',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
