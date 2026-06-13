import { useState } from "react";
import { Eye, Heart, Bookmark, Star, RefreshCw, Pencil } from "lucide-react";

export function MovieSidebar({
  movie,
  isWatched,
  isFavorite,
  isInWatchlist,
  filmRating,
  watchCount,
  onToggleWatch,
  onToggleLike,
  onToggleWatchlist,
  isSavingWatch,
  isSavingLike,
  isSavingWatchlist,
  onSetRating,
  onOpenLog,
  onOpenEditLog,
  hasReview,
  hasLog,
}) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex flex-col gap-3">

      {/* Your Status */}
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8] px-1">
        Your status
      </p>

      {/* Eye + Watchlist + Heart */}
      <div className="bg-[#151921]/80 border border-white/10 rounded-2xl px-5 py-4 flex items-center justify-between">
        <button
          className="relative transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          onClick={onToggleWatch}
          disabled={isSavingWatch}
        >
          <Eye className={`w-10 h-10 transition-colors ${(isWatched || filmRating > 0) ? "text-[#44FFFF] fill-[#44FFFF]/15" : "text-white/40"}`} />
          {watchCount > 1 && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#44FFFF] text-[#0B0E14] text-[9px] font-black rounded-full flex items-center justify-center px-0.5 leading-none">
              {watchCount}
            </span>
          )}
        </button>

        <button
          className="cursor-pointer transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          onClick={onToggleWatchlist}
          disabled={isSavingWatchlist}
        >
          <Bookmark className={`w-10 h-10 transition-colors ${isInWatchlist ? "text-[#BFBCFC] fill-[#BFBCFC]" : "text-white/40"}`} />
        </button>

        <button
          className="cursor-pointer transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          onClick={onToggleLike}
          disabled={isSavingLike}
        >
          <Heart className={`w-10 h-10 transition-colors ${isFavorite ? "text-[#FF61D2] fill-[#FF61D2]" : "text-white/40"}`} />
        </button>
      </div>

      {/* Rating */}
      <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-2xl px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Your Rating</p>
          {filmRating > 0 && (
            <span className="text-sm font-bold text-[#44FFFF]">{filmRating}/10</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
          <div className="flex items-center justify-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => {
              const active = n <= (hoverRating || filmRating);
              return (
                <Star
                  key={n}
                  className={`w-9 h-9 cursor-pointer transition-colors ${active ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#BFBCFC]/15 hover:text-[#44FFFF]/40"}`}
                  onMouseEnter={() => setHoverRating(n)}
                  onClick={() => onSetRating?.(n === filmRating ? 0 : n)}
                />
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-1.5">
            {[6, 7, 8, 9, 10].map((n) => {
              const active = n <= (hoverRating || filmRating);
              return (
                <Star
                  key={n}
                  className={`w-9 h-9 cursor-pointer transition-colors ${active ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#BFBCFC]/15 hover:text-[#44FFFF]/40"}`}
                  onMouseEnter={() => setHoverRating(n)}
                  onClick={() => onSetRating?.(n === filmRating ? 0 : n)}
                />
              );
            })}
          </div>
        </div>
        {filmRating === 0 && (
          <p className="text-xs text-[#94A3B8]/40 mt-3 text-center">Click a star to rate</p>
        )}
      </div>

      {/* Action buttons — single if no engagement yet, two if logged before */}
      {!hasLog ? (
        <button
          onClick={onOpenLog}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#151921]/80 hover:bg-[#151921] border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Review or log
        </button>
      ) : (
        <>
          <button
            onClick={onOpenEditLog}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#151921]/80 hover:bg-[#151921] border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-sm transition-all"
          >
            <Pencil className="w-4 h-4" />
            {hasReview ? "Edit review" : "Add review"}
          </button>
          <button
            onClick={onOpenLog}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#151921]/80 hover:bg-[#151921] border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-sm transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Log again
          </button>
        </>
      )}

      {/* TMDB Score */}
      <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-2xl p-6 mt-3">
        <h3 className="text-xl font-bold font-heading text-[#F8FAFC] mb-4">Scores</h3>
        <div className="flex items-center justify-between">
          <span className="text-[#94A3B8]">TMDB Score</span>
          <span className="text-[#44FFFF] font-data font-medium">
            ★ {movie.vote_average?.toFixed(1)}/10
          </span>
        </div>
      </div>

      {/* Genres */}
      <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold font-heading text-[#F8FAFC] mb-4">Genres</h3>
        <div className="flex flex-wrap gap-2">
          {movie.genres?.map((genre) => (
            <span
              key={genre.id}
              className="bg-[#BFBCFC]/10 text-[#BFBCFC] px-3 py-1 rounded-lg text-sm border border-[#BFBCFC]/20"
            >
              {genre.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
