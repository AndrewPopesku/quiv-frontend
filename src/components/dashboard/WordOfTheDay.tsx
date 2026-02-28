import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Volume2, BookmarkPlus, ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActivityService, DictionaryService } from "@/api";

const today = new Date().toISOString().split("T")[0];

export function WordOfTheDay() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["word-of-the-day", today],
    queryFn: () => ActivityService.activityWordOfTheDayRetrieve(today),
    retry: false,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const word = await DictionaryService.dictionaryWordsTranslateRetrieve(data!.word.term);
      await DictionaryService.dictionaryWordsCreate({ word } as any);
    },
    onSuccess: () => {
      setSaved(true);
      queryClient.invalidateQueries({ queryKey: ["saved-words"] });
      queryClient.invalidateQueries({ queryKey: ["daily-stats"] });
    },
  });

  if (isLoading || !data) return null;

  const word = data.word;
  const firstDefinition = word.definitions?.[0];

  return (
    <div className="bento-item relative overflow-hidden col-span-2 row-span-2 h-full">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

      {/* Content */}
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium uppercase tracking-wider">
            Word of the Day
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => saveMutation.mutate()}
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

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold">
              {word.term}
            </h2>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Volume2 className="w-6 h-6" />
            </Button>
          </div>

          <p className="text-muted-foreground text-lg mb-2">
            {word.phonetic}
          </p>

          {firstDefinition && (
            <p className="text-foreground/90 text-lg leading-relaxed mb-6">
              {firstDefinition.translation}
            </p>
          )}
        </div>

        <Button
          variant="gold"
          className="w-full group"
          onClick={() => navigate(`/vocabulary?term=${encodeURIComponent(word.term)}`)}
        >
          <span>Explore Full Definition</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
