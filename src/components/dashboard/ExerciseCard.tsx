import type { ExerciseCardProps } from "@/types/components";
import { cn } from "@/lib/utils";

export const ExerciseCard = ({ exercise, onClick }: ExerciseCardProps) => {
    const { title, description, icon: Icon, variant } = exercise;

    if (variant === 'gradient') {
        return (
            <button
                onClick={onClick}
                className="bg-gradient-to-br from-secondary to-[#1e40af] p-8 rounded-2xl border border-white/10 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all text-left group flex flex-col justify-between h-56 relative overflow-hidden"
            >
                <div className="bg-white/20 w-14 h-14 rounded-xl flex items-center justify-center text-white backdrop-blur-sm">
                    <Icon size={28} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
                    <p className="text-white/80 leading-relaxed">{description}</p>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className="glass-card hover:border-primary transition-all p-8 text-left group flex flex-col justify-between h-56"
        >
            <div className="bg-muted w-14 h-14 rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                <Icon size={28} />
            </div>
            <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
            </div>
        </button>
    );
};
