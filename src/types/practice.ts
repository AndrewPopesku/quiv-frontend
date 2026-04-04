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
