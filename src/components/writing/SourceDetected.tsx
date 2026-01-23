import { Globe } from "lucide-react";

interface SourceDetectedProps {
    language: string;
}

export function SourceDetected({ language }: SourceDetectedProps) {
    return (
        <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-success" />
                Source Detected
            </h3>

            <div className="bg-primary/20 rounded-xl py-4 px-6 text-center mb-4">
                <span className="text-2xl font-bold text-primary">{language}</span>
            </div>

            <p className="text-sm text-muted-foreground">
                We've automatically detected the language and provided English translations suitable for different social contexts.
            </p>
        </div>
    );
}
