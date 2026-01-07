import { BookOpen, TrendingUp } from "lucide-react";
import type { UserStat, Goal } from "@/types/user";

export const USER_STATS: UserStat[] = [
    { label: "Words Mastered", value: "247", icon: BookOpen, color: "text-primary" },
    { label: "Current Streak", value: "5 days", icon: TrendingUp, color: "text-success" },
];

export const DAILY_GOALS: Goal[] = [
    { id: "words", label: "Words to learn", current: 8, total: 10, unit: "words", variant: "gold" },
    { id: "time", label: "Practice time", current: 25, total: 30, unit: "min", variant: "blue" },
    { id: "reviews", label: "Reviews completed", current: 15, total: 20, unit: "", variant: "success" },
];
