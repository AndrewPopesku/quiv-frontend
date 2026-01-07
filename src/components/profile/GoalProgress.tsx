import type { GoalProgressProps } from "@/types/components";
import { cn } from "@/lib/utils";

export const GoalProgress = ({ label, current, total, unit, variant }: GoalProgressProps) => {
    const percentage = Math.min(100, (current / total) * 100);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-medium text-foreground">
                    {current}/{total} {unit}
                </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500",
                        variant === 'gold' && "progress-gold",
                        variant === 'blue' && "progress-blue",
                        variant === 'success' && "bg-success"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
