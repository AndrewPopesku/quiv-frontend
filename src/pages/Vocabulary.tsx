import { useState, useEffect } from "react";
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
} from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { DictionaryService } from "@/api";
import { ApiError } from "@/api/core/ApiError";
import type { Word } from "@/api/models/Word";

export default function Vocabulary() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("term") ?? "");
  const [activeWord, setActiveWord] = useState<Word | null>(null);
  const [saved, setSaved] = useState(false);

  const translateMutation = useMutation({
    mutationFn: (term: string) => DictionaryService.dictionaryWordsTranslateRetrieve(term),
    onSuccess: (data: any) => {
      setActiveWord(data);
      setSaved(false);
    },
  });

  const saveMutation = useMutation({
    mutationFn: (word: Word) => DictionaryService.dictionaryWordsCreate({ word } as any),
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["saved-words"] });
      queryClient.invalidateQueries({ queryKey: ["daily-stats"] });
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
            className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all focus:border-primary/30"
          />
          <Button
            variant="gold"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleSearch}
            disabled={translateMutation.isPending}
          >
            {translateMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Analyze
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
            {/* Left Column: Header + Meanings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Word Header */}
              <div className="glass-card p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h1 className="text-5xl font-bold text-gradient-gold">{activeWord.term}</h1>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Volume2 className="w-6 h-6" />
                      </Button>
                    </div>
                    <p className="text-xl text-muted-foreground font-serif italic">{activeWord.phonetic}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => saveMutation.mutate(activeWord)}
                    disabled={saveMutation.isPending || saved}
                  >
                    {saved ? (
                      <Check className="w-5 h-5 text-green-500" />
                    ) : saveMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <BookmarkPlus className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Meanings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Meanings</h3>

                {activeWord.definitions.map((def, index) => (
                  <div
                    key={index}
                    className="glass-card overflow-hidden p-6 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="w-8 h-8 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
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
                    </div>

                    <div className="ml-12 space-y-4">
                      {def.example && (
                        <div className="p-4 bg-muted/40 rounded-xl border-l-4 border-primary/50 italic font-serif text-muted-foreground">
                          "{def.example}"
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
                ))}
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
