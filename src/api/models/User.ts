/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Profile } from './Profile';
export type User = {
    readonly id: number;
    email: string;
    username: string;
    password: string;
    profile: Profile;
    /**
     * Designates whether the user can log into this admin site.
     */
    readonly is_staff: boolean;
};

