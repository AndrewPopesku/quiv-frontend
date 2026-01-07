export interface CinemaExample {
    title: string;
    timestamp: string;
    imageUrl: string;
}

export interface Definition {
    partOfSpeech: string;
    text: string;
    example: string;
    synonyms: string[];
    isInformal?: boolean;
}

export interface Word {
    id: string;
    term: string;
    phonetic: string;
    definitions: Definition[];
    cinemaExamples: CinemaExample[];
    mastery: number; // 0-100
}

export enum ViewState {
    HOME = 'HOME',
    DICTIONARY = 'DICTIONARY',
    SAVED_WORDS = 'SAVED_WORDS',
    WRITING_LAB = 'WRITING_LAB',
    EXERCISE_SENTENCE = 'EXERCISE_SENTENCE',
    EXERCISE_FLASHCARDS = 'EXERCISE_FLASHCARDS',
    EXERCISE_CHOICE = 'EXERCISE_CHOICE',
    EXERCISE_MATCHING = 'EXERCISE_MATCHING'
}

export interface Suggestion {
    original: string;
    replacement: string;
    type: 'Grammar' | 'Style' | 'Vocabulary';
    reason: string;
}

export interface AnalysisResult {
    score: number;
    grammarStatus: 'Excellent' | 'Good' | 'Needs Work';
    vocabularyStatus: 'Excellent' | 'Good' | 'Needs Work';
    styleStatus: 'Excellent' | 'Good' | 'Needs Work';
    suggestions: Suggestion[];
    tips: string[];
}
