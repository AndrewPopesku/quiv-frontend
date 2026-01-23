import type { AnalysisResult, TranslationResult, WritingLabResult } from "@/types/vocabulary";

// Mock analysis result for English text
export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
    score: 72,
    grammarStatus: 'Needs Work',
    vocabularyStatus: 'Good',
    styleStatus: 'Good',
    suggestions: [
        {
            original: 'she done',
            replacement: 'she did',
            type: 'Grammar',
            reason: "The word 'done' is a past participle and usually requires an auxiliary verb like 'has'. For the simple past tense, 'did' should be used instead.",
        },
        {
            original: 'she done',
            replacement: 'she has done',
            type: 'Grammar',
            reason: "If you are referring to an action that has a present consequence, the present perfect 'has done' is more appropriate than the non-standard 'done'.",
        },
    ],
    tips: [],
    improvementTips: [
        "Remember that 'done' is the third form of the verb 'do' (do/did/done) and cannot stand alone as the main verb in the past tense.",
        "In some dialects, 'she done' is common, but in standard or professional English, it is considered a grammatical error.",
        "The phrase 'feel this way' is very natural and effective for expressing emotions.",
    ],
};

// Mock translation result for Ukrainian text
export const MOCK_TRANSLATION_RESULT: TranslationResult = {
    sourceLanguage: 'Ukrainian',
    translationNotes: [
        "The Ukrainian phrase 'по-своєму' is best translated as 'my way' or 'in my own way' depending on the level of formality.",
        "The word 'краще' (better) often implies a comparison; in English, it is helpful to ensure the context of what is being improved is clear.",
        "Ukrainian often omits the subject in the second clause ('так буде краще'), whereas English usually requires 'it' as a dummy subject ('it will be better').",
    ],
    variations: [
        {
            register: 'FORMAL',
            text: '"I intend to proceed according to my own judgment, as I believe it will be more effective."',
            description: "Uses formal vocabulary like 'intend' and 'judgment' to convey a professional tone.",
        },
        {
            register: 'CASUAL',
            text: '"I want to do it my way; it\'ll be better."',
            description: 'A direct and simple translation suitable for everyday conversation with friends or family.',
        },
        {
            register: 'CREATIVE',
            text: '"I\'m going to follow my own compass; it\'s the better path."',
            description: 'Uses metaphorical language for a more expressive and artistic tone.',
        },
    ],
};

// Sample texts for testing
export const SAMPLE_ENGLISH_TEXT = "Is it okay to feel this way after what she done to us?";
export const SAMPLE_UKRAINIAN_TEXT = "Я хочу зробити по своєму, так буде краще.";

// Helper function to simulate language detection
export function detectLanguage(text: string): { language: string; isEnglish: boolean } {
    const hasCyrillic = /[\u0400-\u04FF]/.test(text);
    if (hasCyrillic) {
        return { language: 'Ukrainian', isEnglish: false };
    }
    return { language: 'English', isEnglish: true };
}

// Mock analysis function (simulates API call)
export function analyzeText(text: string): WritingLabResult {
    const detection = detectLanguage(text);

    if (detection.isEnglish) {
        return { mode: 'analysis', data: MOCK_ANALYSIS_RESULT };
    } else {
        return { mode: 'translation', data: MOCK_TRANSLATION_RESULT };
    }
}
