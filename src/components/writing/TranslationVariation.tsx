import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { TranslationVariation as TranslationVariationType } from "@/types/vocabulary";

interface TranslationVariationProps {
    variation: TranslationVariationType;
}

const registerStyles = {
    FORMAL: "bg-primary/20 text-primary",
    CASUAL: "bg-secondary/20 text-secondary",
    CREATIVE: "bg-purple-500/20 text-purple-400",
};

export function TranslationVariation({ variation }: TranslationVariationProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(variation.text.replace(/"/g, ''));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="glass-card p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <span className={cn(
                        "text-xs font-bold uppercase tracking-wide px-2 py-1 rounded",
                        registerStyles[variation.register]
                    )}>
                        {variation.register}
                    </span>
                    <p className="text-foreground mt-3 font-medium">
                        {variation.text}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 italic">
                        {variation.description}
                    </p>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                >
                    {copied ? (
                        <Check className="w-4 h-4 text-success" />
                    ) : (
                        <Copy className="w-4 h-4" />
                    )}
                </button>
            </div>
        </div>
    );
}
