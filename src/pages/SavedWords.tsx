import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
    Search,
    Trash2,
    RefreshCw,
    ChevronRight,
    BookOpen,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { DictionaryService } from "@/api";

export default function SavedWords() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState("");

    const { data: words = [], isLoading, error } = useQuery({
        queryKey: ["saved-words"],
        queryFn: () => DictionaryService.dictionaryWordsList(),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => DictionaryService.dictionaryWordsDestroy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["saved-words"] });
            queryClient.invalidateQueries({ queryKey: ["daily-stats"] });
        },
    });

    const resetMasteryMutation = useMutation({
        mutationFn: (id: number) => DictionaryService.dictionaryWordsResetMasteryCreate(id, {} as any),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["saved-words"] }),
    });

    const filteredWords = words.filter(w =>
        w.word.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.word.definitions[0]?.translation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this word from your saved list?')) {
            deleteMutation.mutate(id);
        }
    };

    const handleRevise = (id: number) => {
        resetMasteryMutation.mutate(id);
    };

    return (
        <Layout>
            <PageHeader
                title="Saved Words"
                description="Manage your vocabulary collection and track progress."
                actions={
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search collection..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full md:w-72 bg-muted border border-border rounded-xl py-2.5 pl-10 pr-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        />
                    </div>
                }
            />

            <div className="glass-card overflow-hidden fade-in" style={{ animationDelay: '100ms' }}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : error ? (
                    <EmptyState
                        title="Failed to load words"
                        description="Something went wrong. Please try again later."
                        icon={BookOpen}
                    />
                ) : (
                    <>
                        <div className="grid grid-cols-12 gap-4 p-5 bg-muted/30 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                            <div className="col-span-5 md:col-span-4 pl-4">Word</div>
                            <div className="col-span-4 hidden md:block border-l border-border/50 pl-4">First Definition</div>
                            <div className="col-span-4 md:col-span-2 border-l border-border/50 pl-4">Mastery</div>
                            <div className="col-span-3 md:col-span-2 text-right pr-4">Actions</div>
                        </div>

                        <div className="divide-y divide-border/50">
                            {filteredWords.map((userWord, index) => (
                                <div
                                    key={userWord.id}
                                    className="grid grid-cols-12 gap-4 p-5 items-center hover:bg-muted/20 transition-all cursor-pointer group animate-in fade-in slide-in-from-bottom-2"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="col-span-5 md:col-span-4 pl-4">
                                        <div className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">{userWord.word.term}</div>
                                        <div className="text-xs text-muted-foreground font-serif italic">{userWord.word.phonetic}</div>
                                    </div>

                                    <div className="col-span-4 hidden md:block text-sm text-muted-foreground truncate pr-4 border-l border-border/10 pl-4">
                                        {userWord.word.definitions[0]?.translation || "No definition available"}
                                    </div>

                                    <div className="col-span-4 md:col-span-2 border-l border-border/10 pl-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={cn(
                                                "text-[10px] font-bold px-1.5 py-0.5 rounded",
                                                userWord.mastery >= 100 ? "bg-green-500/10 text-green-500" : "bg-primary/10 text-primary"
                                            )}>
                                                {userWord.mastery}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-500",
                                                    userWord.mastery >= 100 ? "bg-green-500" : "progress-gold"
                                                )}
                                                style={{ width: `${userWord.mastery}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="col-span-3 md:col-span-2 flex justify-end gap-1 pr-4">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => { e.stopPropagation(); handleRevise(userWord.id); }}
                                            disabled={resetMasteryMutation.isPending}
                                            className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/10"
                                            title="Revise Word"
                                        >
                                            <RefreshCw size={16} className={cn(resetMasteryMutation.isPending && "animate-spin")} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => { e.stopPropagation(); handleDelete(userWord.id); }}
                                            disabled={deleteMutation.isPending}
                                            className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                            title="Delete Word"
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                        <div className="h-9 w-9 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredWords.length === 0 && (
                                <EmptyState
                                    title="No words found"
                                    description="Try clearing your search or add some words to your collection."
                                    icon={BookOpen}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
}
