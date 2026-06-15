import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { Link, useParams } from "react-router";
import { BookOpen, ArrowLeft, Star, Heart, RotateCw, AlignLeft, ChevronLeft, ChevronRight, Film, Pencil, MoreHorizontal, Eye } from "lucide-react";
import { EditLogModal } from "../components/EditLogModal";
import { WatchLogModal } from "../components/WatchLogModal";
import { MovieFilters, useMovieFilters } from "../components/MovieFilters";
import { ReviewPagination } from "../components/review/ReviewPagination";
import { toast } from "sonner";

const getToken = () => localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");
const API = import.meta.env.VITE_API_BASE_URL;
const LOGS_PER_PAGE = 20;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function StarRating({ rating }) {
  if (!rating || rating === 0)
    return <span className="text-[#94A3B8]/40 text-xs">No rating</span>;
  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < rating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#44FFFF]/15"}`} />
          ))}
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i + 5} className={`w-4 h-4 ${i + 5 < rating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#44FFFF]/15"}`} />
          ))}
        </div>
      </div>
      <span className="text-[#44FFFF]/80 text-sm font-bold">{rating}</span>
    </div>
  );
}

export function DiaryPage() {
  const { userId } = useParams();
  const isPublic = !!userId;
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [hoverMap, setHoverMap] = useState({});
  const [myStatus, setMyStatus] = useState(null);
  const [dotsMenuOpen, setDotsMenuOpen] = useState(false);
  const [dotsMenuPos, setDotsMenuPos] = useState({ top: 0, left: 0 });
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logModalConfig, setLogModalConfig] = useState({});
  const [menuHoverRating, setMenuHoverRating] = useState(0);
  const [page, setPage] = useState(0);
  const rightPanelRef = useRef(null);
  const dotsButtonRef = useRef(null);

  const updateEntry = (logId, changes) => {
    setData((prev) => ({
      ...prev,
      entries: prev.entries.map((e) => e.logId === logId ? { ...e, ...changes } : e),
    }));
    setSelected((prev) => prev?.logId === logId ? { ...prev, ...changes } : prev);
  };

  const patchLog = async (entry, changes) => {
    updateEntry(entry.logId, changes);
    const token = getToken();
    if (!token) return;
    const merged = { ...entry, ...changes };
    const watchDate = merged.watchedDate && !merged.watchedDate.startsWith("0001")
      ? new Date(merged.watchedDate).toISOString()
      : new Date(merged.loggedDate).toISOString();
    try {
      await fetch(`${API}/Log/Update/${entry.logId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          movieId: entry.movieId,
          watchDate,
          isRewatch: entry.isRewatch,
          isLiked: merged.isLiked,
          rating: merged.userRating > 0 ? merged.userRating : null,
          reviewText: entry.reviewText?.trim() || null,
          containsSpoilers: entry.containsSpoilers ?? false,
        }),
      });

      // Rating/like change may have updated FilmRating/FilmLikes (if this is the latest log) — keep myStatus in sync
      if (("userRating" in changes || "isLiked" in changes) && selected?.movieId === entry.movieId) {
        fetch(`${API}/database/GetMovieStatus/${entry.movieId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((r) => r.ok ? r.json() : null)
          .then(setMyStatus)
          .catch(console.error);
      }
    } catch {
      updateEntry(entry.logId, { isLiked: entry.isLiked, userRating: entry.userRating });
    }
  };

  // Fetch current user's status for the selected film
  useEffect(() => {
    if (!selected) { setMyStatus(null); return; }
    const token = getToken();
    if (!token) return;
    fetch(`${API}/database/GetMovieStatus/${selected.movieId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then(setMyStatus)
      .catch(console.error);
  }, [selected?.movieId, isPublic]);

  useEffect(() => {
    setLoading(true);
    setSelected(null);
    setSelectedMonth(null);
    const token = getToken();
    if (!token) { setLoading(false); return; }
    const url = isPublic
      ? `${API}/PublicProfile/${userId}/YearLog?year=${year}`
      : `${API}/UserActivity/YearLog?year=${year}`;
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setData(d);
        if (d?.entries?.length > 0) setSelected(d.entries[0]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [year, userId, isPublic]);

  const entriesForFilter = useMemo(
    () => (data?.entries ?? [])
      .map((e) => ({ ...e, year: e.releaseYear }))
      .sort((a, b) => {
        const dateDiff = new Date(b.loggedDate) - new Date(a.loggedDate);
        return dateDiff !== 0 ? dateDiff : (b.logId ?? 0) - (a.logId ?? 0);
      }),
    [data]
  );

  const {
    genre, setGenre,
    decade, setDecade,
    year: filterYear, setYear: setFilterYear,
    rating, setRating,
    filtered: filterResult,
    availableGenres, availableDecades, ratingOptions,
    hasActiveFilters, reset: resetFilters,
  } = useMovieFilters(entriesForFilter);

  useEffect(() => setPage(0), [filterResult, selectedMonth]);

  const totalPages = Math.max(1, Math.ceil(filterResult.length / LOGS_PER_PAGE));
  const pagedResult = filterResult.slice(page * LOGS_PER_PAGE, (page + 1) * LOGS_PER_PAGE);

  const monthsWithEntries = new Set(pagedResult.map((e) => new Date(e.loggedDate).getMonth()));

  const grouped = (() => {
    const map = new Map();
    for (const entry of pagedResult) {
      const month = new Date(entry.loggedDate).getMonth();
      if (selectedMonth !== null && month !== selectedMonth) continue;
      if (!map.has(month)) map.set(month, []);
      map.get(month).push(entry);
    }
    return Array.from(map.entries()).sort((a, b) => b[0] - a[0]);
  })();

  const handleSelectMonth = (month) => {
    const next = selectedMonth === month ? null : month;
    setSelectedMonth(next);
    const filtered = !data?.entries
      ? []
      : next === null
      ? data.entries
      : data.entries.filter((e) => new Date(e.loggedDate).getMonth() === next);
    setSelected(filtered[0] ?? null);
    rightPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelect = (entry) => {
    setSelected(entry);
    rightPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleDeleteLog = async (logId) => {
    const token = getToken();
    if (!token) return;
    const prevData = data;
    const prevSelected = selected;
    const entries = data?.entries ?? [];
    const idx = entries.findIndex((e) => e.logId === logId);
    const next = entries[idx + 1] ?? entries[idx - 1] ?? null;
    setData((prev) => ({ ...prev, entries: prev.entries.filter((e) => e.logId !== logId), totalCount: prev.totalCount - 1 }));
    setSelected((prev) => prev?.logId === logId ? next : prev);
    try {
      const res = await fetch(`${API}/Log/Delete/${logId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setData(prevData); setSelected(prevSelected); }
    } catch {
      setData(prevData);
      setSelected(prevSelected);
    }
  };

  const handleToggleWatched = async () => {
    const token = getToken();
    if (!token || !selected) return;
    if (myStatus?.isWatched && myStatus?.hasLogEntries) {
      toast.error("Can't unwatch — you have activity on this film.");
      return;
    }
    const next = !myStatus?.isWatched;
    setMyStatus((prev) => ({ ...prev, isWatched: next }));
    try {
      if (next) {
        await fetch(`${API}/database/LogWatchActivity`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ MovieId: selected.movieId }),
        });
      } else {
        await fetch(`${API}/database/RemoveWatchActivity/${selected.movieId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      setMyStatus((prev) => ({ ...prev, isWatched: !next }));
    }
  };

  const handleToggleLiked = async () => {
    const token = getToken();
    if (!token || !selected) return;
    const next = !myStatus?.isFavorite;
    setMyStatus((prev) => ({ ...prev, isFavorite: next }));
    try {
      const res = await fetch(`${API}/database/ToggleLikeStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ MovieId: selected.movieId, IsLiked: next }),
      });
      if (!res.ok) setMyStatus((prev) => ({ ...prev, isFavorite: !next }));
    } catch {
      setMyStatus((prev) => ({ ...prev, isFavorite: !next }));
    }
  };

  const handleSetMenuRating = async (n) => {
    const token = getToken();
    if (!token || !selected) return;
    const newRating = n === myStatus?.filmRating ? 0 : n;
    setMyStatus((prev) => ({ ...prev, filmRating: newRating }));
    try {
      await fetch(`${API}/database/SetFilmRating`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ MovieId: selected.movieId, Rating: newRating }),
      });
    } catch {
      setMyStatus((prev) => ({ ...prev, filmRating: myStatus?.filmRating ?? 0 }));
    }
  };

  const openDotsMenu = (e) => {
    e.stopPropagation();
    const rect = dotsButtonRef.current?.getBoundingClientRect();
    if (rect) {
      const menuWidth = 192;
      const top = rect.top - 8;
      const left = Math.max(8, rect.right - menuWidth);
      setDotsMenuPos({ top, left });
    }
    setMenuHoverRating(0);
    setDotsMenuOpen(true);
  };

  const handleLogSuccess = () => {
    setLogModalOpen(false);
    const token = getToken();
    if (!token) return;

    if (selected) {
      fetch(`${API}/database/GetMovieStatus/${selected.movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.ok ? r.json() : null)
        .then(setMyStatus)
        .catch(console.error);
    }

    if (isPublic) {
      // Don't touch the public diary — only myStatus needed refreshing
      return;
    }
    fetch(`${API}/UserActivity/YearLog?year=${year}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setData(d);
        if (selected) {
          const updated = d.entries.find((e) => e.logId === selected.logId);
          if (updated) setSelected(updated);
        }
      })
      .catch(console.error);
  };

  const handleEditSave = () => {
    setEditEntry(null);
    // Re-fetch to get updated data
    const token = getToken();
    if (!token) return;

    if (selected) {
      fetch(`${API}/database/GetMovieStatus/${selected.movieId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.ok ? r.json() : null)
        .then(setMyStatus)
        .catch(console.error);
    }

    fetch(`${API}/UserActivity/YearLog?year=${year}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return;
        setData(d);
        // Keep the same entry selected but with updated data
        if (selected) {
          const updated = d.entries.find((e) => e.logId === selected.logId);
          if (updated) setSelected(updated);
        }
      })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-[#BFBCFC]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#44FFFF]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0B0E14] to-transparent" />

        <div className="relative container mx-auto px-4 max-w-7xl py-6">
          <Link
            to={isPublic ? `/user/${userId}` : "/my-profile"}
            className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] text-sm mb-5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {isPublic ? "Back to profile" : "Back to profile"}
          </Link>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-[#BFBCFC]/60 text-[9px] font-bold uppercase tracking-[0.25em] mb-0.5">
                Film Diary
              </p>
              <h1 className="text-2xl md:text-4xl font-black text-[#F8FAFC] leading-none tracking-tight break-words">
                {isPublic && <span className="text-[#F8FAFC]">{data?.username ?? "…"}'s </span>}
                <span className="bg-gradient-to-r from-[#BFBCFC] via-[#9b9dfc] to-[#44FFFF] bg-clip-text text-transparent">
                  {isPublic ? "Logs" : "Your Logs"}
                </span>
              </h1>
            </div>

            {/* Year selector */}
            <div className="flex items-center gap-1 bg-[#151921]/80 border border-[#BFBCFC]/12 rounded-xl px-2 py-1.5">
              <button
                onClick={() => setYear((y) => y - 1)}
                disabled={year <= 2000}
                className="p-1 text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-[#BFBCFC]/8"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[#F8FAFC] font-black text-lg px-3 tabular-nums select-none">
                {year}
              </span>
              <button
                onClick={() => setYear((y) => y + 1)}
                disabled={year >= currentYear}
                className="p-1 text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-md hover:bg-[#BFBCFC]/8"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {data?.totalCount > 0 && (
              <div className="bg-[#BFBCFC]/12 border border-[#BFBCFC]/25 rounded-xl px-4 py-2 text-center backdrop-blur-sm flex-shrink-0">
                <p className="text-2xl md:text-3xl font-black text-[#BFBCFC] leading-none tabular-nums">
                  {data.totalCount}
                </p>
                <p className="text-[#94A3B8] text-[10px] mt-0.5">
                  {data.totalCount === 1 ? "log" : "logs"}
                </p>
              </div>
            )}
          </div>

          {/* Month filter */}
          {data?.entries?.length > 0 && (
            <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
              <button
                onClick={() => setSelectedMonth(null)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-sm font-black uppercase tracking-wider transition-colors cursor-pointer ${
                  selectedMonth === null
                    ? "text-[#BFBCFC]"
                    : "text-[#94A3B8]/50 hover:text-[#F8FAFC]"
                }`}
              >
                All
              </button>
              {MONTH_NAMES.map((name, idx) => {
                const hasEntries = monthsWithEntries.has(idx);
                const isActive = selectedMonth === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectMonth(idx)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-sm font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      isActive
                        ? "text-[#BFBCFC]"
                        : hasEntries
                        ? "text-[#94A3B8] hover:text-[#F8FAFC]"
                        : "text-[#94A3B8]/25 hover:text-[#94A3B8]/60"
                    }`}
                  >
                    {name.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Genre / decade / rating filters */}
      {data?.entries?.length > 0 && (
        <div className="container mx-auto px-4 max-w-7xl pt-4 pb-4 flex flex-col gap-2">
          <MovieFilters
            genre={genre} setGenre={setGenre}
            decade={decade} setDecade={setDecade}
            year={filterYear} setYear={setFilterYear}
            rating={rating} setRating={setRating}
            availableGenres={availableGenres}
            availableDecades={availableDecades}
            ratingOptions={ratingOptions}
            hasActiveFilters={hasActiveFilters}
            reset={resetFilters}
            hideYearRow
          />
          {decade && (
            <MovieFilters
              genre={genre} setGenre={setGenre}
              decade={decade} setDecade={setDecade}
              year={filterYear} setYear={setFilterYear}
              rating={rating} setRating={setRating}
              availableGenres={availableGenres}
              availableDecades={availableDecades}
              ratingOptions={ratingOptions}
              hasActiveFilters={hasActiveFilters}
              reset={resetFilters}
              yearRowOnly
            />
          )}
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-4 max-w-7xl pb-16">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 border-2 border-[#BFBCFC]/10 rounded-full" />
              <div className="absolute inset-0 border-[3px] border-transparent border-t-[#BFBCFC] rounded-full animate-spin" />
            </div>
          </div>
        ) : !data?.entries?.length ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-[#BFBCFC]/8 rounded-full flex items-center justify-center border border-[#BFBCFC]/15 mb-5">
              <BookOpen className="w-9 h-9 text-[#BFBCFC]/25" />
            </div>
            <p className="text-[#F8FAFC] font-semibold text-lg mb-1">No logs in {year}</p>
            <p className="text-[#94A3B8] text-sm">
              {!isPublic && year === currentYear
                ? "Start logging films to see your diary here."
                : "Nothing was logged this year."}
            </p>
          </div>
        ) : filterResult.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-[#BFBCFC]/8 rounded-full flex items-center justify-center border border-[#BFBCFC]/15 mb-5">
              <BookOpen className="w-9 h-9 text-[#BFBCFC]/25" />
            </div>
            <p className="text-[#F8FAFC] font-semibold text-lg mb-1">No logs match your filters</p>
            <button
              onClick={resetFilters}
              className="mt-3 text-xs text-[#BFBCFC]/70 hover:text-[#BFBCFC] transition-colors underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        ) : grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-[#BFBCFC]/8 rounded-full flex items-center justify-center border border-[#BFBCFC]/15 mb-5">
              <BookOpen className="w-9 h-9 text-[#BFBCFC]/25" />
            </div>
            <p className="text-[#F8FAFC] font-semibold text-lg mb-1">
              No logs in {MONTH_NAMES[selectedMonth]} {year}
            </p>
            <p className="text-[#94A3B8] text-sm">
              {isPublic
                ? `${data?.username ?? "This user"} didn't log anything this month.`
                : "You didn't log anything this month."}
            </p>
          </div>
        ) : (
          <>
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
            {/* LEFT: List */}
            <div className="order-2 lg:order-1 w-full lg:flex-1 min-w-0 lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {grouped.map(([month, entries]) => (
                <div key={month} className="mb-5">
                  {/* Month header */}
                  <div className="sticky top-0 z-10 bg-[#0B0E14]/95 backdrop-blur-sm pt-1 pb-2 mb-1 border-b border-[#BFBCFC]/8">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-[#BFBCFC] font-black text-sm uppercase tracking-[0.2em]">
                        {MONTH_NAMES[month]}
                      </span>
                      <span className="text-[#94A3B8]/40 text-xs">
                        {entries.length} film{entries.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    {entries.map((entry) => {
                      const d = new Date(entry.loggedDate);
                      const day = String(d.getDate()).padStart(2, "0");
                      const isSelected = selected?.logId === entry.logId;

                      return (
                        <div
                          key={entry.logId}
                          onClick={() => handleSelect(entry)}
                          className={`w-full flex items-center gap-2 sm:gap-4 px-2 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-150 cursor-pointer group ${
                            isSelected
                              ? "bg-[#BFBCFC]/10 border border-[#BFBCFC]/20"
                              : "hover:bg-[#151921]/80 border border-transparent"
                          }`}
                        >
                          {/* Day */}
                          <span
                            className={`text-sm sm:text-xl font-black tabular-nums w-5 sm:w-8 flex-shrink-0 leading-none text-right ${
                              isSelected
                                ? "text-[#BFBCFC]"
                                : "text-[#94A3B8]/50 group-hover:text-[#94A3B8]"
                            }`}
                          >
                            {day}
                          </span>

                          {/* Poster */}
                          <Link
                            to={`/log/${entry.logId}`}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-10 sm:w-12 flex-shrink-0 aspect-[2/3]"
                          >
                            <div className="w-full h-full rounded-md overflow-hidden bg-[#151921] border border-transparent group-hover:border-[#44FFFF]/40 transition-all duration-200">
                              {entry.poster ? (
                                <img
                                  src={entry.poster}
                                  alt={entry.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Film className="w-4 h-4 text-[#94A3B8]/20" />
                                </div>
                              )}
                            </div>
                            <div className="absolute inset-0 rounded-md ring-2 ring-[#44FFFF]/40 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </Link>

                          {/* Title + year */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm md:text-base font-semibold leading-tight truncate transition-colors ${
                                isSelected
                                  ? "text-[#F8FAFC]"
                                  : "text-[#94A3B8] group-hover:text-[#F8FAFC]"
                              }`}
                            >
                              {entry.title}
                            </p>
                            {entry.releaseYear && (
                              <span className="text-xs text-[#94A3B8]/50 mt-0.5 block">
                                {entry.releaseYear}
                              </span>
                            )}
                          </div>

                          {/* Rating + status icons */}
                          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            {/* Stars */}
                            <span className="flex items-center gap-0.5">
                              {Array.from({ length: 10 }).map((_, i) => {
                                const starNum = i + 1;
                                const active = isPublic
                                  ? (entry.userRating ?? 0)
                                  : (hoverMap[entry.logId] ?? entry.userRating ?? 0);
                                return isPublic ? (
                                  <Star key={i} className={`w-3.5 h-3.5 sm:w-6 sm:h-6 flex-shrink-0 ${starNum <= active ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#44FFFF]/12"}`} />
                                ) : (
                                  <button
                                    key={i}
                                    type="button"
                                    onMouseEnter={() => setHoverMap((p) => ({ ...p, [entry.logId]: starNum }))}
                                    onMouseLeave={() => setHoverMap((p) => { const n = { ...p }; delete n[entry.logId]; return n; })}
                                    onClick={() => patchLog(entry, { userRating: starNum === entry.userRating ? 0 : starNum })}
                                    className="transition-transform hover:scale-110"
                                  >
                                    <Star className={`w-3.5 h-3.5 sm:w-6 sm:h-6 flex-shrink-0 transition-colors ${starNum <= active ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#44FFFF]/12"}`} />
                                  </button>
                                );
                              })}
                              <span className="text-[10px] sm:text-xs text-[#44FFFF]/80 font-bold ml-1 tabular-nums w-3 sm:w-4 text-left">
                                {isPublic
                                  ? (entry.userRating > 0 ? entry.userRating : "")
                                  : (hoverMap[entry.logId] ?? (entry.userRating > 0 ? entry.userRating : ""))}
                              </span>
                            </span>

                            {/* Heart */}
                            {isPublic ? (
                              <Heart className={`w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 ${entry.isLiked ? "text-[#FF61D2] fill-[#FF61D2]" : "text-[#94A3B8]/20"}`} />
                            ) : (
                              <button
                                type="button"
                                onClick={() => patchLog(entry, { isLiked: !entry.isLiked })}
                                className="transition-transform hover:scale-110 flex-shrink-0"
                              >
                                <Heart className={`w-4 h-4 sm:w-6 sm:h-6 transition-colors ${entry.isLiked ? "text-[#FF61D2] fill-[#FF61D2]" : "text-[#94A3B8]/20 hover:text-[#FF61D2]/60"}`} />
                              </button>
                            )}

                            {entry.isRewatch && <RotateCw className="hidden sm:block w-6 h-6 text-[#44FFFF] flex-shrink-0" />}
                            {entry.hasReview && (
                              <Link
                                to={`/log/${entry.logId}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hidden sm:flex group/review relative items-center justify-center w-7 h-7 rounded-md transition-colors hover:bg-[#BFBCFC]/10 flex-shrink-0"
                              >
                                <AlignLeft className="w-5 h-5 text-[#BFBCFC]/50 group-hover/review:text-[#BFBCFC] transition-colors" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: Detail panel */}
            <div
              ref={rightPanelRef}
              className="order-1 lg:order-2 w-full lg:w-72 xl:w-80 flex-shrink-0 lg:sticky lg:top-20"
            >
              {selected ? (
                <div className="bg-[#151921]/60 border border-[#BFBCFC]/10 rounded-2xl overflow-hidden">
                  {/* Top: poster + info side by side */}
                  <div className="flex gap-4 p-5 pb-4">
                    <Link
                      to={`/log/${selected.logId}`}
                      className="w-32 flex-shrink-0 aspect-[2/3] rounded-lg overflow-hidden bg-[#0B0E14] border border-white/5 hover:border-[#44FFFF]/40 transition-colors block"
                    >
                      {selected.poster ? (
                        <img
                          src={selected.poster}
                          alt={selected.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Film className="w-8 h-8 text-[#94A3B8]/15" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                      <div>
                        <Link
                          to={`/movie/${selected.movieId}`}
                          className="block text-[#F8FAFC] font-black text-xl leading-snug hover:text-[#44FFFF] transition-colors mb-1.5 line-clamp-3"
                        >
                          {selected.title}
                        </Link>
                        <div className="flex items-center gap-1.5 flex-wrap mb-2">
                          {selected.releaseYear && (
                            <span className="text-[#94A3B8] text-sm font-semibold">{selected.releaseYear}</span>
                          )}
                          <span className="text-[#94A3B8]/25 text-sm">·</span>
                          <span className="text-[#94A3B8] text-sm">
                            {new Date(selected.loggedDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <StarRating rating={selected.userRating} />
                      </div>

                      {/* Badges */}
                      {(selected.isLiked || selected.isRewatch) && (
                        <div className="flex items-center gap-1.5 flex-wrap mt-2">
                          {selected.isLiked && (
                            <span className="flex items-center gap-1 bg-[#FF61D2]/10 border border-[#FF61D2]/20 rounded-md px-2 py-0.5 text-[#FF61D2] text-[11px] font-medium">
                              <Heart className="w-2.5 h-2.5 fill-[#FF61D2]" />
                              Liked
                            </span>
                          )}
                          {selected.isRewatch && (
                            <span className="flex items-center gap-1 bg-[#44FFFF]/10 border border-[#44FFFF]/20 rounded-md px-2 py-0.5 text-[#44FFFF] text-[11px] font-medium">
                              <RotateCw className="w-2.5 h-2.5" />
                              Rewatch
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Review */}
                  {selected.hasReview && selected.reviewText && (
                    <>
                      <div className="border-t border-[#BFBCFC]/8 mx-5" />
                      <div className="px-5 py-4">
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlignLeft className="w-3.5 h-3.5 text-[#BFBCFC]/40" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#BFBCFC]/40">
                            {isPublic ? "Their review" : "Your review"}
                          </span>
                        </div>
                        <p className="text-[#94A3B8] text-sm leading-relaxed line-clamp-4">
                          {selected.reviewText}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Actions */}
                  <div className="border-t border-[#BFBCFC]/8 mx-5" />
                  <div className="p-4 flex gap-2">
                    <button
                      ref={dotsButtonRef}
                      onClick={openDotsMenu}
                      className={`flex items-center justify-center gap-1.5 bg-[#151921] hover:bg-[#1A2030] border rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${dotsMenuOpen ? "border-[#BFBCFC]/25 text-[#F8FAFC]" : "border-[#BFBCFC]/10 hover:border-[#BFBCFC]/22 text-[#94A3B8] hover:text-[#F8FAFC]"}`}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {isPublic ? (
                      <>
                        <button
                          onClick={handleToggleWatched}
                          className={`flex-1 flex items-center justify-center gap-1.5 border rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${myStatus?.isWatched ? "bg-[#44FFFF]/10 border-[#44FFFF]/25 text-[#44FFFF] hover:bg-[#44FFFF]/15" : "bg-[#151921] hover:bg-[#1A2030] border-[#BFBCFC]/10 hover:border-[#BFBCFC]/22 text-[#94A3B8] hover:text-[#F8FAFC]"}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          {myStatus?.isWatched ? "Watched" : "Watch"}
                        </button>
                        <button
                          onClick={handleToggleLiked}
                          className={`flex items-center justify-center border rounded-xl px-3 py-2.5 transition-all ${myStatus?.isFavorite ? "bg-[#FF61D2]/10 border-[#FF61D2]/25 text-[#FF61D2] hover:bg-[#FF61D2]/15" : "bg-[#151921] hover:bg-[#1A2030] border-[#BFBCFC]/10 hover:border-[#BFBCFC]/22 text-[#94A3B8] hover:text-[#FF61D2]"}`}
                        >
                          <Heart className={`w-4 h-4 ${myStatus?.isFavorite ? "fill-[#FF61D2]" : ""}`} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditEntry(selected)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-[#151921] hover:bg-[#1A2030] border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/22 rounded-xl px-4 py-2.5 text-[#94A3B8] hover:text-[#F8FAFC] text-sm font-semibold transition-all"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-[#151921]/40 border border-[#BFBCFC]/8 rounded-2xl h-48 flex items-center justify-center">
                  <div className="text-center">
                    <Film className="w-8 h-8 text-[#94A3B8]/15 mx-auto mb-2" />
                    <p className="text-[#94A3B8]/40 text-sm">Select a film</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <ReviewPagination
            currentPage={page + 1}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p - 1)}
          />
          </>
        )}
      </div>

      {/* Dots menu */}
      {dotsMenuOpen && selected && createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setDotsMenuOpen(false); setMenuHoverRating(0); }} />
          <div
            className="fixed z-50 w-48 bg-[#0F1318] border border-[#BFBCFC]/25 rounded-lg shadow-2xl overflow-hidden"
            style={{ top: dotsMenuPos.top, left: dotsMenuPos.left, transform: "translateY(-100%)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="py-0.5">
              {isPublic ? (
                // Public: options for current user's relationship with this film
                <>
                  {/* Star rating — 5 boven 5 */}
                  <div className="px-3 py-3 border-b border-[#BFBCFC]/15">
                    <div className="flex flex-col items-center gap-1">
                      {[[1,2,3,4,5],[6,7,8,9,10]].map((row, ri) => (
                        <div key={ri} className="flex items-center gap-0.5">
                          {row.map((n) => (
                            <button
                              key={n}
                              onClick={() => handleSetMenuRating(n)}
                              onMouseEnter={() => setMenuHoverRating(n)}
                              onMouseLeave={() => setMenuHoverRating(0)}
                              className="p-0.5 transition-transform hover:scale-110"
                            >
                              <Star className={`w-5 h-5 transition-colors ${n <= (menuHoverRating || myStatus?.filmRating || 0) ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#94A3B8]/20"}`} />
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                    {(menuHoverRating || myStatus?.filmRating) > 0 && (
                      <p className="text-center text-[#94A3B8] text-[10px] mt-2">
                        {menuHoverRating || myStatus?.filmRating}/10
                      </p>
                    )}
                  </div>

                  {!myStatus?.hasLogEntries ? (
                    <button
                      onClick={() => {
                        setLogModalConfig({ isRewatch: false, hasLogged: false, logId: null, reviewText: "", date: "" });
                        setDotsMenuOpen(false); setLogModalOpen(true);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors cursor-pointer"
                    >
                      Review or log film...
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setLogModalConfig({ isRewatch: true, hasLogged: true, logId: null, reviewText: "", date: "" });
                          setDotsMenuOpen(false); setLogModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors cursor-pointer"
                      >
                        Log again...
                      </button>
                      {!myStatus?.latestReviewText && (
                        <button
                          onClick={() => {
                            setLogModalConfig({ isRewatch: false, hasLogged: true, logId: myStatus?.latestLogId ?? null, reviewText: "", date: myStatus?.latestWatchedDate ?? "" });
                            setDotsMenuOpen(false); setLogModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors cursor-pointer"
                        >
                          Add review...
                        </button>
                      )}
                    </>
                  )}
                  <button className="w-full text-left px-4 py-2.5 text-sm text-[#94A3B8]/35 cursor-default">
                    Add to lists...
                  </button>
                </>
              ) : (
                // Own diary: log again, add review, delete
                <>
                  <button
                    onClick={() => { setDotsMenuOpen(false); setLogModalOpen(true); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors cursor-pointer"
                  >
                    Log again...
                  </button>
                  {!selected.hasReview && (
                    <button
                      onClick={() => { setDotsMenuOpen(false); setEditEntry(selected); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-[#F8FAFC] hover:bg-[#BFBCFC]/10 transition-colors cursor-pointer"
                    >
                      Add review...
                    </button>
                  )}
                  <button className="w-full text-left px-4 py-2.5 text-sm text-[#94A3B8]/35 cursor-default">
                    Add to lists...
                  </button>
                  <div className="border-t border-[#BFBCFC]/10 my-0.5" />
                  <button
                    onClick={() => { setDotsMenuOpen(false); handleDeleteLog(selected.logId); }}
                    className="w-full text-left px-4 py-2.5 text-sm text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-colors cursor-pointer"
                  >
                    Delete log
                  </button>
                </>
              )}
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Log modal */}
      {logModalOpen && selected && (
        <WatchLogModal
          isOpen={logModalOpen}
          onClose={() => setLogModalOpen(false)}
          preSelectedMovie={{
            id: selected.movieId,
            title: selected.title ?? "",
            poster_path: selected.poster?.replace(/^https:\/\/image\.tmdb\.org\/t\/p\/w\d+/, "") ?? null,
          }}
          preIsRewatch={isPublic ? (logModalConfig.isRewatch ?? false) : true}
          preHasWatchedBefore={isPublic ? (logModalConfig.hasLogged ?? false) : true}
          preIsLiked={myStatus?.isFavorite ?? false}
          preRating={myStatus?.filmRating ?? 0}
          preReviewText={isPublic ? (logModalConfig.reviewText ?? "") : ""}
          preDate={isPublic ? (logModalConfig.date ?? "") : ""}
          preLogId={isPublic ? (logModalConfig.logId ?? null) : null}
          onSuccess={handleLogSuccess}
        />
      )}

      {/* Edit modal */}
      {editEntry && (
        <EditLogModal
          isOpen={!!editEntry}
          logData={{
            logId: editEntry.logId,
            watchedDate: editEntry.watchedDate ?? editEntry.loggedDate,
            isLiked: editEntry.isLiked,
            rating: editEntry.userRating ?? 0,
            reviewText: editEntry.reviewText ?? "",
            containsSpoilers: editEntry.containsSpoilers ?? false,
          }}
          onClose={() => setEditEntry(null)}
          onSaved={handleEditSave}
        />
      )}
    </div>
  );
}
