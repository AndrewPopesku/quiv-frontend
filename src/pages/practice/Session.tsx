import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { practiceApi } from "@/services/practiceApi";
import type { PracticeItem, PracticeSession, AnswerResult } from "@/types/practice";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  Trophy,
  Loader2,
  Timer,
  ArrowLeftRight,
  Music,
  Brain,
  Mic,
  Shuffle,
  PenLine,
  BookOpen,
  Network,
  Ghost,
  Moon,
  Sparkles,
  ScanSearch,
  Film,
  Zap,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------


function exerciseLabel(type: string): string {
  const map: Record<string, string> = {
    context_fill: "Context Roulette",
    sentence_forge: "Sentence Forge",
    lyric_lab: "Lyric Lab",
    scene_detective: "Scene Detective",
    word_rivals: "Word Rivals",
    story_weaver: "Story Weaver",
    whisper_challenge: "Whisper Challenge",
    memory_palace: "Memory Palace",
    duo_duel: "Duo Duel",
    scenario_immersion: "AI Scenario",
    vocab_archaeology: "Vocab Archaeology",
    word_network: "Word Network",
    ghost_writer: "Ghost Writer",
    dream_journal: "Dream Journal",
  };
  return map[type] ?? type;
}

function exerciseIcon(type: string) {
  const map: Record<string, React.ReactNode> = {
    context_fill: <Shuffle className="w-4 h-4" />,
    sentence_forge: <PenLine className="w-4 h-4" />,
    lyric_lab: <Music className="w-4 h-4" />,
    scene_detective: <Film className="w-4 h-4" />,
    word_rivals: <Zap className="w-4 h-4" />,
    story_weaver: <BookOpen className="w-4 h-4" />,
    whisper_challenge: <Mic className="w-4 h-4" />,
    memory_palace: <Brain className="w-4 h-4" />,
    duo_duel: <ArrowLeftRight className="w-4 h-4" />,
    scenario_immersion: <Sparkles className="w-4 h-4" />,
    vocab_archaeology: <ScanSearch className="w-4 h-4" />,
    word_network: <Network className="w-4 h-4" />,
    ghost_writer: <Ghost className="w-4 h-4" />,
    dream_journal: <Moon className="w-4 h-4" />,
  };
  return map[type] ?? null;
}

function exerciseBadgeColor(type: string): string {
  const map: Record<string, string> = {
    context_fill: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    sentence_forge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    lyric_lab: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    scene_detective: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    word_rivals: "bg-red-500/20 text-red-400 border-red-500/30",
    story_weaver: "bg-green-500/20 text-green-400 border-green-500/30",
    whisper_challenge: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    memory_palace: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    duo_duel: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    scenario_immersion: "bg-pink-500/20 text-pink-400 border-pink-500/30",
    vocab_archaeology: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    word_network: "bg-teal-500/20 text-teal-400 border-teal-500/30",
    ghost_writer: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    dream_journal: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  };
  return map[type] ?? "bg-muted text-muted-foreground border-border";
}

