import { ArrowRight, Circle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DictionaryService } from "@/api";

export function RecentWords() {
  const navigate = useNavigate();
  const { data: words = [] } = useQuery({
    queryKey: ["saved-words"],
    queryFn: () => DictionaryService.dictionaryWordsList(),
  });

  const recent = words.slice(0, 4);

  return (
    <div className="bento-item col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Words</h3>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          onClick={() => navigate("/saved-words")}
        >
          See All
        </Button>
      </div>

      <div className="space-y-3">
        {recent.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No words saved yet.
          </p>
        )}
        {recent.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group",
              "fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() =>
              navigate(`/vocabulary?term=${encodeURIComponent(item.word.term)}`)
            }
          >
            <div className="flex items-center gap-3">
              <Circle className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">{item.word.term}</p>
                <p className="text-xs text-muted-foreground">
                  {item.word.definitions?.[0]?.translation ?? ""}
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
