import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Rotate3d,
    Check,
    X,
    Layers
} from "lucide-react";
import { MOCK_WORDS } from "@/data/mock-words";
import { cn } from "@/lib/utils";

export default function Flashcards() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const words = MOCK_WORDS;
    const currentWord = words[currentIndex] || words[0];

    if (!currentWord) return null;

    const nextCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % words.length);
        }, 200);
    };

    const prevCard = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + words.length) % words.length);
        }, 200);
    };

    return (
        <Layout>
            <div className="max-w-2xl mx-auto py-8 fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-4">
                        <Layers size={32} />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-2">Flashcards</h1>
                    <p className="text-muted-foreground">Tap the card to flip. Test your memory.</p>
                </div>

                <div
                    className="h-[450px] perspective-1000 relative group cursor-pointer"
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    <div className={cn(
                        "w-full h-full duration-500 preserve-3d absolute transition-transform",
                        isFlipped ? "rotate-y-180" : ""
                    )}>

                        {/* Front */}
                        <div className="backface-hidden absolute w-full h-full glass-card border-primary/20 flex flex-col items-center justify-center p-8 shadow-2xl">
                            <span className="text-primary/50 text-xs tracking-[0.2em] uppercase absolute top-10 font-bold">Term</span>
                            <h2 className="text-6xl font-black text-gradient-gold mb-6">{currentWord?.term}</h2>
                            <p className="text-muted-foreground font-serif italic text-2xl">{currentWord?.phonetic}</p>
                            <div className="absolute bottom-10 text-muted-foreground flex items-center gap-3 text-sm animate-pulse bg-muted/50 px-4 py-2 rounded-full">
                                <Rotate3d size={18} /> Click to flip
                            </div>
                        </div>

                        {/* Back */}
                        <div className="rotate-y-180 backface-hidden absolute w-full h-full glass-card border-primary/40 bg-muted/30 flex flex-col items-center justify-center p-12 text-center shadow-2xl">
                            <span className="text-primary/50 text-xs tracking-[0.2em] uppercase absolute top-10 font-bold">Definition</span>
                            <p className="text-foreground text-3xl leading-snug mb-8 font-medium">{currentWord.definitions[0]?.text}</p>
                            <div className="p-6 bg-muted/50 rounded-2xl border border-border/50">
                                <p className="text-muted-foreground italic font-serif text-xl leading-relaxed">
                                    "{currentWord?.definitions[0]?.example}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-12 gap-6">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); prevCard(); }}
                        className="w-14 h-14 rounded-full border-border hover:bg-muted transition-all"
                    >
                        <ChevronLeft size={28} />
                    </Button>

                    <div className="flex gap-4 flex-1">
                        <Button
                            onClick={(e) => { e.stopPropagation(); nextCard(); }}
                            className="flex-1 h-14 rounded-2xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                            <X size={20} /> Forgot
                        </Button>
                        <Button
                            onClick={(e) => { e.stopPropagation(); nextCard(); }}
                            className="flex-1 h-14 rounded-2xl bg-green-500/10 text-green-500 hover:bg-green-500/20 border border-green-500/20 font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg"
                        >
                            <Check size={20} /> Got it
                        </Button>
                    </div>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); nextCard(); }}
                        className="w-14 h-14 rounded-full border-border hover:bg-muted transition-all"
                    >
                        <ChevronRight size={28} />
                    </Button>
                </div>

                <div className="text-center mt-8">
                    <div className="inline-block px-4 py-1 bg-muted rounded-full text-muted-foreground font-bold text-xs">
                        Card {currentIndex + 1} of {words.length}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
