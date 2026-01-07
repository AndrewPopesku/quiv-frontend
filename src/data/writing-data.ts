import type { Suggestion } from "@/types/vocabulary";

export const MOCK_SUGGESTIONS: Suggestion[] = [
    {
        original: "more better",
        replacement: "better",
        type: "Grammar",
        reason: "'Better' is already a comparative form. Using 'more' before it is redundant and grammatically incorrect.",
    },
    {
        original: "very unique",
        replacement: "unique",
        type: "Style",
        reason: "'Unique' means one of a kind and cannot be qualified. Something is either unique or it isn't.",
    },
];

export const WRITING_TIPS: string[] = [
    "Avoid redundant modifiers like \"very unique\" or \"more better\"",
    "Use active voice for more engaging writing",
    "Vary your sentence length for better rhythm"
];
