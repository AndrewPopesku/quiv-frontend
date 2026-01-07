import type { ActivityDay } from "@/types/user";

// Generate mock data for the last 30 days
export const ACTIVITY_DATA: ActivityDay[] = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    intensity: Math.random() > 0.3 ? Math.random() : 0, // Random intensity or 0
}));
