# Writing Lab Implementation Plan

Based on the screenshots and current codebase analysis, here's a comprehensive plan to implement the updated Writing Lab feature.

---

## Overview

The Writing Lab needs to be enhanced to support:
1. **English text analysis** - Grammar, style, vocabulary feedback with naturalness score
2. **Translation mode** - Auto-detect non-English text and provide translations in multiple registers (formal, casual, creative)

---

## Current State vs Target State

### Current Implementation
- Static mock suggestions (2 hardcoded examples)
- Hardcoded naturalness score (72)
- Non-functional buttons (Clear, Analyze, Apply Fix, Copy)
- No API integration
- Single mode only (English analysis)

### Target Implementation (from screenshots)

**Screenshot 1 - English Analysis Mode:**
- Text: "Is it okay to feel this way after what she done to us?"
- Naturalness Score with circular gauge (shows "out of 100")
- Metrics: Grammar (Needs Work), Vocabulary (Good), Style (Good)
- Suggestions section with grammar corrections ("she done" → "she did" or "she has done")
- Improvement Tips panel with contextual advice
- Clear and Run Analysis buttons

**Screenshot 2 - Translation Mode:**
- Ukrainian text: "Я хочу зробити по своєму, так буде краще."
- Auto-detects source language (shows "Ukrainian" badge)
- "Source Detected" panel instead of "Naturalness Score"
- Translation Notes with linguistic explanations
- English Variations with three registers:
  - FORMAL: Professional tone translation
  - CASUAL: Everyday conversation translation
  - CREATIVE: Artistic/expressive translation
- Each variation has copy button and description

---

## Implementation Tasks

### Phase 1: Type System Updates

**File: `src/types/vocabulary.ts`**

Add new types for the dual-mode functionality:

```typescript
// Language detection result
interface LanguageDetection {
  language: string;
  confidence: number;
  isEnglish: boolean;
}

// Translation variation
interface TranslationVariation {
  register: 'FORMAL' | 'CASUAL' | 'CREATIVE';
  text: string;
  description: string;
}

// Translation result (for non-English input)
interface TranslationResult {
  sourceLanguage: string;
  translationNotes: string[];
  variations: TranslationVariation[];
}

// Update AnalysisResult to include improvement tips
interface AnalysisResult {
  score: number;
  grammarStatus: 'Excellent' | 'Good' | 'Needs Work';
  vocabularyStatus: 'Excellent' | 'Good' | 'Needs Work';
  styleStatus: 'Excellent' | 'Good' | 'Needs Work';
  suggestions: Suggestion[];
  tips: string[];           // Existing
  improvementTips: string[]; // NEW - contextual tips shown in right panel
}

// Combined writing lab result
type WritingLabResult =
  | { mode: 'analysis'; data: AnalysisResult }
  | { mode: 'translation'; data: TranslationResult };
```

---

### Phase 2: Mock Data

**File: `src/data/writing-lab-data.ts` (NEW)**

Create mock data file with sample analysis and translation results:

```typescript
// Mock analysis result for English text
export const MOCK_ANALYSIS_RESULT: AnalysisResult = {
  score: 72, // or dynamic based on suggestions
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
  tips: [], // legacy field
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
  // Simple heuristic: check for Cyrillic characters
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
```

Later, when you have a real API, you can replace these mock functions with actual API calls.

---

### Phase 3: UI Component Updates

**File: `src/pages/Writing.tsx`**

#### 3.1 State Management Updates
- Add `isLoading` state for analysis
- Add `analysisResult` state (type: `WritingLabResult | null`)
- Add `mode` state ('analysis' | 'translation')
- Remove hardcoded `naturalScore` state

#### 3.2 Header Updates
- Update description: "Smart writing assistance. Enter text in English to improve it, or any other language to translate it."
- Wire up Clear button to reset text and results
- Wire up "Run Analysis" button to trigger API call

#### 3.3 Left Panel Updates

**Text Input Area:**
- Keep existing textarea structure
- Add Copy button functionality (clipboard API)
- Keep word/character count

**Suggestions Section (Analysis Mode):**
- Update to match screenshot design:
  - Strikethrough original text
  - Arrow (→) separator
  - Green highlighted replacement in a badge/tag style
  - "GRAMMAR" label below the replacement
  - Expandable explanation with detailed reason
- Wire up "Apply Fix" to replace text in textarea

**English Variations Section (Translation Mode):**
- NEW component: `EnglishVariations`
- Three cards with register badges (FORMAL, CASUAL, CREATIVE)
- Each card shows:
  - Register badge (colored: gold for formal, blue for casual, purple for creative)
  - Translation text in quotes
  - Description in muted text
  - Copy button

#### 3.4 Right Panel Updates

**Analysis Mode - Naturalness Score Card:**
- Keep circular SVG gauge
- Update to show dynamic score from API
- Show "Needs Work" with red icon for Grammar when needed
- Show "Good" with green icon for Vocabulary/Style

