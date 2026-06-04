import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Clock, Film, Heart, ArrowLeft, Eye, RotateCw } from "lucide-react";

// Returns the Monday of the week for a given date
function getWeekStart(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekLabel(weekStart) {
  const now = new Date();
  const thisWeek = getWeekStart(now);
  const lastWeek = new Date(thisWeek);
  lastWeek.setDate(lastWeek.getDate() - 7);

  if (weekStart.getTime() === thisWeek.getTime()) return "This week";
  if (weekStart.getTime() === lastWeek.getTime()) return "Last week";

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const fmtDay = (d) =>
    d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return `${fmtDay(weekStart)} – ${fmtDay(weekEnd)}`;
}

export function AllActivityPage() {
  const auth = useAuth();
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  const getToken = () =>
    auth?.token ||
    auth?.user?.token ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("auth_token") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    sessionStorage.getItem("auth_token") ||
    sessionStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    const fetchActivity = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/Activity/GetAll`,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setActivity(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  // Group by week, newest first — with rewatch detection
  const grouped = useMemo(() => {
    const sorted = [...activity].sort(
      (a, b) => new Date(b.loggedDate) - new Date(a.loggedDate)
    );

    // Mark rewatches: process oldest→newest, first occurrence = original, rest = rewatch
    const seen = new Set();
    const rewatchIndices = new Set();
    [...sorted].reverse().forEach((item, reversedIdx) => {
      const sortedIdx = sorted.length - 1 - reversedIdx;
      if (seen.has(item.movieId)) rewatchIndices.add(sortedIdx);
      seen.add(item.movieId);
    });
    const sortedWithRewatch = sorted.map((item, idx) => ({
      ...item,
      isRewatch: rewatchIndices.has(idx),
    }));

    const map = new Map();
    for (const item of sortedWithRewatch) {
      const weekStart = getWeekStart(item.watchedDate);
      const key = weekStart.getTime();
      if (!map.has(key)) map.set(key, { weekStart, items: [] });
      map.get(key).items.push(item);
    }

    return Array.from(map.values());
  }, [activity]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-[#44FFFF]/20 flex items-center justify-center">
              <Clock className="w-8 h-8 text-[#44FFFF] animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-t-2 border-[#44FFFF] animate-spin" />
          </div>
          <p className="text-[#94A3B8] text-sm">Loading your activity...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">

      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-[#44FFFF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BFBCFC]/4 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0B0E14] to-transparent" />

        <div className="relative container mx-auto px-4 max-w-4xl py-6 md:py-8">
          <Link
            to="/my-profile"
            className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to profile
          </Link>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#44FFFF]/25 to-[#BFBCFC]/10 rounded-2xl flex items-center justify-center border border-[#44FFFF]/30 shadow-lg shadow-[#44FFFF]/10 flex-shrink-0">
              <Clock className="w-6 h-6 md:w-7 md:h-7 text-[#44FFFF]" />
            </div>

            <div className="flex-1">
              <p className="text-[#44FFFF]/60 text-[9px] font-bold uppercase tracking-[0.25em] mb-0.5">
                Your History
              </p>
              <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] leading-none tracking-tight">
                All{" "}
                <span className="bg-gradient-to-r from-[#44FFFF] via-[#BFBCFC] to-[#FF61D2] bg-clip-text text-transparent">
                  Activity
                </span>
              </h1>
            </div>

            {activity.length > 0 && (
              <div className="bg-[#44FFFF]/10 border border-[#44FFFF]/20 rounded-xl px-4 py-2 text-center backdrop-blur-sm flex-shrink-0">
                <p className="text-2xl md:text-3xl font-black text-[#44FFFF] leading-none tabular-nums">
                  {activity.length}
                </p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">
                  {activity.length === 1 ? "film" : "films"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 max-w-4xl py-6 md:py-8">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-[#44FFFF]/8 rounded-full flex items-center justify-center border border-[#44FFFF]/15 mb-6">
              <Eye className="w-10 h-10 text-[#44FFFF]/30" />
            </div>
            <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">No activity yet</h2>
            <p className="text-[#94A3B8] text-sm max-w-xs">
              Log films to see your activity here.
            </p>
            <Link
              to="/search"
              className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-[#44FFFF] to-[#BFBCFC] text-[#0B0E14] font-bold px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              <Film className="w-4 h-4" />
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {grouped.map(({ weekStart, items }, groupIndex) => (
              <div key={weekStart.getTime()}>

                {/* Week divider */}
                {groupIndex > 0 && (
                  <hr className="border-[#BFBCFC]/10 mb-8" />
                )}

                {/* Week label */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#44FFFF]">
                    {getWeekLabel(weekStart)}
                  </span>
                  <span className="text-[#94A3B8]/40 text-xs">
                    {items.length} {items.length === 1 ? "film" : "films"}
                  </span>
                </div>

                {/* Films in this week */}
                <div className="flex flex-col gap-3">
                  {items.map((item, index) => {
                    const dateStr = new Date(item.watchedDate).toLocaleDateString("en-GB", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    });

                    return (
                      <Link
                        key={`${item.movieId}-${index}`}
                        to={`/movie/${item.movieId}`}
                        className="block group"
                      >
                        <div className="flex gap-4 bg-[#151921]/70 border border-[#BFBCFC]/10 rounded-xl p-3 md:p-4 hover:border-[#BFBCFC]/25 transition-all duration-200 group-hover:bg-[#151921]">

                          {/* Poster */}
                          <div className="w-14 md:w-16 flex-shrink-0">
                            <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#0B0E14] border border-white/5">
                              {item.poster && !item.poster.endsWith("null") ? (
                                <img
                                  src={item.poster}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Film className="w-5 h-5 text-[#94A3B8]/25" />
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-[#F8FAFC] font-semibold text-sm md:text-base leading-tight line-clamp-2 group-hover:text-[#BFBCFC] transition-colors">
                                {item.title}
                              </h3>
                              {item.isLiked && (
                                <Heart className="w-4 h-4 text-[#FF61D2] fill-[#FF61D2] flex-shrink-0 mt-0.5" />
                              )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-[#94A3B8] text-xs capitalize">{dateStr}</span>
                              {item.isRewatch && (
                                <span className="flex items-center gap-1 text-[#44FFFF] text-xs font-medium bg-[#44FFFF]/8 border border-[#44FFFF]/20 px-1.5 py-0.5 rounded-md">
                                  <RotateCw className="w-3 h-3" />
                                  Rewatch
                                </span>
                              )}
                            </div>
                          </div>

                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
