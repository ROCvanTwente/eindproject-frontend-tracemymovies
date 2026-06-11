import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";
import { Bookmark, Search, Film } from "lucide-react";
import { ProfilePosterCard } from "../components/ProfilePosterCard";
import { MovieFilters, useMovieFilters, SortDropdown, applySort } from "../components/MovieFilters";

export function WatchlistPage() {
  const { userId } = useParams();
  const isPublic = !!userId;
  const auth = useAuth();
  const { refreshKey } = useRefresh();
  const [movies, setMovies] = useState([]);
  const [ownerUsername, setOwnerUsername] = useState(null);
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

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const url = isPublic
          ? `${import.meta.env.VITE_API_BASE_URL}/PublicProfile/${userId}/Watchlist`
          : `${import.meta.env.VITE_API_BASE_URL}/Activity/GetWatchlist`;
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        if (isPublic) {
          const data = await res.json();
          setOwnerUsername(data.username);
          setMovies(data.items ?? []);
        } else {
          setMovies(await res.json());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) load();
  }, [token, refreshKey, userId]);

  const { genre, setGenre, decade, setDecade, year, setYear, rating, setRating, filtered: filterResult, availableGenres, availableDecades, ratingOptions, hasActiveFilters, reset } = useMovieFilters(movies);

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
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#BFBCFC]/20 flex items-center justify-center">
              <Bookmark className="w-8 h-8 text-[#BFBCFC] animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-t-2 border-[#BFBCFC] animate-spin" />
          </div>
          <p className="text-[#94A3B8] text-sm">Loading your watchlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">

      {/* ── HEADER ── */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#BFBCFC]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#44FFFF]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0B0E14] to-transparent" />

        <div className="relative container mx-auto px-4 max-w-7xl py-6 md:py-8">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#BFBCFC]/20 to-[#44FFFF]/8 rounded-2xl flex items-center justify-center border border-[#BFBCFC]/30 shadow-lg shadow-[#BFBCFC]/10 flex-shrink-0">
              <Bookmark className="w-6 h-6 md:w-7 md:h-7 text-[#BFBCFC]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] leading-none tracking-tight">
                {isPublic && <span className="text-[#F8FAFC]">{ownerUsername ?? "..."}'s </span>}
                <span className="bg-gradient-to-r from-[#BFBCFC] via-[#d4d2fd] to-[#44FFFF] bg-clip-text text-transparent">
                  Watchlist
                </span>
              </h1>
            </div>
            {movies.length > 0 && (
              <div className="bg-[#BFBCFC]/10 border border-[#BFBCFC]/20 rounded-xl px-4 py-2 text-center backdrop-blur-sm flex-shrink-0">
                <p className="text-2xl md:text-3xl font-black text-[#BFBCFC] leading-none tabular-nums">
                  {movies.length}
                </p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">
                  {movies.length === 1 ? "film" : "films"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TOOLBAR ── */}
      {movies.length > 0 && (
        <div className="sticky top-16 z-30 bg-[#0B0E14]/92 backdrop-blur-xl border-b border-[#BFBCFC]/8">
          <div className="container mx-auto px-4 max-w-7xl pt-3 pb-2 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search your watchlist..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#151921] border border-[#BFBCFC]/12 rounded-lg pl-8.5 pr-3 py-2 text-[#F8FAFC] placeholder-[#94A3B8]/50 text-sm focus:outline-none focus:border-[#BFBCFC]/35 transition-all"
                />
              </div>
              <SortDropdown value={sortValue} onChange={setSortValue} excludeGroups={["Your Rating"]} />
              <MovieFilters
                genre={genre} setGenre={setGenre}
                decade={decade} setDecade={setDecade}
                year={year} setYear={setYear}
                rating={rating} setRating={setRating}
                availableGenres={availableGenres}
                availableDecades={availableDecades}
                ratingOptions={ratingOptions}
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
              <div className="pb-1">
                <MovieFilters
                  genre={genre} setGenre={setGenre}
                  decade={decade} setDecade={setDecade}
                  year={year} setYear={setYear}
                  rating={rating} setRating={setRating}
                  availableGenres={availableGenres}
                  availableDecades={availableDecades}
                  ratingOptions={ratingOptions}
                  hasActiveFilters={hasActiveFilters}
                  reset={reset}
                  yearRowOnly
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 max-w-7xl py-8 md:py-10">
        {movies.length === 0 ? (
          <EmptyState isPublic={isPublic} ownerUsername={ownerUsername} />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Bookmark className="w-10 h-10 text-[#94A3B8]/20 mb-4" />
            <p className="text-[#94A3B8] text-sm">
              Nothing found for{" "}
              <span className="text-[#F8FAFC] font-medium">"{search}"</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 md:gap-3">
            {filtered.map((movie) => (
              <ProfilePosterCard
                key={movie.movieId}
                movieId={movie.movieId}
                poster={movie.poster}
                title={movie.title}
                to={`/movie/${movie.movieId}`}
                isInWatchlistProp={isPublic ? undefined : true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const EmptyState = ({ isPublic, ownerUsername }) => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-[#BFBCFC]/12 to-[#44FFFF]/6 rounded-full flex items-center justify-center border border-[#BFBCFC]/15">
        <Bookmark className="w-16 h-16 text-[#BFBCFC]/30" />
      </div>
      <div className="absolute inset-0 rounded-full bg-[#BFBCFC]/6 blur-2xl -z-10" />
    </div>
    <h2 className="text-2xl md:text-3xl font-bold text-[#F8FAFC] mb-3">
      {isPublic ? `${ownerUsername ?? "This user"}'s watchlist is empty` : "Your watchlist is empty"}
    </h2>
  </div>
);