**Analysis Mode - Improvement Tips Card:**
- Rename from "Quick Tips" to "Improvement Tips"
- Use orange bullet points (matching screenshot)
- Show contextual tips based on analysis results

**Translation Mode - Source Detected Card:**
- NEW component to replace Naturalness Score when in translation mode
- Shows detected language in a prominent badge (e.g., "Ukrainian")
- Subtitle: "We've automatically detected the language..."

**Translation Mode - Translation Notes Card:**
- Replaces Improvement Tips in translation mode
- Orange bullet points
- Shows linguistic notes about the translation

---

### Phase 4: Component Extraction

Create reusable components for cleaner code:

**File: `src/components/writing/NaturalnessScore.tsx`**
- Circular gauge component
- Score display
- Grammar/Vocabulary/Style metrics

**File: `src/components/writing/SourceDetected.tsx`**
- Language detection badge
- Description text

**File: `src/components/writing/SuggestionCard.tsx`**
- Expandable suggestion component
- Apply fix functionality

**File: `src/components/writing/TranslationVariation.tsx`**
- Register badge
- Translation text
- Copy functionality

**File: `src/components/writing/ImprovementTips.tsx`**
- Bulleted list of tips
- Supports both analysis tips and translation notes

---

### Phase 5: Styling Updates

**File: `src/index.css` or component styles**

Add styles for:
- Register badges (FORMAL: gold, CASUAL: blue, CREATIVE: purple)
- "Needs Work" red status indicator
- Source language badge styling
- Orange bullet points for tips

---

### Phase 6: Loading & Error States

Add proper UX for:
- Loading spinner during analysis
- Error handling for API failures
- Empty state when no text entered
- Disabled buttons during loading

---

## Data Flow

```
User enters text
    ↓
Click "Run Analysis"
    ↓
detectLanguage(text)
    ↓
┌─────────────────────────────────────┐
│ Is English?                         │
├──────────YES─────────┬──────NO──────┤
│                      │              │
│ analyzeText()        │ translateText()
│ Returns:             │ Returns:
│ - Naturalness score  │ - Source language
│ - Suggestions        │ - Translation notes
│ - Improvement tips   │ - 3 variations
│                      │              │
│ Show Analysis Mode   │ Show Translation Mode
└──────────────────────┴──────────────┘
```

---

## File Changes Summary

| File | Action | Description |
|------|--------|-------------|
| `src/types/vocabulary.ts` | MODIFY | Add new types for translation mode |
| `src/data/writing-lab-data.ts` | CREATE | Mock data and helper functions |
| `src/pages/Writing.tsx` | MODIFY | Main page with dual-mode support |
| `src/components/writing/NaturalnessScore.tsx` | CREATE | Score gauge component |
| `src/components/writing/SourceDetected.tsx` | CREATE | Language detection display |
| `src/components/writing/SuggestionCard.tsx` | CREATE | Suggestion item component |
| `src/components/writing/TranslationVariation.tsx` | CREATE | Translation card component |
| `src/components/writing/ImprovementTips.tsx` | CREATE | Tips/notes list component |
| `src/data/writing-data.ts` | MODIFY | Update or remove mock data |

---

## UI Comparison Checklist

### Analysis Mode (Screenshot 1)
- [ ] Header: "Writing Lab" with description
- [ ] Text input with Copy button
- [ ] Word count and character count
- [ ] Clear button (outline style)
- [ ] Run Analysis button (gold with sparkle icon)
- [ ] Suggestions section with count badge
- [ ] Suggestion cards with strikethrough → replacement format
- [ ] GRAMMAR/STYLE/VOCABULARY labels
- [ ] Expandable explanation
- [ ] Naturalness Score circular gauge
- [ ] Grammar/Vocabulary/Style status indicators
- [ ] "Needs Work" in red with warning icon
- [ ] "Good" in green with check icon
- [ ] Improvement Tips with orange bullets

### Translation Mode (Screenshot 2)
- [ ] Same header and text input
- [ ] Source Detected panel with language badge
- [ ] "Ukrainian" (or detected language) in gold badge
- [ ] Translation Notes with orange bullets
- [ ] English Variations section
- [ ] FORMAL card with description and copy
- [ ] CASUAL card with description and copy
- [ ] CREATIVE card with description and copy
- [ ] Register badges with appropriate colors

---

## Implementation Order

1. **Types** - Update type definitions first
2. **Mock Data** - Create `src/data/writing-lab-data.ts` with sample data and helper functions
3. **Main Page Logic** - Update Writing.tsx with new state management and conditional rendering
4. **Analysis Mode UI** - Complete the English analysis UI
5. **Translation Mode UI** - Implement the translation mode components
6. **Styling** - Polish all visual elements
7. **Testing** - Test both modes with various inputs

---

## Notes

- The screenshots show the app name as "Levise" in the sidebar - this may be a product rename consideration
- Dictionary widget shows "247 / 312 words" and "79% mastered" - this is a separate feature, not part of Writing Lab
- The "Device" text in header appears to be a device indicator, not related to Writing Lab functionality
