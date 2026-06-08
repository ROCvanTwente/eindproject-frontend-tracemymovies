import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { Eye, Heart, Film, Star, MoreHorizontal, Bookmark } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";
import { toast } from "sonner";
import { WatchLogModal } from "./WatchLogModal";

export function ProfilePosterCard({
  movieId,
  poster,
  title,
  to,
  isWatchedProp,
  isLikedProp,
  hasActivityProp,
  watchCountProp,
  isInWatchlistProp,
  filmRatingProp,
  logIdProp,
  onEyeOverride,
}) {
  const navigate = useNavigate();
  const auth = useAuth();
  const { triggerRefresh } = useRefresh();

  const token = useMemo(
    () =>
      auth?.token ||
      auth?.user?.token ||
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token"),
    [auth]
  );

  const [isWatched, setIsWatched] = useState(isWatchedProp ?? false);
  const [isLiked, setIsLiked] = useState(isLikedProp ?? false);
  const [hasActivity, setHasActivity] = useState(hasActivityProp ?? false);
  const [watchCount, setWatchCount] = useState(watchCountProp ?? 0);
  const [isInWatchlist, setIsInWatchlist] = useState(isInWatchlistProp ?? false);
  const [autoLatestLogId, setAutoLatestLogId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Context menu
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [subMenuPos, setSubMenuPos] = useState({ top: 0, left: 0 });
  const [filmRating, setFilmRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [latestReviewText, setLatestReviewText] = useState("");
  const [latestWatchedDate, setLatestWatchedDate] = useState("");
  const [preModalDate, setPreModalDate] = useState("");
  const [preModalReviewText, setPreModalReviewText] = useState("");
  const [preModalIsRewatch, setPreModalIsRewatch] = useState(false);
  const [preModalLogId, setPreModalLogId] = useState(null);
  const [preModalRating, setPreModalRating] = useState(0);
  const [specificLogRating, setSpecificLogRating] = useState(0);
  const [logModalOpen, setLogModalOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const logButtonRef = useRef(null);

  useEffect(() => {
    if (isWatchedProp !== undefined) setIsWatched(isWatchedProp);
  }, [isWatchedProp]);

  useEffect(() => {
    if (isLikedProp !== undefined) setIsLiked(isLikedProp);
  }, [isLikedProp]);

  useEffect(() => {
    if (isInWatchlistProp !== undefined) setIsInWatchlist(isInWatchlistProp);
  }, [isInWatchlistProp]);

  useEffect(() => {
    if (filmRatingProp !== undefined) setFilmRating(filmRatingProp);
  }, [filmRatingProp]);

  useEffect(() => {
    if (isWatchedProp !== undefined) return;
    const fetchStatus = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/database/GetMovieStatus/${movieId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!res.ok) return;
        const data = await res.json();
        setIsWatched(data.isWatched);
        setIsLiked(data.isFavorite);
        setHasActivity(data.hasLogEntries);
        setWatchCount(data.logCount ?? 0);
        setFilmRating(data.filmRating ?? 0);
        setLatestReviewText(data.latestReviewText ?? "");
        setLatestWatchedDate(data.latestWatchedDate ?? "");
        setIsInWatchlist(data.isInWatchlist ?? false);
        setAutoLatestLogId(data.latestLogId ?? null);
      } catch {}
    };
    if (token && movieId) fetchStatus();
  }, [movieId, token, isWatchedProp]);

  // Close menu on Escape or scroll
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === "Escape") { setMenuOpen(false); setSubMenuOpen(false); } };
    const onScroll = () => { setMenuOpen(false); setSubMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [menuOpen]);

  const openMenu = async (e) => {
    e.stopPropagation();
    setSubMenuOpen(false);
    const rect = menuButtonRef.current?.getBoundingClientRect();
    if (rect) {
      const menuWidth = 224;
      const spaceRight = window.innerWidth - rect.right;
      const left = spaceRight >= menuWidth + 8
        ? rect.right + 8
        : rect.left - menuWidth - 8;
      const top = Math.min(rect.top, window.innerHeight - 320);
      setMenuPos({ top, left });
    }
    // Fetch status first so the menu opens with correct label immediately
    try {
      if (logIdProp) {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/log/ActivityDetail/${logIdProp}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setFilmRating(data.filmRating ?? 0);
          setLatestReviewText(data.reviewText ?? "");
          setLatestWatchedDate(data.watchedDate ? new Date(data.watchedDate).toISOString().split("T")[0] : "");
          setSpecificLogRating(data.rating ?? 0);
        }
      } else {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/database/GetMovieStatus/${movieId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const data = await res.json();
          setFilmRating(data.filmRating ?? 0);
          setLatestReviewText(data.latestReviewText ?? "");
          setLatestWatchedDate(data.latestWatchedDate ?? "");
          setIsInWatchlist(data.isInWatchlist ?? false);
        }
      }
    } catch {}
    setMenuOpen(true);
  };

  const handleSetRating = async (n) => {
    const newRating = n === filmRating ? 0 : n;
    setFilmRating(newRating);
    try {
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/SetFilmRating`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ MovieId: movieId, Rating: newRating }),
      });
      triggerRefresh();
    } catch {}
  };

  const handleToggleWatchlist = async () => {
    const next = !isInWatchlist;
    setIsInWatchlist(next);
    setMenuOpen(false);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/ToggleWatchlistStatus`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ MovieId: movieId, IsInWatchlist: next }),
      });
      if (!res.ok) setIsInWatchlist(!next);
      else {
        toast.success(next ? `'${title}' added to watchlist` : `'${title}' removed from watchlist`);
        triggerRefresh();
      }
    } catch {
      setIsInWatchlist(!next);
    }
  };

  const handleEye = async (e) => {
    e.stopPropagation();
    if (saving) return;
    setSaving(true);
    try {
      if (isWatched && hasActivity) {
        toast.error(`'${title}' can't be removed because there is activity on it.`);
        return;
      } else if (isWatched && !hasActivity) {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/database/RemoveWatchActivity/${movieId}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) { setIsWatched(false); triggerRefresh(); }
      } else {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/database/LogWatchActivity`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ MovieId: movieId }),
          }
        );
        if (res.ok) { setIsWatched(true); triggerRefresh(); }
      }
    } catch {}
    finally { setSaving(false); }
  };

  const handleHeart = async (e) => {
    e.stopPropagation();
    if (saving) return;
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setSaving(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/database/ToggleLikeStatus`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ MovieId: movieId, IsLiked: nextLiked }),
        }
      );
      if (!res.ok) setIsLiked(!nextLiked);
      else triggerRefresh();
    } catch {
      setIsLiked(!nextLiked);
    } finally {
      setSaving(false);
    }
  };

  const posterPath = poster
    ? poster.replace(/^https:\/\/image\.tmdb\.org\/t\/p\/w\d+/, "")
    : null;
  const preSelectedMovie = { id: movieId, title: title || "", poster_path: posterPath };

  const hasLogOrReview = isWatched || hasActivity;

  const menu = menuOpen
    ? createPortal(
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setMenuOpen(false); setSubMenuOpen(false); }} />
          <div
            className="fixed z-50 w-52 bg-[#0F1318] border border-[#BFBCFC]/25 rounded-lg shadow-2xl overflow-hidden"
            style={{ top: menuPos.top, left: menuPos.left }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Star rating — 5 boven 5 */}
            <div className="px-3 py-3 border-b border-[#BFBCFC]/15">
              <div className="flex flex-col items-center gap-1">
                {[[1,2,3,4,5],[6,7,8,9,10]].map((row, ri) => (
                  <div key={ri} className="flex items-center gap-0.5">
                    {row.map((n) => (
                      <button
                        key={n}
                        onClick={() => handleSetRating(n)}
                        onMouseEnter={() => setHoverRating(n)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-5 h-5 transition-colors ${
                            n <= (hoverRating || filmRating)
                              ? "text-[#44FFFF] fill-[#44FFFF]"
                              : "text-[#94A3B8]/20"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
              {(hoverRating || filmRating) > 0 && (
                <p className="text-center text-[#94A3B8] text-[10px] mt-2">
                  {hoverRating || filmRating}/10
                </p>
              )}
            </div>

            {/* Menu items */}
            <div className="py-0.5">
              <button className="w-full text-left px-4 py-2 text-sm text-[#94A3B8]/35 cursor-default">
                Show your activity
              </button>

              {/* Log / Review — submenu when film is already logged */}
              <button
                ref={logButtonRef}
                onClick={
                  hasLogOrReview
                    ? () => {
                        const rect = logButtonRef.current?.getBoundingClientRect();
                        if (rect) setSubMenuPos({ top: rect.top, left: rect.right + 4 });
                        setSubMenuOpen((p) => !p);
                      }
                    : () => { setPreModalDate(""); setPreModalReviewText(""); setPreModalIsRewatch(false); setPreModalLogId(null); setMenuOpen(false); setLogModalOpen(true); }
                }
                className="w-full text-left px-4 py-2 text-sm text-[#F8FAFC] hover:bg-[#BFBCFC]/10 cursor-pointer transition-colors"
              >
                {hasLogOrReview ? "Log again / edit review..." : "Review or log film again..."}
              </button>

              {!isWatched && (
                <button
                  onClick={handleToggleWatchlist}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    isInWatchlist ? "text-[#BFBCFC] hover:bg-[#BFBCFC]/10" : "text-[#F8FAFC] hover:bg-[#BFBCFC]/10"
                  }`}
                >
                  {isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
                </button>
              )}

              <button className="w-full text-left px-4 py-2 text-sm text-[#94A3B8]/35 cursor-default">
                Add to lists...
              </button>
            </div>
          </div>
          {subMenuOpen && (
            <div
              className="fixed z-50 w-52 bg-[#0F1318] border border-[#BFBCFC]/25 rounded-lg shadow-2xl overflow-hidden"
              style={{ top: subMenuPos.top, left: subMenuPos.left }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-0.5">
                <button
                  onClick={() => { setPreModalDate(""); setPreModalReviewText(""); setPreModalIsRewatch(true); setPreModalLogId(null); setPreModalRating(filmRating); setMenuOpen(false); setSubMenuOpen(false); setLogModalOpen(true); }}
                  className="w-full text-left px-4 py-2 text-sm text-[#F8FAFC] hover:bg-[#BFBCFC]/10 cursor-pointer transition-colors"
                >
                  Review or log film again...
                </button>
                <button
                  onClick={() => { setPreModalDate(latestWatchedDate); setPreModalReviewText(latestReviewText); setPreModalIsRewatch(false); setPreModalLogId(logIdProp ?? autoLatestLogId); setPreModalRating(logIdProp ? specificLogRating : filmRating); setMenuOpen(false); setSubMenuOpen(false); setLogModalOpen(true); }}
                  className="w-full text-left px-4 py-2 text-sm text-[#F8FAFC] hover:bg-[#BFBCFC]/10 cursor-pointer transition-colors"
                >
                  {latestReviewText ? "Edit review..." : "Add review..."}
                </button>
              </div>
            </div>
          )}
        </>,
        document.body
      )
    : null;

  return (
    <>
      <div
        className="relative group cursor-pointer"
        onClick={(e) => { e.stopPropagation(); navigate(to ?? (autoLatestLogId ? `/log/${autoLatestLogId}` : `/movie/${movieId}`)); }}
      >
        {/* Poster */}
        <div
          className={`aspect-[2/3] rounded-lg overflow-hidden bg-[#151921] border transition-all duration-200 ${
            isWatched
              ? "border-white/5 group-hover:border-[#44FFFF]/50"
              : "border-white/5 group-hover:border-white/30"
          }`}
        >
          {poster ? (
            <img src={poster} alt={title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-6 h-6 text-[#94A3B8]/20" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#0B0E14]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-end justify-center pb-3 gap-1.5">
            {/* Eye */}
            <button
              onClick={onEyeOverride ? (e) => { e.stopPropagation(); onEyeOverride(); } : handleEye}
              className={`relative w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                isWatched
                  ? "bg-[#44FFFF]/20 text-[#44FFFF] hover:bg-[#44FFFF]/30"
                  : "bg-black/50 text-[#94A3B8] hover:text-[#44FFFF] hover:bg-[#44FFFF]/20"
              }`}
              title={isWatched ? (hasActivity ? "Has activity" : "Unwatch") : "Mark as watched"}
            >
              <Eye className="w-4 h-4" />
            </button>

            {/* Heart */}
            <button
              onClick={handleHeart}
              className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                isLiked
                  ? "bg-[#FF61D2]/20 text-[#FF61D2] hover:bg-[#FF61D2]/30"
                  : "bg-black/50 text-[#94A3B8] hover:text-[#FF61D2] hover:bg-[#FF61D2]/20"
              }`}
              title={isLiked ? "Unlike" : "Like"}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-[#FF61D2]" : ""}`} />
            </button>

            {/* Three dots */}
            <button
              ref={menuButtonRef}
              onClick={openMenu}
              className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                menuOpen
                  ? "bg-white/20 text-[#F8FAFC]"
                  : "bg-black/50 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/20"
              }`}
              title="More options"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ring on hover — cyan if watched, white if not */}
        <div className={`absolute inset-0 rounded-lg ring-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isWatched ? "ring-[#44FFFF]/40" : "ring-white/20"}`} />
      </div>

      {menu}

      <WatchLogModal
        isOpen={logModalOpen}
        onClose={() => setLogModalOpen(false)}
        preSelectedMovie={preSelectedMovie}
        preIsRewatch={preModalIsRewatch}
        preIsLiked={isLiked}
        preRating={preModalRating}
        preReviewText={preModalReviewText}
        preDate={preModalDate}
        preLogId={preModalLogId}
        onSuccess={() => triggerRefresh()}
      />
    </>
  );
}
