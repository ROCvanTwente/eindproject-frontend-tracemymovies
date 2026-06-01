import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AnalyticsHeader } from "../components/analytics/AnalyticsHeader";
import { StatsGrid } from "../components/analytics/StatsGrid";
import { BottomInsights } from "../components/analytics/BottomInsights";
import { YearlyChart } from "../components/analytics/YearlyChart";

export function AnalyticsPage() {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [watchlistShort, setWatchlistShort] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const watchlistRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/UserActivity/WatchlistShort`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (watchlistRes.ok) {
          const wData = await watchlistRes.json();
          setWatchlistShort(Array.isArray(wData) ? wData : [wData]);
        }

        const analyticsRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/UserActivity/Analytics`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (analyticsRes.ok) {
          const aData = await analyticsRes.json();
          setAnalyticsData(aData);
        }
      } catch (error) {
        console.error("Error fetching movie DNA analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-primary/10 rounded-full scale-110"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-accent border-b-primary rounded-full animate-spin"></div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-accent animate-pulse">DNA</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-background text-foreground relative overflow-hidden selection:bg-accent/20 selection:text-accent">
      {/* Refactored High-Performance Modular Glow Layers */}
      <div className="ambient-glow-accent top-[-10%] left-[-10%] w-[50vw] h-[50vw] opacity-10" />
      <div className="ambient-glow-primary bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] opacity-8" />
      <div className="ambient-glow-accent top-[40%] left-[35%] w-[30vw] h-[30vw] opacity-5" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10 space-y-12 animate-fade-in">
        <AnalyticsHeader />
        
        <section className="space-y-4">
          <StatsGrid stats={analyticsData?.stats} />
        </section>

        <BottomInsights 
          genreData={analyticsData?.genreData || []} 
          favoriteActors={analyticsData?.favoriteActors || []}
          favoriteDirectors={analyticsData?.favoriteDirectors || []}
        />
        
        <section className="bg-surface/30 backdrop-blur-3xl border border-primary/5 rounded-2xl md:rounded-3xl p-6 shadow-2xl">
          <YearlyChart yearlyData={analyticsData?.yearlyData || []} />
        </section>
      </div>
    </div>
  );
}