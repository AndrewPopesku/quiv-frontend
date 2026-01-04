import { Volume2, BookmarkPlus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function WordOfTheDay() {
  return (
    <div className="bento-item relative overflow-hidden col-span-2 row-span-2">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium uppercase tracking-wider">
            Word of the Day
          </span>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <BookmarkPlus className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-gold">
              Ephemeral
            </h2>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Volume2 className="w-6 h-6" />
            </Button>
          </div>

          <p className="text-muted-foreground text-lg mb-2">
            /ɪˈfem(ə)rəl/
          </p>

          <p className="text-foreground/90 text-lg leading-relaxed mb-6">
            Lasting for a very short time. Something that is transient, fleeting, or momentary.
          </p>

          <div className="p-4 glass-card mb-6">
            <p className="text-muted-foreground italic mb-2">
              "The ephemeral beauty of cherry blossoms reminds us to appreciate the present moment."
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">From "Lost in Translation" (2003)</span>
            </div>
          </div>
        </div>

        <Button variant="gold" className="w-full group">
          <span>Explore Full Definition</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
}
