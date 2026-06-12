import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Search, X, Film, List, Loader2, Trash2 } from "lucide-react";
import { DndProvider, useDrag, useDrop, useDragLayer } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p";

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw==";

function DraggableFilmCard({ movie, index, isRanked, moveMovie, onDropEnd, onRemove }) {
  const ref = useRef(null);
  const posterRef = useRef(null);
  const previewImgRef = useRef(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: "NEW_LIST_MOVIE",
    item: () => {
      const rect = posterRef.current?.getBoundingClientRect();
      return { index, movie, width: rect?.width, height: rect?.height };
    },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    end: () => onDropEnd?.(),
  });

  useEffect(() => {
    if (previewImgRef.current) {
      preview(previewImgRef.current, { captureDraggingState: true });
    }
  }, [preview]);

  const [, drop] = useDrop({
    accept: "NEW_LIST_MOVIE",
    hover: (item, monitor) => {
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex || !ref.current) return;

      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleX = (hoverRect.right - hoverRect.left) / 2;
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;

      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset.x - hoverRect.left;
      const hoverClientY = clientOffset.y - hoverRect.top;

      // Only swap once the dragged poster has reached the middle of this card
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX && hoverClientY > hoverMiddleY) return;

      moveMovie(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`group cursor-move ${isDragging ? "opacity-0" : ""}`}>
      <img
        ref={previewImgRef}
        src={TRANSPARENT_PIXEL}
        alt=""
        style={{ position: "fixed", top: -1, left: -1, width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      />
      <div ref={posterRef} className="relative rounded-lg overflow-hidden bg-[#151921]">
        <div className="aspect-[2/3]">
          {movie.poster ? (
            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#151921]">
              <Film className="w-8 h-8 text-[#94A3B8]/20" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onRemove(movie.movieId)}
          className="absolute top-1.5 right-1.5 bg-[#FF61D2]/90 backdrop-blur-sm hover:bg-[#FF61D2] text-white p-1.5 rounded-lg transition-all shadow-lg opacity-0 group-hover:opacity-100"
          title="Remove from list"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <p className="mt-1.5 text-[#F8FAFC] text-xs font-medium truncate">{movie.title}</p>
      {isRanked && (
        <p className="text-center text-[#BFBCFC] font-bold font-heading text-sm">{index + 1}</p>
      )}
    </div>
  );
}

function getDragLayerStyles(initialOffset, currentOffset) {
  if (!initialOffset || !currentOffset) return { display: "none" };
  const { x, y } = currentOffset;
  return { transform: `translate(${x}px, ${y}px)` };
}

function FilmDragLayer() {
  const { isDragging, item, initialOffset, currentOffset } = useDragLayer((monitor) => ({
    item: monitor.getItem(),
    isDragging: monitor.isDragging(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
  }));

  if (!isDragging || !item) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div style={getDragLayerStyles(initialOffset, currentOffset)}>
        <div
          style={{ width: item.width, height: item.height }}
          className="rounded-lg overflow-hidden shadow-2xl shadow-black/60 ring-2 ring-[#BFBCFC]"
        >
          {item.movie?.poster ? (
            <img src={item.movie.poster} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#151921]">
              <Film className="w-8 h-8 text-[#94A3B8]/20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreateListPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const auth = useAuth();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [isRanked, setIsRanked] = useState(false);
  const [movies, setMovies] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = useMemo(
    () =>
      auth?.token ||
      auth?.user?.token ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token"),
    [auth]
  );

  useEffect(() => {
    if (!isEdit || !token) return;

    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load list");
        const data = await res.json();
        setListName(data.listName ?? "");
        setListDescription(data.listDescription ?? "");
        setIsRanked(Boolean(data.isRanked));
        setMovies(data.movies ?? []);
      } catch {
        toast.error("Could not load this list");
        navigate("/my-lists");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [isEdit, id, token]);

  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/search?query=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        const results = Array.isArray(data) ? data : [];
        setSearchResults(results.filter((m) => !movies.some((lm) => lm.movieId === m.id)).slice(0, 8));
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchQuery, movies]);

  const handleAddMovie = async (movie) => {
    const newEntry = {
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${TMDB_POSTER_BASE}/w500${movie.poster_path}` : null,
      releaseYear: movie.release_date?.split("-")[0] ?? null,
      voteAverage: movie.vote_average ?? null,
    };

    setSearchQuery("");
    setSearchResults([]);

    if (isEdit) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${id}/movies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ movieId: movie.id }),
        });
        if (!res.ok) throw new Error("Failed to add movie");
        setMovies((prev) => [...prev, newEntry]);
        toast.success(`Added ${movie.title}`);
      } catch {
        toast.error("Could not add movie to list");
      }
    } else {
      setMovies((prev) => [...prev, newEntry]);
    }
  };

  const handleRemoveMovie = async (movieId) => {
    if (isEdit) {
      const previous = movies;
      setMovies((prev) => prev.filter((m) => m.movieId !== movieId));
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${id}/movies/${movieId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to remove movie");
      } catch {
        setMovies(previous);
        toast.error("Could not remove movie from list");
      }
    } else {
      setMovies((prev) => prev.filter((m) => m.movieId !== movieId));
    }
  };

  const moveMovie = (dragIndex, hoverIndex) => {
    setMovies((prev) => {
      const updated = [...prev];
      const [dragged] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, dragged);
      return updated;
    });
  };

  const handleDropEnd = async () => {
    if (!isEdit) return;
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${id}/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ movieIds: movies.map((m) => m.movieId) }),
      });
    } catch {
      toast.error("Could not save new order");
    }
  };

  const handleSave = async () => {
    if (!listName.trim()) {
      toast.error("Please give your list a name");
      return;
    }

    setSaving(true);
    try {
      if (isEdit) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listName: listName.trim(),
            listDescription: listDescription.trim(),
            isRanked,
          }),
        });
        if (!res.ok) throw new Error("Failed to update list");
        toast.success("List updated");
        navigate(`/list/${id}`);
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listName: listName.trim(),
            listDescription: listDescription.trim(),
            isRanked,
          }),
        });
        if (!res.ok) throw new Error("Failed to create list");
        const created = await res.json();

        for (const movie of movies) {
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${created.listId}/movies`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ movieId: movie.movieId }),
          });
        }

        toast.success("List created");
        navigate(`/list/${created.listId}`);
      }
    } catch {
      toast.error(isEdit ? "Could not update list" : "Could not create list");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (isEdit) navigate(`/list/${id}`);
    else navigate("/my-lists");
  };

  const handleDeleteList = () => setShowDeleteConfirm(true);

  const confirmDeleteList = async () => {
    setShowDeleteConfirm(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete list");
      toast.success("List deleted");
      navigate("/my-lists");
    } catch {
      toast.error("Could not delete list");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#BFBCFC]/20 flex items-center justify-center">
              <List className="w-8 h-8 text-[#BFBCFC] animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-t-2 border-[#BFBCFC] animate-spin" />
          </div>
          <p className="text-[#94A3B8] text-sm">Loading list...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <FilmDragLayer />
      <div className="min-h-screen py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-4 border-b border-[#BFBCFC]/25 pb-4 mb-6">
            <h1 className="text-2xl md:text-4xl font-black leading-none tracking-tight">
              <span className="bg-gradient-to-r from-[#BFBCFC] via-[#9b9dfc] to-[#44FFFF] bg-clip-text text-transparent">
                {isEdit ? "Edit List" : "New List"}
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
  <label className="block text-sm font-medium text-[#F8FAFC] mb-2">
    Description
  </label>

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
                              src={`${TMDB_POSTER_BASE}/w92${movie.poster_path}`}
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
                className="px-5 py-2 rounded-lg font-medium text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#151921] transition-all"
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
                  onDropEnd={handleDropEnd}
                  onRemove={handleRemoveMovie}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-[#BFBCFC]/30 rounded-xl">
              <Film className="w-10 h-10 text-[#BFBCFC]/20 mx-auto mb-3" />
              <p className="text-[#94A3B8] text-sm">
                Your list is empty. Use the search above to add films.
              </p>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-[#151921] border border-[#FF61D2]/30 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-[#FF61D2]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Trash2 className="w-5 h-5 text-[#FF61D2]" />
                </div>
                <div>
                  <h3 className="text-[#F8FAFC] font-bold text-lg leading-tight">Delete list?</h3>
                  <p className="text-[#94A3B8] text-sm mt-1">
                    Are you sure you want to delete "{listName}"? This cannot be undone.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[#BFBCFC]/20 text-[#94A3B8] hover:text-[#F8FAFC] hover:border-[#BFBCFC]/40 transition-all text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteList}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#FF61D2] hover:bg-[#FF4DC7] text-white font-bold transition-all shadow-lg shadow-[#FF61D2]/30 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </DndProvider>
  );
}
