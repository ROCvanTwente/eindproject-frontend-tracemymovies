import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { Film, Flame, Star, Clock, TrendingUp, ArrowDownAz, ArrowUpAz, Calendar, Flashlight, Search } from "lucide-react";

const TABS = [
  { id: "popular-high-low", label: "Popular (High-Low)", icon: Flame, endpoint: "popular", desc: true },
  { id: "popular-low-high", label: "Popular (Low-High)", icon: Flame, endpoint: "popular", desc: false },
  { id: "title-high-low", label: "Title (A-Z)", icon: ArrowDownAz, endpoint: "title", desc: false },
  { id: "title-low-high", label: "Title (Z-A)", icon: ArrowUpAz, endpoint: "title", desc: true },
  { id: "rating-high-low", label: "Rating (High-Low)", icon: Star, endpoint: "rating", desc: true },
  { id: "rating-low-high", label: "Rating (Low-High)", icon: Star, endpoint: "rating", desc: false },
  { id: "date-high-low", label: "ReleaseDate (High-Low)", icon: Calendar, endpoint: "date", desc: true },
  { id: "date-low-high", label: "ReleaseDate (Low-High)", icon: Calendar, endpoint: "date", desc: false },
];

export function MoviesPage() {
  const [activeTab, setActiveTab] = useState("popular-high-low");
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const controllerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [yearFilter, setYearFilter] = useState(null);

  useEffect(() => {
    console.log(page);
    fetchData();
  }, [page]);

  useEffect(() => {
    setPage(0);
    fetchData();
    console.log(yearFilter);
  }, [activeTab, searchQuery, yearFilter]);

  const fetchData = useCallback(() => {

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return;

    setLoading(true);
    setMovies([]);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/get100movies?page=${page}&sort=${tab.endpoint}&desc=${tab.desc}${searchQuery != "" ? `&search=${searchQuery}` : ""}`,
      {
        signal: controller.signal,
      })
      .then((r) => r.ok ? r.json() : [])
      .then((data) => { console.log(data); setMovies(Array.isArray(data.moviesData) ? data.moviesData : []); setTotalPage(data.totalPages) })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error(err);
        } else {
          setMovies([])
        }
      })
      .finally(() => setLoading(false));
  });



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
            <div>
              <p className="text-[#BFBCFC]/60 text-[9px] font-bold uppercase tracking-[0.25em] mb-0.5">Browse</p>
              <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] leading-none tracking-tight">
                Movies
              </h1>
            </div>
          </div>

          <div className="relative hidden mb-3 lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              className="w-full bg-[#151921] text-[#F8FAFC] placeholder:text-[#94A3B8] pl-10 pr-4 py-2 rounded-xl border border-[#BFBCFC]/15 focus:outline-none focus:border-[#BFBCFC] focus:ring-2 focus:ring-[#BFBCFC]/20 w-64 transition-all duration-200"
            />
          </div>

          {/* Tabs */}
          <div className="flex w-full justify-center gap-1 p-1 bg-[#151921]/80 rounded-xl w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all text-wrap duration-200 ${activeTab === id
                  ? "bg-[#BFBCFC] text-[#0B0E14]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label.split(" ")[0]}
                <br />
                {label.split(" ")[1]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 max-w-7xl py-6">
        {loading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-xl bg-[#151921] animate-pulse" />
            ))}
          </div>
        ) : (
            <>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
                {movies.map((movie) => {
                  const id = movie.id ?? movie.movieId;
                  const title = movie.title ?? movie.name;
                  const poster = movie.posterImg
                    ? `https://image.tmdb.org/t/p/w342${movie.posterImg}`
                    : null;

                  return (
                    <div
                      key={id}
                      onClick={() => navigate(`/movie/${id}`)}
                      className="group cursor-pointer"
                    >
                      <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[#151921] border border-white/5 group-hover:border-[#BFBCFC]/35 group-hover:shadow-lg group-hover:shadow-[#BFBCFC]/10 transition-all duration-200">
                        {poster ? (
                          <img
                            src={poster}
                            alt={title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-6 h-6 text-[#94A3B8]/20" />
                          </div>
                        )}
                      </div>
                      <p className="mt-1.5 text-[#94A3B8] text-xs truncate group-hover:text-[#F8FAFC] transition-colors px-0.5">
                        {title}
                      </p>
                    </div>
                  );
                })}
              </div>
              {totalPage != 0 && (
                <div className="flex justify-between w-full mt-5">
                  <button onClick={() => !(page <= 0) && setPage(page - 1)}>Prev</button>
                  <p>{page + 1}/{totalPage + 1}</p>
                  <button onClick={() => !(page > totalPage) && setPage(page + 1)}>Next</button>
                </div>
              )}
            </>
        )}
      </div>
    </div>
  );
}