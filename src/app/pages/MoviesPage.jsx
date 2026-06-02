import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Film, Flame, Star, Clock, TrendingUp } from "lucide-react";

const TABS = [
  { id: "popular",  label: "Popular",    icon: Flame,      endpoint: "Popular" },
  { id: "trending", label: "Trending",   icon: TrendingUp, endpoint: "Trending" },
  { id: "toprated", label: "Top Rated",  icon: Star,       endpoint: "TopRated" },
  { id: "upcoming", label: "Upcoming",   icon: Clock,      endpoint: "Upcoming" },
];

export function MoviesPage() {
  const [activeTab, setActiveTab] = useState("popular");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const tab = TABS.find((t) => t.id === activeTab);
    if (!tab) return;

    setLoading(true);
    setMovies([]);

    fetch(`${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/${tab.endpoint}`)
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setMovies(Array.isArray(data) ? data : data?.results ?? []))
      .catch(() => setMovies([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

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

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-[#151921]/80 rounded-xl w-fit">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === id
                    ? "bg-[#BFBCFC] text-[#0B0E14]"
                    : "text-[#94A3B8] hover:text-[#F8FAFC]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
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
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-3 md:gap-4">
            {movies.map((movie) => {
              const id = movie.id ?? movie.movieId;
              const title = movie.title ?? movie.name;
              const poster = movie.poster_path
                ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
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
        )}
      </div>
    </div>
  );
}
