import { Flame, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ActivityService } from "@/api";

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakCard() {
  const { data: stats } = useQuery({
    queryKey: ["daily-stats"],
    queryFn: () => ActivityService.activityStatsRetrieve(),
  });

  const currentStreak = stats?.current_streak ?? 0;
  const longestStreak = stats?.longest_streak ?? 0;
  const dailyGoal = stats?.daily_goal ?? 0;
  const weekActivity = stats?.week_activity ?? [0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="bento-item relative overflow-hidden col-span-2 h-full flex flex-col justify-center">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {currentStreak > 0 ? `${currentStreak} Day Streak!` : "No Streak Yet"}
            </h3>
            <p className="text-xs text-muted-foreground">
              {currentStreak > 0 ? "Keep it going" : "Complete your daily goal to start"}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          {WEEK_DAYS.map((day, index) => {
            const met = dailyGoal > 0 && weekActivity[index] >= dailyGoal;
            return (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    met
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {met ? (
                    <Flame className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{day}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Trophy className="w-4 h-4 text-primary" />
          <span>Best streak: {longestStreak} days</span>
        </div>
      </div>
    </div>
  );
}
