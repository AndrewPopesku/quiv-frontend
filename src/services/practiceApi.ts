import axios from "axios";
import type {
  CreateSessionPayload,
  SessionWithItems,
  PracticeItem,
  AnswerResult,
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

  submitAnswer: (itemId: number, answer: unknown) =>
    axios.post<AnswerResult>(
      `/api/practice/items/${itemId}/answer/`,
      { answer },
      { headers: auth() },
    ),
};
