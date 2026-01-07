import type { LucideIcon } from "lucide-react";

export interface UserStat {
    label: string;
    value: string;
    icon: LucideIcon;
    color: string;
}

export interface Goal {
    id: string;
    label: string;
    current: number;
    total: number;
    unit: string;
    variant: 'gold' | 'blue' | 'success';
}

export interface ActivityDay {
    day: number;
    intensity: number; // 0-1
}
