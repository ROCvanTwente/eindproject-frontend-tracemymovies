import { Award, Film, Activity } from "lucide-react";

export function BottomInsights({ genreData, favoriteActors, favoriteDirectors }) {
  const maxGenreCount = genreData.length > 0 ? Math.max(...genreData.map(o => o.count)) : 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      {/* Dynamic Genre Breakdown */}
      <div className="bg-surface/60 backdrop-blur-3xl border border-border rounded-2xl p-6 shadow-2xl hover:border-accent/30 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors duration-300">
            <Activity className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-foreground tracking-wide group-hover:text-accent transition-colors duration-300">
              Genre Spectrum
            </h2>
            <p className="text-[11px] text-muted-foreground/60">Real-time taste mapping</p>
          </div>
        </div>

        <div className="space-y-4">
          {genreData.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4">No genre distribution recorded.</p>
          ) : (
            genreData.map((item) => (
              <div key={item.genre} className="space-y-1.5 group/item">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-semibold group-hover/item:text-foreground transition-colors duration-200">
                    {item.genre}
                  </span>
                  <span className="text-accent font-bold tracking-tight">
                    {item.count} films
                  </span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden p-px border border-border">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-accent/80 to-accent shadow-[0_0_10px_var(--color-accent)] transition-all duration-1000"
                    style={{ width: `${(item.count / maxGenreCount) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dynamic Star Metrics */}
      <div className="bg-surface/60 backdrop-blur-3xl border border-border rounded-2xl p-6 shadow-2xl hover:border-accent/30 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors duration-300">
            <Award className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-foreground tracking-wide group-hover:text-accent transition-colors duration-300">
              Starring Frequency
            </h2>
            <p className="text-[11px] text-muted-foreground/60">Top aggregated cast listings</p>
          </div>
        </div>

        <div className="space-y-3">
          {favoriteActors.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4">No frequent actors found in watch logs.</p>
          ) : (
            favoriteActors.map((actor, index) => (
              <div 
                key={actor.name} 
                className="flex items-center gap-4 bg-background/50 hover:bg-background rounded-xl p-3 border border-border hover:border-accent/20 transition-all duration-300 group/row"
              >
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-surface to-muted border border-border flex items-center justify-center text-xs font-black text-accent group-hover/row:shadow-[0_0_8px_var(--color-accent)] transition-all duration-300">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-bold truncate tracking-wide group-hover/row:text-accent transition-colors duration-200">
                    {actor.name}
                  </p>
                  <p className="text-muted-foreground/80 text-xs font-medium">
                    {actor.movies} {actor.movies === 1 ? 'movie' : 'movies'} watched
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dynamic Director Metrics */}
      <div className="bg-surface/60 backdrop-blur-3xl border border-border rounded-2xl p-6 shadow-2xl hover:border-accent/30 transition-all duration-500 group relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-accent/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-colors duration-300">
            <Film className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-heading text-foreground tracking-wide group-hover:text-accent transition-colors duration-300">
              Auteur Directors
            </h2>
            <p className="text-[11px] text-muted-foreground/60">Visionaries behind your timeline</p>
          </div>
        </div>

        <div className="space-y-3">
          {favoriteDirectors.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4">No frequent directors found in watch logs.</p>
          ) : (
            favoriteDirectors.map((director, index) => (
              <div 
                key={director.name} 
                className="flex items-center gap-4 bg-background/50 hover:bg-background rounded-xl p-3 border border-border hover:border-accent/20 transition-all duration-300 group/row"
              >
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-surface to-muted border border-border flex items-center justify-center text-xs font-black text-accent group-hover/row:shadow-[0_0_8px_var(--color-accent)] transition-all duration-300">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-sm font-bold truncate tracking-wide group-hover/row:text-accent transition-colors duration-200">
                    {director.name}
                  </p>
                  <p className="text-muted-foreground/80 text-xs font-medium">
                    {director.movies} {director.movies === 1 ? 'film' : 'films'} directed
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}