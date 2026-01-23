import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Suggestion } from "@/types/vocabulary";

interface SuggestionCardProps {
    suggestion: Suggestion;
    onApplyFix?: (original: string, replacement: string) => void;
}

export function SuggestionCard({ suggestion, onApplyFix }: SuggestionCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="glass-card overflow-hidden">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-start gap-4 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-sm text-muted-foreground line-through">
                            {suggestion.original}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-sm font-medium text-success bg-success/20 px-2 py-0.5 rounded">
                            {suggestion.replacement}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {suggestion.type}
                    </span>
                </div>

                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
            </button>

            {isExpanded && (
                <div className="px-4 pb-4 slide-up">
                    <div className="p-4 bg-muted/50 rounded-lg border-l-2 border-warning">
                        <p className="text-sm text-muted-foreground">
                            {suggestion.reason}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
