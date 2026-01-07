import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const recentWords = [
  { word: "Serendipity", mastered: true, context: "The Social Network" },
  { word: "Ubiquitous", mastered: true, context: "Ex Machina" },
  { word: "Mellifluous", mastered: false, context: "The King's Speech" },
  { word: "Ineffable", mastered: false, context: "Interstellar" },
];

export function RecentWords() {
  return (
    <div className="bento-item col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Recent Words</h3>
        <Button variant="ghost" size="sm" className="text-primary">
          See All
        </Button>
      </div>

      <div className="space-y-3">
        {recentWords.map((item, index) => (
          <div
            key={item.word}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer group",
              "fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-3">
              {item.mastered ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <Circle className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground">{item.word}</p>
                <p className="text-xs text-muted-foreground">{item.context}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
