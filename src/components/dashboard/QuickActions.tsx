import { Search, Zap, Brain, PenTool } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  {
    icon: Search,
    label: "Search Word",
    description: "Look up any word",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
  },
  {
    icon: Zap,
    label: "Quick Quiz",
    description: "5-minute practice",
    gradient: "from-secondary/20 to-secondary/5",
    iconColor: "text-secondary",
  },
  {
    icon: Brain,
    label: "Review",
    description: "Spaced repetition",
    gradient: "from-success/20 to-success/5",
    iconColor: "text-success",
  },
  {
    icon: PenTool,
    label: "Write",
    description: "Practice writing",
    gradient: "from-warning/20 to-warning/5",
    iconColor: "text-warning",
  },
];

export function QuickActions() {
  return (
    <div className="bento-item col-span-2">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <button
            key={action.label}
            className={cn(
              "p-4 rounded-xl bg-gradient-to-br transition-all duration-300 hover:scale-105 group text-left",
              action.gradient,
              "fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <action.icon className={cn("w-6 h-6 mb-3", action.iconColor)} />
            <p className="font-medium text-foreground">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
