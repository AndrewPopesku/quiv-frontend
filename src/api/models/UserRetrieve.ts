/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProfileRetrieve } from './ProfileRetrieve';
export type UserRetrieve = {
    readonly id: number;
    email: string;
    username: string;
    password: string;
    readonly profile: ProfileRetrieve;
    /**
     * Designates whether the user can log into this admin site.
     */
    readonly is_staff: boolean;
};

