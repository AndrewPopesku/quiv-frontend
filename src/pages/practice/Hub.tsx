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
import { toast } from "@/components/ui/use-toast";
import { practiceApi } from "@/services/practiceApi";
import type { CreateSessionPayload } from "@/types/practice";
import { Layers, Loader2, Sword } from "lucide-react";

export default function Hub() {
  const navigate = useNavigate();
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

  const handleStart = () => {
    createSessionMutation.mutate({ mode: "context_fill" });
  };

  return (
    <Layout>
      <div className="mb-8 fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Practice</h1>
        <p className="text-muted-foreground text-lg">Sharpen your vocabulary with a variety of exercises.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl fade-in" style={{ animationDelay: "50ms" }}>
        {/* Flashcards */}
        <button
          onClick={() => setDialogOpen(true)}
          className="glass-card p-6 text-left w-full group hover:border-blue-500/50 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
              <Layers className="w-7 h-7 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-blue-400 transition-colors">
                Flashcards
              </h3>
              <p className="text-muted-foreground text-sm">
                Study your words with flashcards. See the definition, flip to reveal the word.
              </p>
            </div>
          </div>
        </button>

        {/* Sentence Forge */}
        <button
          onClick={() => navigate("/exercises/sentence-forge")}
          className="glass-card p-6 text-left w-full group hover:border-secondary/50 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
              <Sword className="w-7 h-7 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-secondary transition-colors">
                Sentence Forge
              </h3>
              <p className="text-muted-foreground text-sm">
                Build sentences from your vocabulary. AI scores grammar, naturalness, and context fit.
              </p>
            </div>
          </div>
        </button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Flashcards</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Study your words with flashcards. See the definition, flip to reveal the word.
            </p>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={createSessionMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleStart} disabled={createSessionMutation.isPending}>
              {createSessionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Starting…
                </>
              ) : (
                "Start"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
