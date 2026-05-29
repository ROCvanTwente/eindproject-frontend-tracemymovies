import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

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