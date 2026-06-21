import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { Trash2 } from "lucide-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

import { FilmDragLayer } from "../components/featured-lists/FilmDragLayer";
import { FeaturedListsBrowse } from "../components/featured-lists/FeaturedListsBrowse";
import { FeaturedListsForm } from "../components/featured-lists/FeaturedListsForm";

const TMDB_POSTER_BASE = "https://image.tmdb.org/t/p";

export function FeaturedListsPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("editId");
  const activeId = id || queryId;
  const isEdit = Boolean(activeId);
  const navigate = useNavigate();
  const auth = useAuth();

  const [featuredLists, setFeaturedLists] = useState([]);
  const [browseLoading, setBrowseLoading] = useState(!isEdit);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [listName, setListName] = useState("");
  const [listDescription, setListDescription] = useState("");
  const [isRanked, setIsRanked] = useState(false);
  const [movies, setMovies] = useState([]);
  const [originalMovies, setOriginalMovies] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const token = useMemo(
    () =>
      auth?.token ||
      auth?.user?.token ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token"),
    [auth]
  );

  // Robust Admin Verification parsing claims directly to survive profile sync drops
  const isUserAdmin = useMemo(() => {
    if (auth?.user?.isAdmin || auth?.isAdmin) return true;
    if (!token) return false;

    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        const roleClaim = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        const adminClaim = payload['isAdmin'];
        
        if (roleClaim === 'Admin' || roleClaim?.includes('Admin') || String(adminClaim).toLowerCase() === 'true') {
          return true;
        }
      }
    } catch (e) {
      console.error("Admin verification fallback parsing error:", e);
    }
    return false;
  }, [auth, token]);

  // Browse View Data Loading
  useEffect(() => {
    if (isEdit || isCreating) return;

    const fetchFeaturedLists = async () => {
      try {
        setBrowseLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/featured`);
        if (!res.ok) throw new Error("Failed to load featured lists");
        const data = await res.json();
        setFeaturedLists(data);
      } catch {
        toast.error("Could not load global lists");
      } finally {
        setBrowseLoading(false);
      }
    };

    fetchFeaturedLists();
  }, [isEdit, isCreating, refreshTrigger]);

  // Edit Mode Initial Loading
  useEffect(() => {
    if (!isEdit) return;

    const fetchList = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${activeId}`);
        if (!res.ok) throw new Error("Failed to load list");
        const data = await res.json();
        setListName(data.listName ?? "");
        setListDescription(data.listDescription ?? "");
        setIsRanked(Boolean(data.isRanked));
        setMovies(data.movies ?? []);
        setOriginalMovies(data.movies ?? []);
      } catch {
        toast.error("Could not load this featured list");
        navigate("/featured-lists");
      } finally {
        setLoading(false);
      }
    };

    fetchList();
  }, [isEdit, activeId]);

  // Security route guard to block non-admins from edit/create mode
  useEffect(() => {
    if ((isEdit || isCreating) && !isUserAdmin && !browseLoading) {
      toast.error("Only administrators can create or edit global featured lists");
      navigate("/featured-lists");
    }
  }, [isEdit, isCreating, isUserAdmin, browseLoading, navigate]);

  // TMDB Instant Movie Engine Lookups
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

  const handleAddMovie = (movie) => {
    const newEntry = {
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${TMDB_POSTER_BASE}/w500${movie.poster_path}` : null,
      releaseYear: movie.release_date?.split("-")[0] ?? null,
      voteAverage: movie.vote_average ?? null,
    };
    setSearchQuery("");
    setSearchResults([]);
    setMovies((prev) => [...prev, newEntry]);
  };

  const handleRemoveMovie = (movieId) => {
    setMovies((prev) => prev.filter((m) => m.movieId !== movieId));
  };

  const moveMovie = (dragIndex, hoverIndex) => {
    setMovies((prev) => {
      const updated = [...prev];
      const [dragged] = updated.splice(dragIndex, 1);
      updated.splice(hoverIndex, 0, dragged);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!listName.trim()) return toast.error("Please give your list a name");
    if (movies.length === 0) return toast.error("Add at least one film to your list");

    setSaving(true);
    try {
      if (isEdit) {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/featured-list/${activeId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ listName: listName.trim(), listDescription: listDescription.trim(), isRanked }),
        });
        if (!res.ok) throw new Error();

        const toRemove = originalMovies.filter((om) => !movies.some((m) => m.movieId === om.movieId));
        const toAdd = movies.filter((m) => !originalMovies.some((om) => om.movieId === m.movieId));

        for (const m of toRemove) {
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/featured-list/${activeId}/movies/${m.movieId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          });
        }
        for (const m of toAdd) {
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/featured-list/${activeId}/movies`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ movieId: m.movieId }),
          });
        }
        if (movies.length > 0) {
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/featured-list/${activeId}/reorder`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ movieIds: movies.map((m) => m.movieId) }),
          });
        }
        toast.success("Featured list updated successfully");
        navigate("/featured-lists");
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/featured-list`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ listName: listName.trim(), listDescription: listDescription.trim(), isRanked }),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();

        for (const m of movies) {
          await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/featured-list/${created.listId}/movies`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ movieId: m.movieId }),
          });
        }
        toast.success("Featured list created globally");
        setIsCreating(false);
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch {
      toast.error("Could not save featured list configuration");
    } finally {
      setSaving(false);
    }
  };

  const confirmDeleteList = async () => {
    setShowDeleteConfirm(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/featured-list/${activeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success("Featured list removed permanently");
      navigate("/featured-lists");
      setRefreshTrigger((prev) => prev + 1);
    } catch {
      toast.error("Could not remove featured list");
    }
  };

  if (browseLoading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#BFBCFC]/20 border-t-[#BFBCFC] rounded-full animate-spin" />
      </div>
    );
  }

  if ((isEdit || isCreating) && !isUserAdmin) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#BFBCFC]/20 border-t-[#BFBCFC] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isEdit && !isCreating) {
    return (
      <FeaturedListsBrowse
        featuredLists={featuredLists}
        isAdmin={isUserAdmin}
        onCreateClick={() => {
          setListName("");
          setListDescription("");
          setIsRanked(false);
          setMovies([]);
          setIsCreating(true);
        }}
        onEditClick={(listId) => navigate(`/featured-lists?editId=${listId}`)}
        onListClick={(listId) => navigate(`/list/${listId}`)}
      />
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <FilmDragLayer />
      <FeaturedListsForm
        isEdit={isEdit}
        listName={listName}
        setListName={setListName}
        isRanked={isRanked}
        setIsRanked={setIsRanked}
        listDescription={listDescription}
        setListDescription={setListDescription}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        isSearching={isSearching}
        searchResults={searchResults}
        handleAddMovie={handleAddMovie}
        movies={movies}
        moveMovie={moveMovie}
        handleRemoveMovie={handleRemoveMovie}
        handleDeleteList={() => setShowDeleteConfirm(true)}
        handleCancel={() => (isEdit ? navigate("/featured-lists") : setIsCreating(false))}
        handleSave={handleSave}
        saving={saving}
      />

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
                  <p className="text-[#94A3B8] text-sm mt-1">Are you sure? This cannot be undone.</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-[#BFBCFC]/20 text-[#94A3B8] text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteList}
                  className="flex-1 px-4 py-2 rounded-lg bg-[#FF61D2] text-white font-bold text-sm"
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