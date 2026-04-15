export type ExerciseType =
  | "context_fill"
  | "sentence_forge"
  | "lyric_lab"
  | "scene_detective"
  | "word_rivals"
  | "story_weaver"
  | "whisper_challenge"
  | "memory_palace"
  | "duo_duel"
  | "scenario_immersion"
  | "vocab_archaeology"
  | "word_network"
  | "ghost_writer"
  | "dream_journal";

export type SessionMode = "mixed" | "streak_sprint" | ExerciseType;

export interface PracticeSession {
  id: number;
  mode: SessionMode;
  total_items: number;
  correct_count: number;
  created_at: string;
  completed_at: string | null;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface PracticeItem {
  id: number;
  session: number;
  exercise_type: ExerciseType;
  prompt: string;
  payload: Record<string, any>;
  options: MCQOption[];
  correct_answer: { type: string; value: unknown };
  created_at: string;
  answered_at: string | null;
  is_correct: boolean | null;
}

export interface AnswerResult {
  is_correct: boolean;
  correct_answer: {
    type: string;
    value: any;
    target_word?: string;
    required_words?: string[];
    original_text?: string;
    min_words?: number;
  };
  mastery: number;
}

export interface CreateSessionPayload {
  mode: SessionMode;
  items_count: number;
  song_query?: string;
}

export interface SessionWithItems {
  session: PracticeSession;
  items: PracticeItem[];
}

// ---------------------------------------------------------------------------
// Sentence Forge types
// ---------------------------------------------------------------------------

export interface SentenceForgeTargetWord {
  id: number;
  word: string;
  definition: string;
  part_of_speech: string;
}

export interface SentenceForgeItem {
  item_id: number;
  prompt: string;
  target_words: SentenceForgeTargetWord[];
  hints_available: string[];
}

export interface GrammarError {
  span: [number, number];
  original: string;
  correction: string;
  error_type: string;
  explanation: string;
}

export interface WordUsageDetail {
  word: string;
  used: boolean;
  correct_sense: boolean;
  form_used: string;
  notes: string;
}

export interface NaturalnessNote {
  span: [number, number];
  issue: string;
  suggestion: string;
}

export interface SentenceForgeEvaluation {
  grammar: { score: number; errors: GrammarError[] };
  vocabulary: { score: number; word_usage: WordUsageDetail[] };
  naturalness: { score: number; notes: NaturalnessNote[] };
  context: { score: number; notes: string };
  native_version: { text: string; notes: string };
  next_sentence?: SentenceForgeItem;
  session_complete?: boolean;
}

export interface SentenceForgeStartResponse {
  session_id: number;
  difficulty: string;
  sentence: SentenceForgeItem;
}

export interface SentenceForgeHintResponse {
  hint: string;
}

export interface SentenceForgeSessionSummary {
  sentences_completed: number;
  avg_grammar: number;
  avg_naturalness: number;
  avg_vocabulary: number;
  avg_context: number;
  words_reviewed: string[];
  difficulty: string;
}
