import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  User,
  Settings,
  Calendar,
  Edit3,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ACHIEVEMENTS } from "@/data/achievements";
import { USER_STATS, DAILY_GOALS } from "@/data/user-stats";
import { AchievementCard } from "@/components/profile/AchievementCard";
import { GoalProgress } from "@/components/profile/GoalProgress";

export default function Profile() {
  return (
    <Layout>
      {/* Profile Header */}
      <div className="glass-card p-8 mb-8 relative overflow-hidden fade-in">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-primary-foreground shadow-glow">
              A
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 bg-muted rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Edit3 className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold text-foreground mb-1">Alex Johnson</h1>
            <p className="text-muted-foreground mb-2">alex.johnson@email.com</p>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className="text-sm text-muted-foreground">
                Learning English
              </span>
            </div>
          </div>

          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Learning Goals */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Progress
            </h3>
            <Button variant="ghost" size="sm" className="text-primary">
              Details
            </Button>
          </div>

          <div className="space-y-6">
            {DAILY_GOALS.map((goal) => (
              <GoalProgress
                key={goal.id}
                label={goal.label}
                current={goal.current}
                total={goal.total}
                unit={goal.unit}
                variant={goal.variant}
              />
            ))}
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Activity Calendar
            </h3>
            <span className="text-sm text-muted-foreground">December 2025</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-center text-xs text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: 31 }, (_, i) => {
              const activity = Math.random();
              return (
                <div
                  key={i}
                  className={cn(
                    "aspect-square rounded-md flex items-center justify-center text-xs transition-colors cursor-pointer hover:ring-2 hover:ring-primary/50",
                    activity > 0.7 ? "bg-primary text-primary-foreground" :
                      activity > 0.4 ? "bg-primary/50 text-foreground" :
                        activity > 0.1 ? "bg-primary/20 text-muted-foreground" :
                          "bg-muted text-muted-foreground"
                  )}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
