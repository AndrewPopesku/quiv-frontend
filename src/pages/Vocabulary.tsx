import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Search,
  Volume2,
  BookmarkPlus,
  Play,
  Sparkles
} from "lucide-react";
import { MOCK_WORDS } from "@/data/mock-words";
import type { Word } from "@/types/vocabulary";
import { EmptyState } from "@/components/ui/EmptyState";

export default function Vocabulary() {
  const [searchQuery, setSearchQuery] = useState("");

  // Find active word based on search or fallback to first
  const filteredWords = MOCK_WORDS.filter(w =>
    w.term.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeWord: Word | undefined = filteredWords.length > 0 ? filteredWords[0] : undefined;

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
            className="w-full pl-12 pr-4 py-4 bg-muted border border-border rounded-2xl text-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all focus:border-primary/30"
          />
          <Button variant="gold" className="absolute right-2 top-1/2 -translate-y-1/2">
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze
          </Button>
        </div>
      </div>

      {activeWord ? (
        <div className="fade-in" style={{ animationDelay: '100ms' }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Left Column: Header + Meanings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Word Header */}
              <div className="glass-card p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h1 className="text-5xl font-bold text-gradient-gold">{activeWord.term}</h1>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Volume2 className="w-6 h-6" />
                      </Button>
                    </div>
                    <p className="text-xl text-muted-foreground font-serif italic">{activeWord.phonetic}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <BookmarkPlus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Meanings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Meanings</h3>

                {activeWord.definitions.map((meaning, index) => (
                  <div
                    key={index}
                    className="glass-card overflow-hidden p-6 hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <span className="w-8 h-8 shrink-0 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </span>
                      <div>
                        <span className="text-xs text-primary font-bold uppercase tracking-widest">
                          {meaning.partOfSpeech} {meaning.isInformal && '(Informal)'}
                        </span>
                        <p className="text-foreground font-medium text-xl mt-1 leading-relaxed">
                          {meaning.text}
                        </p>
                      </div>
                    </div>

                    <div className="ml-12 space-y-4">
                      <div className="p-4 bg-muted/40 rounded-xl border-l-4 border-primary/50 italic font-serif text-muted-foreground">
                        "{meaning.example}"
                      </div>

                      {meaning.synonyms.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                            Synonyms
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {meaning.synonyms.map((syn) => (
                              <span
                                key={syn}
                                className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors cursor-pointer"
                              >
                                {syn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Cinema */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Play className="w-5 h-5 text-primary" fill="currentColor" />
                Seen in Cinema
              </h3>

              <div className="space-y-4">
                {activeWord.cinemaExamples.length > 0 ? (
                  activeWord.cinemaExamples.map((clip, index) => (
                    <div
                      key={index}
                      className="glass-card overflow-hidden group cursor-pointer hover:border-primary/30 transition-all"
                    >
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        <img
                          src={clip.imageUrl}
                          alt={clip.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                            <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded font-mono text-[10px] text-white tracking-tighter">
                          {clip.timestamp}
                        </span>
                      </div>
                      <div className="p-4 bg-card/50">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {clip.title}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass-card p-12 text-center border-dashed">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                      <Play className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                    <p className="text-muted-foreground text-sm font-medium">
                      No movie clips found for this word.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No words found"
          description="Try searching for another word or check your spelling."
          icon={Search}
        />
      )}
    </Layout>
  );
}
