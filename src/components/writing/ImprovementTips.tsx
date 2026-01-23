interface ImprovementTipsProps {
    title: string;
    tips: string[];
}

export function ImprovementTips({ title, tips }: ImprovementTipsProps) {
    return (
        <div className="glass-card p-6">
            <h3 className="font-semibold text-foreground mb-4">{title}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
                {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
                        {tip}
                    </li>
                ))}
            </ul>
        </div>
    );
}
