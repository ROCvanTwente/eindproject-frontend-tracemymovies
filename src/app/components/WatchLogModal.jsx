import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
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

export function WatchLogModal({ isOpen, onClose, preSelectedMovie = null, preIsRewatch = false, preIsLiked = false, preRating = 0 }) {
  const auth = useAuth();
  const { triggerRefresh } = useRefresh();

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
      setWatchDate(new Date().toISOString().split("T")[0]);
      setIsRewatch(preIsRewatch);
      setIsLiked(preIsLiked);
      setRating(preRating);
      setHoverRating(0);
      setReviewText("");
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
      }
    } catch {
      // leave hasWatched false
    }
  };

  const handleSubmit = async () => {
    if (!selectedMovie) return;

    setIsSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/Log/WatchMovie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: selectedMovie.id,
          watchDate: new Date(watchDate).toISOString(),
          isRewatch,
          isLiked,
          rating: rating > 0 ? rating : null,
          reviewText: reviewText.trim() || null,
          containsSpoilers,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success(`"${selectedMovie.title}" logged!`);
      triggerRefresh();
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
          <div className="bg-[#151921] border border-[#BFBCFC]/20 rounded-2xl overflow-hidden shadow-2xl">

            {/* Banner */}
            <div className="relative h-36 overflow-hidden">
              {selectedMovie.backdrop_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w780${selectedMovie.backdrop_path}`}
                  className="w-full h-full object-cover opacity-40"
                  alt=""
                />
              ) : selectedMovie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                  className="w-full h-full object-cover object-top opacity-30"
                  alt=""
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-[#151921] to-transparent" />

              <button
                onClick={() => setStep("search")}
                className="absolute top-4 left-4 flex items-center gap-1 text-xs text-white bg-black/50 hover:bg-black/80 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                Back
              </button>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 bg-black/50 hover:bg-red-500/80 rounded-lg text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-6 pb-6 -mt-6 relative">
              {/* Title row */}
              <div className="flex items-end gap-4 mb-6">
                {selectedMovie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w154${selectedMovie.poster_path}`}
                    className="w-16 rounded-lg border border-[#BFBCFC]/20 shadow-lg flex-shrink-0"
                    alt={selectedMovie.title}
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold text-[#F8FAFC] leading-tight">
                    {selectedMovie.title}
                  </h2>
                  {selectedMovie.release_date && (
                    <p className="text-[#94A3B8] text-sm">{selectedMovie.release_date.split("-")[0]}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">

                {/* Date + Rewatch + Like */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#BFBCFC]/10 flex items-center justify-between">
                    <span className="text-xs text-[#94A3B8] mr-2">Date</span>
                    <DatePicker value={watchDate} onChange={setWatchDate} />
                  </div>

                  <div className={`bg-[#0B0E14] p-3.5 rounded-xl border flex items-center justify-between transition-opacity ${!hasWatched ? "opacity-40 border-[#BFBCFC]/5" : "border-[#BFBCFC]/10"}`}>
                    <span className="text-xs text-[#94A3B8] flex items-center gap-1.5">
                      <RotateCw className="w-3.5 h-3.5" />
                      Rewatch
                      {!hasWatched && <span className="text-[10px] text-[#94A3B8]/50 ml-1">(not yet watched)</span>}
                    </span>
                    <button
                      onClick={() => hasWatched && setIsRewatch((v) => !v)}
                      disabled={!hasWatched}
                      className={`w-9 h-5 rounded-full transition-colors relative ${isRewatch && hasWatched ? "bg-[#44FFFF]" : "bg-[#94A3B8]/30"} ${!hasWatched ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isRewatch && hasWatched ? "left-5" : "left-1"}`} />
                    </button>
                  </div>
                </div>

                {/* Like button */}
                <button
                  onClick={() => setIsLiked((v) => !v)}
                  className={`w-full p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                    isLiked
                      ? "bg-[#FF61D2]/10 border-[#FF61D2]/40"
                      : "bg-[#0B0E14] border-[#BFBCFC]/10 hover:border-[#FF61D2]/25"
                  }`}
                >
                  <span className={`text-xs flex items-center gap-1.5 transition-colors ${isLiked ? "text-[#FF61D2]" : "text-[#94A3B8]"}`}>
                    <Heart className={`w-3.5 h-3.5 transition-all ${isLiked ? "fill-[#FF61D2]" : ""}`} />
                    Like this film
                  </span>
                  <div className={`w-9 h-5 rounded-full transition-colors relative ${isLiked ? "bg-[#FF61D2]" : "bg-[#94A3B8]/30"}`}>
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isLiked ? "left-5" : "left-1"}`} />
                  </div>
                </button>

                {/* Star rating */}
                <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#BFBCFC]/10">
                  <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mb-3">
                    <Star className="w-3.5 h-3.5" />
                    Score {rating > 0 && <span className="text-[#44FFFF] font-bold">{rating}/10</span>}
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <button
                        key={n}
                        onClick={() => setRating(n === rating ? 0 : n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-7 h-7 transition-colors ${
                            n <= displayRating
                              ? "text-[#44FFFF] fill-[#44FFFF]"
                              : "text-[#94A3B8]/40"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review */}
                <div className="bg-[#0B0E14] p-3.5 rounded-xl border border-[#BFBCFC]/10">
                  <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mb-2">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Review
                  </p>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="What did you think?"
                    rows={3}
                    className="w-full bg-transparent text-[#F8FAFC] text-sm placeholder-[#94A3B8]/50 outline-none resize-none"
                  />
                  {reviewText.length > 0 && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#BFBCFC]/10">
                      <button
                        onClick={() => setContainsSpoilers((v) => !v)}
                        className={`w-4 h-4 rounded border transition-colors flex items-center justify-center ${containsSpoilers ? "bg-[#FF61D2] border-[#FF61D2]" : "border-[#94A3B8]/40"}`}
                      >
                        {containsSpoilers && <span className="text-white text-[8px] font-bold">✓</span>}
                      </button>
                      <span className="text-xs text-[#94A3B8]">Contains spoilers</span>
                    </div>
                  )}
                </div>

                {/* Submit */}
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
                      Save log
                    </>
                  )}
                </button>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
