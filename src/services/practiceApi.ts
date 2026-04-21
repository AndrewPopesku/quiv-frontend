import axios from "axios";
import type {
  CreateSessionPayload,
  SessionWithItems,
  PracticeItem,
  AnswerResult,
  SentenceForgeStartResponse,
  SentenceForgeHintResponse,
  SentenceForgeEvaluation,
  SentenceForgeSessionSummary,
} from "@/types/practice";

function auth() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const practiceApi = {
  createSession: (payload: CreateSessionPayload) =>
    axios.post<SessionWithItems>("/api/practice/sessions/", payload, {
      headers: auth(),
    }),

  getItems: (sessionId: number) =>
    axios.get<PracticeItem[]>(`/api/practice/sessions/${sessionId}/items/`, {
      headers: auth(),
    }),

  submitAnswer: (itemId: number, isCorrect: boolean) =>
    axios.post<AnswerResult>(
      `/api/practice/items/${itemId}/answer/`,
      { is_correct: isCorrect },
      { headers: auth() },
    ),

  // Sentence Forge
  sentenceForgeStart: (language: string) =>
    axios.post<SentenceForgeStartResponse>(
      "/api/practice/sentence-forge/start/",
      { language },
      { headers: auth() },
    ),

  sentenceForgeHint: (sessionId: number, hintType: string) =>
    axios.post<SentenceForgeHintResponse>(
      `/api/practice/sentence-forge/${sessionId}/hint/`,
      { hint_type: hintType },
      { headers: auth() },
    ),

  sentenceForgeSubmit: (sessionId: number, sentence: string) =>
    axios.post<SentenceForgeEvaluation>(
      `/api/practice/sentence-forge/${sessionId}/submit/`,
      { sentence },
      { headers: auth() },
    ),

  sentenceForgeEnd: (sessionId: number) =>
    axios.post<{ session_summary: SentenceForgeSessionSummary }>(
      `/api/practice/sentence-forge/${sessionId}/end/`,
      {},
      { headers: auth() },
    ),
};
