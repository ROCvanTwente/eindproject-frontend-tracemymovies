import { Film, Star, ArrowRight } from "lucide-react";

export function WatchlistShort({ watchlist, onNavigate }) {
  return (
    <div className="bg-card text-card-foreground rounded-xl border p-6 shadow-sm flex flex-col h-full justify-between transition-all duration-300 hover:shadow-md">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg tracking-tight">Watchlist Preview</h3>
          </div>
          <button 
            onClick={() => onNavigate("/watchlist")}
            className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
          >
            Bekijk alles <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl border-muted/40">
            <p className="text-sm text-muted-foreground font-medium">Je watchlist is leeg.</p>
            <p className="text-xs text-muted-foreground/70 mt-1 max-w-[200px]">Voeg films toe om je volgende films te plannen.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {watchlist.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onNavigate(`/movie/${movie.id}`)}
                className="group relative overflow-hidden rounded-xl bg-muted/30 border border-muted/50 cursor-pointer aspect-[2/3] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40"
              >
                {movie.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.posterPath}`}
                    alt={movie.movieTitle}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center p-4 text-center text-xs font-medium">
                    {movie.movieTitle}
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end">
                  <p className="text-white font-semibold text-xs leading-tight mb-1 line-clamp-2">{movie.movieTitle}</p>
                  {movie.tmdbRating && (
                    <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      <span>{parseFloat(movie.tmdbRating).toFixed(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}