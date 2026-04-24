import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

type SubtitleWord = {
  text: string;
  start_ms: number;
  end_ms: number;
  is_searched: boolean;
};

type MovieClip = Record<string, any>;

interface Props {
  clip: MovieClip;
  term: string;
  className?: string;
}

export function MovieClipPlayer({ clip, term, className }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeMs, setCurrentTimeMs] = useState(0);

  const subtitleWords: SubtitleWord[] = clip.subtitle_words ?? [];

  const sourceTitle = (clip.source_title as string | undefined)
    ?.replace(/\s*\[[\d:]+\]\s*$/, "")
    .trim();

  function handleTimeUpdate() {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTimeMs(video.currentTime * 1000);
  }

  function renderSubtitle() {
    if (subtitleWords.length > 0) {
      return subtitleWords.map((w, i) => {
        const isActive = currentTimeMs >= w.start_ms && currentTimeMs <= w.end_ms;
        return (
          <span
            key={i}
            className={cn(
              "transition-colors",
              isActive && "underline underline-offset-2",
              w.is_searched ? "font-bold text-yellow-300" : "text-white",
            )}
          >
            {w.text}{" "}
          </span>
        );
      });
    }

    const text: string = clip.full_text ?? "";
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <span key={i} className="font-bold text-yellow-300">{part}</span>
      ) : (
        <span key={i}>{part}</span>
      ),
    );
  }

  return (
    <div
      className={cn("rounded-xl overflow-hidden border border-white/10 flex flex-col", className)}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <video
          ref={videoRef}
          src={clip.video_url}
          controls
          className="w-full object-cover"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
        />
        {isPlaying && (
          <div className="absolute bottom-10 left-0 right-0 flex justify-center pointer-events-none px-3">
            <span className="bg-black/80 text-sm px-3 py-1.5 rounded text-center leading-snug">
              {renderSubtitle()}
            </span>
          </div>
        )}
      </div>
      {sourceTitle && (
        <p className="px-3 py-2 text-xs text-muted-foreground bg-black/30 truncate">
          {sourceTitle}
        </p>
      )}
    </div>
  );
}
