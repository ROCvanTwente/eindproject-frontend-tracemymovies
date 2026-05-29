import { useNavigate } from "react-router";

import {
  Film,
  Star,
  TrendingUp,
  Sparkles,
  Clock,
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
import { AnalyticsHeader } from "../components/analytics/AnalyticsHeader";
import { StatsGrid } from "../components/analytics/StatsGrid";
import { RecentActivity } from "../components/analytics/RecentActivity";
import { FavoriteFilms } from "../components/analytics/FavoriteFilms";
import { SearchMovieModal } from "../components/analytics/SearchMovieModal";
import { BottomInsights } from "../components/analytics/BottomInsights";
import { YearlyChart } from "../components/analytics/YearlyChart";

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
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const removeFavorite = async (movieId) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/Favorites/${movieId}`, {
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
    const q = searchQuery.trim();

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/search?query=${encodeURIComponent(q)}`
        );
        if (!res.ok) {
          setSearchResults([]);
          return;
        }
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setSearchResults([]);
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

    setFavoriteMovies((prev) => [...prev, movie]);

    try {
      const token = getToken();
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Favorites/${movie.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        setFavoriteMovies((prev) => prev.filter((m) => m.id !== movie.id));
        console.error("Favoriet toevoegen mislukt:", await res.text());
      }
    } catch (e) {
      setFavoriteMovies((prev) => prev.filter((m) => m.id !== movie.id));
      console.error("Favoriet toevoegen mislukt:", e);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const idsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Favorites`, {
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
              `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/GetMovieDetails?id=${id}`
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
        const token = getToken();
        if (!token) return;

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
        if (!response.ok) throw new Error("Failed to fetch recent activity");

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
        <AnalyticsHeader />
        <StatsGrid />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 md:mb-8 items-start">
          <RecentActivity recentActivity={recentActivity} />
          
          <FavoriteFilms
            favoriteMovies={favoriteMovies}
            onOpenSearch={openSearch}
            onRemoveFavorite={removeFavorite}
            onNavigate={navigate}
          />
        </div>


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

        <SearchMovieModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          duplicateError={duplicateError}
          searchLoading={searchLoading}
          searchResults={searchResults}
          onAddFavorite={addFavorite}
        />

        <BottomInsights genreData={genreData} />
        <YearlyChart yearlyData={yearlyData} />
      </div>
    </div>
  );
}