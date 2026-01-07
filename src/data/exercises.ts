import { Layers, ListChecks, Link as LinkIcon, PenTool } from "lucide-react";
import type { Exercise } from "@/types/exercises";

export const EXERCISES: Exercise[] = [
    {
        id: "flashcards",
        title: "Flashcards",
        description: "Learn words and definitions at your own pace",
        icon: Layers,
        route: "/exercises/flashcards",
        variant: "glass"
    },
    {
        id: "multiple-choice",
        title: "Multiple Choice",
        description: "Test your knowledge by selecting correct definitions",
        icon: ListChecks,
        route: "/exercises/multiple-choice",
        variant: "glass"
    },
    {
        id: "matching",
        title: "Matching",
        description: "Match words with their correct definitions",
        icon: LinkIcon,
        route: "/exercises/matching",
        variant: "glass"
    },
    {
        id: "sentence-builder",
        title: "Sentence Builder",
        description: "Use words in sentences - AI checks your fluency",
        icon: PenTool,
        route: "/exercises/sentence-builder",
        variant: "gradient"
    }
];
