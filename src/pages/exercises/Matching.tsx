import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { RefreshCw, Link as LinkIcon, Sparkles } from "lucide-react";
import { MOCK_WORDS } from "@/data/mock-words";
import { cn } from "@/lib/utils";

interface MatchItem {
    id: string;
    content: string;
    type: 'TERM' | 'DEF';
    wordId: string;
}

export default function Matching() {
    const [items, setItems] = useState<MatchItem[]>([]);
    const [selected, setSelected] = useState<MatchItem | null>(null);
    const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
    const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);

    const setupGame = () => {
        const gameWords = MOCK_WORDS.slice(0, 4);

        const terms: MatchItem[] = gameWords.map(w => ({
            id: `term-${w.id}`,
            content: w.term,
            type: 'TERM',
            wordId: w.id
        }));

        const defs: MatchItem[] = gameWords.map(w => ({
            id: `def-${w.id}`,
            content: w.definitions[0]?.text || "",
            type: 'DEF',
            wordId: w.id
        }));

        const allItems = [...terms, ...defs].sort(() => 0.5 - Math.random());
        setItems(allItems);
        setMatchedIds(new Set());
        setSelected(null);
        setWrongPair(null);
    };

    useEffect(() => {
        setupGame();
    }, []);

    const handleClick = (item: MatchItem) => {
        if (matchedIds.has(item.id) || wrongPair) return;

        if (!selected) {
            setSelected(item);
        } else {
            if (selected.id === item.id) {
                setSelected(null);
                return;
            }

            if (selected.wordId === item.wordId && selected.type !== item.type) {
                const newMatched = new Set(matchedIds);
                newMatched.add(selected.id);
                newMatched.add(item.id);
                setMatchedIds(newMatched);
                setSelected(null);
            } else {
                setWrongPair([selected.id, item.id]);
                setTimeout(() => {
                    setWrongPair(null);
                    setSelected(null);
                }, 800);
            }
        }
    };

    const isComplete = items.length > 0 && matchedIds.size === items.length;

    return (
        <Layout>
            <div className="max-w-6xl mx-auto py-8 fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-4">
                            <LinkIcon size={32} />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Matching</h1>
                        <p className="text-muted-foreground">Match the terms to their correct definitions.</p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={setupGame}
                        className="gap-2 border-border/50 hover:bg-muted h-12 rounded-xl px-6"
                    >
                        <RefreshCw size={18} className={cn(isComplete && "animate-spin")} /> Reset Game
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {items.map((item) => {
                        const isMatched = matchedIds.has(item.id);
                        const isSelected = selected?.id === item.id;
                        const isWrong = wrongPair?.includes(item.id);

                        return (
                            <div
                                key={item.id}
                                onClick={() => handleClick(item)}
                                className={cn(
                                    "h-44 p-6 rounded-2xl border flex items-center justify-center text-center transition-all cursor-pointer shadow-xl",
                                    "bg-muted/30 border-border/50 text-foreground hover:border-primary/50 hover:bg-muted/50",
                                    isMatched && "bg-green-500/10 border-green-500/30 text-green-500 opacity-40 scale-95 pointer-events-none shadow-none",
                                    isWrong && "bg-destructive/10 border-destructive text-destructive animate-shake shadow-[0_0_20px_rgba(239,68,68,0.2)]",
                                    isSelected && "bg-primary/10 border-primary text-primary ring-2 ring-primary/20 scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.2)]",
                                    item.type === 'TERM' ? 'font-bold text-2xl' : 'text-sm font-medium leading-relaxed'
                                )}
                            >
                                {item.content}
                            </div>
                        );
                    })}
                </div>

                {isComplete && (
                    <div className="mt-16 text-center animate-in zoom-in duration-500">
                        <div className="inline-flex p-6 bg-primary/10 rounded-full text-primary mb-6 animate-bounce">
                            <Sparkles size={48} />
                        </div>
                        <h2 className="text-5xl font-black text-gradient-gold mb-6 tracking-tight">
                            Perfect Match!
                        </h2>
                        <Button
                            onClick={setupGame}
                            size="lg"
                            className="h-14 px-10 rounded-2xl font-bold text-lg bg-primary text-primary-foreground hover:scale-105 transition-transform shadow-glow"
                        >
                            Play Again
                        </Button>
                    </div>
                )}
            </div>

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
        </Layout>
    );
}
