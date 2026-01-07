import { Flame, Trophy } from "lucide-react";

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const completedDays = [true, true, true, true, true, false, false];

export function StreakCard() {
  return (
    <div className="bento-item relative overflow-hidden col-span-2">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/20">
            <Flame className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">5 Day Streak!</h3>
            <p className="text-xs text-muted-foreground">Keep it going</p>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          {weekDays.map((day, index) => (
            <div key={index} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${completedDays[index]
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {completedDays[index] ? (
                  <Flame className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{day}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Trophy className="w-4 h-4 text-primary" />
          <span>Best streak: 12 days</span>
        </div>
      </div>
    </div>
  );
}
