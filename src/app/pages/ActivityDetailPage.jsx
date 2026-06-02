import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft, Heart, RotateCw, Eye, Star,
  MessageSquare, Film, AlertCircle, Play,
} from "lucide-react";
import { TrailerModal } from "../components/movie/TrailerModal";

export function ActivityDetailPage() {
  const { id } = useParams();
  const auth = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerAnimate, setTrailerAnimate] = useState(false);

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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/Log/ActivityDetail/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.status === 404) { setNotFound(true); return; }
        if (!res.ok) return;
        const detail = await res.json();
        setData(detail);

        // Fetch trailer via GetMovieDetails (same as MovieDetailPage)
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token && id) load();
  }, [id, token]);

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
        <p className="text-[#94A3B8]">Log entry niet gevonden.</p>
        <Link to="/my-profile" className="text-[#BFBCFC] text-sm hover:underline">
          Terug naar profiel
        </Link>
      </div>
    );
  }

  const dateStr = new Date(data.watchedDate).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <div className="container mx-auto px-4 max-w-4xl py-8">

        {/* Back */}
        <Link
          to="/my-profile"
          className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#F8FAFC] text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar profiel
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* ── LEFT: Poster + Trailer button ── */}
          <div className="flex-shrink-0 w-44 md:w-52 mx-auto md:mx-0">

            {/* Poster — clickable, hover border */}
            <Link to={`/movie/${data.movieId}`} className="block group">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden bg-[#151921] border border-white/5 group-hover:border-[#BFBCFC]/40 shadow-2xl shadow-black/40 transition-all duration-300 group-hover:scale-[1.02]">
                {data.poster ? (
                  <img
                    src={data.poster}
                    alt={data.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Film className="w-10 h-10 text-[#94A3B8]/20" />
                  </div>
                )}
              </div>
            </Link>

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

            {/* Title + year + heart */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC] leading-tight">
                {data.title}
              </h1>
              {data.isLiked && (
                <Heart className="w-6 h-6 text-[#FF61D2] fill-[#FF61D2] flex-shrink-0 mt-1" />
              )}
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
                {data.isRewatch
                  ? <><RotateCw className="w-3.5 h-3.5" /> Rewatched {dateStr}</>
                  : <><Eye className="w-3.5 h-3.5" /> Watched {dateStr}</>
                }
              </span>
            </div>

            {/* Rating */}
            {data.rating != null && data.rating > 0 && (
              <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-2xl p-4 mb-4">
                <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mb-3 uppercase tracking-wider font-medium">
                  <Star className="w-3.5 h-3.5" />
                  Jouw score
                </p>
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
              </div>
            )}

            {/* Review */}
            {data.reviewText && (
              <div className="bg-[#151921]/80 border border-[#BFBCFC]/10 rounded-2xl p-4">
                <p className="text-xs text-[#94A3B8] flex items-center gap-1.5 mb-2 uppercase tracking-wider font-medium">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Review
                  {data.containsSpoilers && (
                    <span className="ml-auto text-[#FF61D2] bg-[#FF61D2]/10 border border-[#FF61D2]/20 px-2 py-0.5 rounded-full text-[10px] font-bold normal-case tracking-normal">
                      ⚠ Spoilers
                    </span>
                  )}
                </p>
                <p className="text-[#F8FAFC] text-sm leading-relaxed">{data.reviewText}</p>
              </div>
            )}

            {/* Empty state */}
            {(data.rating == null || data.rating === 0) && !data.reviewText && (
              <div className="bg-[#151921]/80 border border-dashed border-[#BFBCFC]/15 rounded-2xl p-6 text-center">
                <p className="text-[#94A3B8] text-sm">Geen score of recensie toegevoegd.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trailer modal — same as MovieDetailPage */}
      <TrailerModal
        isOpen={trailerOpen}
        isAnimateIn={trailerAnimate}
        onClose={closeTrailer}
        videoKey={trailerKey}
      />
    </div>
  );
}
