import { Search, Loader2, Trash2, Film } from "lucide-react";
import { DraggableFilmCard } from "./DraggableFilmCard";

export function FeaturedListsForm({
  isEdit,
  listName,
  setListName,
  isRanked,
  setIsRanked,
  listDescription,
  setListDescription,
  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  isSearching,
  searchResults,
  handleAddMovie,
  movies,
  moveMovie,
  handleRemoveMovie,
  handleDeleteList,
  handleCancel,
  handleSave,
  saving,
}) {
  return (
    <div className="min-h-screen py-8 md:py-12 bg-[#0B0E14] text-[#F8FAFC]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-4 border-b border-[#BFBCFC]/25 pb-4 mb-6">
          <h1 className="text-2xl md:text-4xl font-black leading-none tracking-tight">
            <span className="bg-gradient-to-r from-[#BFBCFC] via-[#9b9dfc] to-[#44FFFF] bg-clip-text text-transparent">
              {isEdit ? "Edit Featured List" : "New Featured List"}
            </span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-5">
            <div>
              <label className="flex items-center gap-1.5 text-sm font-medium text-[#F8FAFC] mb-2">
                Name
                <span className="w-1.5 h-1.5 rounded-full bg-[#44FFFF]" />
              </label>
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                maxLength={100}
                className="w-full bg-[#0B0E14] text-[#F8FAFC] px-3.5 py-2.5 rounded-lg border border-[#BFBCFC]/30 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all"
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isRanked}
                onChange={(e) => setIsRanked(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-[#BFBCFC]/30 bg-[#0B0E14] text-[#BFBCFC] accent-[#BFBCFC] cursor-pointer"
              />
              <div>
                <span className="text-[#F8FAFC] font-medium group-hover:text-[#BFBCFC] transition-colors">
                  Ranked list
                </span>
              </div>
            </label>
          </div>

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-[#F8FAFC] mb-2">Description</label>
            <textarea
              placeholder="Thoughts..."
              maxLength={10000}
              value={listDescription}
              onChange={(e) => setListDescription(e.target.value)}
              className="w-full flex-1 min-h-[110px] bg-[#0B0E14] text-[#F8FAFC] px-3.5 py-2.5 rounded-lg border border-[#BFBCFC]/30 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 transition-all resize-none"
            />
            <div className="mt-1 text-xs text-[#94A3B8] text-right">
              {listDescription.length}/10000 characters
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-y border-[#BFBCFC]/25 py-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] w-4 h-4" />
            <input
              type="text"
              placeholder="Enter name of film..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              className="w-full bg-[#0B0E14] text-[#F8FAFC] pl-10 pr-4 py-2 rounded-lg border border-[#BFBCFC]/30 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20"
            />

            {searchFocused && searchQuery.trim() && (
              <div className="absolute z-20 mt-2 w-full bg-[#0B0E14] border border-[#BFBCFC]/30 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                {isSearching ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-5 h-5 text-[#BFBCFC] animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="p-1.5 space-y-1">
                    {searchResults.map((movie) => (
                      <button
                        type="button"
                        key={movie.id}
                        onClick={() => handleAddMovie(movie)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#BFBCFC]/10 transition-colors text-left"
                      >
                        {movie.poster_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                            alt={movie.title}
                            className="w-9 h-14 object-cover rounded flex-none"
                          />
                        ) : (
                          <div className="w-9 h-14 bg-[#151921] rounded flex-none flex items-center justify-center">
                            <Film className="w-4 h-4 text-[#94A3B8]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-[#F8FAFC] text-sm font-medium truncate">{movie.title}</p>
                          <p className="text-[#94A3B8] text-xs">{movie.release_date?.slice(0, 4) ?? "—"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#94A3B8] text-sm text-center py-6">No films found.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 flex-shrink-0">
            {isEdit && (
              <button
                type="button"
                onClick={handleDeleteList}
                className="flex items-center gap-2 px-5 py-2 rounded-lg font-medium text-[#FF61D2] hover:bg-[#FF61D2]/10 transition-all"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-2 rounded-lg font-medium transition-all shadow-lg shadow-[#BFBCFC]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Create List"}
            </button>
          </div>
        </div>

        {movies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
            {movies.map((movie, index) => (
              <DraggableFilmCard
                key={movie.movieId}
                movie={movie}
                index={index}
                isRanked={isRanked}
                moveMovie={moveMovie}
                onRemove={handleRemoveMovie}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-[#BFBCFC]/30 rounded-xl">
            <Film className="w-10 h-10 text-[#BFBCFC]/20 mx-auto mb-3" />
            <p className="text-[#94A3B8] text-sm">Your list is empty. Use search to add films.</p>
          </div>
        )}
      </div>
    </div>
  );
}