import { Film, Star, ArrowRight } from "lucide-react";

export function WatchlistShort({ watchlist, onNavigate }) {
  return (
    <div className="bg-[#151921]/40 backdrop-blur-xl border border-[#BFBCFC]/10 rounded-xl p-4 h-[440px] flex flex-col w-full overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-none">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-[#44FFFF]" />
          <h2 className="text-xl font-bold font-heading text-[#F8FAFC]">
            Watchlist Preview
          </h2>
        </div>
        <button 
          onClick={() => onNavigate("/watchlist")}
          className="text-xs font-medium text-[#64748B] hover:text-[#44FFFF] flex items-center gap-1 transition-colors"
        >
          Bekijk alles <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {watchlist.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center border border-dashed border-[#BFBCFC]/20 rounded-xl bg-[#151921]/10 p-6">
          <p className="text-sm text-[#94A3B8] font-medium">Je watchlist is leeg.</p>
          <p className="text-xs text-[#64748B] mt-1 max-w-[200px]">Voeg films toe om je volgende films te plannen.</p>
        </div>
      ) : (
        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 min-h-0">
          {Array.from({ length: 4 }).map((_, i) => {
            const movie = watchlist[i];
            return movie ? (
              <div
                key={movie.id}
                onClick={() => onNavigate(`/movie/${movie.id}`)}
                className="relative group cursor-pointer rounded-xl overflow-hidden border border-[#BFBCFC]/10 bg-[#0B0E14]/40 hover:border-[#44FFFF]/50 hover:shadow-[0_0_20px_rgba(68,255,255,0.15)] transition-all duration-300 h-full w-full min-h-0"
              >
                <div className="absolute inset-0 z-0">
                  {movie.posterPath ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                      alt={movie.movieTitle}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#0B0E14]/80 flex items-center justify-center p-3 text-center text-xs font-medium text-[#94A3B8]">
                      {movie.movieTitle}
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10" />

                <div className="absolute bottom-0 inset-x-0 p-2.5 z-20 pointer-events-none">
                  <h3 className="text-[#F8FAFC] font-semibold text-xs truncate group-hover:text-[#44FFFF] transition-colors">
                    {movie.movieTitle}
                  </h3>
                  {movie.tmdbRating && (
                    <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-medium mt-0.5">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{parseFloat(movie.tmdbRating).toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                key={`empty-${i}`}
                className="border border-dashed border-[#BFBCFC]/10 rounded-xl bg-[#151921]/5 h-full w-full min-h-0 opacity-40 flex items-center justify-center"
              />
            );
          })}
        </div>
      )}
    </div>
  );
}