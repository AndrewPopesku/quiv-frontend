import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
    AlertCircle,
    RefreshCw,
    Copy,
    Check,
    Sparkles,
    Globe,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { analyzeText, SAMPLE_ENGLISH_TEXT } from "@/data/writing-lab-data";
import { NaturalnessScore } from "@/components/writing/NaturalnessScore";
import { SourceDetected } from "@/components/writing/SourceDetected";
import { SuggestionCard } from "@/components/writing/SuggestionCard";
import { TranslationVariation } from "@/components/writing/TranslationVariation";
import { ImprovementTips } from "@/components/writing/ImprovementTips";
import type { WritingLabResult } from "@/types/vocabulary";

export default function Writing() {
    const [text, setText] = useState(SAMPLE_ENGLISH_TEXT);
    const [result, setResult] = useState<WritingLabResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleAnalyze = () => {
        if (!text.trim()) return;

        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            const analysisResult = analyzeText(text);
            setResult(analysisResult);
            setIsLoading(false);
        }, 500);
    };

    const handleClear = () => {
        setText("");
        setResult(null);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const charCount = text.length;

    return (
        <Layout>
            <PageHeader
                title="Writing Lab"
                description="Smart writing assistance. Enter text in English to improve it, or any other language to translate it."
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Panel - Text Input & Results */}
                <div className="lg:col-span-3 space-y-4">
                    {/* Text Input Area */}
                    <div className="glass-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Your Text</h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-2 text-muted-foreground"
                                onClick={handleCopy}
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-success" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                                Copy
                            </Button>
                        </div>

                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Start writing here... The AI will analyze your text for grammar, style, and naturalness."
                            className="w-full h-48 p-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none custom-scrollbar"
                        />

                        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <span>{wordCount} words</span>
                            <span>{charCount} characters</span>
                        </div>

                    </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button
                                variant="outline"
                                className="gap-2"
                                onClick={handleClear}
                            >
                                <RefreshCw className="w-4 h-4" /> Clear
                            </Button>
                            <Button
                                variant="gold"
                                className="gap-2"
                                onClick={handleAnalyze}
                                disabled={isLoading || !text.trim()}
                            >
                                <Sparkles className="w-4 h-4" />
                                {isLoading ? "Analyzing..." : "Run Analysis"}
                            </Button>
                        </div>

                    {/* Analysis Mode - Suggestions */}
                    {result?.mode === "analysis" && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-warning" />
                                Suggestions ({result.data.suggestions.length})
                            </h3>

                            {result.data.suggestions.map((suggestion, index) => (
                                <SuggestionCard
                                    key={index}
                                    suggestion={suggestion}
                                />
                            ))}
                        </div>
                    )}

                    {/* Translation Mode - English Variations */}
                    {result?.mode === "translation" && (
                        <div className="space-y-3">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Globe className="w-5 h-5 text-secondary" />
                                English Variations
                            </h3>

                            {result.data.variations.map((variation, index) => (
                                <TranslationVariation
                                    key={index}
                                    variation={variation}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Panel - Score/Detection & Tips */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Analysis Mode - Naturalness Score */}
                    {result?.mode === "analysis" && (
                        <>
                            <NaturalnessScore
                                score={result.data.score}
                                grammarStatus={result.data.grammarStatus}
                                vocabularyStatus={result.data.vocabularyStatus}
                                styleStatus={result.data.styleStatus}
                            />
                            <ImprovementTips
                                title="Improvement Tips"
                                tips={result.data.improvementTips}
                            />
                        </>
                    )}

                    {/* Translation Mode - Source Detected & Notes */}
                    {result?.mode === "translation" && (
                        <>
                            <SourceDetected language={result.data.sourceLanguage} />
                            <ImprovementTips
                                title="Translation Notes"
                                tips={result.data.translationNotes}
                            />
                        </>
                    )}

                    {/* Empty State */}
                    {!result && (
                        <div className="glass-card p-6 text-center">
                            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-foreground mb-2">
                                Ready to Analyze
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Enter your text and click "Run Analysis" to get AI-powered feedback on your writing.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
