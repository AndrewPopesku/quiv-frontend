import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/components/ui/use-toast";
import { practiceApi } from "@/services/practiceApi";
import type { SessionMode, CreateSessionPayload } from "@/types/practice";
import {
  Shuffle,
  Zap,
  PenLine,
  Music,
  Film,
  Sword,
  BookOpen,
  Mic,
  Brain,
  ArrowLeftRight,
  Sparkles,
  ScanSearch,
  Network,
  Ghost,
  Moon,
  Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ExerciseConfig {
  key: string;
  label: string;
  icon: LucideIcon;
  desc: string;
  color: string;
  bg: string;
  disabled?: boolean;
  comingSoon?: boolean;
}

const EXERCISES: ExerciseConfig[] = [
  { key: "context_fill", label: "Context Roulette", icon: Shuffle, desc: "Fill the blank in a real example sentence.", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { key: "sentence_forge", label: "Sentence Forge", icon: PenLine, desc: "Write an original sentence using the target word.", color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  { key: "lyric_lab", label: "Lyric Lab", icon: Music, desc: "Fill vocabulary blanks in real song lyrics.", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { key: "scene_detective", label: "Scene Detective", icon: Film, desc: "Answer vocab questions about a movie clip.", color: "text-gray-400", bg: "bg-gray-500/10 border-gray-500/20", disabled: true, comingSoon: true },
  { key: "word_rivals", label: "Word Rivals", icon: Sword, desc: "Speed drill — translation, context clash, spelling.", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  { key: "story_weaver", label: "Story Weaver", icon: BookOpen, desc: "Continue a story using your vocabulary words.", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  { key: "whisper_challenge", label: "Whisper Challenge", icon: Mic, desc: "Identify the vocabulary word in a noisy sentence.", color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
  { key: "memory_palace", label: "Memory Palace", icon: Brain, desc: "Place words in virtual rooms and recall them.", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { key: "duo_duel", label: "Duo Duel", icon: ArrowLeftRight, desc: "Bidirectional translation — random direction each item.", color: "text-cyan-400", bg: "bg-cyan-500/10 border-cyan-500/20" },
  { key: "scenario_immersion", label: "AI Scenario", icon: Sparkles, desc: "Reply to a real-life scenario using target words.", color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
  { key: "vocab_archaeology", label: "Vocab Archaeology", icon: ScanSearch, desc: "Read a heavily-redacted passage and uncover the word.", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  { key: "word_network", label: "Word Network", icon: Network, desc: "Identify synonyms and related words.", color: "text-teal-400", bg: "bg-teal-500/10 border-teal-500/20" },
  { key: "ghost_writer", label: "Ghost Writer", icon: Ghost, desc: "Rewrite a text to match a style or register.", color: "text-slate-400", bg: "bg-slate-500/10 border-slate-500/20" },
  { key: "dream_journal", label: "Dream Journal", icon: Moon, desc: "Free writing in your target language. Daily reflection.", color: "text-violet-400", bg: "bg-violet-500/10 border-violet-500/20" },
];

export default function Hub() {
  const navigate = useNavigate();
  const [selectedExercise, setSelectedExercise] = useState<ExerciseConfig | null>(null);
  const [selectedMode, setSelectedMode] = useState<SessionMode | null>(null);
  const [itemsCount, setItemsCount] = useState(10);
  const [songQuery, setSongQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const createSessionMutation = useMutation({
    mutationFn: (payload: CreateSessionPayload) => practiceApi.createSession(payload),
    onSuccess: (res) => {
      const { session, items } = res.data;
      setDialogOpen(false);
      navigate(`/practice/session/${session.id}`, { state: { items, session } });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error ?? "Failed to create session. Please try again.";
      toast({ title: "Error", description: message, variant: "destructive" });
    },
  });

  const openExerciseDialog = (exercise: ExerciseConfig) => {
    if (exercise.disabled) return;
    setSelectedExercise(exercise);
    setSelectedMode(exercise.key as SessionMode);
    setItemsCount(10);
    setSongQuery("");
    setDialogOpen(true);
  };

  const openQuickStartDialog = (mode: SessionMode, label: string, desc: string) => {
    setSelectedExercise({ key: mode, label, icon: mode === "mixed" ? Shuffle : Zap, desc, color: "text-primary", bg: "" });
    setSelectedMode(mode);
    setItemsCount(10);
    setSongQuery("");
    setDialogOpen(true);
  };

  const handleStartSession = () => {
    if (!selectedMode) return;
    const payload: CreateSessionPayload = {
      mode: selectedMode,
      items_count: itemsCount,
      ...(selectedMode === "lyric_lab" && songQuery.trim() ? { song_query: songQuery.trim() } : {}),
    };
    createSessionMutation.mutate(payload);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="mb-8 fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Practice</h1>
        <p className="text-muted-foreground text-lg">Sharpen your vocabulary with AI-powered exercises.</p>
      </div>

      {/* Quick Start Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10 fade-in" style={{ animationDelay: "50ms" }}>
        {/* Mixed Practice */}
        <button
          onClick={() => openQuickStartDialog("mixed", "Mixed Practice", "All 12 exercise types in one adaptive session.")}
          className="glass-card p-6 text-left group hover:border-primary/50 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 group-hover:bg-primary/20 transition-colors">
              <Shuffle className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                Mixed Practice
              </h3>
              <p className="text-muted-foreground text-sm">All 12 exercise types in one adaptive session.</p>
            </div>
          </div>
        </button>

        {/* Streak Sprint */}
        <button
          onClick={() => openQuickStartDialog("streak_sprint", "Streak Sprint", "Rapid-fire review in 60 seconds. Context fill, Duo Duel, Word Rivals.")}
          className="glass-card p-6 text-left group hover:border-yellow-500/50 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 group-hover:bg-yellow-500/20 transition-colors">
              <Zap className="w-7 h-7 text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-foreground group-hover:text-yellow-400 transition-colors">
                  Streak Sprint
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 uppercase tracking-wide">
                  60-second rapid fire
                </span>
              </div>
              <p className="text-muted-foreground text-sm">Rapid-fire review in 60 seconds. Context fill, Duo Duel, Word Rivals.</p>
            </div>
          </div>
        </button>
      </div>

      {/* Exercise Grid */}
      <div className="fade-in" style={{ animationDelay: "100ms" }}>
        <h2 className="text-2xl font-bold text-foreground mb-6">Choose your exercise</h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXERCISES.map((exercise, index) => {
            const Icon = exercise.icon;
            return (
              <button
                key={exercise.key}
                onClick={() => openExerciseDialog(exercise)}
                disabled={exercise.disabled}
                className={`glass-card p-4 text-left group border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${
                  exercise.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:scale-[1.02] hover:shadow-lg"
                } ${exercise.bg}`}
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${exercise.bg} flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${exercise.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors truncate">
                        {exercise.label}
                      </span>
                      {exercise.comingSoon && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wide flex-shrink-0">
                          Soon
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{exercise.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Config Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedExercise?.label}
            </DialogTitle>
            {selectedExercise && (
              <p className="text-sm text-muted-foreground mt-1">{selectedExercise.desc}</p>
            )}
          </DialogHeader>

          <div className="space-y-6 py-2">
            {/* Items count slider */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Questions: <span className="text-primary font-bold">{itemsCount}</span>
              </Label>
              <Slider
                min={5}
                max={20}
                step={1}
                value={[itemsCount]}
                onValueChange={(val) => setItemsCount(val[0])}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>5</span>
                <span>20</span>
              </div>
            </div>

            {/* Song query input — lyric_lab only */}
            {selectedMode === "lyric_lab" && (
              <div className="space-y-2">
                <Label htmlFor="song_query" className="text-sm font-medium">Song</Label>
                <Input
                  id="song_query"
                  placeholder="e.g. still alive portal"
                  value={songQuery}
                  onChange={(e) => setSongQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={createSessionMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartSession}
              disabled={createSessionMutation.isPending}
            >
              {createSessionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting…
                </>
              ) : (
                "Start Session"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
