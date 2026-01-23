import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StatusLevel } from "@/types/vocabulary";

interface NaturalnessScoreProps {
    score: number;
    grammarStatus: StatusLevel;
    vocabularyStatus: StatusLevel;
    styleStatus: StatusLevel;
}

export function NaturalnessScore({
    score,
    grammarStatus,
    vocabularyStatus,
    styleStatus,
}: NaturalnessScoreProps) {
    const getScoreColor = (score: number) => {
        if (score >= 85) return "text-success";
        if (score >= 70) return "text-primary";
        if (score >= 50) return "text-warning";
        return "text-destructive";
    };

    const getStatusDisplay = (status: StatusLevel) => {
        switch (status) {
            case 'Excellent':
                return {
                    color: 'text-success',
                    icon: CheckCircle2,
                };
            case 'Good':
                return {
                    color: 'text-success',
                    icon: CheckCircle2,
                };
            case 'Needs Work':
                return {
                    color: 'text-destructive',
                    icon: AlertCircle,
                };
        }
    };

    const grammarDisplay = getStatusDisplay(grammarStatus);
    const vocabularyDisplay = getStatusDisplay(vocabularyStatus);
    const styleDisplay = getStatusDisplay(styleStatus);

    return (
        <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Naturalness Score
            </h3>

            <div className="relative w-48 h-48 mx-auto mb-6">
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
                        strokeDasharray={`${score * 2.83} 283`}
                        className="transition-all duration-1000"
                    />
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="hsl(var(--primary))" />
                            <stop offset="100%" stopColor="hsl(var(--cinema-gold))" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={cn("text-5xl font-bold", getScoreColor(score))}>
                        {score}
                    </span>
                    <span className="text-sm text-muted-foreground">out of 100</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Grammar</span>
                    <span className={cn("flex items-center gap-1", grammarDisplay.color)}>
                        <grammarDisplay.icon className="w-4 h-4" /> {grammarStatus}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Vocabulary</span>
                    <span className={cn("flex items-center gap-1", vocabularyDisplay.color)}>
                        <vocabularyDisplay.icon className="w-4 h-4" /> {vocabularyStatus}
                    </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Style</span>
                    <span className={cn("flex items-center gap-1", styleDisplay.color)}>
                        <styleDisplay.icon className="w-4 h-4" /> {styleStatus}
                    </span>
                </div>
            </div>
        </div>
    );
}
