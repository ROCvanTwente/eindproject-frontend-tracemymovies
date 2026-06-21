import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { Plus, Edit, Film, List, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";
import { ProfilePosterCard } from "../components/ProfilePosterCard";
import { MovieFilters, useMovieFilters, SortDropdown, applySort } from "../components/MovieFilters";

function DescriptionText({ description }) {
  const [expanded, setExpanded] = useState(false);
  if (!description) return null;
  const isLong = description.length > 160;

  return (
    <div className="mb-2 max-w-[50rem]">
      <p className={`text-[#94A3B8] leading-relaxed break-words ${!expanded ? "line-clamp-3" : ""}`}>
        {description}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="text-[#BFBCFC] text-xs font-medium hover:text-[#AFA9FF] transition-colors mt-0.5"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
}

function MovieCard({ movie, isRanked, onRemove }) {
  return (
    <div>
      <ProfilePosterCard
        movieId={movie.movieId}
        poster={movie.poster}
        title={movie.title}
        to={`/movie/${movie.movieId}`}
        inListContext={!!onRemove}
        onRemoveFromList={onRemove ? () => onRemove(movie.movieId) : undefined}
      />
      {isRanked && (
        <p className="mt-1.5 text-center text-[#BFBCFC] font-bold font-heading text-sm">
          {movie.position + 1}
        </p>
      )}
    </div>
  );
}

export function ListDetailPage() {
  const { id, userId } = useParams();
  const isPublic = !!userId;
  const navigate = useNavigate();
  const auth = useAuth();
  const { refreshKey } = useRefresh();

  const [list, setList] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState(null);

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

  const currentUserId = useMemo(() => {
    if (auth?.user?.id || auth?.user?.userId) return auth.user.id || auth.user.userId;
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        return payload['nameid'] || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      }
    } catch {}
    return null;
  }, [auth, token]);

  const isOwner = useMemo(() => {
    if (!list?.userId || !currentUserId) return false;
    return String(list.userId) === String(currentUserId);
  }, [list, currentUserId]);

  const fetchList = async () => {
    try {
      setLoading(true);
      const url = isPublic
        ? `${import.meta.env.VITE_API_BASE_URL}/PublicProfile/${userId}/Lists/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/Lists/${id}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load list");
      const data = await res.json();
      setList(data);
      setMovies(data.movies ?? []);
    } catch {
      toast.error("Could not load this list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchList();
  }, [token, id, userId]);

  const handleRemoveMovie = async (movieId) => {
    const previousMovies = movies;
    const previousList = list;
    setMovies((prev) => prev.filter((m) => m.movieId !== movieId));
    setList((prev) => (prev ? { ...prev, movieCount: prev.movieCount - 1 } : prev));
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Lists/${id}/movies/${movieId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove movie");
    } catch {
      setMovies(previousMovies);
      setList(previousList);
      toast.error("Could not remove movie from list");
    }
  };

  useEffect(() => {
    if (!token || !list) return;

    const fetchWatchedCount = async () => {
      try {
        const url = isPublic
          ? `${import.meta.env.VITE_API_BASE_URL}/PublicProfile/${userId}/Lists/${id}/watched-count`
          : `${import.meta.env.VITE_API_BASE_URL}/Lists/${id}/watched-count`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setList((prev) => (prev ? { ...prev, watchedCount: data.watchedCount } : prev));
      } catch {}
    };

    fetchWatchedCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const {
    genre, setGenre, decade, setDecade, year, setYear,
    filtered: filterResult, availableGenres, availableDecades,
    hasActiveFilters, reset,
  } = useMovieFilters(movies);

  const filtered = useMemo(() => {
    let result = filterResult;
    if (search.trim()) {
      result = result.filter((m) =>
        m.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    return applySort(result, sortValue);
  }, [filterResult, search, sortValue]);

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

  const backTo = isPublic ? `/user/${userId}/lists` : "/my-lists";

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center px-4">
        <div>
          <p className="text-[#F8FAFC] font-semibold text-lg mb-2">List not found</p>
          <Link to={backTo} className="text-[#BFBCFC] hover:text-[#AFA9FF] transition-colors">
            Back to lists
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-[#94A3B8] text-sm mb-1">
              Published {new Date(list.createdAt).toLocaleDateString()}
            </p>
            <h1 className="text-xl md:text-3xl font-black leading-tight tracking-tight mb-2 text-[#F8FAFC] break-words max-w-[50rem]">
              {list.listName}
            </h1>
            <DescriptionText description={list.listDescription} />
            
            <span className="inline-flex items-center gap-1.5 text-[#F8FAFC] font-data font-medium text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#44FFFF]" />
              {list.movieCount} {list.movieCount === 1 ? "Film" : "Films"}
            </span>
          </div>
          <div className="flex flex-col gap-3 md:w-56 flex-shrink-0">
            {(!isPublic &&
              (list?.isFeatured || list?.listType === "Featured"
                ? isUserAdmin
                : isOwner)) && (
              <button
                onClick={() => {
                  if (list?.isFeatured || list?.listType === "Featured") {
                    navigate(`/featured-lists?editId=${id}`);
                  } else {
                    navigate(`/list/${id}/edit`);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-[#BFBCFC] hover:bg-[#BFBCFC]/10 transition-all"
              >
                <Edit className="w-4 h-4" />
                {list?.isFeatured || list?.listType === "Featured" ? "Edit Featured List" : "Edit or Delete this List"}
              </button>
            )}
            {movies.length > 0 && (
              <div className="bg-[#0B0E14] border border-white/5 rounded-xl p-4">
                <div className="flex items-end justify-between gap-2">
                  <p className="text-[#94A3B8] text-sm leading-snug">
                    You've watched
                    <br />
                    <span className="text-[#F8FAFC] font-medium">
                      {list.watchedCount ?? 0} of {movies.length}
                    </span>
                  </p>
                  <span className="text-3xl font-bold font-heading text-[#BFBCFC] flex items-start gap-0.5">
                    {Math.round(((list.watchedCount ?? 0) / movies.length) * 100)}
                    <span className="text-base mt-1">%</span>
                  </span>
                </div>
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#44FFFF] rounded-full transition-all"
                    style={{ width: `${Math.round(((list.watchedCount ?? 0) / movies.length) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {movies.length > 0 ? (
          <>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <div className="relative w-full sm:flex-1 sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Enter name of film..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#151921] border border-[#BFBCFC]/12 rounded-lg pl-8.5 pr-3 py-2 text-[#F8FAFC] placeholder-[#94A3B8]/50 text-sm focus:outline-none focus:border-[#BFBCFC]/35 transition-all"
                  />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <SortDropdown value={sortValue} onChange={setSortValue} />
                  <MovieFilters
                    genre={genre} setGenre={setGenre}
                    decade={decade} setDecade={setDecade}
                    year={year} setYear={setYear}
                    availableGenres={availableGenres}
                    availableDecades={availableDecades}
                    hasActiveFilters={hasActiveFilters}
                    reset={reset}
                    hideYearRow
                    hideRating
                  />
                  {(search || hasActiveFilters) && (
                    <p className="text-[#94A3B8] text-xs sm:ml-auto hidden sm:block">
                      {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
              {decade && (
                <MovieFilters
                  genre={genre} setGenre={setGenre}
                  decade={decade} setDecade={setDecade}
                  year={year} setYear={setYear}
                  availableGenres={availableGenres}
                  availableDecades={availableDecades}
                  hasActiveFilters={hasActiveFilters}
                  reset={reset}
                  yearRowOnly
                />
              )}
            </div>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">
                {filtered.map((movie) => (
                  <MovieCard
                    key={movie.movieId}
                    movie={movie}
                    isRanked={list.isRanked}
                    onRemove={isPublic || list?.isFeatured || list?.listType === "Featured" || !isOwner ? undefined : handleRemoveMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-[#94A3B8] text-sm">No movies match your filters</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <Film className="w-24 h-24 text-[#BFBCFC]/20 mx-auto mb-4" />
            <h3 className="text-2xl font-heading font-bold text-[#F8FAFC] mb-2">No movies yet</h3>
            {isPublic ? (
              <p className="text-[#94A3B8]">This list is empty</p>
            ) : (
              <>
                <p className="text-[#94A3B8] mb-6">Start adding movies to your list</p>
                <button
                  onClick={() => navigate(`/list/${id}/edit`)}
                  className="bg-[#BFBCFC] hover:bg-[#AFA9FF] text-[#0B0E14] px-6 py-3 rounded-xl font-medium transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add Your First Movie
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
