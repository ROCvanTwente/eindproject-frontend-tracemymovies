import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import {
  X, Calendar, RotateCw, Save, Star, MessageSquare,
  Search, ChevronRight, ChevronLeft, Loader2, Film, Heart,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function DatePicker({ value, onChange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selected = value ? new Date(value + "T00:00:00") : today;
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(new Date(selected.getFullYear(), selected.getMonth(), 1));
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getDays = () => {
    const year = view.getFullYear();
    const month = view.getMonth();
    const firstDay = new Date(year, month, 1);
    // Monday-based: 0=Mon … 6=Sun
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  };

  const prevMonth = () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1));
  const nextMonth = () => {
    const next = new Date(view.getFullYear(), view.getMonth() + 1, 1);
    if (next <= today) setView(next);
  };

  const selectDay = (d) => {
    if (!d || d > today) return;
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    onChange(iso);
    setOpen(false);
  };

  const isSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const isNextMonthDisabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > today;

  const label = `${selected.getDate()} ${MONTHS[selected.getMonth()]} ${selected.getFullYear()}`;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm text-[#F8FAFC] hover:text-[#BFBCFC] transition-colors"
      >
        <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
        {label}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 bg-[#0B0E14] border border-[#BFBCFC]/20 rounded-2xl shadow-2xl shadow-black/60 p-4 w-72 select-none">

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#BFBCFC]/10 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold text-[#F8FAFC]">
              {MONTHS[view.getMonth()]}, {view.getFullYear()}
            </span>
            <button
              onClick={nextMonth}
              disabled={isNextMonthDisabled}
              className={`p-1.5 rounded-lg transition-colors ${isNextMonthDisabled ? "text-[#94A3B8]/20 cursor-not-allowed" : "hover:bg-[#BFBCFC]/10 text-[#94A3B8] hover:text-[#F8FAFC]"}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-[#94A3B8]/50 uppercase py-1">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {getDays().map((d, i) => {
              if (!d) return <div key={`e-${i}`} />;
              const isFuture = d > today;
              const isToday = isSameDay(d, today);
              const isSelected = isSameDay(d, selected);
              return (
                <button
                  key={d.getTime()}
                  type="button"
                  onClick={() => selectDay(d)}
                  disabled={isFuture}
                  className={`w-8 h-8 mx-auto rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center
                    ${isFuture ? "text-[#94A3B8]/20 cursor-not-allowed" : "cursor-pointer"}
                    ${isSelected ? "bg-[#BFBCFC] text-[#0B0E14] font-bold" : ""}
                    ${isToday && !isSelected ? "border border-[#44FFFF]/50 text-[#44FFFF]" : ""}
                    ${!isFuture && !isSelected ? "hover:bg-[#BFBCFC]/15 text-[#F8FAFC]" : ""}
                  `}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function WatchLogModal({ isOpen, onClose, preSelectedMovie = null, preIsRewatch = false, preIsLiked = false, preRating = 0, preReviewText = "", preDate = "", preLogId = null, onSuccess }) {
  const auth = useAuth();
  const { triggerRefresh } = useRefresh();
  const navigate = useNavigate();

  const token = useMemo(
    () =>
      auth?.token ||
      auth?.user?.token ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("auth_token") ||
      localStorage.getItem("token") ||
      sessionStorage.getItem("authToken") ||
      sessionStorage.getItem("auth_token") ||
      sessionStorage.getItem("token"),
    [auth]
  );

  const [step, setStep] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [watchDate, setWatchDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRewatch, setIsRewatch] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [containsSpoilers, setContainsSpoilers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasWatched, setHasWatched] = useState(!!preSelectedMovie);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      if (preSelectedMovie) {
        setSelectedMovie(preSelectedMovie);
        setStep("log");
      } else {
        setStep("search");
        setSelectedMovie(null);
      }
      setWatchDate(preDate || new Date().toISOString().split("T")[0]);
      setIsRewatch(preIsRewatch);
      setIsLiked(preIsLiked);
      setRating(preRating);
      setHoverRating(0);
      setReviewText(preReviewText);
      setContainsSpoilers(false);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  // Debounced search — exact same as UserProfilePage favorites search
  useEffect(() => {
    if (!isOpen || step !== "search") return;
    const q = searchQuery.trim();
    if (!q) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/search?query=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, step]);

  if (!isOpen) return null;

  const handleSelectMovie = async (movie) => {
    setSelectedMovie(movie);
    setIsRewatch(preIsRewatch);
    setHasWatched(!!preSelectedMovie);
    setStep("log");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/database/GetMovieStatus/${movie.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setHasWatched(data.isWatched === true);
        setIsLiked(data.isFavorite === true);
        setRating(data.filmRating ?? 0);
      }
    } catch {
      // leave defaults
    }
  };

  const handleSubmit = async () => {
    if (!selectedMovie) return;

    setIsSaving(true);
    try {
      const body = JSON.stringify({
        movieId: selectedMovie.id,
        watchDate: new Date(watchDate).toISOString(),
        isRewatch,
        isLiked,
        rating: rating > 0 ? rating : null,
        reviewText: reviewText.trim() || null,
        containsSpoilers,
      });

      const res = preLogId
        ? await fetch(`${import.meta.env.VITE_API_BASE_URL}/Log/Update/${preLogId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body,
          })
        : await fetch(`${import.meta.env.VITE_API_BASE_URL}/Log/WatchMovie`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body,
          });

      if (!res.ok) throw new Error();
      toast.success(preLogId ? `"${selectedMovie.title}" updated!` : `"${selectedMovie.title}" logged!`);
      triggerRefresh();
      onSuccess?.();
      onClose();
    } catch {
      toast.error("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const displayRating = hoverRating || rating;

  const modal = (
    <div
      className="fixed inset-0 flex items-start justify-center px-4 py-8 sm:items-center overflow-y-auto"
      style={{ zIndex: 99999 }}
    >
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-2xl z-[100000]">

        {/* ── STEP 1: SEARCH ── */}
        {step === "search" && (
          <div className="bg-[#151921] border border-[#BFBCFC]/20 rounded-xl w-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#BFBCFC]/10">
              <h3 className="text-[#F8FAFC] font-bold">Search for a film to log</h3>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-full hover:bg-[#BFBCFC]/10 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>

            <div className="p-4">
              {/* Search input — same as UserProfilePage */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for a film to log..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#BFBCFC]/15 rounded-lg pl-9 pr-4 py-2.5 text-[#F8FAFC] text-sm placeholder-[#94A3B8] focus:outline-none focus:border-[#BFBCFC]/40"
                />
              </div>

              {/* Results */}
              <div className="mt-3 max-h-80 overflow-y-auto space-y-1">
                {searchLoading && (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-5 h-5 text-[#BFBCFC] animate-spin" />
                  </div>
                )}
                {!searchLoading && !searchQuery && (
                  <p className="text-[#94A3B8] text-sm text-center py-6">Type a film title to search.</p>
                )}
                {!searchLoading && searchQuery && searchResults.length === 0 && (
                  <p className="text-[#94A3B8] text-sm text-center py-6">No films found.</p>
                )}
                {searchResults.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMovie(m)}
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
                    <div className="min-w-0 flex-1">
                      <p className="text-[#F8FAFC] text-sm font-medium truncate">{m.title}</p>
                      <p className="text-[#94A3B8] text-xs">{m.release_date?.slice(0, 4)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#94A3B8] flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: LOG ── */}
        {step === "log" && selectedMovie && (
          <div className="bg-[#0F1318] border border-[#BFBCFC]/15 rounded-2xl overflow-hidden shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#BFBCFC]/10">
              {!preSelectedMovie ? (
                <button
                  onClick={() => setStep("search")}
                  className="flex items-center gap-1 text-sm text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              ) : <div className="w-12" />}
              <span className="text-[#F8FAFC] text-sm font-semibold">
                {preLogId ? "Edit log" : "Log film"}
              </span>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-[#BFBCFC]/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>

            {/* Film info */}
            <div className="flex items-center gap-4 px-5 py-5 border-b border-[#BFBCFC]/10">
              <div
                onClick={() => { onClose(); navigate(`/movie/${selectedMovie.id}`); }}
                className="group relative w-16 flex-shrink-0 cursor-pointer"
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden bg-[#151921] border border-white/5 group-hover:border-[#BFBCFC]/30 transition-all duration-200">
                  {selectedMovie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w154${selectedMovie.poster_path}`}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover group-hover:brightness-75 transition-all duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Film className="w-5 h-5 text-[#94A3B8]/20" />
                    </div>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <h2 className="text-[#F8FAFC] font-bold text-xl leading-tight">{selectedMovie.title}</h2>
                {selectedMovie.release_date && (
                  <p className="text-[#94A3B8] text-sm mt-1">{selectedMovie.release_date.split("-")[0]}</p>
                )}
              </div>
            </div>

            <div className="px-5 py-4 space-y-3">

              {/* Review — top */}
              <div className="bg-[#151921] border border-[#BFBCFC]/10 rounded-xl px-4 py-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <MessageSquare className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span className="text-xs text-[#94A3B8]">Review</span>
                </div>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="What did you think?"
                  rows={5}
                  className="w-full bg-transparent text-[#F8FAFC] text-sm placeholder-[#94A3B8]/40 outline-none resize-none"
                />
                {reviewText.length > 0 && (
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#BFBCFC]/10">
                    <button
                      onClick={() => setContainsSpoilers((v) => !v)}
                      className={`w-4 h-4 rounded border transition-colors flex items-center justify-center flex-shrink-0 ${containsSpoilers ? "bg-[#FF61D2] border-[#FF61D2]" : "border-[#94A3B8]/40"}`}
                    >
                      {containsSpoilers && <span className="text-white text-[8px] font-bold">✓</span>}
                    </button>
                    <span className="text-xs text-[#94A3B8]">Contains spoilers</span>
                  </div>
                )}
              </div>

              {/* Date + Rewatch + Heart — compact row */}
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#151921] border border-[#BFBCFC]/10 rounded-xl px-3 py-2.5 flex items-center">
                  <DatePicker value={watchDate} onChange={setWatchDate} />
                </div>

                <button
                  onClick={() => hasWatched && setIsRewatch((v) => !v)}
                  disabled={!hasWatched}
                  title={hasWatched ? "Rewatch" : "Watch it first"}
                  className={`p-3.5 rounded-xl border transition-all ${
                    isRewatch && hasWatched
                      ? "bg-[#44FFFF]/15 border-[#44FFFF]/50 text-[#44FFFF]"
                      : "bg-[#151921] border-[#BFBCFC]/10 text-[#94A3B8] hover:border-[#44FFFF]/30"
                  } ${!hasWatched ? "opacity-35 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <RotateCw className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsLiked((v) => !v)}
                  title="Like this film"
                  className={`p-3.5 rounded-xl border transition-all ${
                    isLiked
                      ? "bg-[#FF61D2]/15 border-[#FF61D2]/50"
                      : "bg-[#151921] border-[#BFBCFC]/10 hover:border-[#FF61D2]/30"
                  }`}
                >
                  <Heart className={`w-5 h-5 transition-all ${isLiked ? "text-[#FF61D2] fill-[#FF61D2] scale-110" : "text-[#94A3B8]"}`} />
                </button>
              </div>

              {/* Stars */}
              <div className="bg-[#151921] border border-[#BFBCFC]/10 rounded-xl px-3 py-2">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                    <Star className="w-2.5 h-2.5" />
                    Rating
                  </span>
                  {displayRating > 0 ? (
                    <span className="text-[10px] font-bold text-[#44FFFF]">{displayRating}/10</span>
                  ) : (
                    <span className="text-[10px] text-[#94A3B8]/40">—</span>
                  )}
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      onClick={() => setRating(n === rating ? 0 : n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="flex-1 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star className={`w-full h-auto transition-colors ${n <= displayRating ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#94A3B8]/25"}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Save */}
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-[#44FFFF] to-[#BFBCFC] hover:opacity-90 text-[#0B0E14] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {preLogId ? "Save changes" : "Save log"}
                  </>
                )}
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
