/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Definition } from './Definition';
import type { NuancedRelatedWord } from './NuancedRelatedWord';
export type Word = {
    readonly id: number;
    term: string;
    pronunciation: string;
    definitions: Array<Definition>;
    nuances: Array<NuancedRelatedWord>;
};

