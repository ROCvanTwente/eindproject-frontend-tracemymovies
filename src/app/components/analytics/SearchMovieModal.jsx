import { X, Search, Loader2, Film } from "lucide-react";

export function SearchMovieModal({
  isOpen,
  onClose,
  searchQuery,
  onSearchChange,
  duplicateError,
  searchLoading,
  searchResults,
  onAddFavorite,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-primary/20 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-primary/10">
          <h3 className="text-foreground font-bold font-heading">Film zoeken</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full hover:bg-primary/10 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Zoek een film..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-background border border-primary/15 rounded-lg pl-9 pr-4 py-2.5 text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:border-primary/40"
            />
          </div>

          {duplicateError && (
            <p className="mt-2 text-xs text-secondary bg-secondary/10 border border-secondary/20 rounded-lg px-3 py-2">
              {duplicateError}
            </p>
          )}

          <div className="mt-3 max-h-80 overflow-y-auto space-y-1 custom-scrollbar">
            {searchLoading && (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              </div>
            )}
            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-6">Geen films gevonden.</p>
            )}
            {!searchLoading && !searchQuery && (
              <p className="text-muted-foreground text-sm text-center py-6">Typ een filmtitel om te zoeken.</p>
            )}
            {searchResults.map((m) => (
              <button
                key={m.id}
                onClick={() => onAddFavorite(m)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors text-left cursor-pointer"
              >
                {m.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                    alt={m.title}
                    className="w-9 h-14 object-cover rounded flex-none"
                  />
                ) : (
                  <div className="w-9 h-14 bg-background rounded flex-none flex items-center justify-center">
                    <Film className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-medium truncate">{m.title}</p>
                  <p className="text-muted-foreground text-xs">{m.release_date?.slice(0, 4)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}