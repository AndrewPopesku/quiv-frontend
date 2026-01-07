import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Copy,
  Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { MOCK_SUGGESTIONS, WRITING_TIPS } from "@/data/writing-data";

export default function Writing() {
  const [text, setText] = useState(
    "I think this approach is more better than the previous one. The design is very unique and I believe it will resonate well with our target audience."
  );
  const [expandedSuggestion, setExpandedSuggestion] = useState<number | null>(null);
  const [naturalScore] = useState(72);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-primary";
    if (score >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <Layout>
      <PageHeader
        title="Writing Lab"
        description="Practice writing with AI-powered feedback"
        actions={
          <>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" /> Clear
            </Button>
            <Button variant="gold" className="gap-2">
              <Wand2 className="w-4 h-4" /> Analyze
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Text Input Area */}
        <div className="lg:col-span-3 space-y-4">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Your Text</h3>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                <Copy className="w-4 h-4" /> Copy
              </Button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Start writing here... The AI will analyze your text for grammar, style, and naturalness."
              className="w-full h-64 p-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none custom-scrollbar"
            />

            <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
              <span>{text.split(/\s+/).filter(Boolean).length} words</span>
              <span>{text.length} characters</span>
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Suggestions ({MOCK_SUGGESTIONS.length})
            </h3>

            {MOCK_SUGGESTIONS.map((suggestion, index) => (
              <div
                key={index}
                className={cn(
                  "glass-card overflow-hidden transition-all duration-300",
                  "fade-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() =>
                    setExpandedSuggestion(
                      expandedSuggestion === index ? null : index
                    )
                  }
                  className="w-full p-4 flex items-start gap-4 text-left hover:bg-white/5 transition-colors"
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg shrink-0",
                      suggestion.type === "Grammar" && "bg-destructive/20 text-destructive",
                      suggestion.type === "Style" && "bg-warning/20 text-warning",
                      suggestion.type === "Vocabulary" && "bg-secondary/20 text-secondary"
                    )}
                  >
                    <AlertCircle className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground line-through text-destructive/70">
                        {suggestion.original}
                      </span>
                      <span className="text-muted-foreground">→</span>
                      <span className="text-sm font-medium text-success">
                        {suggestion.replacement}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground capitalize">
                      {suggestion.type.replace("-", " ")}
                    </span>
                  </div>

                  {expandedSuggestion === index ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>

                {expandedSuggestion === index && (
                  <div className="px-4 pb-4 slide-up">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Explanation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.reason}
                      </p>
                      <Button variant="gold" size="sm" className="mt-4">
                        Apply Fix
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Feedback Panel */}
        <div className="lg:col-span-2 space-y-4">
          {/* Naturalness Meter */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Naturalness Score
            </h3>

            <div className="relative w-48 h-48 mx-auto mb-6">
              {/* Background Circle */}
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${naturalScore * 2.83} 283`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--cinema-gold))" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Score Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("text-5xl font-bold", getScoreColor(naturalScore))}>
                  {naturalScore}
                </span>
                <span className="text-sm text-muted-foreground">out of 100</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Grammar</span>
                <span className="text-success flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Excellent
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Vocabulary</span>
                <span className="text-primary flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Good
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Style</span>
                <span className="text-warning flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" /> Needs Work
                </span>
              </div>
            </div>
          </div>

          {/* Writing Tips */}
          <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Tips</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {WRITING_TIPS.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
