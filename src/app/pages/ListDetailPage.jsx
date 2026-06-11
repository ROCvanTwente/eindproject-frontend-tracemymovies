import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { ArrowLeft, Plus, Edit, Film, List, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";
import { ProfilePosterCard } from "../components/ProfilePosterCard";
import { MovieFilters, useMovieFilters, SortDropdown, applySort } from "../components/MovieFilters";

function MovieCard({ movie, isRanked }) {
  return (
    <div>
      <ProfilePosterCard
        movieId={movie.movieId}
        poster={movie.poster}
        title={movie.title}
        to={`/movie/${movie.movieId}`}
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
        <Link
          to={backTo}
          className="inline-flex items-center gap-2 text-[#BFBCFC] hover:text-[#AFA9FF] mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Lists
        </Link>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-4">
          <div className="flex-1 min-w-0">
            <p className="text-[#94A3B8] text-sm mb-1">
              Published {new Date(list.createdAt).toLocaleDateString()}
            </p>
            <h1 className="text-2xl md:text-4xl font-black leading-none tracking-tight mb-2">
              <span className="bg-gradient-to-r from-[#BFBCFC] via-[#9b9dfc] to-[#44FFFF] bg-clip-text text-transparent">
                {list.listName}
              </span>
            </h1>
            {list.listDescription && (
              <p className="text-[#94A3B8] mb-2">{list.listDescription}</p>
            )}
            <span className="text-[#44FFFF] font-data font-medium text-sm">
              {list.movieCount} {list.movieCount === 1 ? "film" : "films"}
            </span>
          </div>
          <div className="flex flex-col gap-3 md:w-56 flex-shrink-0">
            {!isPublic && (
              <button
                onClick={() => navigate(`/list/${id}/edit`)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-[#BFBCFC] hover:bg-[#BFBCFC]/10 transition-all"
              >
                <Edit className="w-4 h-4" />
                Edit or Delete this List
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
                  <span className="text-3xl font-bold font-heading text-[#F8FAFC] flex items-start gap-0.5">
                    {Math.round(((list.watchedCount ?? 0) / movies.length) * 100)}
                    <span className="text-base mt-1">%</span>
                  </span>
                </div>
                <div className="mt-3 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#4ADE80] rounded-full transition-all"
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
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#151921] border border-[#BFBCFC]/12 rounded-lg pl-8.5 pr-3 py-2 text-[#F8FAFC] placeholder-[#94A3B8]/50 text-sm focus:outline-none focus:border-[#BFBCFC]/35 transition-all"
                  />
                </div>
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
                  <p className="text-[#94A3B8] text-xs ml-auto hidden sm:block">
                    {filtered.length} result{filtered.length !== 1 ? "s" : ""}
                  </p>
                )}
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
                  <MovieCard key={movie.movieId} movie={movie} isRanked={list.isRanked} />
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
