import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Volume2, Loader2, BookOpen } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { DictionaryService } from "@/api";
import { parseExamples } from "@/lib/vocabulary";
import type { Definition } from "@/api/models/Definition";
import type { UserWordList } from "@/api/models/UserWordList";

export default function SavedWordDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userWordId = Number(id);

  const { data: savedWords } = useQuery({
    queryKey: ["saved-words"],
    queryFn: () => DictionaryService.dictionaryUserWordsList(),
  });

  const userWord = savedWords?.find((w: UserWordList) => w.id === userWordId);

  const { data: learnedDefs, isLoading: learnedLoading } = useQuery({
    queryKey: ["learned-definitions", userWordId],
    queryFn: () => DictionaryService.dictionaryUserWordsLearnedDefinitionsList(userWordId),
    enabled: !!userWord,
  });

  const { data: allDefsResponse, isLoading: defsLoading } = useQuery({
    queryKey: ["word-definitions", userWord?.word.id],
    queryFn: () => DictionaryService.dictionaryWordsDefinitionsLookupRetrieve(userWord!.word.id) as any,
    enabled: !!userWord,
  });

  const isLoading = learnedLoading || defsLoading;

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

  const allDefs: Definition[] = allDefsResponse?.definitions ?? allDefsResponse ?? [];
  const learnedDefIds = new Set((learnedDefs ?? []).map((ld: any) => ld.definition));
  const filteredDefs = allDefs.filter(d => learnedDefIds.has(d.id));

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

        {/* Word Header */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-5xl font-bold text-gradient-gold break-words">
                {userWord.word.term}
              </h1>
              <p className="text-xl text-muted-foreground font-serif italic">
                {userWord.word.phonetic}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Volume2 className="w-6 h-6" />
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
        ) : filteredDefs.length === 0 ? (
          <EmptyState
            title="No saved definitions"
            description="This word has no saved definitions yet."
            icon={BookOpen}
          />
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Saved Definitions</h3>

            {filteredDefs.map((def, index) => (
              <div
                key={def.id}
                className="glass-card overflow-hidden p-6 hover:border-primary/20 transition-all"
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
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
