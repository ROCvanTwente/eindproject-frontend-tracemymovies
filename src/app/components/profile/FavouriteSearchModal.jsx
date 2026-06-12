import { Film, Loader2, Search, X } from "lucide-react";

export function FavouriteSearchModal({ searchQuery, setSearchQuery, searchResults, searchLoading, duplicateError, onAdd, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#151921] border border-[#BFBCFC]/20 rounded-xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-[#BFBCFC]/10">
          <h3 className="text-[#F8FAFC] font-bold font-heading">Search for a film</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-[#BFBCFC]/10 flex items-center justify-center">
            <X className="w-4 h-4 text-[#94A3B8]" />
          </button>
        </div>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input
              autoFocus
              type="text"
              placeholder="Search for a film..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#BFBCFC]/15 rounded-lg pl-9 pr-4 py-2.5 text-[#F8FAFC] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#BFBCFC]/40"
            />
          </div>
          {duplicateError && (
            <p className="mt-2 text-xs text-[#FF61D2] bg-[#FF61D2]/10 border border-[#FF61D2]/20 rounded-lg px-3 py-2">
              {duplicateError}
            </p>
          )}
          <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
            {searchLoading && (
              <div className="flex justify-center py-6">
                <Loader2 className="w-5 h-5 text-[#BFBCFC] animate-spin" />
              </div>
            )}
            {!searchLoading && searchQuery && searchResults.length === 0 && (
              <p className="text-[#94A3B8] text-sm text-center py-6">No films found.</p>
            )}
            {!searchLoading && !searchQuery && (
              <p className="text-[#94A3B8] text-sm text-center py-6">Type a film title to search.</p>
            )}
            {searchResults.map((m) => (
              <button
                key={m.id}
                onClick={() => onAdd(m)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#BFBCFC]/10 transition-colors text-left"
              >
                {m.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w92${m.poster_path}`} alt={m.title} className="w-9 h-14 object-cover rounded flex-none" />
                ) : (
                  <div className="w-9 h-14 bg-[#0B0E14] rounded flex-none flex items-center justify-center">
                    <Film className="w-4 h-4 text-[#94A3B8]" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[#F8FAFC] text-sm font-medium truncate">{m.title}</p>
                  <p className="text-[#94A3B8] text-xs">{m.release_date?.slice(0, 4)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
