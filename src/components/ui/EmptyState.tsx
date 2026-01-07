import type { EmptyStateProps } from "@/types/components";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

export const EmptyState = ({ title, description, icon: Icon, action }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-24 glass-card fade-in">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
                {Icon ? (
                    <Icon className="w-10 h-10 text-muted-foreground/20" />
                ) : (
                    <div className="w-10 h-10 border-2 border-dashed border-muted-foreground/20 rounded-full" />
                )}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground max-w-xs text-center mb-6">
                {description}
            </p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};
