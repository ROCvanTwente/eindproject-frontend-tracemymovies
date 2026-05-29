import React from "react";
import { Eye, Heart, Plus, Play, Share2, Loader2 } from "lucide-react";

export function MovieHeroActions({
  isWatched,
  isFavorite,
  isInWatchlist,
  isSavingWatch,
  isSavingLike,
  onToggleWatch,
  onToggleLike,
  onToggleWatchlist,
  onOpenTrailer,
  onOpenShare,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onToggleWatch}
        disabled={isSavingWatch}
        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium flex items-center gap-1.5 text-xs md:text-sm w-[115px] justify-center transition-all ${
          isWatched
            ? "bg-[#44FFFF] text-[#000]"
            : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20 hover:bg-[#151921]"
        }`}
      >
        {isSavingWatch ? (
          <Loader2 className="w-4 animate-spin" />
        ) : (
          <>
            <Eye className="w-4" />
            Watched
          </>
        )}
      </button>

      <button
        onClick={onToggleLike}
        disabled={isSavingLike}
        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 text-xs md:text-sm transition-all ${
          isFavorite
            ? "bg-[#44FFFF] text-[#000]"
            : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20"
        }`}
      >
        {isSavingLike ? (
          <Loader2 className="w-4 animate-spin" />
        ) : (
          <Heart className={`w-4 ${isFavorite ? "fill-current" : ""}`} />
        )}
        Like
      </button>

      <button
        onClick={onToggleWatchlist}
        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 text-xs md:text-sm ${
          isInWatchlist
            ? "bg-[#44FFFF] text-[#000]"
            : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20"
        }`}
      >
        <Plus className="w-4" />
        Watchlist
      </button>

      <button
        onClick={onOpenTrailer}
        className="bg-[#FF61D2]/10 hover:bg-[#FF61D2] text-[#FF61D2] hover:text-[#0B0E14] px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 border border-[#FF61D2]/30 text-xs md:text-sm"
      >
        <Play className="w-4 fill-current" />
        Trailer
      </button>

      <button
        onClick={onOpenShare}
        className="bg-[#151921]/70 hover:bg-[#44FFFF] hover:text-[#0B0E14] text-[#F8FAFC] px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 border border-[#BFBCFC]/20 text-xs md:text-sm"
      >
        <Share2 className="w-4" />
        Share
      </button>
    </div>
  );
}