import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";
import {
  ArrowLeft, Heart, RotateCw, Eye, Star,
  MessageSquare, Film, AlertCircle, Play, Pencil, RefreshCw,
} from "lucide-react";
import { TrailerModal } from "../components/movie/TrailerModal";
import { toast } from "sonner";
import { EditLogModal } from "../components/EditLogModal";
import { WatchLogModal } from "../components/WatchLogModal";
import { ProfilePosterCard } from "../components/ProfilePosterCard";

export function ActivityDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auth = useAuth();
  const { refreshKey, triggerRefresh } = useRefresh();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerAnimate, setTrailerAnimate] = useState(false);
  const [spoilerRevealed, setSpoilerRevealed] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [logAgainOpen, setLogAgainOpen] = useState(false);
  const [currentFilmIsLiked, setCurrentFilmIsLiked] = useState(false);
  const [currentFilmRating, setCurrentFilmRating] = useState(0);
  const [hoverFilmRating, setHoverFilmRating] = useState(0);
  const [myIsWatched, setMyIsWatched] = useState(false);
  const [myWatchCount, setMyWatchCount] = useState(0);

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

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const loadData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/Log/ActivityDetail/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) return;
      const detail = await res.json();
      setData(detail);
      setCurrentFilmIsLiked(detail.isOwnLog ? (detail.filmIsLiked ?? false) : (detail.myFilmIsLiked ?? false));
      setCurrentFilmRating(detail.isOwnLog ? (detail.filmRating ?? 0) : (detail.myFilmRating ?? 0));
      setMyIsWatched(detail.myIsWatched ?? false);
      setMyWatchCount(detail.myWatchCount ?? 0);

      // Fetch trailer only once
      if (!trailerKey) {
        const movieRes = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/tmdbmovie/GetMovieDetails?id=${detail.movieId}`
        );
        if (movieRes.ok) {
          const movieData = await movieRes.json();
          const trailer = movieData?.videos?.results?.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
          );
          if (trailer?.key) setTrailerKey(trailer.key);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && id) loadData();
  }, [id, token, refreshKey]);

  const handleEyeToggle = async () => {
    if (data?.isOwnLog) return;
    const isEffectivelyWatched = myIsWatched || currentFilmRating > 0;
    if (isEffectivelyWatched) {
      if (currentFilmRating > 0) { toast.error("Remove your rating first before unwatching."); return; }
      if (myWatchCount > 1) { toast.error("Can't remove — you have activity on this film."); return; }
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/RemoveWatchActivity/${data.movieId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) { setMyIsWatched(false); setMyWatchCount(0); triggerRefresh(); }
    } else {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/LogWatchActivity`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ MovieId: data.movieId }) });
      if (res.ok) { setMyIsWatched(true); setMyWatchCount(1); triggerRefresh(); }
    }
  };

  const openTrailer = () => {
    setTrailerOpen(true);
    setTimeout(() => setTrailerAnimate(true), 10);
  };

  const closeTrailer = () => {
    setTrailerAnimate(false);
    setTimeout(() => setTrailerOpen(false), 200);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-[#BFBCFC]/20" />
          <div className="absolute inset-0 rounded-full border-t-2 border-[#BFBCFC] animate-spin" />
        </div>
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-4">
        <AlertCircle className="w-10 h-10 text-[#94A3B8]/40" />
        <p className="text-[#94A3B8]">Log entry not found.</p>
        <Link to="/my-profile" className="text-[#BFBCFC] text-sm hover:underline">
          Back to profile
        </Link>
      </div>
    );
  }

  const dateStr = new Date(data.watchedDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <div className="container mx-auto px-4 max-w-4xl py-8">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* ── LEFT: Poster + Trailer button ── */}
          <div className="flex-shrink-0 w-44 md:w-52 mx-auto md:mx-0">

            {/* Poster */}
            <ProfilePosterCard
              movieId={data.movieId}
              poster={data.poster}
              title={data.title}
              to={`/movie/${data.movieId}`}
              isWatchedProp={data.isOwnLog ? true : myIsWatched}
              isLikedProp={currentFilmIsLiked}
              hasActivityProp={data.isOwnLog ? true : undefined}
              onEyeOverride={data.isOwnLog ? undefined : handleEyeToggle}
            />

            {/* Trailer button — only if available */}
            {trailerKey && (
              <button
                onClick={openTrailer}
                className="mt-3 w-full flex items-center justify-center gap-2 bg-[#FF61D2]/12 hover:bg-[#FF61D2]/22 border border-[#FF61D2]/25 hover:border-[#FF61D2]/50 text-[#FF61D2] font-semibold text-sm py-2.5 rounded-xl transition-all duration-200"
              >
                <Play className="w-4 h-4 fill-[#FF61D2]" />
                Trailer
              </button>
            )}
          </div>

          {/* ── RIGHT: Info ── */}
          <div className="flex-1 min-w-0">

            {/* Logged by (other user's log) */}
            {!data.isOwnLog && data.ownerUsername && (
              <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-widest mb-2">
                {data.isRewatch ? "Rewatched" : "Watched"} by{" "}
                <Link to={`/user/${data.ownerUsername}`} className="text-[#BFBCFC] hover:text-[#F8FAFC] transition-colors">
                  {data.ownerUsername}
                </Link>
              </p>
            )}

            {/* Title + year */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC] leading-tight">
                {data.title}
              </h1>
            </div>

            {data.releaseYear && (
              <p className="text-[#94A3B8] text-sm mb-4">{data.releaseYear}</p>
            )}

            {/* Watched / Rewatched pill */}
            <div className="mb-6">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                data.isRewatch
                  ? "text-[#44FFFF] bg-[#44FFFF]/10 border-[#44FFFF]/25"
                  : "text-[#BFBCFC] bg-[#BFBCFC]/10 border-[#BFBCFC]/25"
              }`}>
                {data.isOwnLog ? (
                  data.isRewatch
                    ? <><RotateCw className="w-3.5 h-3.5" /> Rewatched {dateStr}</>
                    : <><Eye className="w-3.5 h-3.5" /> Watched {dateStr}</>
                ) : (
                  dateStr
                )}
              </span>
            </div>

            {/* Rating + per-log like */}
            {(data.rating != null && data.rating > 0) || data.isLiked ? (
              <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-2xl p-4 mb-4">
                <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mb-3 uppercase tracking-wider font-medium">
                  <Star className="w-3.5 h-3.5" />
                  {data.isOwnLog ? "Your score" : `${data.ownerUsername ?? "Their"}'s score`}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  {data.rating != null && data.rating > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <Star
                          key={n}
                          className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${
                            n <= data.rating
                              ? "text-[#44FFFF] fill-[#44FFFF]"
                              : "text-[#94A3B8]/20"
                          }`}
                        />
                      ))}
                      <span className="text-[#44FFFF] font-black text-base ml-2">
                        {data.rating}
                        <span className="text-[#94A3B8] text-xs font-normal">/10</span>
                      </span>
                    </div>
                  )}
                  {data.isLiked && (
                    <Heart className="w-5 h-5 text-[#FF61D2] fill-[#FF61D2] ml-1" />
                  )}
                </div>
              </div>
            ) : null}

            {/* Review */}
            {data.reviewText && (
              <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mb-3 uppercase tracking-wider font-medium">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Review
                  {data.containsSpoilers && (
                    <span className="ml-auto text-[#FF61D2] bg-[#FF61D2]/10 border border-[#FF61D2]/20 px-2 py-0.5 rounded-full text-[10px] font-bold normal-case tracking-normal">
                      ⚠ Spoilers
                    </span>
                  )}
                </p>

                {data.containsSpoilers && !spoilerRevealed ? (
                  <button
                    onClick={() => setSpoilerRevealed(true)}
                    className="w-full text-left group"
                  >
                    <p className="text-[#94A3B8] text-sm italic leading-relaxed group-hover:text-[#F8FAFC] transition-colors">
                      Some mysteries are meant to be discovered on screen.{" "}
                      <span className="underline underline-offset-2 text-[#FF61D2]/80 group-hover:text-[#FF61D2] transition-colors">
                        This review may reveal them.
                      </span>
                    </p>
                  </button>
                ) : (
                  <div>
                    <p className="text-[#F8FAFC] text-sm leading-relaxed">{data.reviewText}</p>
                    {data.containsSpoilers && (
                      <button
                        onClick={() => setSpoilerRevealed(false)}
                        className="mt-2 text-[#94A3B8]/50 hover:text-[#94A3B8] text-xs transition-colors"
                      >
                        Hide spoilers
                      </button>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[#94A3B8]/50 text-xs">
                  <Heart className="w-3 h-3" />
                  <span>No likes yet</span>
                </div>
              </div>
            )}

            {/* Empty state */}
            {(data.rating == null || data.rating === 0) && !data.reviewText && (
              <div className="bg-[#151921]/80 border border-dashed border-[#BFBCFC]/15 rounded-2xl p-6 text-center">
                <p className="text-[#94A3B8] text-sm">No rating or review added.</p>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="flex-shrink-0 w-full md:w-52 flex flex-col gap-3 md:pt-8">

            {/* Sidebar header label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#94A3B8] px-1">
              {data.isOwnLog ? "Your status" : "Your status"}
            </p>

            {/* Eye + Heart icons row */}
            <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-2xl px-5 py-4 flex items-center justify-between">
              {/* Eye */}
              <button
                className="relative transition-all hover:scale-110"
                onClick={handleEyeToggle}
              >
                <Eye className={`w-10 h-10 ${(data.isOwnLog || myIsWatched || currentFilmRating > 0) ? "text-[#44FFFF] fill-[#44FFFF]/15" : "text-[#94A3B8]/30"}`} />
                {(data.isOwnLog ? data.watchCount : myWatchCount) > 1 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#44FFFF] text-[#0B0E14] text-[9px] font-black rounded-full flex items-center justify-center px-0.5 leading-none">
                    {data.isOwnLog ? data.watchCount : myWatchCount}
                  </span>
                )}
              </button>

              {/* Heart */}
              <button
                className="cursor-pointer transition-all hover:scale-110"
                onClick={async () => {
                  const next = !currentFilmIsLiked;
                  setCurrentFilmIsLiked(next);
                  await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/ToggleLikeStatus`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ MovieId: data.movieId, IsLiked: next }),
                  });
                  loadData();
                }}
              >
                <Heart className={`w-10 h-10 transition-all ${currentFilmIsLiked ? "text-[#FF61D2] fill-[#FF61D2]" : "text-[#94A3B8]/30"}`} />
              </button>
            </div>

            {/* Rating */}
            <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-2xl px-5 py-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">Your Rating</p>
                {currentFilmRating > 0 && (
                  <span className="text-sm font-bold text-[#44FFFF]">{currentFilmRating}/10</span>
                )}
              </div>
              <div className="flex flex-col gap-1.5" onMouseLeave={() => setHoverFilmRating(0)}>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((n) => {
                    const active = n <= (hoverFilmRating || currentFilmRating);
                    return (
                      <Star
                        key={n}
                        className={`w-7 h-7 cursor-pointer transition-colors ${active ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#BFBCFC]/15 hover:text-[#44FFFF]/40"}`}
                        onMouseEnter={() => setHoverFilmRating(n)}
                        onClick={async () => {
                          const newRating = n === currentFilmRating ? 0 : n;
                          setCurrentFilmRating(newRating);
                          await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/SetFilmRating`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ MovieId: data.movieId, Rating: newRating }) });
                          if (newRating > 0 && !myIsWatched) {
                            const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/LogWatchActivity`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ MovieId: data.movieId }) });
                            if (r.ok) { setMyIsWatched(true); setMyWatchCount(1); }
                          }
                          triggerRefresh();
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex items-center gap-1">
                  {[6,7,8,9,10].map((n) => {
                    const active = n <= (hoverFilmRating || currentFilmRating);
                    return (
                      <Star
                        key={n}
                        className={`w-7 h-7 cursor-pointer transition-colors ${active ? "text-[#44FFFF] fill-[#44FFFF]" : "text-[#BFBCFC]/15 hover:text-[#44FFFF]/40"}`}
                        onMouseEnter={() => setHoverFilmRating(n)}
                        onClick={async () => {
                          const newRating = n === currentFilmRating ? 0 : n;
                          setCurrentFilmRating(newRating);
                          await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/SetFilmRating`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ MovieId: data.movieId, Rating: newRating }) });
                          if (newRating > 0 && !myIsWatched) {
                            const r = await fetch(`${import.meta.env.VITE_API_BASE_URL}/database/LogWatchActivity`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ MovieId: data.movieId }) });
                            if (r.ok) { setMyIsWatched(true); setMyWatchCount(1); }
                          }
                          triggerRefresh();
                        }}
                      />
                    );
                  })}
                </div>
              </div>
              {currentFilmRating === 0 && (
                <p className="text-xs text-[#94A3B8]/40 mt-2">Click a star to rate</p>
              )}
            </div>

            {/* Action buttons */}
            {data.isOwnLog ? (
              <>
                <button
                  onClick={() => setEditOpen(true)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#151921]/80 hover:bg-[#151921] border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-sm transition-all"
                >
                  <Pencil className="w-4 h-4" />
                  {data.reviewText ? "Edit review" : "Add review"}
                </button>
                <button
                  onClick={() => setLogAgainOpen(true)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#151921]/80 hover:bg-[#151921] border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-sm transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  {data.watchCount > 1 ? "Log again" : "Log this film"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setLogAgainOpen(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-[#151921]/80 hover:bg-[#151921] border border-[#BFBCFC]/10 hover:border-[#BFBCFC]/30 text-[#94A3B8] hover:text-[#F8FAFC] rounded-xl text-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                {myWatchCount > 0 ? "Log again" : "Log this film"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trailer modal */}
      <TrailerModal
        isOpen={trailerOpen}
        isAnimateIn={trailerAnimate}
        onClose={closeTrailer}
        videoKey={trailerKey}
      />

      {/* Edit log modal */}
      <EditLogModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        logData={data}
        onSaved={loadData}
      />

      {/* Log again modal — pre-selected movie, today's date, rewatch checked, no review */}
      <WatchLogModal
        isOpen={logAgainOpen}
        onClose={() => setLogAgainOpen(false)}
        onSuccess={loadData}
        preSelectedMovie={{
          id: data?.movieId,
          title: data?.title,
          poster_path: data?.poster?.split("/w500").pop(),
          release_date: data?.releaseYear ? `${data.releaseYear}-01-01` : undefined,
        }}
        preIsRewatch={true}
        preIsLiked={currentFilmIsLiked}
        preRating={currentFilmRating}
      />
    </div>
  );
}
