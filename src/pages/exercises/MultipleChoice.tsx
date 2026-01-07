import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, ListChecks, Flame } from "lucide-react";
import { MOCK_WORDS } from "@/data/mock-words";
import { cn } from "@/lib/utils";
import type { Word } from "@/types/vocabulary";

export default function MultipleChoice() {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [options, setOptions] = useState<Word[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [streak, setStreak] = useState(0);

    const setupRound = () => {
        const target = MOCK_WORDS[Math.floor(Math.random() * MOCK_WORDS.length)] as Word | undefined;
        if (!target) return;

        const distractors = MOCK_WORDS
            .filter(w => w.id !== target.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        const allOptions = [target, ...distractors].sort(() => 0.5 - Math.random());

        setCurrentWord(target);
        setOptions(allOptions);
        setSelectedOption(null);
    };

    useEffect(() => {
        setupRound();
    }, []);

    const handleSelect = (id: string) => {
        if (selectedOption || !currentWord) return;

        setSelectedOption(id);
        const correct = id === currentWord.id;

        if (correct) {
            setStreak(s => s + 1);
        } else {
            setStreak(0);
        }
    };

    if (!currentWord) return null;

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-8 fade-in">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-4">
                            <ListChecks size={32} />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">Multiple Choice</h1>
                        <p className="text-muted-foreground mt-1">Select the term that matches the definition.</p>
                    </div>
                    <div className="bg-muted px-6 py-3 rounded-2xl border border-border flex items-center gap-3 shadow-sm">
                        <Flame className={cn("w-6 h-6", streak > 0 ? "text-orange-500 fill-orange-500 animate-pulse" : "text-muted-foreground")} />
                        <span className="text-xl font-black">{streak}</span>
                    </div>
                </div>

                <div className="glass-card overflow-hidden mb-8 border-primary/20 shadow-2xl">
                    <div className="p-12 text-center bg-gradient-to-b from-muted/50 to-transparent">
                        <span className="text-primary/50 text-[10px] tracking-[0.3em] uppercase mb-4 block font-black">Definition</span>
                        <p className="text-3xl text-foreground font-medium leading-relaxed italic font-serif">
                            "{currentWord.definitions[0]?.text}"
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option) => {
                        const isSelected = selectedOption === option.id;
                        const isCorrect = option.id === currentWord.id;
                        const shown = !!selectedOption;

                        return (
                            <button
                                key={option.id}
                                onClick={() => handleSelect(option.id)}
                                disabled={shown}
                                className={cn(
                                    "p-8 rounded-2xl border-2 text-2xl font-black transition-all duration-300 flex items-center justify-between shadow-lg",
                                    "bg-muted/30 border-border/50 text-foreground hover:border-primary/50 hover:bg-muted/50",
                                    shown && isCorrect && "bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]",
                                    shown && isSelected && !isCorrect && "bg-destructive/10 border-destructive text-destructive shadow-[0_0_20px_rgba(239,68,68,0.2)]",
                                    shown && !isSelected && !isCorrect && "opacity-40 grayscale-[0.5] scale-[0.98] border-border",
                                    !shown && "hover:scale-[1.02] hover:-translate-y-1"
                                )}
                            >
                                <span>{option.term}</span>
                                {shown && isCorrect && <CheckCircle className="w-8 h-8" />}
                                {shown && isSelected && !isCorrect && <XCircle className="w-8 h-8" />}
                            </button>
                        );
                    })}
                </div>

                {selectedOption && (
                    <div className="mt-12 flex justify-center animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <Button
                            onClick={setupRound}
                            size="lg"
                            className="h-16 px-12 rounded-2xl font-black text-xl bg-foreground text-background hover:scale-105 transition-transform shadow-2xl flex items-center gap-4"
                        >
                            Next Word <ArrowRight size={24} />
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
}
