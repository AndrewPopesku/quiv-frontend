import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, Loader2, BookOpen, BookmarkPlus, BookmarkCheck, Check, BookmarkMinus, Film, RefreshCw } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { DictionaryService } from "@/api";
import { parseExamples } from "@/lib/vocabulary";
import type { Definition } from "@/api/models/Definition";
import type { UserWordList } from "@/api/models/UserWordList";
import { MovieClipPlayer } from "@/components/dictionary/MovieClipPlayer";

type ClipWithMeta = {
  clip: Record<string, any>;
  meaning: string;
  partOfSpeech: string;
};

export default function SavedWordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userWordId = Number(id);

  const [savedDefIds, setSavedDefIds] = useState<Set<number> | null>(null);
  const [pendingDefId, setPendingDefId] = useState<number | null>(null);
  const [clips, setClips] = useState<ClipWithMeta[]>([]);
  const [clipsLoading, setClipsLoading] = useState(false);

  const { data: savedWords } = useQuery({
    queryKey: ["saved-words"],
    queryFn: () => DictionaryService.dictionaryUserWordsList(),
  });

  const userWord = savedWords?.find((w: UserWordList) => w.id === userWordId);

  const { data: learnedDefs } = useQuery({
    queryKey: ["learned-definitions", userWordId],
    queryFn: () => DictionaryService.dictionaryUserWordsLearnedDefinitionsList(userWordId),
    enabled: !!userWord,
    onSuccess: (data: any[]) => {
      if (savedDefIds === null) {
        setSavedDefIds(new Set(data.map((ld) => ld.definition as number)));
      }
    },
  } as any);

  const { data: allDefsResponse, isLoading: defsLoading } = useQuery({
    queryKey: ["word-definitions", userWord?.word.id],
    queryFn: () => DictionaryService.dictionaryWordsDefinitionsLookupRetrieve(userWord!.word.id) as any,
    enabled: !!userWord,
  });

  const { data: nuancesResponse, isLoading: nuancesLoading } = useQuery({
    queryKey: ["word-nuances", userWord?.word.id],
    queryFn: () => DictionaryService.dictionaryWordsNuancesLookupRetrieve(userWord!.word.id) as any,
    enabled: !!userWord,
  });

  const allDefs: Definition[] = allDefsResponse?.definitions ?? allDefsResponse ?? [];
  const nuances: any[] = nuancesResponse?.nuances ?? nuancesResponse ?? [];

  const fetchClips = useCallback(async (wordId: number, defs: Definition[]) => {
    setClipsLoading(true);
    setClips([]);
    try {
      const results = await Promise.all(
        defs.map(async (def) => {
          try {
            const data = await DictionaryService.dictionaryWordsDefinitionsClipsList(wordId, def.id) as any;
            const list: Record<string, any>[] = Array.isArray(data) ? data : (data.results ?? []);
            return list.map((c) => ({ clip: c, meaning: def.translation, partOfSpeech: def.part_of_speech }));
          } catch {
            return [];
          }
        })
      );
      const seen = new Set<number>();
      const all = results.flat().filter(({ clip }) => {
        if (seen.has(clip.id)) return false;
        seen.add(clip.id);
        return true;
      });
      setClips([...all].sort(() => Math.random() - 0.5).slice(0, 4));
    } finally {
      setClipsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userWord && allDefs.length > 0) {
      fetchClips(userWord.word.id, allDefs);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDefsResponse, userWord?.word.id]);

  // Fall back to server data until local state is initialised
  const serverSavedDefIds = new Set((learnedDefs ?? []).map((ld: any) => ld.definition as number));
  const activeSavedDefIds: Set<number> = savedDefIds ?? serverSavedDefIds;

  const saveDefinitionMutation = useMutation({
    mutationFn: async (definitionId: number) => {
      await DictionaryService.dictionaryUserWordsLearnedDefinitionsCreate(
        userWordId,
        { definition: definitionId } as any
      );
      return definitionId;
    },
    onMutate: (defId) => setPendingDefId(defId),
    onSuccess: (definitionId) => {
      setSavedDefIds(prev => new Set([...(prev ?? serverSavedDefIds), definitionId]));
      queryClient.invalidateQueries({ queryKey: ["learned-definitions", userWordId] });
    },
    onSettled: () => setPendingDefId(null),
  });

  const unsaveDefinitionMutation = useMutation({
    // Backend destroy uses pk as definition_id, not UserDefinition record id
    mutationFn: async (definitionId: number) => {
      await DictionaryService.dictionaryUserWordsLearnedDefinitionsDestroy(definitionId, userWordId);
      return definitionId;
    },
    onMutate: (defId) => setPendingDefId(defId),
    onSuccess: (definitionId) => {
      const next = new Set(activeSavedDefIds);
      next.delete(definitionId);
      setSavedDefIds(next);
      queryClient.invalidateQueries({ queryKey: ["saved-words"] });

      if (next.size === 0) {
        // Backend already deleted the UserWord when last definition was removed
        navigate("/saved-words");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["learned-definitions", userWordId] });
    },
    onSettled: () => setPendingDefId(null),
  });

  const saveAllMutation = useMutation({
    mutationFn: async () => {
      const unsaved = allDefs.filter(d => !activeSavedDefIds.has(d.id));
      await Promise.all(
        unsaved.map(d =>
          DictionaryService.dictionaryUserWordsLearnedDefinitionsCreate(
            userWordId,
            { definition: d.id } as any
          )
        )
      );
      return allDefs.map(d => d.id);
    },
    onSuccess: (allIds) => {
      setSavedDefIds(new Set(allIds));
      queryClient.invalidateQueries({ queryKey: ["learned-definitions", userWordId] });
    },
  });

  if (!savedWords) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!userWord) {
    return (
      <Layout>
        <EmptyState
          title="Word not found"
          description="This saved word could not be found."
          icon={BookOpen}
        />
      </Layout>
    );
  }

  const isLoading = defsLoading || nuancesLoading;
  const anyDefinitionSaved = activeSavedDefIds.size > 0;
  const allDefinitionsSaved = allDefs.length > 0 && allDefs.every(d => activeSavedDefIds.has(d.id));

  return (
    <Layout>
      <div className="fade-in">
        <Button
          variant="ghost"
          className="mb-6 text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/saved-words")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Saved Words
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Right Column: Video Clips */}
          <div className="order-last lg:col-start-3 lg:sticky lg:top-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Film className="w-4 h-4 text-primary" />
                Clips
              </h3>
              {!clipsLoading && userWord && allDefs.length > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary w-8 h-8"
                  onClick={() => fetchClips(userWord.word.id, allDefs)}
                  title="Shuffle clips"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              )}
            </div>

            {clipsLoading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
              </div>
            )}

            {!clipsLoading && clips.length === 0 && (
              <div className="glass-card p-6 text-center">
                <Film className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No video clips found for this word yet.</p>
              </div>
            )}

            {!clipsLoading && clips.length > 0 && (
              <div className="space-y-4">
                {clips.map((item, i) => (
                  <div key={i} className="glass-card overflow-hidden">
                    <MovieClipPlayer clip={item.clip} term={userWord.word.term} />
                    <div className="px-3 py-2 border-t border-border/40">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-primary/70">
                        {item.partOfSpeech} · {item.meaning}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Word Header */}
            <div className="glass-card p-8">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h1 className="text-3xl md:text-5xl font-bold text-gradient-gold break-words">
                    {userWord.word.term}
                  </h1>
                  <p className="text-xl text-muted-foreground font-serif italic">
                    {userWord.word.pronunciation}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                    <Volume2 className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={anyDefinitionSaved ? "text-primary hover:text-foreground" : "text-muted-foreground hover:text-foreground"}
                    onClick={() => saveAllMutation.mutate()}
                    disabled={saveAllMutation.isPending || allDefinitionsSaved}
                    title={allDefinitionsSaved ? "All definitions saved" : "Save all definitions"}
                  >
                    {saveAllMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : allDefinitionsSaved ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : anyDefinitionSaved ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </Button>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {userWord.mastery ?? 0}% mastery
                  </span>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* All Definitions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Meanings</h3>

                  {allDefs.map((def, index) => {
                    const isSaved = activeSavedDefIds.has(def.id);
                    const isPending = pendingDefId === def.id;

                    return (
                      <div
                        key={def.id}
                        className={`glass-card overflow-hidden p-6 transition-all ${
                          isSaved ? "border-primary/30" : "hover:border-primary/20 opacity-70"
                        }`}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <span className="w-8 h-8 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <div className="flex-1">
                            <span className="text-xs text-primary font-bold uppercase tracking-widest">
                              {def.part_of_speech}
                            </span>
                            <p className="text-foreground font-medium text-xl mt-1 leading-relaxed">
                              {def.translation}
                            </p>
                            {def.details && (
                              <p className="text-muted-foreground text-sm mt-1">{def.details}</p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`shrink-0 transition-colors ${
                              isSaved
                                ? "text-green-500 hover:text-destructive"
                                : "text-muted-foreground hover:text-primary"
                            }`}
                            onClick={() =>
                              isSaved
                                ? unsaveDefinitionMutation.mutate(def.id)
                                : saveDefinitionMutation.mutate(def.id)
                            }
                            disabled={isPending}
                            title={isSaved ? "Remove from saved" : "Save this definition"}
                          >
                            {isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isSaved ? (
                              <BookmarkMinus className="w-4 h-4" />
                            ) : (
                              <BookmarkPlus className="w-4 h-4" />
                            )}
                          </Button>
                        </div>

                        <div className="ml-12 space-y-4">
                          {def.example && (
                            <div className="space-y-2">
                              {parseExamples(def.example).map((ex, i) => (
                                <div
                                  key={i}
                                  className="p-4 bg-muted/40 rounded-xl border-l-4 border-primary/50 italic font-serif text-muted-foreground"
                                >
                                  "{ex}"
                                </div>
                              ))}
                            </div>
                          )}

                          {def.direct_synonyms && (
                            <div className="space-y-2">
                              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                                Synonyms
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {def.direct_synonyms.split(",").map((syn) => (
                                  <span
                                    key={syn.trim()}
                                    className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
                                  >
                                    {syn.trim()}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Nuanced Related Words */}
                {nuances.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Usage Comparison</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {nuances.map((nuance, index) => (
                        <div key={index} className="glass-card p-6 border-l-4 border-success">
                          <h4 className="text-lg font-bold text-foreground mb-2">{nuance.related_term}</h4>
                          <p className="text-sm text-muted-foreground">{nuance.difference_explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
