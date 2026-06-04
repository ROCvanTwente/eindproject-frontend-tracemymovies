import { Heart, Plus, X } from "lucide-react";

export function FavoriteFilms({ favoriteMovies, onOpenSearch, onRemoveFavorite, onNavigate }) {
  return (
    <div className="bg-surface/40 backdrop-blur-xl border border-primary/10 rounded-xl p-4 h-110 flex flex-col w-full overflow-hidden">
      <h2 className="text-xl font-bold font-heading text-foreground mb-4 flex items-center gap-2 flex-none">
        <Heart className="w-5 h-5 text-secondary" fill="var(--color-secondary)" />
        Favorite Films
      </h2>

      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3 min-h-0">
        {Array.from({ length: 4 }).map((_, i) => {
          const movie = favoriteMovies[i];
          return movie ? (
            <div
              key={movie.id}
              onClick={() => onNavigate(`/movie/${movie.id}`)}
              className="relative group cursor-pointer rounded-xl overflow-hidden border border-primary/10 bg-background/40 hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/5 transition-all duration-300 h-full w-full min-h-0"
            >
              <div className="absolute inset-0 z-0">
                <img
                  src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/40 to-transparent z-10" />
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(movie.id);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 backdrop-blur-sm z-30"
              >
                <X className="w-3 h-3 text-white" />
              </button>

              <div className="absolute bottom-0 inset-x-0 p-2.5 z-20 pointer-events-none">
                <h3 className="text-foreground font-semibold text-xs truncate group-hover:text-secondary transition-colors">
                  {movie.title}
                </h3>
                <p className="text-muted-foreground text-[10px]">
                  {movie.release_date?.slice(0, 4)}
                </p>
              </div>
            </div>
          ) : (
            <button
              key={`empty-${i}`}
              onClick={onOpenSearch}
              className="group relative border border-dashed border-primary/20 rounded-xl bg-surface/10 hover:border-secondary/40 hover:bg-secondary/5 transition-all duration-300 flex flex-col items-center justify-center gap-2 h-full w-full min-h-0"
            >
              <div className="w-9 h-9 rounded-full border border-dashed border-primary/20 group-hover:border-secondary/40 flex items-center justify-center transition-all duration-300">
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-all duration-300 group-hover:rotate-90" />
              </div>
              <span className="text-muted-foreground text-xs font-medium group-hover:text-secondary transition-colors">
                Voeg toe
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}