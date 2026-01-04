import { Play, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const movies = [
  {
    id: 1,
    title: "Inception",
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=400&fit=crop",
    matchScore: 92,
    duration: "2h 28m",
  },
  {
    id: 2,
    title: "The Grand Budapest Hotel",
    poster: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=400&fit=crop",
    matchScore: 85,
    duration: "1h 39m",
  },
  {
    id: 3,
    title: "Amélie",
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=400&fit=crop",
    matchScore: 78,
    duration: "2h 2m",
  },
];

export function CinemaPreview() {
  return (
    <div className="bento-item col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Continue Learning</h3>
          <p className="text-sm text-muted-foreground">Movies matched to your level</p>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className={cn(
              "group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105",
              "fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="aspect-[2/3] relative">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="cinematic-overlay" />
              
              {/* Match Score Badge */}
              <div
                className={cn(
                  "absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-bold",
                  movie.matchScore >= 85
                    ? "bg-success text-success-foreground"
                    : movie.matchScore >= 70
                    ? "bg-primary text-primary-foreground"
                    : "bg-warning text-warning-foreground"
                )}
              >
                {movie.matchScore}%
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center shadow-glow">
                  <Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" />
                </div>
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h4 className="text-sm font-semibold text-foreground truncate">
                  {movie.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{movie.duration}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
