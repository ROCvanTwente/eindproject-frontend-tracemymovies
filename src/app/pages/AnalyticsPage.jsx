import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { AnalyticsHeader } from "../components/analytics/AnalyticsHeader";
import { StatsGrid } from "../components/analytics/StatsGrid";
import { WatchlistShort } from "../components/analytics/WatchlistShort";
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

  const [watchlistShort, setWatchlistShort] = useState([]);

  const getToken = () =>
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  useEffect(() => {
    const fetchWatchlistShort = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/UserActivity/WatchlistShort`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch watchlist short");

        const data = await response.json();
        setWatchlistShort(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error("Error fetching watchlist short:", error);
      }
    };
    fetchWatchlistShort();
  }, []);

  return (
    <div className="min-h-screen py-6 md:py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <AnalyticsHeader />
        <StatsGrid />

        <div className="mb-6 md:mb-8">
          <WatchlistShort
            watchlist={watchlistShort}
            onNavigate={navigate}
          />
        </div>

        <BottomInsights genreData={genreData} />
        <YearlyChart yearlyData={yearlyData} />
      </div>
    </div>
  );
}
