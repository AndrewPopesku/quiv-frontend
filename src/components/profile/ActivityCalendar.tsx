import { cn } from "@/lib/utils";
import { ACTIVITY_DATA } from "@/data/activity";

export const ActivityCalendar = () => {
    return (
        <div className="glass-card p-6 fade-in">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Activity Calendar
                </h3>
                <span className="text-xs text-muted-foreground">Last 30 days</span>
            </div>

            <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-2">
                {ACTIVITY_DATA.map((day) => (
                    <div
                        key={day.day}
                        className={cn(
                            "aspect-square rounded-md transition-all duration-500 hover:scale-110 cursor-help",
                            day.intensity === 0 && "bg-muted/30",
                            day.intensity > 0 && day.intensity <= 0.3 && "bg-primary/20",
                            day.intensity > 0.3 && day.intensity <= 0.6 && "bg-primary/50",
                            day.intensity > 0.6 && "bg-secondary"
                        )}
                        title={`Day ${day.day}: ${Math.round(day.intensity * 100)}% activity`}
                    />
                ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2 text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-sm bg-muted/30" />
                    <div className="w-3 h-3 rounded-sm bg-primary/20" />
                    <div className="w-3 h-3 rounded-sm bg-primary/50" />
                    <div className="w-3 h-3 rounded-sm bg-secondary" />
                </div>
                <span>More</span>
            </div>
        </div>
    );
};
