import { useState } from "react";
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
      className="glass-card p-8 space-y-6 min-h-[280px] flex flex-col cursor-pointer hover:border-primary/40 transition-colors select-none"
    >
      <div className="flex-1 space-y-4">
        {payload.part_of_speech && (
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 border text-xs">
            {payload.part_of_speech}
          </Badge>
        )}
        <p className="text-xl font-medium text-foreground leading-relaxed">{prompt}</p>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <RotateCcw className="w-3 h-3" />
        tap to reveal
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Flashcard back — word reveal + self-rating
// ---------------------------------------------------------------------------

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
        "glass-card p-8 space-y-6 min-h-[280px] flex flex-col select-none",
        !result && "cursor-pointer hover:border-primary/40 transition-colors"
      )}
    >
      {/* The word */}
      <div className="flex-1 space-y-4">
        <div className="text-center py-2">
          <p className="text-4xl font-bold text-foreground">{word}</p>
        </div>

        {/* Example sentence */}
        {payload.example_sentence && (
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              {payload.example_sentence}
            </p>
          </div>
        )}
      </div>

      {/* Self-rating or mastery + next */}
      {!result ? (
        <div className="grid grid-cols-2 gap-3" onClick={(e) => e.stopPropagation()}>
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
    const word = String((currentItem.correct_answer as any)?.value ?? "");
    const answer = knew ? word : "";
    setIsSubmitting(true);
    try {
      const res = await practiceApi.submitAnswer(currentItem.id, answer);
      setResult(res.data);
      setResults((prev) => [...prev, { is_correct: res.data.is_correct }]);
    } catch {
      // silently fail — advance anyway
      setResults((prev) => [...prev, { is_correct: knew }]);
      setResult({ is_correct: knew, correct_answer: { type: "text", value: word }, mastery: 0 });
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
      <div className="max-w-2xl mx-auto px-4 py-6">
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
