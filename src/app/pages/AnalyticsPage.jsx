// Hoofdpagina voor filmstatistieken (Movie DNA) met data-integraties.
import { useEffect, useState } from "react";
import { AnalyticsHeader } from "../components/analytics/AnalyticsHeader";
import { BiometricHud } from "../components/analytics/BiometricHud";
import { DirectorSynergy } from "../components/analytics/DirectorSynergy";
import { YearlyChart } from "../components/analytics/YearlyChart";
import { MoodRadar as TasteProfile } from "../components/analytics/MoodRadar";
import { MovieTimeline } from "../components/analytics/MovieTimeline";
 
export function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const getToken = () => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
 
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = getToken();
        if (!token) return;
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
      <div className="min-h-screen flex items-center justify-center bg-[#0B0E14]">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 border-2 border-[#BFBCFC]/10 rounded-full scale-110"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-[#44FFFF] border-b-[#BFBCFC] rounded-full animate-spin"></div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#44FFFF] animate-pulse">DNA</span>
        </div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F8FAFC] relative overflow-hidden selection:bg-[#44FFFF]/20 selection:text-[#44FFFF]">
      <div className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] rounded-full bg-[#44FFFF]/3 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-[#FF61D2]/3 blur-3xl pointer-events-none" />
     
      <div className="container mx-auto px-6 max-w-7xl relative z-10 py-12 space-y-12 animate-fade-in">
        <AnalyticsHeader />
       
        <section>
          <BiometricHud stats={analyticsData?.stats} />
        </section>
 
        <div className="space-y-12 pt-4">
          {/* NIVEAU 1: Direct verbonden met de dynamische API-feeds */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-3 min-h-[420px] w-full flex items-center justify-center">
              <TasteProfile rawData={analyticsData?.tasteProfile} />
            </div>
            <div className="lg:col-span-2">
              <DirectorSynergy rawPairings={analyticsData?.directorSynergy} />
            </div>
          </section>
 
          {/* NIVEAU 2: Uitgebreide tijdlijn (chronologische verdeling) */}
          <section className="w-full">
            <MovieTimeline rawData={analyticsData?.movieTimeline} />
          </section>
        </div>
       
        {/* Randloze zwevende voettekst-kaart voor jaarlijkse/maandelijkse trends */}
        <section className="bg-[#151921]/20 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-md">
          <YearlyChart 
            yearlyData={analyticsData?.yearlyData || []} 
            monthlyData={analyticsData?.monthlyData || {}} 
          />
        </section>
      </div>
    </div>
  );
}