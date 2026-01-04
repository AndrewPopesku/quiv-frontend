import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Play, Clock, Star, Info, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = ["All", "For You", "Drama", "Comedy", "Thriller", "Documentary"];

const movies = [
  {
    id: 1,
    title: "The Shawshank Redemption",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
    matchScore: 95,
    duration: "2h 22m",
    year: 1994,
    rating: 9.3,
    wordsKnown: 1842,
    totalWords: 1920,
  },
  {
    id: 2,
    title: "Pulp Fiction",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop",
    matchScore: 87,
    duration: "2h 34m",
    year: 1994,
    rating: 8.9,
    wordsKnown: 1650,
    totalWords: 1900,
  },
  {
    id: 3,
    title: "Forrest Gump",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
    matchScore: 92,
    duration: "2h 22m",
    year: 1994,
    rating: 8.8,
    wordsKnown: 1720,
    totalWords: 1850,
  },
  {
    id: 4,
    title: "The Dark Knight",
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
    matchScore: 78,
    duration: "2h 32m",
    year: 2008,
    rating: 9.0,
    wordsKnown: 1420,
    totalWords: 1820,
  },
  {
    id: 5,
    title: "Inception",
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
    matchScore: 84,
    duration: "2h 28m",
    year: 2010,
    rating: 8.8,
    wordsKnown: 1580,
    totalWords: 1880,
  },
  {
    id: 6,
    title: "The Godfather",
    poster: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop",
    matchScore: 72,
    duration: "2h 55m",
    year: 1972,
    rating: 9.2,
    wordsKnown: 1380,
    totalWords: 1920,
  },
];

export default function Cinema() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Cinema Mode
          </h1>
          <p className="text-muted-foreground">
            Learn through movies matched to your vocabulary level
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search movies..."
              className="pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "gold" : "pill"}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Movie */}
      <div className="relative rounded-2xl overflow-hidden mb-8 group fade-in">
        <div className="aspect-[21/9] relative">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=800&fit=crop"
            alt="Featured movie"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 p-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-success text-success-foreground text-sm font-bold">
                95% Match
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                Editor's Pick
              </span>
            </div>
            <h2 className="text-4xl font-bold text-foreground mb-3">
              The Shawshank Redemption
            </h2>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              Two imprisoned men bond over a number of years, finding solace and eventual 
              redemption through acts of common decency.
            </p>
            <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 2h 22m
              </span>
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" /> 9.3
              </span>
              <span>1994</span>
              <span>Drama</span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="gold" size="lg" className="gap-2">
                <Play className="w-5 h-5 fill-current" /> Watch Now
              </Button>
              <Button variant="glass" size="lg" className="gap-2">
                <Info className="w-5 h-5" /> More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          Recommended for You
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={cn(
              "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300",
              hoveredMovie === movie.id ? "scale-105 z-10" : "hover:scale-102",
              "fade-in"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onMouseEnter={() => setHoveredMovie(movie.id)}
            onMouseLeave={() => setHoveredMovie(null)}
          >
            <div className="aspect-[2/3] relative">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="cinematic-overlay opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Match Score Badge */}
              <div
                className={cn(
                  "absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold shadow-elevated",
                  movie.matchScore >= 90
                    ? "bg-success text-success-foreground"
                    : movie.matchScore >= 75
                    ? "bg-primary text-primary-foreground"
                    : "bg-warning text-warning-foreground"
                )}
              >
                {movie.matchScore}%
              </div>

              {/* Hover Overlay */}
              <div
                className={cn(
                  "absolute inset-0 flex flex-col justify-end p-4 transition-all duration-300",
                  hoveredMovie === movie.id ? "opacity-100" : "opacity-0"
                )}
              >
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shadow-glow transform group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
                  </div>
                </div>

                {/* Vocabulary Overlap Tooltip */}
                <div className="glass p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Vocabulary Overlap</p>
                  <p className="text-sm font-medium text-foreground">
                    You know {movie.wordsKnown.toLocaleString()}/{movie.totalWords.toLocaleString()} words
                  </p>
                  <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full progress-gold rounded-full transition-all duration-500"
                      style={{ width: `${(movie.wordsKnown / movie.totalWords) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Movie Info */}
            <div className="p-3 bg-card">
              <h4 className="font-semibold text-foreground text-sm truncate mb-1">
                {movie.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-primary" />
                  {movie.rating}
                </span>
                <span>{movie.year}</span>
                <span>{movie.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
