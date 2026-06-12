import { useState, useEffect, useCallback, useRef } from "react";
import { Film, Flame, Star, ArrowDownAz, ArrowUpAz, Calendar, Search } from "lucide-react";
import { ProfilePosterCard } from "../components/ProfilePosterCard";
import { MovieFilters, useMovieFilters } from "../components/MovieFilters";
import { ReviewPagination } from "../components/review/ReviewPagination";

const TABS = [
  { id: "popular-high-low", label: "Popular", sub: "High-Low", icon: Flame, endpoint: "popular", desc: true },
  { id: "popular-low-high", label: "Popular", sub: "Low-High", icon: Flame, endpoint: "popular", desc: false },
  { id: "title-high-low", label: "Title", sub: "A-Z", icon: ArrowDownAz, endpoint: "title", desc: false },
  { id: "title-low-high", label: "Title", sub: "Z-A", icon: ArrowUpAz, endpoint: "title", desc: true },
  { id: "rating-high-low", label: "Rating", sub: "High-Low", icon: Star, endpoint: "rating", desc: true },
  { id: "rating-low-high", label: "Rating", sub: "Low-High", icon: Star, endpoint: "rating", desc: false },
  { id: "date-high-low", label: "Date", sub: "Newest", icon: Calendar, endpoint: "date", desc: true },
  { id: "date-low-high", label: "Date", sub: "Oldest", icon: Calendar, endpoint: "date", desc: false },
];

export function MoviesPage() {
  const [activeTab, setActiveTab] = useState("popular-high-low");
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const controllerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [yearFilter, setYearFilter] = useState(null);

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    setPage(0);
    fetchData();
  }, [activeTab, searchQuery, yearFilter]);

  const fetchData = useCallback(() => {
    if (controllerRef.current) controllerRef.current.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return;
    setLoading(true);
    setMovies([]);
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/get100movies?page=${page}&sort=${tab.endpoint}&desc=${tab.desc}${searchQuery !== "" ? `&search=${searchQuery}` : ""}`,
      { signal: controller.signal }
    )
      .then((r) => r.ok ? r.json() : [])
      .then((data) => {
        setMovies(Array.isArray(data.moviesData)
          ? data.moviesData.map((m) => ({ ...m, year: m.date ? new Date(m.date).getFullYear() : null }))
          : []);
        setTotalPage(data.totalPages);
        if (data.totalCount != null) setTotalCount(data.totalCount);
      })
      .catch((err) => { if (err.name !== "AbortError") console.error(err); else setMovies([]); })
      .finally(() => setLoading(false));
  });

  const {
    genre, setGenre,
    decade, setDecade,
    year, setYear,
    rating, setRating,
    filtered,
    availableGenres, availableDecades, ratingOptions,
    hasActiveFilters, reset,
  } = useMovieFilters(movies);

  return (
    <div className="min-h-screen bg-[#0B0E14]">

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#BFBCFC]/6 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#44FFFF]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0B0E14] to-transparent" />

        <div className="relative container mx-auto px-4 max-w-7xl py-6 md:py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#BFBCFC]/25 to-[#44FFFF]/10 rounded-2xl flex items-center justify-center border border-[#BFBCFC]/30 shadow-lg flex-shrink-0">
              <Film className="w-6 h-6 md:w-7 md:h-7 text-[#BFBCFC]" />
            </div>
            <div className="flex-1">
              <p className="text-[#BFBCFC]/60 text-[9px] font-bold uppercase tracking-[0.25em] mb-0.5">Browse</p>
              <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] leading-none tracking-tight">Movies</h1>
            </div>
            {totalCount > 0 && (
              <div className="bg-[#BFBCFC]/12 border border-[#BFBCFC]/25 rounded-xl px-4 py-2 text-center backdrop-blur-sm flex-shrink-0">
                <p className="text-2xl md:text-3xl font-black text-[#BFBCFC] leading-none tabular-nums">
                  {totalCount.toLocaleString()}
                </p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">
                  {totalCount === 1 ? "film" : "films"}
                </p>
              </div>
            )}
          </div>

          {/* Sort Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-[#151921]/80 rounded-xl w-fit">
            {TABS.map(({ id, label, sub, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${activeTab === id ? "bg-[#BFBCFC] text-[#0B0E14]" : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label} <span className="opacity-70">{sub}</span></span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-30 bg-[#0B0E14]/92 backdrop-blur-xl border-b border-[#BFBCFC]/8">
        <div className="container mx-auto px-4 max-w-7xl pt-3 pb-2 flex flex-col gap-2">

          {/* Row 1: search + filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#151921] border border-[#BFBCFC]/12 rounded-lg pl-8 pr-3 py-2 text-[#F8FAFC] placeholder-[#94A3B8]/50 text-sm focus:outline-none focus:border-[#BFBCFC]/35 transition-all"
              />
            </div>
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
              hideRating
              hideGenre
              hideDecade
              hideYearRow
            />
            {hasActiveFilters && (
              <p className="text-[#94A3B8] text-xs ml-auto hidden sm:block">
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 max-w-7xl py-6">
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
            {Array.from({ length: 28 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-[#151921] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Film className="w-10 h-10 text-[#94A3B8]/20 mb-4" />
            <p className="text-[#F8FAFC] font-semibold text-base mb-1">No movies found</p>
            <p className="text-[#94A3B8] text-sm">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
              {filtered.map((movie) => {
                const id = movie.id ?? movie.movieId;
                const title = movie.title ?? movie.name;
                const poster = movie.posterImg
                  ? `https://image.tmdb.org/t/p/w342${movie.posterImg}`
                  : null;

                return (
                  <ProfilePosterCard
                    key={id}
                    movieId={id}
                    poster={poster}
                    title={title}
                  />
                );
              })}
            </div>

            <ReviewPagination
              currentPage={page + 1}
              totalPages={totalPage + 1}
              onPageChange={(p) => setPage(p - 1)}
            />
          </>
        )}
      </div>
    </div>
  );
}
