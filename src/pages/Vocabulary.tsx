import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Filter, 
  Volume2, 
  BookmarkPlus, 
  Play,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const occasionTabs = ["Formal", "Casual", "Slang"];

const polysemyMeanings = [
  {
    id: 1,
    partOfSpeech: "adjective",
    definition: "Unwell or suffering from an illness",
    example: "She's been sick for three days.",
    synonyms: ["ill", "unwell", "ailing"],
  },
  {
    id: 2,
    partOfSpeech: "adjective (informal)",
    definition: "Excellent or impressive; very good",
    example: "That skateboard trick was sick!",
    synonyms: ["awesome", "amazing", "cool"],
  },
  {
    id: 3,
    partOfSpeech: "adjective",
    definition: "Feeling nauseous or queasy",
    example: "The boat ride made me feel sick.",
    synonyms: ["nauseous", "queasy"],
  },
];

const movieClips = [
  {
    id: 1,
    movie: "The Social Network",
    thumbnail: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=200&fit=crop",
    timestamp: "0:45:23",
    context: "I'm sick of the accusations.",
  },
  {
    id: 2,
    movie: "Good Will Hunting",
    thumbnail: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=200&fit=crop",
    timestamp: "1:12:08",
    context: "That's a sick move right there.",
  },
  {
    id: 3,
    movie: "The Breakfast Club",
    thumbnail: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=200&fit=crop",
    timestamp: "0:32:15",
    context: "I'm sick of being told what to do.",
  },
];

export default function Vocabulary() {
  const [activeOccasion, setActiveOccasion] = useState("Casual");
  const [expandedMeaning, setExpandedMeaning] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Layout>
      {/* Search Header */}
      <div className="mb-8 fade-in">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for any word..."
            className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <Button variant="gold" className="absolute right-2 top-1/2 -translate-y-1/2">
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze
          </Button>
        </div>
      </div>

      {/* Word Result Dashboard */}
      <div className="space-y-6">
        {/* Word Header */}
        <div className="glass-card p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-5xl font-bold text-gradient-gold">Sick</h1>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <Volume2 className="w-6 h-6" />
                </Button>
              </div>
              <p className="text-xl text-muted-foreground">/sɪk/</p>
            </div>
            <Button variant="outline" className="gap-2">
              <BookmarkPlus className="w-5 h-5" />
              Save to Chest
            </Button>
          </div>

          {/* Occasion Toggles */}
          <div className="inline-flex p-1 bg-muted rounded-full">
            {occasionTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveOccasion(tab)}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  activeOccasion === tab
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Polysemy Accordion */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Meanings</h3>
            
            {polysemyMeanings.map((meaning, index) => (
              <div
                key={meaning.id}
                className={cn(
                  "glass-card overflow-hidden transition-all duration-300",
                  "fade-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() =>
                    setExpandedMeaning(
                      expandedMeaning === meaning.id ? null : meaning.id
                    )
                  }
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                      {meaning.id}
                    </span>
                    <div>
                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {meaning.partOfSpeech}
                      </span>
                      <p className="text-foreground font-medium">{meaning.definition}</p>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-muted-foreground transition-transform",
                      expandedMeaning === meaning.id && "rotate-180"
                    )}
                  />
                </button>

                {expandedMeaning === meaning.id && (
                  <div className="px-4 pb-4 slide-up">
                    <div className="ml-12 space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg border-l-2 border-primary">
                        <p className="text-foreground italic">"{meaning.example}"</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                          Synonyms
                        </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {meaning.synonyms.map((syn) => (
                            <span
                              key={syn}
                              className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm"
                            >
                              {syn}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Comparison Cards */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Usage Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-6 border-l-4 border-success">
                  <h4 className="text-lg font-bold text-foreground mb-2">Sick</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    More casual/informal. Common in everyday speech and informal writing.
                  </p>
                  <div className="p-3 bg-success/10 rounded-lg">
                    <p className="text-sm text-foreground italic">
                      "I'm feeling sick today, so I'll stay home."
                    </p>
                  </div>
                </div>
                <div className="glass-card p-6 border-l-4 border-secondary">
                  <h4 className="text-lg font-bold text-foreground mb-2">Ill</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    More formal. Preferred in professional or written contexts.
                  </p>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <p className="text-sm text-foreground italic">
                      "The patient has been ill for several weeks."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Seen in Cinema */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              Seen in Cinema
            </h3>

            <div className="space-y-3">
              {movieClips.map((clip, index) => (
                <div
                  key={clip.id}
                  className={cn(
                    "glass-card overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-102",
                    "fade-in"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="aspect-video relative">
                    <img
                      src={clip.thumbnail}
                      alt={clip.movie}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-glow">
                        <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-1 bg-background/80 rounded text-xs text-foreground">
                      {clip.timestamp}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-foreground">{clip.movie}</p>
                    <p className="text-xs text-muted-foreground italic mt-1">
                      "{clip.context}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
