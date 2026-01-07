import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { Exercise } from "./exercises";

export interface ExerciseCardProps {
    exercise: Exercise;
    onClick: () => void;
}

export interface EmptyStateProps {
    title: string;
    description: string;
    icon?: LucideIcon;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
}

export interface GoalProgressProps {
    label: string;
    current: number;
    total: number;
    unit: string;
    variant: 'gold' | 'blue' | 'success';
}

