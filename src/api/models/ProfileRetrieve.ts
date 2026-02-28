/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Language } from './Language';
export type ProfileRetrieve = {
    readonly id: number;
    daily_goal?: number;
    timezone: string;
    readonly current_streak: number;
    readonly last_streak_date: string | null;
    readonly longest_streak: number;
    readonly user_language: Language;
    readonly target_language: Language;
};

