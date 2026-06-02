import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import { Eye, Heart, Film } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useRefresh } from "../context/RefreshContext";
import { toast } from "sonner";

export function ProfilePosterCard({
  movieId,
  poster,
  title,
  to,             // override click destination (default: /movie/:movieId)
  isWatchedProp,
  isLikedProp,
  hasActivityProp,
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
  const [saving, setSaving] = useState(false);

  // Fetch status if not provided as props
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
      } catch {}
    };
    if (token && movieId) fetchStatus();
  }, [movieId, token, isWatchedProp]);

  const handleEye = async (e) => {
    e.stopPropagation();
    if (saving) return;

    setSaving(true);
    try {
      if (isWatched && hasActivity) {
        toast.error(`'${title}' can't be removed because there is activity on it.`);
        return;
      } else if (isWatched && !hasActivity) {
        // Only quick-watched — allow removing
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/database/RemoveWatchActivity/${movieId}`,
          { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          setIsWatched(false);
          triggerRefresh();
        }
      } else {
        // Not watched — mark as watched
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/database/LogWatchActivity`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ MovieId: movieId }),
          }
        );
        if (res.ok) {
          setIsWatched(true);
          triggerRefresh();
        }
      }
    } catch {} finally {
      setSaving(false);
    }
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

  return (
    <div
      className="relative group cursor-pointer"
      onClick={(e) => { e.stopPropagation(); navigate(to ?? `/movie/${movieId}`); }}
    >
      {/* Poster */}
      <div className={`aspect-[2/3] rounded-lg overflow-hidden bg-[#151921] border transition-all duration-200 ${
        isWatched ? "border-[#44FFFF]/50" : "border-white/5 group-hover:border-[#BFBCFC]/30"
      }`}>
        {poster ? (
          <img src={poster} alt={title} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-6 h-6 text-[#94A3B8]/20" />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#0B0E14]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-end justify-center pb-3 gap-2">
          {/* Eye */}
          <button
            onClick={handleEye}
            className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
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
        </div>
      </div>

      {/* Green border glow when watched */}
      {isWatched && (
        <div className="absolute inset-0 rounded-lg ring-2 ring-[#44FFFF]/40 pointer-events-none" />
      )}
    </div>
  );
}