function roundTypeBadgeColor(roundType: string): string {
  const map: Record<string, string> = {
    speed_translation: "bg-red-500/20 text-red-400 border-red-500/30",
    context_clash: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    reverse_challenge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    spelling_showdown: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  };
  return map[roundType] ?? "bg-muted text-muted-foreground border-border";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ExerciseContext({ item }: { item: PracticeItem }) {
  const { exercise_type, prompt, payload } = item;

  switch (exercise_type) {
    case "context_fill":
      return (
        <div className="space-y-3">
          <p className="text-xl font-medium leading-relaxed text-foreground">{prompt}</p>
          {payload.translation_hint && (
            <span className="text-sm text-muted-foreground italic">{payload.translation_hint}</span>
          )}
        </div>
      );

    case "sentence_forge":
      return (
        <div className="space-y-4">
          {payload.situational_prompt && (
            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
              <p className="text-sm text-muted-foreground leading-relaxed">{payload.situational_prompt}</p>
            </div>
          )}
          {Array.isArray(payload.required_words) && payload.required_words.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Required words</p>
              <div className="flex flex-wrap gap-2">
                {payload.required_words.map((w: string) => (
                  <Badge key={w} variant="outline" className="text-orange-400 border-orange-500/30 bg-orange-500/10 font-mono">
                    {w}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case "lyric_lab":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-purple-400">
            <Music className="w-5 h-5" />
            {payload.song_title && (
              <span className="text-sm font-medium">
                {payload.song_title}{payload.artist ? ` — ${payload.artist}` : ""}
              </span>
            )}
          </div>
          <p className="text-xl font-medium leading-relaxed text-foreground font-mono">{prompt}</p>
        </div>
      );

    case "scene_detective":
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
          <div className="p-6 rounded-2xl bg-muted/30 border border-border">
            <Film className="w-16 h-16 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-semibold text-foreground">Scene Detective</p>
            <p className="text-sm text-muted-foreground mt-1">Coming Soon — video clip exercises are on the way!</p>
          </div>
        </div>
      );

    case "word_rivals": {
      const roundType: string = payload.round_type ?? "";
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {roundType && (
              <Badge className={cn("text-xs font-semibold border", roundTypeBadgeColor(roundType))}>
                {roundType.replace(/_/g, " ")}
              </Badge>
            )}
          </div>
          <p className="text-xl font-medium leading-relaxed text-foreground">{prompt}</p>
        </div>
      );
    }

    case "story_weaver":
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
            <p className="text-base leading-relaxed text-foreground">{payload.story_opening ?? prompt}</p>
          </div>
          {Array.isArray(payload.required_words) && payload.required_words.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Required words</p>
              <div className="flex flex-wrap gap-2">
                {payload.required_words.map((w: string) => (
                  <Badge key={w} variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10 font-mono">
                    {w}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case "whisper_challenge":
      return (
        <div className="space-y-4">
          {payload.translation_hint && (
            <p className="text-sm text-muted-foreground">
              Translation: <span className="italic">{payload.translation_hint}</span>
            </p>
          )}
          <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/20 font-mono text-2xl tracking-widest text-center">
            {payload.degraded_word ?? prompt}
          </div>
          <p className="text-xs text-muted-foreground text-center">Spell the full word</p>
        </div>
      );

    case "memory_palace":
      return (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
            {payload.room && (
              <p className="text-sm text-muted-foreground">
                Room: <span className="font-semibold text-foreground">{payload.room}</span>
              </p>
            )}
            {payload.object && (
              <p className="text-sm text-muted-foreground">
                Object: <span className="font-semibold text-foreground">{payload.object}</span>
              </p>
            )}
          </div>
          {payload.mnemonic_hint && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border">
              <Brain className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm italic text-muted-foreground">{payload.mnemonic_hint}</p>
            </div>
          )}
          <p className="text-xl font-medium text-foreground">{prompt}</p>
        </div>
      );

    case "duo_duel": {
      // Backend sends "l1_to_l2" or "l2_to_l1"
      const direction: string = payload.direction ?? "l1_to_l2";
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4 text-cyan-400" />
            <span className="text-sm text-muted-foreground">
              {direction === "l1_to_l2" ? "Translation → Term" : "Term → Translation"}
            </span>
          </div>
          <p className="text-3xl font-bold text-foreground">{prompt}</p>
        </div>
      );
    }

    case "scenario_immersion":
      return (
        <div className="space-y-4">
          {payload.scenario && (
            <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
              <p className="text-sm text-muted-foreground leading-relaxed">{payload.scenario}</p>
            </div>
          )}
          {Array.isArray(payload.required_words) && payload.required_words.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Required words</p>
              <div className="flex flex-wrap gap-2">
                {payload.required_words.map((w: string) => (
                  <Badge key={w} variant="outline" className="text-pink-400 border-pink-500/30 bg-pink-500/10 font-mono text-xs">
                    {w}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case "vocab_archaeology":
      return (
        <div className="space-y-3">
          <div className="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {payload.redacted_text ?? prompt}
          </div>
          {payload.part_of_speech && (
            <p className="text-sm text-muted-foreground">
              Part of speech: <span className="italic">{payload.part_of_speech}</span>
            </p>
          )}
        </div>
      );

    case "word_network":
      return (
        <div className="space-y-3">
          <p className="text-base text-foreground">{prompt}</p>
          {Array.isArray(payload.all_synonyms) && payload.all_synonyms.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Hint — related: {(payload.all_synonyms as string[]).slice(0, 2).join(", ")}…
            </div>
          )}
        </div>
      );

    case "ghost_writer":
      return (
        <div className="space-y-4">
          <p className="text-base font-medium text-foreground">{prompt}</p>
          {payload.original_sentence && (
            <div className="p-4 rounded-xl bg-muted/20 border border-border/60">
              <p className="text-sm leading-relaxed text-muted-foreground italic">"{payload.original_sentence}"</p>
            </div>
          )}
        </div>
      );

    case "dream_journal":
      return (
        <div className="space-y-4">
          <p className="text-xl font-medium text-foreground leading-relaxed">{prompt}</p>
          {Array.isArray(payload.suggested_words) && payload.suggested_words.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Suggested words</p>
              <div className="flex flex-wrap gap-2">
                {(payload.suggested_words as string[]).map((word) => (
                  <Badge
                    key={word}
                    variant="outline"
                    className="text-violet-400 border-violet-500/30 bg-violet-500/10 text-xs"
                  >
                    {word}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    default:
      return (
        <p className="text-xl font-medium text-foreground leading-relaxed">{prompt}</p>
      );
  }
}

// ---------------------------------------------------------------------------
// Feedback correct_answer display
// ---------------------------------------------------------------------------

function CorrectAnswerDisplay({ correct_answer }: { correct_answer: AnswerResult["correct_answer"] }) {
  const { type, value } = correct_answer;

  if (type === "text_list" && Array.isArray(value)) {
    return (
      <span>
        Answer: <span className="font-semibold text-foreground">{value.join(" / ")}</span>
      </span>
    );
  }
  if (type === "words_included" && Array.isArray(value)) {
    return (
      <span>
        Required words: <span className="font-semibold text-foreground">{value.join(", ")}</span>
      </span>
    );
  }
  if (type === "any_word_included" && Array.isArray(value)) {
    return (
      <span>
        Use any of: <span className="font-semibold text-foreground">{value.join(", ")}</span>
      </span>
    );
  }
  if (type === "bool") {
    return (
      <span>
        Answer: <span className="font-semibold text-foreground">{value ? "True" : "False"}</span>
      </span>
    );
  }
  // text / word_id / definition_id
  return (
    <span>
      Answer: <span className="font-semibold text-foreground">{String(value)}</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Timer display
// ---------------------------------------------------------------------------

function TimerDisplay({ timeLeft }: { timeLeft: number }) {
  const pct = (timeLeft / 30) * 100;
  const color =
    timeLeft > 15
      ? "text-green-400"
      : timeLeft > 8
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="flex items-center gap-2">
      <Timer className={cn("w-4 h-4", color)} />
      <span className={cn("text-sm font-bold tabular-nums", color)}>{timeLeft}s</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000",
            timeLeft > 15 ? "bg-green-400" : timeLeft > 8 ? "bg-yellow-400" : "bg-red-400"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Session() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const locationState = location.state as { items: PracticeItem[]; session: PracticeSession } | null;

  const [items, setItems] = useState<PracticeItem[]>(locationState?.items ?? []);
  const [session] = useState<PracticeSession | null>(locationState?.session ?? null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<AnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [results, setResults] = useState<Array<{ is_correct: boolean }>>([]);

  // Fetch items if not provided via location state
  const { isLoading } = useQuery({
    queryKey: ["practiceItems", sessionId],
    queryFn: async () => {
      const res = await practiceApi.getItems(Number(sessionId));
      setItems(res.data);
      return res.data;
    },
    enabled: !locationState && !!sessionId,
  });

  const currentItem = items[currentIndex] as PracticeItem | undefined;

  // Word rivals countdown timer
  useEffect(() => {
    if (!currentItem || currentItem.exercise_type !== "word_rivals" || feedback) return;
    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Auto-submit when word_rivals timer hits 0
  useEffect(() => {
    if (timeLeft === 0 && !feedback && currentItem?.exercise_type === "word_rivals") {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  async function handleSubmit() {
    if (isSubmitting || !currentItem) return;

    let answerValue: unknown = answer;
    if (currentItem.options.length > 0) {
      answerValue = selectedOption;
    }

    setIsSubmitting(true);
    try {
      const res = await practiceApi.submitAnswer(currentItem.id, answerValue);
      setFeedback(res.data);
      setResults((prev) => [...prev, { is_correct: res.data.is_correct }]);
    } catch {
      // silently fail
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= items.length) {
      setCurrentIndex(items.length);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setAnswer("");
      setSelectedOption(null);
      setFeedback(null);
      setTimeLeft(null);
    }
  }

  const isLastItem = currentIndex === items.length - 1;

  // Decide input type
  function getInputType(): "short" | "long" | "mcq" | "none" {
    if (!currentItem) return "none";
    const { exercise_type, options } = currentItem;
    if (exercise_type === "scene_detective") return "none";
    if (options.length > 0) return "mcq";
    const longTypes = [
      "sentence_forge",
      "story_weaver",
      "scenario_immersion",
      "ghost_writer",
      "dream_journal",
    ];
    if (exercise_type === "duo_duel") {
      const direction = currentItem.payload.direction ?? "to_translation";
      return direction === "to_translation" ? "long" : "short";
    }
    return longTypes.includes(exercise_type) ? "long" : "short";
  }

  const submitDisabled =
    isSubmitting ||
    (currentItem?.exercise_type !== "scene_detective" &&
      !answer.trim() &&
      !selectedOption);

  // -------------------------------------------------------------------------
  // Results screen
  // -------------------------------------------------------------------------
  if (currentIndex >= items.length && items.length > 0) {
    const correct = results.filter((r) => r.is_correct).length;
    const total = results.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="glass-card p-8 text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="p-6 rounded-full bg-yellow-500/10 border border-yellow-500/20">
                <Trophy className="w-16 h-16 text-yellow-400" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Session Complete!</h1>
              <p className="text-muted-foreground">
                {session ? `Mode: ${session.mode.replace(/_/g, " ")}` : "Great work!"}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-5xl font-bold text-foreground">
                {correct}
                <span className="text-muted-foreground text-3xl"> / {total}</span>
              </p>
              <p className="text-muted-foreground">correct</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy</span>
                <span className="font-bold text-foreground">{accuracy}%</span>
              </div>
              <Progress value={accuracy} className="h-3" />
            </div>

            <p className="text-sm text-muted-foreground">
              {accuracy >= 80
                ? "Excellent mastery! Keep it up."
                : accuracy >= 50
                ? "Good progress — a bit more practice will help."
                : "Don't give up — review and try again!"}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => navigate("/practice")}>
                Review Mistakes
              </Button>
              <Button className="flex-1" onClick={() => navigate("/practice")}>
                Practice Again
              </Button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // -------------------------------------------------------------------------
  // Loading state
  // -------------------------------------------------------------------------
  if (isLoading || (!currentItem && items.length === 0)) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!currentItem) return null;

  const inputType = getInputType();
  const progressPct = items.length > 0 ? (currentIndex / items.length) * 100 : 0;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Progress section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {currentIndex + 1} / {items.length}
              </span>
              <span>{Math.round(progressPct)}% complete</span>
            </div>

            <Progress value={progressPct} className="h-2" />

            {/* Dots row */}
            <div className="flex gap-1.5 flex-wrap">
              {items.map((_, i) => {
                const result = results[i];
                const isCurrent = i === currentIndex;
                return (
                  <div
                    key={i}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      items.length <= 20 ? "w-full flex-1" : "w-2",
                      isCurrent
                        ? "bg-yellow-400"
                        : result === undefined
                        ? "bg-muted"
                        : result.is_correct
                        ? "bg-green-500"
                        : "bg-red-500"
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Exercise card */}
          <div className="glass-card p-6 space-y-6">
            {/* Exercise type badge + timer */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <Badge
                className={cn(
                  "flex items-center gap-1.5 border text-xs font-medium",
                  exerciseBadgeColor(currentItem.exercise_type)
                )}
              >
                {exerciseIcon(currentItem.exercise_type)}
                {exerciseLabel(currentItem.exercise_type)}
              </Badge>

              {currentItem.exercise_type === "word_rivals" && timeLeft !== null && !feedback && (
                <div className="flex-1 min-w-[120px] max-w-[200px]">
                  <TimerDisplay timeLeft={timeLeft} />
                </div>
              )}
            </div>

            {/* Exercise context */}
            <ExerciseContext item={currentItem} />

            {/* Input area — hidden after feedback */}
            {!feedback && inputType !== "none" && (
              <div className="space-y-3">
                {inputType === "short" && (
                  <Input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !feedback && handleSubmit()}
                    placeholder="Type your answer…"
                    autoFocus
                    disabled={isSubmitting}
                  />
                )}

                {inputType === "long" && (
                  <Textarea
                    rows={4}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Write your answer…"
                    autoFocus
                    disabled={isSubmitting}
                  />
                )}

                {inputType === "mcq" && (
                  <div className="space-y-2">
                    {currentItem.options.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedOption(String(opt.id))}
                        disabled={isSubmitting}
                        className={cn(
                          "w-full p-4 rounded-xl border text-left transition-all text-sm",
                          selectedOption === String(opt.id)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50 bg-transparent"
                        )}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Submit button */}
            {!feedback && (
              <Button
                onClick={handleSubmit}
                disabled={submitDisabled}
                className="w-full"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Checking…
                  </>
                ) : currentItem.exercise_type === "scene_detective" ? (
                  "Skip"
                ) : (
                  "Submit"
                )}
              </Button>
            )}

            {/* Feedback panel */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4"
                >
                  {/* Correct / incorrect header */}
                  <div
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border",
                      feedback.is_correct
                        ? "bg-green-500/10 border-green-500/30"
                        : "bg-red-500/10 border-red-500/30"
                    )}
                  >
                    {feedback.is_correct ? (
                      <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                    )}
                    <div>
                      <p
                        className={cn(
                          "font-bold",
                          feedback.is_correct ? "text-green-400" : "text-red-400"
                        )}
                      >
                        {feedback.is_correct ? "Correct! +7 mastery" : "Incorrect"}
                      </p>
                    </div>
                  </div>

                  {/* Correct answer card */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border text-sm text-muted-foreground">
                    <CorrectAnswerDisplay correct_answer={feedback.correct_answer} />
                  </div>

                  {/* Mastery bar */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Mastery</span>
                      <span className="font-semibold text-foreground">{feedback.mastery}%</span>
                    </div>
                    <Progress value={feedback.mastery} className="h-2" />
                  </div>

                  {/* Next / Finish button */}
                  <Button onClick={handleNext} className="w-full">
                    {isLastItem ? "Finish" : (
                      <>
                        Next <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
