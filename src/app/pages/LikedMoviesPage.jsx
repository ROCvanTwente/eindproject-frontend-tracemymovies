import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";
import { toast } from "sonner";
import { Heart, Search, Film, Star, AlignLeft } from "lucide-react";
import { MovieFilters, useMovieFilters, SortDropdown, applySort } from "../components/MovieFilters";
import { Link } from "react-router";

const LikedMoviesPage = () => {
  const { userId } = useParams();
  const isPublic = !!userId;
  const [likedMovies, setLikedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortValue, setSortValue] = useState(null);
  const auth = useAuth();
  const { refreshKey } = useRefresh();

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
    const fetchAllLikedMovies = async () => {
      try {
        setLoading(true);
        const url = isPublic
          ? `${import.meta.env.VITE_API_BASE_URL}/PublicProfile/${userId}/Liked`
          : `${import.meta.env.VITE_API_BASE_URL}/database/GetLikedMovies`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) throw new Error("Kon gelikete films niet ophalen");
        const data = await response.json();
        setLikedMovies(data);
      } catch (error) {
        console.error(error);
        toast.error("Fout bij het laden van je likes");
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchAllLikedMovies();
  }, [token, refreshKey, userId]);

  const { genre, setGenre, decade, setDecade, rating, setRating, filtered: filterResult, availableGenres, availableDecades, ratingOptions, hasActiveFilters, reset } = useMovieFilters(likedMovies);

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
            <div className="absolute inset-0 rounded-full border-2 border-[#FF61D2]/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-[#FF61D2] animate-pulse fill-[#FF61D2]" />
            </div>
            <div className="absolute inset-0 rounded-full border-t-2 border-[#FF61D2] animate-spin" />
          </div>
          <p className="text-[#94A3B8] text-sm">Loading your likes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">

      {/* ── CINEMATIC HEADER ── */}
      <div className="relative overflow-hidden">

        {/* Backdrop: user's own liked posters blurred together */}
        {likedMovies.length > 0 && (
          <>
            <div className="absolute inset-0 flex">
              {likedMovies.slice(0, 7).map((m) => (
                <div
                  key={m._id}
                  className="flex-1 bg-cover bg-center"
                  style={{ backgroundImage: `url(${m.poster})` }}
                />
              ))}
            </div>
            <div className="absolute inset-0 bg-[#0B0E14]/80 backdrop-blur-3xl" />
          </>
        )}

        {/* Fallback blobs when no movies */}
        {likedMovies.length === 0 && (
          <>
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#FF61D2]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFBCFC]/6 rounded-full blur-3xl pointer-events-none" />
          </>
        )}

        {/* Soft fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0B0E14] to-transparent" />

        {/* Header content */}
        <div className="relative container mx-auto px-4 max-w-7xl py-6 md:py-8">
          <div className="flex items-center gap-4 md:gap-6">

            {/* Icon */}
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#FF61D2]/30 to-[#BFBCFC]/10 rounded-2xl flex items-center justify-center border border-[#FF61D2]/35 shadow-lg shadow-[#FF61D2]/15 flex-shrink-0">
              <Heart className="w-6 h-6 md:w-7 md:h-7 text-[#FF61D2] fill-[#FF61D2]" />
            </div>

            {/* Title */}
            <div className="flex-1">
              <p className="text-[#FF61D2]/65 text-[9px] font-bold uppercase tracking-[0.25em] mb-0.5">
                Your Collection
              </p>
              <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] leading-none tracking-tight">
                Liked{" "}
                <span className="bg-gradient-to-r from-[#FF61D2] via-[#cc7be0] to-[#BFBCFC] bg-clip-text text-transparent">
                  Movies
                </span>
              </h1>
            </div>

            {/* Count pill */}
            {likedMovies.length > 0 && (
              <div className="bg-[#FF61D2]/12 border border-[#FF61D2]/25 rounded-xl px-4 py-2 text-center backdrop-blur-sm flex-shrink-0">
                <p className="text-2xl md:text-3xl font-black text-[#FF61D2] leading-none tabular-nums">
                  {likedMovies.length}
                </p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">
                  {likedMovies.length === 1 ? "movie" : "movies"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── STICKY TOOLBAR ── */}
      {likedMovies.length > 0 && (
        <div className="sticky top-16 z-30 bg-[#0B0E14]/92 backdrop-blur-xl border-b border-[#BFBCFC]/8">
          <div className="container mx-auto px-4 max-w-7xl py-3 flex items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search your likes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#151921] border border-[#BFBCFC]/12 rounded-lg pl-8.5 pr-3 py-2 text-[#F8FAFC] placeholder-[#94A3B8]/50 text-sm focus:outline-none focus:border-[#FF61D2]/35 transition-all"
              />
            </div>

            <SortDropdown value={sortValue} onChange={setSortValue} />

            <MovieFilters
              genre={genre} setGenre={setGenre}
              decade={decade} setDecade={setDecade}
              rating={rating} setRating={setRating}
              availableGenres={availableGenres}
              availableDecades={availableDecades}
              ratingOptions={ratingOptions}
              hasActiveFilters={hasActiveFilters}
              reset={reset}
            />

            {(search || hasActiveFilters) && (
              <p className="text-[#94A3B8] text-xs ml-auto hidden sm:block">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div className="container mx-auto px-4 max-w-7xl py-8 md:py-10">
        {likedMovies.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search className="w-10 h-10 text-[#94A3B8]/25 mb-3" />
            <p className="text-[#94A3B8] text-sm">
              Nothing found for{" "}
              <span className="text-[#F8FAFC] font-medium">"{search}"</span>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 md:gap-3">
            {filtered.map((movie, index) => (
              <MovieCard key={movie.movieId} movie={movie} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── MOVIE CARD ── */
const MovieCard = ({ movie, index }) => (
  <div className="flex flex-col gap-1.5">
    <Link to={`/movie/${movie.movieId}`} className="group relative block">
    <div className="relative overflow-hidden rounded-xl aspect-[2/3] bg-[#151921] border border-white/5 transition-all duration-300 group-hover:border-[#FF61D2]/35 group-hover:shadow-xl group-hover:shadow-[#FF61D2]/12">

      {/* Poster */}
      {movie.poster ? (
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Film className="w-8 h-8 text-[#94A3B8]/20" />
        </div>
      )}

      {/* Number badge — top left */}
      <div className="absolute top-2 left-2 min-w-[22px] h-[22px] px-1.5 bg-[#0B0E14]/80 backdrop-blur-sm rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-[#94A3B8] text-[10px] font-bold leading-none">
          #{index + 1}
        </span>
      </div>

      {/* Heart badge — top right */}
      <div className="absolute top-2 right-2 w-[22px] h-[22px] bg-[#0B0E14]/80 backdrop-blur-sm rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Heart className="w-3 h-3 text-[#FF61D2] fill-[#FF61D2]" />
      </div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Title — slides up from bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        {movie.title && (
          <h3 className="text-[#F8FAFC] text-[11px] font-semibold leading-tight line-clamp-2">
            {movie.title}
          </h3>
        )}
      </div>

      {/* Pink ring glow */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/5 group-hover:ring-[#FF61D2]/22 transition-all duration-300 pointer-events-none" />
    </div>
  </Link>

    {/* Icons below poster */}
    <div className="flex items-center gap-1 px-0.5 flex-wrap">
      {movie.userRating > 0 && (
        <div className="grid grid-cols-5 gap-[2px]">
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <Star key={n} className={`w-2 h-2 ${n <= movie.userRating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#94A3B8]/20"}`} />
          ))}
        </div>
      )}
      <Heart className="w-3 h-3 text-[#FF61D2] fill-[#FF61D2]" />
      {movie.hasReview && (
        <Link
          to={`/log/${movie.latestLogId}`}
          onClick={(e) => e.stopPropagation()}
          title="Bekijk recensie"
        >
          <AlignLeft className="w-3 h-3 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors" />
        </Link>
      )}
    </div>
  </div>
);

/* ── EMPTY STATE ── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div className="relative mb-8">
      <div className="w-32 h-32 bg-gradient-to-br from-[#FF61D2]/12 to-[#BFBCFC]/6 rounded-full flex items-center justify-center border border-[#FF61D2]/15">
        <Heart className="w-16 h-16 text-[#FF61D2]/30" />
      </div>
      <div className="absolute inset-0 rounded-full bg-[#FF61D2]/6 blur-2xl -z-10" />
    </div>
    <h2 className="text-2xl md:text-3xl font-bold text-[#F8FAFC] mb-3">
      No liked movies yet
    </h2>
    <p className="text-[#94A3B8] text-sm md:text-base max-w-xs mb-8 leading-relaxed">
      Explore movies and press the heart to start building your personal collection.
    </p>
    <Link
      to="/search"
      className="inline-flex items-center gap-2 bg-gradient-to-r from-[#FF61D2] to-[#BFBCFC] text-[#0B0E14] font-bold px-7 py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-[#FF61D2]/25"
    >
      <Film className="w-4 h-4" />
      Discover Movies
    </Link>
  </div>
);

export default LikedMoviesPage;
