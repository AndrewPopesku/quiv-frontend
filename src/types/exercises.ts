import type { LucideIcon } from "lucide-react";

export interface Exercise {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    route: string;
    variant?: 'glass' | 'gradient';
}
