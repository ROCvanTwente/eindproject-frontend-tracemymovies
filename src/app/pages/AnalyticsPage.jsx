import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import {
  Film,
  Star,
  TrendingUp,
  Sparkles,
  Clock,
  Heart,
  Plus,
  X,
  Search,
  Loader2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function AnalyticsPage() {
  const navigate = useNavigate();

  const yearlyData = [
    { year: "2020", movies: 45 },
    { year: "2021", movies: 62 },
    { year: "2022", movies: 58 },
    { year: "2023", movies: 71 },
    { year: "2024", movies: 38 },
  ];

  const genreData = [
    { genre: "Sci-Fi", count: 78, color: "#BFBCFC" },
    { genre: "Action", count: 65, color: "#BFBCFC" },
    { genre: "Drama", count: 52, color: "#BFBCFC" },
    { genre: "Thriller", count: 41, color: "#BFBCFC" },
    { genre: "Comedy", count: 38, color: "#BFBCFC" },
  ];

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [duplicateError, setDuplicateError] = useState("");

  const getToken = () =>
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token");


  const removeFavorite = async (movieId) => {
    const token = getToken();
    if (!token) return;
    await fetch(`https://localhost:7245/api/Favorites/${movieId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setFavoriteMovies((prev) => prev.filter((m) => m.id !== movieId));
  };

  const openSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setDuplicateError("");
    setSearchModalOpen(true);
  };

  useEffect(() => {
    if (!searchModalOpen) return;
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `https://localhost:7245/api/tmdbmovie/search?query=${encodeURIComponent(searchQuery)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        const all = data.results || data;
        setSearchResults(Array.isArray(all) ? all.slice(0, 8) : []);
      } catch (e) {
        console.error(e);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchModalOpen]);

  const addFavorite = async (movie) => {
    if (favoriteMovies.length >= 4) return;
    if (favoriteMovies.some((m) => m.id === movie.id)) {
      setDuplicateError(`"${movie.title}" staat al in je favorieten.`);
      return;
    }
    setDuplicateError("");

    setSearchModalOpen(false);

    try {
      const token = getToken();
      const res = await fetch(
        `https://localhost:7245/api/Favorites/${movie.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        console.error("Favoriet toevoegen mislukt:", await res.text());
        return;
      }

      const detailsRes = await fetch(
        `https://localhost:7245/api/tmdbmovie/GetMovieDetails?id=${movie.id}`
      );
      const fullMovie = detailsRes.ok ? await detailsRes.json() : movie;
      setFavoriteMovies((prev) => [...prev, fullMovie]);
    } catch (e) {
      console.error("Favoriet toevoegen mislukt:", e);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token =
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token");

        if (!token) return;

        const idsRes = await fetch("https://localhost:7245/api/Favorites", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!idsRes.ok) return;

        const ids = await idsRes.json();
        const top4 = ids.slice(0, 4);

        const movies = await Promise.all(
          top4.map((id) =>
            fetch(
              `https://localhost:7245/api/tmdbmovie/GetMovieDetails?id=${id}`
            ).then((r) => (r.ok ? r.json() : null))
          )
        );

        setFavoriteMovies(movies.filter(Boolean));
      } catch (error) {
        console.error("Error fetching favorite movies:", error);
      }
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const token =
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/UserActivity/Recent`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 401) {
          console.error("Unauthorized - token invalid or expired");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch recent activity");
        }

        const data = await response.json();

        setRecentActivity(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching recent activity:", error);
      }
    };

    fetchRecentActivity();
  }, []);

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <div className="mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 md:w-14 h-12 md:h-14 bg-[#44FFFF]/10 rounded-xl mb-2 md:mb-3">
            <Sparkles className="w-6 md:w-7 h-6 md:h-7 text-[#44FFFF]" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1 md:mb-2">
            Movie DNA
          </h1>

          <p className="text-[#94A3B8] text-sm md:text-base">
            Your personal cinematic analytics and insights
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">

          {/* Total Watched */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Film className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" />
                </div>

                <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
                  Total Watched
                </h3>
              </div>

              <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                274
              </p>

              <div className="flex items-center gap-1">
                <span className="text-[#44FFFF] text-xs font-data font-medium">
                  +18 this month
                </span>

                <TrendingUp className="w-3 h-3 text-[#44FFFF]" />
              </div>
            </div>
          </div>

          {/* Average Score */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Star
                    className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]"
                    fill="#BFBCFC"
                  />
                </div>

                <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
                  Average Score
                </h3>
              </div>

              <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                7.8
              </p>

              <p className="text-[#44FFFF] text-xs font-data font-medium">
                out of 10 ★
              </p>
            </div>
          </div>

          {/* Watch Streak */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" />
                </div>

                <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
                  Watch Streak
                </h3>
              </div>

              <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                12
              </p>

              <p className="text-[#44FFFF] text-xs font-data font-medium">
                days in a row
              </p>
            </div>
          </div>

          {/* Total Hours */}
          <div className="relative overflow-hidden bg-gradient-to-br from-[#BFBCFC]/20 via-[#BFBCFC]/10 to-transparent border border-[#BFBCFC]/30 rounded-lg md:rounded-xl p-3 md:p-4 hover:scale-105 transition-transform duration-300">
            <div className="absolute top-0 right-0 w-16 md:w-20 h-16 md:h-20 bg-[#BFBCFC]/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="w-8 md:w-10 h-8 md:h-10 bg-[#BFBCFC]/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Clock className="w-4 md:w-5 h-4 md:h-5 text-[#BFBCFC]" />
                </div>

                <h3 className="text-[#94A3B8] font-medium text-xs md:text-sm">
                  Total Hours
                </h3>
              </div>

              <p className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1">
                548
              </p>

              <p className="text-[#44FFFF] text-xs font-data font-medium">
                ≈ 22.8 days
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#44FFFF]" />
            Recent Activity
          </h2>

          {recentActivity.length === 0 ? (
            <p className="text-[#94A3B8] text-sm md:text-base">
              No recent activity found.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg p-3 hover:border-[#BFBCFC]/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-[#F8FAFC] font-medium text-sm">
                      {activity.movieTitle}
                    </h4>

                    <span className="text-[#44FFFF] font-data text-xs font-bold">
                      ★ {Number(activity.tmdbRating).toFixed(1)}/10
                    </span>
                  </div>

                  <p className="text-[#94A3B8] text-xs mb-1.5 line-clamp-2">
                    {activity.overview}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-[#94A3B8] text-xs">
                      {new Date(activity.watchedDate).toLocaleDateString()}
                    </p>

                    <p className="text-[#44FFFF] text-xs font-data">
                      Watched {activity.amountWatched}x
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Favorite Films */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold font-heading text-[#F8FAFC] mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-[#FF61D2]" fill="#FF61D2" />
            Favorite Films
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 4 }).map((_, i) => {
              const movie = favoriteMovies[i];
              return movie ? (
                <div
                  key={movie.id}
                  onClick={() => navigate(`/movie/${movie.id}`)}
                  className="relative group cursor-pointer transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-1"
                  style={{ willChange: "transform" }}
                >
                  <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[#FF61D2]/60 group-hover:shadow-[0_8px_32px_rgba(255,97,210,0.25)]">
                    <div className="relative overflow-hidden">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full aspect-[2/3] object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFavorite(movie.id); }}
                        className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 backdrop-blur-sm"
                      >
                        <X className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                    <div className="p-2.5">
                      <h3 className="text-[#F8FAFC] font-medium text-xs truncate transition-colors duration-200 group-hover:text-white">
                        {movie.title}
                      </h3>
                      <span className="text-[#94A3B8] text-xs">
                        {movie.release_date?.slice(0, 4)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  key={`empty-${i}`}
                  onClick={openSearch}
                  className="group relative transition-all duration-300 ease-out hover:scale-[1.04] hover:-translate-y-1 text-left"
                  style={{ willChange: "transform" }}
                >
                  <div className="bg-[#151921]/50 backdrop-blur-xl border border-dashed border-[#BFBCFC]/20 rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[#FF61D2]/50 group-hover:bg-[#FF61D2]/5 group-hover:shadow-[0_8px_32px_rgba(255,97,210,0.15)]">
                    <div className="aspect-[2/3] flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full border border-dashed border-[#BFBCFC]/25 group-hover:border-[#FF61D2]/60 flex items-center justify-center transition-all duration-300 group-hover:bg-[#FF61D2]/10">
                        <Plus className="w-5 h-5 text-[#94A3B8] group-hover:text-[#FF61D2] transition-all duration-300 group-hover:rotate-90 group-hover:scale-110" />
                      </div>
                      <span className="text-[#94A3B8] text-xs font-medium group-hover:text-[#FF61D2] transition-colors duration-200">
                        Voeg toe
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs invisible select-none">-</p>
                      <p className="text-xs invisible select-none">-</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Modal */}
        {searchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#151921] border border-[#BFBCFC]/20 rounded-xl w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-[#BFBCFC]/10">
                <h3 className="text-[#F8FAFC] font-bold font-heading">
                  Film zoeken
                </h3>
                <button
                  onClick={() => setSearchModalOpen(false)}
                  className="w-7 h-7 rounded-full hover:bg-[#BFBCFC]/10 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-[#94A3B8]" />
                </button>
              </div>

              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Zoek een film..."
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

                <div className="mt-3 max-h-80 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-[#BFBCFC]/40 scrollbar-track-transparent hover:scrollbar-thumb-[#BFBCFC]/60">
                  {searchLoading && (
                    <div className="flex justify-center py-6">
                      <Loader2 className="w-5 h-5 text-[#BFBCFC] animate-spin" />
                    </div>
                  )}
                  {!searchLoading && searchQuery && searchResults.length === 0 && (
                    <p className="text-[#94A3B8] text-sm text-center py-6">
                      Geen films gevonden.
                    </p>
                  )}
                  {!searchLoading && !searchQuery && (
                    <p className="text-[#94A3B8] text-sm text-center py-6">
                      Typ een filmtitel om te zoeken.
                    </p>
                  )}
                  {searchResults.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => addFavorite(m)}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[#BFBCFC]/10 transition-colors text-left"
                    >
                      {m.poster_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                          alt={m.title}
                          className="w-9 h-14 object-cover rounded flex-none"
                        />
                      ) : (
                        <div className="w-9 h-14 bg-[#0B0E14] rounded flex-none flex items-center justify-center">
                          <Film className="w-4 h-4 text-[#94A3B8]" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[#F8FAFC] text-sm font-medium truncate">
                          {m.title}
                        </p>
                        <p className="text-[#94A3B8] text-xs">
                          {m.release_date?.slice(0, 4)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5 mb-6 md:mb-8">

          {/* Favorite Genre */}
          <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">
              Favorite Genre
            </h2>

            <div className="space-y-3">
              {genreData.map((item) => (
                <div key={item.genre}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[#F8FAFC] text-sm">
                      {item.genre}
                    </span>

                    <span className="text-[#44FFFF] text-sm font-bold">
                      {item.count}
                    </span>
                  </div>

                  <div className="h-2 bg-[#0B0E14] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(item.count / 78) * 100}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Actor */}
          <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">
              Favorite Actor
            </h2>

            <div className="space-y-2">
              {[
                { name: "Leonardo DiCaprio", movies: 12 },
                { name: "Tom Hanks", movies: 10 },
                { name: "Christian Bale", movies: 9 },
                { name: "Scarlett Johansson", movies: 8 },
              ].map((actor, index) => (
                <div
                  key={actor.name}
                  className="flex items-center gap-3 bg-[#0B0E14]/50 rounded-lg p-2.5"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center text-[#0B0E14] font-bold">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-[#F8FAFC] text-sm">
                      {actor.name}
                    </p>

                    <p className="text-[#44FFFF] text-xs">
                      {actor.movies} movies
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Favorite Director */}
          <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">
            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">
              Favorite Director
            </h2>

            <div className="space-y-2">
              {[
                { name: "Christopher Nolan", movies: 8 },
                { name: "Quentin Tarantino", movies: 7 },
                { name: "Martin Scorsese", movies: 6 },
                { name: "Steven Spielberg", movies: 5 },
              ].map((director, index) => (
                <div
                  key={director.name}
                  className="flex items-center gap-3 bg-[#0B0E14]/50 rounded-lg p-2.5"
                >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#BFBCFC] to-[#44FFFF] rounded-full flex items-center justify-center text-[#0B0E14] font-bold">
                    {index + 1}
                  </div>

                  <div>
                    <p className="text-[#F8FAFC] text-sm">
                      {director.name}
                    </p>

                    <p className="text-[#44FFFF] text-xs">
                      {director.movies} movies
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Watched Per Year */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#151921]/70 backdrop-blur-xl border border-[#BFBCFC]/15 rounded-lg md:rounded-xl p-3 md:p-4">

            <h2 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC] mb-4">
              Movies Watched Per Year
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={yearlyData}>
                <defs>
                  <linearGradient
                    id="yearlyBarGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#BFBCFC" stopOpacity={1} />
                    <stop offset="100%" stopColor="#44FFFF" stopOpacity={0.6} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#151921"
                  opacity={0.3}
                />

                <XAxis dataKey="year" stroke="#94A3B8" />

                <YAxis stroke="#94A3B8" />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#151921",
                    border: "1px solid rgba(191, 188, 252, 0.3)",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                  }}
                />

                <Bar
                  dataKey="movies"
                  fill="url(#yearlyBarGradient)"
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}