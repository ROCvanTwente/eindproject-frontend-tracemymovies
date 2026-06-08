import React from "react";
import { Play, Share2 } from "lucide-react";

export function MovieHeroActions({
  onOpenTrailer,
  onOpenShare,
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onOpenTrailer}
        className="bg-[#FF61D2]/10 hover:bg-[#FF61D2] text-[#FF61D2] hover:text-[#0B0E14] px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 border border-[#FF61D2]/30 text-xs md:text-sm transition-all"
      >
        <Play className="w-4 fill-current" />
        Trailer
      </button>

      <button
        onClick={onOpenShare}
        className="bg-[#151921]/70 hover:bg-[#44FFFF] hover:text-[#0B0E14] text-[#F8FAFC] px-3 md:px-4 py-1.5 md:py-2 rounded-lg flex items-center gap-1.5 border border-[#BFBCFC]/20 text-xs md:text-sm transition-all"
      >
        <Share2 className="w-4" />
        Share
      </button>
    </div>
  );
}