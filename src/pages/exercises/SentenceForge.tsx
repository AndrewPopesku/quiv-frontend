import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { practiceApi } from "@/services/practiceApi";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import type {
  SentenceForgeItem,
  SentenceForgeEvaluation,
  SentenceForgeSessionSummary,
  GrammarError,
  NaturalnessNote,
} from "@/types/practice";
import {
  Sword,
  Loader2,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Trophy,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Inline sentence annotation
// ---------------------------------------------------------------------------

type SegmentType = "plain" | "grammar" | "naturalness";

interface Segment {
  text: string;
  type: SegmentType;
  tooltip?: string;
}

function buildSegments(
  sentence: string,
  grammarErrors: GrammarError[],
  naturalnessNotes: NaturalnessNote[],
): Segment[] {
  interface RawSpan {
    start: number;
    end: number;
    type: SegmentType;
    tooltip: string;
  }

  // Resolve a span by searching for `text` as a whole word in the sentence.
  // Returns null if not found or text is empty.
  function findSpan(text: string): { start: number; end: number } | null {
    if (!text) return null;
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?<![\\w])${escaped}(?![\\w])`, "i");
    const match = regex.exec(sentence);
    if (!match) return null;
    return { start: match.index, end: match.index + text.length };
  }

  const raw: RawSpan[] = [];

  for (const e of grammarErrors) {
    const found = findSpan(e.original);
    if (found) {
      raw.push({
        ...found,
        type: "grammar",
        tooltip: `${e.explanation} → "${e.correction}"`,
      });
    }
  }

  for (const n of naturalnessNotes) {
    const found = findSpan(n.issue);
    if (found) {
      raw.push({ ...found, type: "naturalness", tooltip: n.suggestion });
    }
  }

  raw.sort((a, b) => a.start - b.start || b.end - a.end);

  const segments: Segment[] = [];
  let cursor = 0;

  for (const span of raw) {
    if (span.start >= cursor) {
      if (span.start > cursor) {
        segments.push({ text: sentence.slice(cursor, span.start), type: "plain" });
      }
      segments.push({
        text: sentence.slice(span.start, span.end),
        type: span.type,
        tooltip: span.tooltip,
      });
      cursor = span.end;
    }
  }

  if (cursor < sentence.length) {
    segments.push({ text: sentence.slice(cursor), type: "plain" });
  }

  return segments;
}

function AnnotatedSentence({
  sentence,
  grammarErrors,
  naturalnessNotes,
}: {
  sentence: string;
  grammarErrors: GrammarError[];
  naturalnessNotes: NaturalnessNote[];
}) {
  const segments = buildSegments(sentence, grammarErrors, naturalnessNotes);

  return (
    <p className="text-lg font-medium leading-relaxed">
      {segments.map((seg, i) => (
        <span
          key={i}
          title={seg.tooltip}
          className={cn(
            seg.type === "grammar" &&
              "bg-red-500/20 text-red-300 underline decoration-red-400 decoration-wavy rounded px-0.5 cursor-help",
            seg.type === "naturalness" &&
              "bg-yellow-500/20 text-yellow-200 underline decoration-yellow-400 decoration-dotted rounded px-0.5 cursor-help",
          )}
        >
          {seg.text}
        </span>
      ))}
    </p>
  );
}

// ---------------------------------------------------------------------------
// Score bar helper
// ---------------------------------------------------------------------------

function ScoreBar({
  label,
  score,
  max = 100,
  colorClass,
}: {
  label: string;
  score: number;
  max?: number;
  colorClass: string;
}) {
  const pct = Math.round((score / max) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground font-medium">{label}</span>
        <span className="font-bold text-foreground">
          {score}
          {max !== 100 && `/${max}`}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", colorClass)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Naturalness dots (1–5 scale)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Hint panel
// ---------------------------------------------------------------------------

const HINT_OPTIONS = [
  { type: "structure", label: "Structure hint" },
  { type: "starter", label: "Starter hint" },
  { type: "full_scaffold", label: "Full scaffold" },
];

function HintPanel({
  sessionId,
  usedHints,
  onHintUsed,
}: {
  sessionId: number;
  usedHints: string[];
  onHintUsed: (type: string, text: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [hintTexts, setHintTexts] = useState<Record<string, string>>({});

  const requestHint = async (hintType: string) => {
    if (hintTexts[hintType]) return; // already fetched
    setLoading(hintType);
    try {
      const res = await practiceApi.sentenceForgeHint(sessionId, hintType);
      setHintTexts((prev) => ({ ...prev, [hintType]: res.data.hint }));
      onHintUsed(hintType, res.data.hint);
    } catch {
      toast({ title: "Could not load hint", variant: "destructive" });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="rounded-2xl border border-border/40 bg-muted/20 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" /> Need a hint?
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3">
              {HINT_OPTIONS.map(({ type, label }) => {
                const used = usedHints.includes(type);
                const hintText = hintTexts[type];
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!!loading || used}
                        onClick={() => requestHint(type)}
                        className={cn(
                          "flex-1 text-xs border-border/40",
                          used && "opacity-60",
                        )}
                      >
                        {loading === type ? (
                          <Loader2 className="w-3 h-3 animate-spin mr-1.5" />
                        ) : null}
                        {label}
                      </Button>
                    </div>
                    {hintText && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-3 text-sm text-yellow-200 font-mono">
                        {hintText}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Feedback panel
// ---------------------------------------------------------------------------

function FeedbackPanel({
  sentence,
  evaluation,
  onNext,
  isLast,
}: {
  sentence: string;
  evaluation: SentenceForgeEvaluation;
  onNext: () => void;
  isLast: boolean;
}) {
  const { grammar, vocabulary, naturalness, context, native_version } = evaluation;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Score grid */}
      <div className="glass-card p-6 space-y-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Scores</p>
        <ScoreBar
          label="Grammar"
          score={grammar.score}
          colorClass={
            grammar.score >= 80
              ? "bg-green-500"
              : grammar.score >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
          }
        />
        <ScoreBar
          label="Vocabulary"
          score={vocabulary.score}
          colorClass={vocabulary.score >= 80 ? "bg-green-500" : "bg-orange-500"}
        />
        <ScoreBar
          label="Naturalness"
          score={naturalness.score}
          colorClass={naturalness.score >= 80 ? "bg-purple-500" : naturalness.score >= 50 ? "bg-yellow-500" : "bg-red-500"}
        />
        <ScoreBar
          label="Context fit"
          score={context.score}
          colorClass={context.score >= 80 ? "bg-blue-500" : "bg-blue-400/60"}
        />
      </div>

      {/* Annotated sentence */}
      <div className="glass-card p-6 space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Your sentence
        </p>
        <AnnotatedSentence
          sentence={sentence}
          grammarErrors={grammar.errors}
          naturalnessNotes={naturalness.notes}
        />
        {(grammar.errors.length > 0 || naturalness.notes.length > 0) && (
          <div className="flex flex-wrap gap-3 pt-1 text-xs text-muted-foreground">
            {grammar.errors.length > 0 && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-red-500/40" />
                Grammar error
              </span>
            )}
            {naturalness.notes.length > 0 && (
              <span className="flex items-center gap-1">
                <span className="inline-block w-2.5 h-2.5 rounded-sm bg-yellow-500/40" />
                Naturalness tip
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grammar errors */}
      {grammar.errors.length > 0 && (
        <div className="glass-card p-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400/80">
            Grammar errors
          </p>
          <div className="space-y-3">
            {grammar.errors.map((err, i) => (
              <div
                key={i}
                className="bg-red-500/8 border border-red-500/20 rounded-xl px-4 py-3 space-y-1"
              >
                <div className="flex items-center gap-2 text-sm">
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="line-through text-red-300">{err.original}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-green-400 font-semibold">{err.correction}</span>
                </div>
                <p className="text-xs text-muted-foreground pl-6">{err.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Context notes */}
      {context.notes && (
        <div className="glass-card p-6 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-400/80">
            Context feedback
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">{context.notes}</p>
        </div>
      )}

      {/* Native version comparison */}
      <div className="glass-card p-6 space-y-4 border-secondary/20">
        <p className="text-xs font-bold uppercase tracking-widest text-secondary/80 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> Native speaker version
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Your version</p>
            <p className="text-sm font-medium text-foreground/80 italic leading-relaxed">
              "{sentence}"
            </p>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs text-secondary/80 font-medium">Native version</p>
            <p className="text-sm font-medium text-foreground italic leading-relaxed">
              "{native_version.text}"
            </p>
          </div>
        </div>
        {native_version.notes && (
          <p className="text-xs text-muted-foreground leading-relaxed border-t border-border/30 pt-3">
            {native_version.notes}
          </p>
        )}
      </div>

      {/* Naturalness notes */}
      {naturalness.notes.length > 0 && (
        <div className="glass-card p-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-400/80">
            Naturalness tips
          </p>
          <div className="space-y-3">
            {naturalness.notes.map((n, i) => (
              <div key={i} className="space-y-1">
                <p className="text-sm text-foreground/80">{n.issue}</p>
                <p className="text-xs text-yellow-300/80">→ {n.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next / finish */}
      <Button
        onClick={onNext}
        className="w-full h-14 rounded-2xl bg-secondary text-white font-black text-lg hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-3"
      >
        {isLast ? (
          <>
            <Trophy className="w-5 h-5" /> View session summary
          </>
        ) : (
          <>
            Next sentence <ArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Session summary screen
// ---------------------------------------------------------------------------

function SummaryScreen({
  summary,
  onRestart,
}: {
  summary: SentenceForgeSessionSummary;
  onRestart: () => void;
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="glass-card p-8 text-center space-y-4">
        <div className="inline-flex p-5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <Trophy className="w-14 h-14 text-yellow-400" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-foreground">Session Complete!</h2>
          <p className="text-muted-foreground mt-1">
            {summary.sentences_completed} sentence
            {summary.sentences_completed !== 1 ? "s" : ""} completed
          </p>
        </div>
      </div>

      <div className="glass-card p-6 space-y-5">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Session averages
        </p>
        <ScoreBar
          label="Grammar"
          score={Math.round(summary.avg_grammar)}
          colorClass={summary.avg_grammar >= 80 ? "bg-green-500" : "bg-yellow-500"}
        />
        <ScoreBar
          label="Vocabulary"
          score={Math.round(summary.avg_vocabulary)}
          colorClass="bg-blue-500"
        />
        <ScoreBar
          label="Naturalness"
          score={Math.round(summary.avg_naturalness)}
          colorClass={summary.avg_naturalness >= 80 ? "bg-purple-500" : "bg-yellow-500"}
        />
        <ScoreBar
          label="Context fit"
          score={Math.round(summary.avg_context)}
          colorClass="bg-purple-500"
        />
      </div>

      {summary.words_reviewed.length > 0 && (
        <div className="glass-card p-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Words reviewed
          </p>
          <div className="flex flex-wrap gap-2">
            {summary.words_reviewed.map((word, i) => (
              <Badge
                key={i}
                className="bg-secondary/10 text-secondary border-secondary/20 border"
              >
                {word}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-xl"
          onClick={() => navigate("/practice")}
        >
          Back to Practice
        </Button>
        <Button className="flex-1 h-12 rounded-xl" onClick={onRestart}>
          Practice Again
        </Button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Writing phase
// ---------------------------------------------------------------------------

function WritingPhase({
  item,
  sessionId,
  itemIndex,
  totalItems,
  usedHints,
  onHintUsed,
  onSubmit,
  isSubmitting,
}: {
  item: SentenceForgeItem;
  sessionId: number;
  itemIndex: number;
  totalItems: number;
  usedHints: string[];
  onHintUsed: (type: string, text: string) => void;
  onSubmit: (sentence: string) => void;
  isSubmitting: boolean;
}) {
  const [sentence, setSentence] = useState("");
  const wordCount = sentence.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Sentence {itemIndex + 1} of {totalItems}
          </span>
        </div>
        <Progress
          value={((itemIndex + 1) / totalItems) * 100}
          className="h-1.5"
        />
      </div>

      {/* Target words */}
      <div className="glass-card p-6 space-y-4">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Use these words
        </p>
        <div className="flex flex-wrap gap-3">
          {item.target_words.map((word) => (
            <div
              key={word.id}
              className="bg-secondary/10 border border-secondary/25 rounded-2xl px-4 py-3 min-w-[140px]"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-secondary text-lg">{word.word}</span>
                <Badge className="text-[10px] bg-secondary/20 text-secondary/80 border-none py-0">
                  {word.part_of_speech}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">{word.definition}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Prompt */}
      <div className="flex gap-3 items-start bg-muted/20 rounded-2xl px-5 py-4 border border-border/30">
        <span className="text-xl mt-0.5">📍</span>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Scenario
          </p>
          <p className="text-foreground/90 leading-relaxed italic">{item.prompt}</p>
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Your sentence
        </label>
        <div className="relative">
          <textarea
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Write your sentence in the target language…"
            disabled={isSubmitting}
            rows={4}
            className={cn(
              "w-full bg-muted/20 border-2 border-border/50 rounded-2xl p-5 text-lg text-foreground",
              "placeholder:text-muted-foreground/50 focus:outline-none focus:border-secondary",
              "transition-all resize-none font-medium leading-relaxed",
            )}
          />
          <div className="absolute bottom-3 right-4 text-xs text-muted-foreground/60">
            {wordCount} word{wordCount !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Hint panel */}
      <HintPanel sessionId={sessionId} usedHints={usedHints} onHintUsed={onHintUsed} />

      {/* Submit */}
      <Button
        onClick={() => onSubmit(sentence)}
        disabled={isSubmitting || wordCount < 3}
        className="w-full h-14 rounded-2xl bg-secondary text-white font-black text-lg hover:scale-[1.01] active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" /> Evaluating…
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" /> Submit sentence
          </>
        )}
      </Button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------

type Phase = "loading" | "writing" | "feedback" | "complete";

export default function SentenceForge() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // profile.target_language is a Language object at runtime (UserRetrieve shape)
  const targetLanguageName = (user?.profile?.target_language as any)?.name as
    | string
    | undefined;

  // Session state
  const [restartKey, setRestartKey] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentItem, setCurrentItem] = useState<SentenceForgeItem | null>(null);
  const [itemIndex, setItemIndex] = useState(0);
  const [totalItems] = useState(3);
  const [usedHints, setUsedHints] = useState<string[]>([]);
  const [evaluation, setEvaluation] = useState<SentenceForgeEvaluation | null>(null);
  const [lastSentence, setLastSentence] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [summary, setSummary] = useState<SentenceForgeSessionSummary | null>(null);

  // Auto-start when we have the language name
  const hasStarted = sessionId !== null;

  const { error: startError } = useQuery({
    queryKey: ["sentence-forge-start", targetLanguageName, restartKey],
    queryFn: async () => {
      if (!targetLanguageName) return null;
      const res = await practiceApi.sentenceForgeStart(targetLanguageName);
      setSessionId(res.data.session_id);
      setCurrentItem(res.data.sentence);
      setPhase("writing");
      return res.data;
    },
    enabled: !!targetLanguageName && !hasStarted,
    retry: false,
  });

  const startErrorMsg =
    (startError as any)?.response?.data?.error ??
    (startError ? "Failed to start session. Please try again." : null);

  const handleHintUsed = (type: string) => {
    setUsedHints((prev) => (prev.includes(type) ? prev : [...prev, type]));
  };

  const handleSubmit = async (sentence: string) => {
    if (!sessionId || !currentItem) return;
    setIsSubmitting(true);
    setLastSentence(sentence);
    try {
      const res = await practiceApi.sentenceForgeSubmit(sessionId, sentence);
      setEvaluation(res.data);
      setPhase("feedback");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ?? "Failed to evaluate sentence. Please try again.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (!sessionId || !evaluation) return;

    if (evaluation.session_complete || !evaluation.next_sentence) {
      // Fetch summary then show complete screen
      try {
        const res = await practiceApi.sentenceForgeEnd(sessionId);
        setSummary(res.data.session_summary);
        setPhase("complete");
      } catch {
        // Still show complete even without summary
        setPhase("complete");
      }
    } else {
      // Move to next sentence
      setCurrentItem(evaluation.next_sentence);
      setItemIndex((prev) => prev + 1);
      setEvaluation(null);
      setUsedHints([]);
      setPhase("writing");
    }
  };

  const handleRestart = () => {
    // Reset all state and re-trigger start (increment key to bust query cache)
    setRestartKey((k) => k + 1);
    setPhase("loading");
    setSessionId(null);
    setCurrentItem(null);
    setItemIndex(0);
    setTotalXp(0);
    setUsedHints([]);
    setEvaluation(null);
    setLastSentence("");
    setSummary(null);
  };

  const isLastItem =
    evaluation?.session_complete === true || evaluation?.next_sentence === undefined;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-8 fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/practice")}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-secondary/10 rounded-xl text-secondary">
              <Sword className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-foreground tracking-tight">
                Sentence Forge
              </h1>
              {targetLanguageName && (
                <p className="text-xs text-muted-foreground">
                  {targetLanguageName} · {totalItems} sentences
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-4"
            >
              {startErrorMsg ? (
                <>
                  <AlertCircle className="w-10 h-10 text-destructive" />
                  <p className="text-center text-muted-foreground max-w-xs">{startErrorMsg}</p>
                  <Button variant="outline" onClick={handleRestart}>
                    Try again
                  </Button>
                </>
              ) : (
                <>
                  <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                  <p className="text-muted-foreground">Preparing your sentences…</p>
                </>
              )}
            </motion.div>
          )}

          {phase === "writing" && currentItem && sessionId !== null && (
            <motion.div
              key={`writing-${itemIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <WritingPhase
                item={currentItem}
                sessionId={sessionId}
                itemIndex={itemIndex}
                totalItems={totalItems}
                usedHints={usedHints}
                onHintUsed={handleHintUsed}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}

          {phase === "feedback" && evaluation && (
            <motion.div
              key={`feedback-${itemIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Progress shown during feedback too */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    Sentence {itemIndex + 1} of {totalItems}
                  </span>
                </div>
                <Progress
                  value={((itemIndex + 1) / totalItems) * 100}
                  className="h-1.5"
                />
              </div>

              <FeedbackPanel
                sentence={lastSentence}
                evaluation={evaluation}
                onNext={handleNext}
                isLast={isLastItem}
              />
            </motion.div>
          )}

          {phase === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <SummaryScreen
                summary={
                  summary ?? {
                    sentences_completed: itemIndex + 1,
                    avg_grammar: 0,
                    avg_naturalness: 0,
                    avg_vocabulary: 0,
                    avg_context: 0,
                    words_reviewed: [],
                    difficulty: "intermediate",
                  }
                }
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
