import { useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { practiceApi } from "@/services/practiceApi";
import type { PracticeItem, PracticeSession, AnswerResult } from "@/types/practice";
import { cn } from "@/lib/utils";
import { Trophy, Loader2, RotateCcw } from "lucide-react";

// ---------------------------------------------------------------------------
// Flashcard front — definition clues
// ---------------------------------------------------------------------------

function CardFront({
  item,
  onReveal,
}: {
  item: PracticeItem;
  onReveal: () => void;
}) {
  const { prompt, payload } = item;

  return (
    <div
      onClick={onReveal}
      className="glass-card p-8 flex flex-col h-[520px] sm:h-[560px] cursor-pointer hover:border-primary/40 transition-colors select-none"
    >
      <div className="flex-1 flex flex-col justify-center gap-5">
        {payload.part_of_speech && (
          <Badge className="self-start bg-blue-500/20 text-blue-400 border-blue-500/30 border text-sm px-3 py-1">
            {payload.part_of_speech}
          </Badge>
        )}
        <p className={cn("font-medium text-foreground leading-relaxed", fitTextClass(prompt))}>
          {prompt}
        </p>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground shrink-0">
        <RotateCcw className="w-4 h-4" />
        tap to reveal
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Movie clip player with subtitle overlay
// ---------------------------------------------------------------------------

type SubtitleWord = {
  text: string;
  start_ms: number;
  end_ms: number;
  is_searched: boolean;
};

function MovieClipPlayer({ clip, term }: { clip: Record<string, any>; term: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);

  const subtitleWords: SubtitleWord[] = clip.subtitle_words ?? [];

  const sourceTitle = (clip.source_title as string | undefined)
    ?.replace(/\s*\[[\d:]+\]\s*$/, "")
    .trim();

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTimeMs(video.currentTime * 1000);
  }

  // Subtitle rendering: word-by-word with highlighting when timing data exists,
  // otherwise fall back to full_text with the target word bolded.
  function renderSubtitle() {
    if (subtitleWords.length > 0) {
      return subtitleWords.map((w, i) => {
        const isActive = currentTimeMs >= w.start_ms && currentTimeMs <= w.end_ms;
        return (
          <span
            key={i}
            className={cn(
              "transition-colors",
              isActive && "underline underline-offset-2",
              w.is_searched ? "font-bold text-yellow-300" : "text-white",
            )}
          >
            {w.text}{" "}
          </span>
        );
      });
    }

    // Fallback: highlight the target term inside full_text
    const text: string = clip.full_text ?? "";
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-bold text-yellow-300">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden border border-white/10 flex flex-col h-full"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative flex-1 min-h-0">
        <video
          ref={videoRef}
          src={clip.video_url}
          controls
          className="w-full h-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
        />
        {isPlaying && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none px-3">
            <span className="bg-black/80 text-sm px-3 py-1.5 rounded text-center leading-snug">
              {renderSubtitle()}
            </span>
          </div>
        )}
      </div>
      {sourceTitle && (
        <p className="px-3 py-2 text-xs text-muted-foreground bg-black/30">
          {sourceTitle}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flashcard back — word reveal + self-rating
// ---------------------------------------------------------------------------

/** Returns a Tailwind font-size class that scales inversely with text length. */
function fitTextClass(text: string, base = 0): string {
  const len = text.length;
  const sizes = ["text-3xl", "text-2xl", "text-xl", "text-lg", "text-base", "text-sm"];
  let idx = 0;
  if (len > 60)  idx = 1;
  if (len > 120) idx = 2;
  if (len > 200) idx = 3;
  if (len > 320) idx = 4;
  if (len > 480) idx = 5;
  return sizes[Math.min(idx + base, sizes.length - 1)];
}

const CONTEXT_TYPE_LABEL: Record<string, string> = {
  ai_dialogue:      "Dialogue",
  ai_idiom_proverb: "Idiom / Proverb",
  ai_generated:     "Example",
  stored_example:   "Example",
};

const CONTEXT_TYPE_STYLE: Record<string, string> = {
  ai_dialogue:      "bg-purple-500/10 text-purple-400 border-purple-500/30",
  ai_idiom_proverb: "bg-amber-500/10  text-amber-400  border-amber-500/30",
  ai_generated:     "bg-blue-500/10   text-blue-400   border-blue-500/30",
  stored_example:   "bg-zinc-500/10   text-zinc-400   border-zinc-500/30",
};

function parseDialogue(text: string): { speaker: string; line: string }[] {
  const parts = text.split(/\s*\b([AB]):\s*/);
  // split gives: ["", "A", "text1", "B", "text2", ...]
  const result: { speaker: string; line: string }[] = [];
  for (let i = 1; i + 1 < parts.length; i += 2) {
    const line = parts[i + 1]?.trim();
    if (line) result.push({ speaker: parts[i], line });
  }
  return result;
}

function DialogueBubbles({ text }: { text: string }) {
  const lines = parseDialogue(text);
  if (lines.length === 0) {
    return <p className="text-sm text-muted-foreground leading-relaxed italic">{text}</p>;
  }
  return (
    <div className="space-y-2">
      {lines.map(({ speaker, line }, i) => (
        <div key={i} className={cn("flex gap-2", speaker === "B" && "flex-row-reverse")}>
          <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5
            bg-purple-500/20 text-purple-300 border border-purple-500/30">
            {speaker}
          </div>
          <div className={cn(
            "px-4 py-2.5 rounded-2xl text-base leading-relaxed max-w-[85%]",
            speaker === "A"
              ? "rounded-tl-sm bg-white/5 text-foreground"
              : "rounded-tr-sm bg-purple-500/10 text-foreground",
          )}>
            {line}
          </div>
        </div>
      ))}
    </div>
  );
}

function CardBack({
  item,
  result,
  isSubmitting,
  onRate,
  onNext,
  isLastItem,
  onFlipBack,
}: {
  item: PracticeItem;
  result: AnswerResult | null;
  isSubmitting: boolean;
  onRate: (knew: boolean) => void;
  onNext: () => void;
  isLastItem: boolean;
  onFlipBack: () => void;
}) {
  const { payload, correct_answer } = item;
  const word = String((correct_answer as any)?.value ?? "");

  return (
    <div
      onClick={!result ? onFlipBack : undefined}
      className={cn(
        "glass-card p-8 flex flex-col h-[520px] sm:h-[560px] select-none",
        !result && "cursor-pointer hover:border-primary/40 transition-colors"
      )}
    >
      {/* Word — pinned top */}
      <div className="text-center shrink-0 pb-5">
        <p className="text-4xl font-bold text-foreground">{word}</p>
      </div>

      {/* Content — fills remaining space, clips overflow */}
      <div className="flex-1 overflow-hidden flex flex-col gap-3 min-h-0">
        {payload.clip?.video_url ? (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <MovieClipPlayer clip={payload.clip} term={word} />
          </div>
        ) : payload.example_sentence ? (
          <div className="flex-1 flex flex-col justify-center gap-3">
            {CONTEXT_TYPE_LABEL[payload.context_type] && (
              <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border self-start", CONTEXT_TYPE_STYLE[payload.context_type])}>
                {CONTEXT_TYPE_LABEL[payload.context_type]}
              </span>
            )}
            {payload.context_type === "ai_dialogue" ? (
              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20">
                <DialogueBubbles text={payload.example_sentence} />
              </div>
            ) : (
              <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <p className={cn(
                  "text-foreground/80 leading-relaxed italic whitespace-pre-line",
                  fitTextClass(payload.example_sentence),
                )}>
                  {payload.example_sentence}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Actions — pinned bottom */}
      <div className="shrink-0 pt-4" onClick={(e) => e.stopPropagation()}>
      {!result ? (
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => onRate(false)}
            disabled={isSubmitting}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Didn't know"}
          </Button>
          <Button
            onClick={() => onRate(true)}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Knew it"}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Mastery</span>
              <span className="font-semibold text-foreground">{result.mastery}%</span>
            </div>
            <Progress value={result.mastery} className="h-2" />
          </div>

          <Button onClick={onNext} className="w-full">
            {isLastItem ? "Finish" : "Next →"}
          </Button>
        </div>
      )}
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
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [results, setResults] = useState<Array<{ is_correct: boolean }>>([]);

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

  function handleReveal() {
    setIsFlipped(true);
  }

  async function handleRate(knew: boolean) {
    if (isSubmitting || !currentItem) return;
    setIsSubmitting(true);
    try {
      const res = await practiceApi.submitAnswer(currentItem.id, knew);
      setResult(res.data);
      setResults((prev) => [...prev, { is_correct: res.data.is_correct }]);
    } catch {
      // silently fail — advance anyway
      setResults((prev) => [...prev, { is_correct: knew }]);
      setResult({ is_correct: knew, correct_answer: { type: "text", value: "" }, mastery: 0 });
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= items.length) {
      setCurrentIndex(items.length);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setResult(null);
    }
  }

  const isLastItem = currentIndex === items.length - 1;
  const progressPct = items.length > 0 ? (currentIndex / items.length) * 100 : 0;

  // -------------------------------------------------------------------------
  // Results screen
  // -------------------------------------------------------------------------
  if (currentIndex >= items.length && items.length > 0) {
    const correct = results.filter((r) => r.is_correct).length;
    const total = results.length;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-12">
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
            </div>

            <div className="space-y-3">
              <p className="text-5xl font-bold text-foreground">
                {correct}
                <span className="text-muted-foreground text-3xl"> / {total}</span>
              </p>
              <p className="text-muted-foreground">knew it</p>
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
                Back to Practice
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{currentIndex + 1} / {items.length}</span>
              <span>{Math.round(progressPct)}% complete</span>
            </div>
            <Progress value={progressPct} className="h-2" />
            <div className="flex gap-1.5 flex-wrap">
              {items.map((_, i) => {
                const r = results[i];
                const isCurrent = i === currentIndex;
                return (
                  <div
                    key={i}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      items.length <= 20 ? "w-full flex-1" : "w-2",
                      isCurrent
                        ? "bg-yellow-400"
                        : r === undefined
                        ? "bg-muted"
                        : r.is_correct
                        ? "bg-green-500"
                        : "bg-red-500"
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Flashcard with flip animation */}
          <AnimatePresence mode="wait" initial={false}>
            {!isFlipped ? (
              <motion.div
                key="front"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardFront item={currentItem} onReveal={handleReveal} />
              </motion.div>
            ) : (
              <motion.div
                key="back"
                initial={{ rotateY: -90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CardBack
                  item={currentItem}
                  result={result}
                  isSubmitting={isSubmitting}
                  onRate={handleRate}
                  onNext={handleNext}
                  isLastItem={isLastItem}
                  onFlipBack={() => setIsFlipped(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Layout>
  );
}
