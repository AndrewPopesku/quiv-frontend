import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  variant?: "default" | "gold" | "blue";
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bento-item relative overflow-hidden group h-full flex flex-col justify-between",
        className
      )}
    >
      {/* Gradient overlay */}
      {variant !== "default" && (
        <div
          className={cn(
            "absolute inset-0 opacity-10",
            variant === "gold" && "bg-gradient-to-br from-primary to-transparent",
            variant === "blue" && "bg-gradient-to-br from-secondary to-transparent"
          )}
        />
      )}

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            {title}
          </span>
          <div
            className={cn(
              "p-2 rounded-lg",
              variant === "gold" && "bg-primary/20 text-primary",
              variant === "blue" && "bg-secondary/20 text-secondary",
              variant === "default" && "bg-muted text-muted-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "text-3xl font-bold",
              variant === "gold" && "text-gradient-gold",
              variant === "blue" && "text-gradient-blue"
            )}
          >
            {value}
          </span>
          {subtitle && (
            <span className="text-sm text-muted-foreground">{subtitle}</span>
          )}
        </div>

        {trend && (
          <div
            className={cn(
              "mt-2 text-xs font-medium",
              trend.positive ? "text-success" : "text-destructive"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
