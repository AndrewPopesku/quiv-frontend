import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Search,
  Volume2,
  BookmarkPlus,
  Sparkles,
  Loader2,
  Check,
  X,
  RefreshCw,
  Film,
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { DictionaryService } from "@/api";
import { ApiError } from "@/api/core/ApiError";
import type { ExtendedWord, WordLookupResponse } from "@/types/vocabulary";
import { parseExamples } from "@/lib/vocabulary";
import { MovieClipPlayer } from "@/components/dictionary/MovieClipPlayer";

type ClipWithMeta = {
  clip: Record<string, any>;
  meaning: string;
  partOfSpeech: string;
};

export default function Vocabulary() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("term") ?? "");
  const [activeWord, setActiveWord] = useState<ExtendedWord | null>(null);
  const [savedDefinitionIds, setSavedDefinitionIds] = useState<Set<number>>(new Set());
  const [userWordId, setUserWordId] = useState<number | null>(null);
  const [clips, setClips] = useState<ClipWithMeta[]>([]);
  const [clipsLoading, setClipsLoading] = useState(false);

  const fetchClips = useCallback(async (word: ExtendedWord) => {
    setClipsLoading(true);
    setClips([]);
    try {
      const results = await Promise.all(
        word.definitions.map(async (def) => {
          try {
            const data = await DictionaryService.dictionaryWordsDefinitionsClipsList(word.id, def.id) as any;
            const list: Record<string, any>[] = Array.isArray(data) ? data : (data.results ?? []);
            return list.map((c) => ({
              clip: c,
              meaning: def.translation,
              partOfSpeech: def.part_of_speech,
            }));
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

  const reshuffleClips = useCallback(async () => {
    if (!activeWord) return;
    await fetchClips(activeWord);
  }, [activeWord, fetchClips]);

  const translateMutation = useMutation({
    mutationFn: async (term: string) => {
      const response = await DictionaryService.dictionaryWordsLookupRetrieve(term) as any;
      const lookupData = response as WordLookupResponse;
      const wordBasic = lookupData.word ?? response;
      const [defsResponse, nuancesResponse] = await Promise.all([
        DictionaryService.dictionaryWordsDefinitionsLookupRetrieve(wordBasic.id) as any,
        DictionaryService.dictionaryWordsNuancesLookupRetrieve(wordBasic.id) as any,
      ]);
      const definitions = defsResponse.definitions ?? defsResponse;
      const nuances = nuancesResponse.nuances ?? nuancesResponse;
      return {
        ...wordBasic,
        definitions,
        nuances,
        is_saved: lookupData.is_saved ?? false,
        user_word_id: lookupData.user_word_id ?? null,
        saved_definitions: lookupData.saved_definitions ?? [],
      } as ExtendedWord;
    },
    onSuccess: (data) => {
      setActiveWord(data);
      setSavedDefinitionIds(new Set(data.saved_definitions));
      setUserWordId(data.user_word_id);
      fetchClips(data);
    },
  });

  const ensureWordSaved = async (word: ExtendedWord): Promise<number> => {
    if (userWordId) return userWordId;
    const result = await DictionaryService.dictionaryUserWordsCreate({ word: word.id } as any) as any;
    const newId = result.id;
    setUserWordId(newId);
    queryClient.invalidateQueries({ queryKey: ["saved-words"] });
    queryClient.invalidateQueries({ queryKey: ["daily-stats"] });
    return newId;
  };

  const saveAllMutation = useMutation({
    mutationFn: async (word: ExtendedWord) => {
      const uwId = await ensureWordSaved(word);
      const unsavedDefs = word.definitions.filter(d => !savedDefinitionIds.has(d.id));
      await Promise.all(
        unsavedDefs.map(d =>
          DictionaryService.dictionaryUserWordsLearnedDefinitionsCreate(uwId, { definition: d.id } as any)
        )
      );
      return word.definitions.map(d => d.id);
    },
    onSuccess: (allIds) => {
      setSavedDefinitionIds(new Set(allIds));
      queryClient.invalidateQueries({ queryKey: ["saved-words"] });
    },
  });

  const saveDefinitionMutation = useMutation({
    mutationFn: async ({ word, definitionId }: { word: ExtendedWord; definitionId: number }) => {
      const uwId = await ensureWordSaved(word);
      await DictionaryService.dictionaryUserWordsLearnedDefinitionsCreate(uwId, { definition: definitionId } as any);
      return definitionId;
    },
    onSuccess: (defId) => {
      setSavedDefinitionIds(prev => new Set([...prev, defId]));
      queryClient.invalidateQueries({ queryKey: ["saved-words"] });
    },
  });

  useEffect(() => {
    const term = searchParams.get("term");
    if (term && !activeWord && !translateMutation.isPending) {
      translateMutation.mutate(term);
      setSearchParams({}, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    const term = searchQuery.trim();
    if (term) {
      translateMutation.mutate(term);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const allDefinitionsSaved = activeWord
    ? activeWord.definitions.every(d => savedDefinitionIds.has(d.id))
    : false;

  return (
    <Layout>
      {/* Search Header */}
      <div className="mb-8 fade-in">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for any word..."
            className="w-full pl-12 pr-20 md:pr-48 py-4 bg-muted border border-border rounded-2xl text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all focus:border-primary/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-14 md:right-40 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <Button
            variant="gold"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleSearch}
            disabled={translateMutation.isPending}
          >
            {translateMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span className="hidden md:inline">Analyze</span>
          </Button>
        </div>
      </div>

      {translateMutation.isPending && !activeWord && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {translateMutation.isError && (
        <EmptyState
          title="Translation failed"
          description={
            translateMutation.error instanceof ApiError && translateMutation.error.status === 400
              ? "Please enter a word in the language you're learning."
              : "Could not translate this word. Check spelling or try another term."
          }
          icon={Search}
        />
      )}

      {activeWord && (
        <div className="fade-in" style={{ animationDelay: '100ms' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Right Column: Video Clips */}
            <div className="order-last lg:col-start-3 lg:sticky lg:top-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Film className="w-4 h-4 text-primary" />
                  Clips
                </h3>
                {!clipsLoading && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-primary w-8 h-8"
                    onClick={reshuffleClips}
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
                      <MovieClipPlayer clip={item.clip} term={activeWord.term} />
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

            {/* Left Column: Header + Meanings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Word Header */}
              <div className="glass-card p-8">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h1 className="text-3xl md:text-5xl font-bold text-gradient-gold break-words">{activeWord.term}</h1>
                    <p className="text-xl text-muted-foreground font-serif italic">{activeWord.phonetic}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                      <Volume2 className="w-6 h-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground"
                      onClick={() => saveAllMutation.mutate(activeWord)}
                      disabled={saveAllMutation.isPending || allDefinitionsSaved}
                    >
                      {allDefinitionsSaved ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : saveAllMutation.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <BookmarkPlus className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Meanings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Meanings</h3>

                {activeWord.definitions.map((def, index) => {
                  const isDefSaved = savedDefinitionIds.has(def.id);
                  return (
                    <div
                      key={index}
                      className="glass-card overflow-hidden p-6 hover:border-primary/20 transition-all group"
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
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={() => saveDefinitionMutation.mutate({ word: activeWord, definitionId: def.id })}
                          disabled={isDefSaved || saveDefinitionMutation.isPending}
                        >
                          {isDefSaved ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <BookmarkPlus className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      <div className="ml-12 space-y-4">
                        {def.example && (
                          <div className="space-y-2">
                            {parseExamples(def.example).map((ex, i) => (
                              <div key={i} className="p-4 bg-muted/40 rounded-xl border-l-4 border-primary/50 italic font-serif text-muted-foreground">
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
              {activeWord.nuances && activeWord.nuances.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Usage Comparison
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeWord.nuances.map((nuance, index) => (
                      <div key={index} className="glass-card p-6 border-l-4 border-success">
                        <h4 className="text-lg font-bold text-foreground mb-2">{nuance.related_term}</h4>
                        <p className="text-sm text-muted-foreground">
                          {nuance.difference_explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!activeWord && !translateMutation.isPending && !translateMutation.isError && (
        <EmptyState
          title="Look up a word"
          description="Type a word and click Analyze to get its translation and definitions."
          icon={Search}
        />
      )}
    </Layout>
  );
}
