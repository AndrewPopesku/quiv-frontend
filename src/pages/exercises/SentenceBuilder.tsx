import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
    ChevronRight,
    RefreshCw,
    Send,
    CheckCircle,
    XCircle,
    Trophy,
    PenTool,
    Sparkles,
    Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { DictionaryService, PracticeService } from "@/api";
import type { AnalysisResult } from "@/types/vocabulary";

interface ExerciseWord {
    id: string;
    term: string;
    phonetic: string;
    definitions: Array<{ text: string }>;
}

export default function SentenceBuilder() {
    const [currentWord, setCurrentWord] = useState<ExerciseWord | null>(null);
    const [userInput, setUserInput] = useState("");
    const [feedback, setFeedback] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);

    const { data: words = [], isLoading } = useQuery<ExerciseWord[]>({
        queryKey: ["exercise-words"],
        queryFn: async () => {
            const userWords = await DictionaryService.dictionaryUserWordsList();
            const wordsWithDefs = await Promise.all(
                userWords.map(async (uw) => {
                    const def = await DictionaryService.dictionaryWordsDefinitionsLookupRetrieve(uw.word.id);
                    return {
                        id: String(uw.word.id),
                        term: uw.word.term,
                        phonetic: uw.word.phonetic,
                        definitions: [{ text: def.translation ?? "" }],
                    };
                })
            );
            return wordsWithDefs;
        },
    });

    useEffect(() => {
        if (words.length > 0 && !currentWord) {
            setCurrentWord(words[Math.floor(Math.random() * words.length)]);
        }
    }, [words]);

    const pickRandomWord = () => {
        if (words.length === 0) return;
        const random = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(random);
        setUserInput("");
        setFeedback(null);
        setCompleted(false);
    };

    const checkAnswer = async () => {
        if (!userInput.trim() || !currentWord) return;
        setLoading(true);
        try {
            const response: any = await PracticeService.practiceAnalyzeCreate({ text: userInput });
            const result: AnalysisResult = {
                score: response.data?.naturalness_score ?? 0,
                grammarStatus: response.data?.grammar_rating ?? 'Good',
                vocabularyStatus: response.data?.vocabulary_rating ?? 'Good',
                styleStatus: response.data?.style_rating ?? 'Good',
                suggestions: [],
                tips: response.data?.improvement_tips ?? [],
            };
            setFeedback(result);
            if (result.score > 70) {
                setCompleted(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </Layout>
        );
    }

    if (words.length === 0) {
        return (
            <Layout>
                <div className="text-center py-20 text-muted-foreground">
                    No saved words yet. Add some words to your collection first.
                </div>
            </Layout>
        );
    }

    if (!currentWord) return null;

    return (
        <Layout>
            <div className="max-w-3xl mx-auto py-8 fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-secondary/10 rounded-2xl text-secondary mb-4 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                        <PenTool size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">Sentence Builder</h1>
                    <p className="text-muted-foreground text-lg">Prove your mastery. Use the word correctly in a sentence.</p>
                </div>

                <div className="glass-card border-secondary/20 overflow-hidden shadow-2xl relative">
                    {/* Progress Shimmer if loading */}
                    {loading && (
                        <div className="absolute top-0 left-0 w-full h-1 overflow-hidden">
                            <div className="h-full bg-secondary animate-shimmer w-full"></div>
                        </div>
                    )}

                    <div className="bg-muted/30 p-10 text-center border-b border-border/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent pointer-events-none"></div>
                        <span className="text-secondary/50 text-xs tracking-[0.3em] uppercase mb-4 block font-black relative z-10">Your Target Word</span>
                        <h2 className="text-6xl font-black text-secondary mb-3 tracking-tighter relative z-10">{currentWord.term}</h2>
                        <p className="text-muted-foreground font-serif italic text-2xl mb-6 relative z-10">{currentWord.phonetic}</p>
                        <div className="inline-block bg-muted/50 backdrop-blur-sm px-6 py-2.5 rounded-xl text-sm font-medium text-foreground border border-border/50 relative z-10">
                            {currentWord.definitions?.[0]?.text}
                        </div>
                    </div>

                    <div className="p-10">
                        <div className="mb-8">
                            <label className="block text-muted-foreground text-sm mb-3 font-bold uppercase tracking-wider">
                                Write a sentence using <span className="text-secondary">"{currentWord.term}"</span>:
                            </label>
                            <div className="relative">
                                <textarea
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    placeholder={`e.g., The ${currentWord.term.toLowerCase()} moment was...`}
                                    className={cn(
                                        "w-full bg-muted/20 border-2 border-border/50 rounded-2xl p-6 text-xl text-foreground focus:outline-none focus:border-secondary transition-all h-40 resize-none font-medium leading-relaxed",
                                        completed && "border-green-500/30 bg-green-500/5"
                                    )}
                                    disabled={loading || completed}
                                />
                                {completed && (
                                    <div className="absolute inset-0 bg-green-500/5 backdrop-blur-[1px] rounded-2xl flex items-center justify-center animate-in fade-in zoom-in">
                                        <div className="bg-green-500 text-black px-6 py-3 rounded-full font-black text-lg flex items-center gap-3 shadow-glow-green">
                                            <Trophy size={24} /> Mastered!
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!feedback && !completed && (
                            <Button
                                onClick={checkAnswer}
                                disabled={loading || userInput.length < 5}
                                className="w-full h-16 rounded-2xl bg-secondary text-white font-black text-xl hover:scale-[1.01] active:scale-[0.99] transition-all shadow-glow-blue flex items-center justify-center gap-3 disabled:opacity-50"
                            >
                                {loading ? <RefreshCw className="animate-spin w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
                                Check My Sentence
                            </Button>
                        )}

                        {feedback && (
                            <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                                <div className={cn(
                                    "rounded-2xl p-8 mb-8 border-2 shadow-xl",
                                    completed ? "bg-green-500/10 border-green-500/30" : "bg-orange-500/10 border-orange-500/30"
                                )}>
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className={cn(
                                                "font-black text-2xl mb-1",
                                                completed ? "text-green-500" : "text-orange-500"
                                            )}>
                                                {completed ? 'Excellent Usage!' : 'Keep Trying'}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-muted-foreground text-sm font-bold uppercase tracking-wider">AI Usage Score:</span>
                                                <span className="text-foreground font-black text-xl">{feedback.score}</span>
                                                <div className="w-32 h-2 bg-muted rounded-full ml-2 overflow-hidden">
                                                    <div
                                                        className={cn("h-full transition-all duration-1000", completed ? "bg-green-500" : "bg-orange-500")}
                                                        style={{ width: `${feedback.score}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        {completed ? <CheckCircle className="text-green-500 w-10 h-10" /> : <XCircle className="text-orange-500 w-10 h-10" />}
                                    </div>

                                    <div className="space-y-3">
                                        {feedback.tips.map((tip, i) => (
                                            <div key={i} className="flex gap-3 text-foreground font-medium bg-muted/30 p-3 rounded-xl border border-border/30">
                                                <div className={cn("w-1.5 h-1.5 rounded-full mt-2.5 shrink-0", completed ? "bg-green-500" : "bg-orange-500")}></div>
                                                <span>{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button
                                    onClick={pickRandomWord}
                                    variant="outline"
                                    className="w-full h-16 rounded-2xl border-border/50 font-black text-xl hover:bg-muted transition-all flex items-center justify-center gap-3 shadow-lg"
                                >
                                    Next Word <ChevronRight size={24} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={pickRandomWord}
                        className="text-muted-foreground font-bold hover:text-foreground transition-all flex items-center gap-2 px-4 py-2 hover:bg-muted rounded-xl text-sm"
                    >
                        Skip this word <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            <style>{`
        .shadow-glow-green {
          box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
        }
        .shadow-glow-blue {
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
        }
      `}</style>
        </Layout>
    );
}
