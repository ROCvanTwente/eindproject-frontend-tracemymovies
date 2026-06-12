import { useState, useEffect, useMemo } from "react";
import { Star, Heart, Eye, MoreHorizontal } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useRefresh } from "../../context/RefreshContext";
import { toast } from "sonner";

export function MovieCarouselCard({ 
    movie, 
    index, 
    showRanking, 
    showReleaseDate, 
    onMovieClick 
}) {
    const auth = useAuth();
    const { triggerRefresh } = useRefresh();

    // Retrieve auth token exactly like ProfilePosterCard
    const token = useMemo(
        () =>
          auth?.token ||
          auth?.user?.token ||
          localStorage.getItem("auth_token") ||
          sessionStorage.getItem("auth_token"),
        [auth]
    );

    // Dynamic states for interactive buttons
    const [isWatched, setIsWatched] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [hasActivity, setHasActivity] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch live status for this specific card on mount
    useEffect(() => {
        const fetchStatus = async () => {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/database/GetMovieStatus/${movie.id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (!res.ok) return;
            const data = await res.json();
            setIsWatched(data.isWatched);
            setIsLiked(data.isFavorite);
            setHasActivity(data.hasLogEntries);
          } catch {}
        };
        if (token && movie.id) fetchStatus();
    }, [movie.id, token]);

    // Handle watch state updates with the API
    const handleEyeClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
          if (isWatched && hasActivity) {
            toast.error(`'${movie.title}' can't be removed because there is activity on it.`);
            return;
          } else if (isWatched && !hasActivity) {
            const res = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/database/RemoveWatchActivity/${movie.id}`,
              { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) { setIsWatched(false); triggerRefresh(); }
          } else {
            const res = await fetch(
              `${import.meta.env.VITE_API_BASE_URL}/database/LogWatchActivity`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ MovieId: movie.id }),
              }
            );
            if (res.ok) { setIsWatched(true); triggerRefresh(); }
          }
        } catch {}
        finally { setSaving(false); }
    };

    // Handle favorite state updates with the API
    const handleHeartClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
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
              body: JSON.stringify({ MovieId: movie.id, IsLiked: nextLiked }),
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

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750/151921/BFBCFC?text=No+Poster';

    const getRankingBadge = () => {
        if (!showRanking || index > 2) return null;
        
        const badges = [
            { color: 'from-yellow-400 to-yellow-600', glow: 'shadow-yellow-500/50', number: '1' },
            { color: 'from-gray-300 to-gray-500', glow: 'shadow-gray-400/50', number: '2' },
            { color: 'from-orange-400 to-orange-600', glow: 'shadow-orange-500/50', number: '3' },
        ];
        const badge = badges[index];

        return (
            <div className={`absolute top-2 left-2 z-10 bg-gradient-to-br ${badge.color} rounded-lg w-8 h-8 shadow-lg ${badge.glow} flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">{badge.number}</span>
            </div>
        );
    };

    return (
        <div className="px-2">
            <div className="group cursor-pointer relative" onClick={(e) => onMovieClick(e, movie.id)}>
                <div 
                    className={`relative overflow-hidden rounded-xl aspect-[2/3] bg-[#151921] border transition-all duration-200 ${
                        isWatched
                          ? "border-white/5 group-hover:border-[#44FFFF]/50"
                          : "border-white/5 group-hover:border-white/30"
                    }`}
                >
                    {getRankingBadge()}
                    
                    {showReleaseDate && movie.release_date && (
                        <div className="absolute top-2 right-2 z-10 bg-[#44FFFF]/90 backdrop-blur-sm text-[#0B0E14] px-2 py-1 rounded-lg text-xs font-bold">
                            {new Date(movie.release_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                    )}
                    
                    <img 
                        src={imageUrl} 
                        alt={movie.title} 
                        className="w-full h-full object-cover" 
                    />
                    
                    {/* Hover Info & Action Overlay matching layout exactly */}
                    <div className="absolute inset-0 bg-[#0B0E14]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-end justify-center pb-3 gap-1.5">
                        
                        {/* Eye icon - Log Activity */}
                        <button
                          onClick={handleEyeClick}
                          className={`relative w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                            isWatched
                              ? "bg-[#44FFFF]/20 text-[#44FFFF] hover:bg-[#44FFFF]/30"
                              : "bg-black/50 text-[#94A3B8] hover:text-[#44FFFF] hover:bg-[#44FFFF]/20"
                          }`}
                          title={isWatched ? (hasActivity ? "Has activity" : "Unwatch") : "Mark as watched"}
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Heart icon - Like Movie */}
                        <button
                          onClick={handleHeartClick}
                          className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
                            isLiked
                              ? "bg-[#FF61D2]/20 text-[#FF61D2] hover:bg-[#FF61D2]/30"
                              : "bg-black/50 text-[#94A3B8] hover:text-[#FF61D2] hover:bg-[#FF61D2]/20"
                          }`}
                          title={isLiked ? "Unlike" : "Like"}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? "fill-[#FF61D2]" : ""}`} />
                        </button>

                        {/* Three dots - Context Options / Navigation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMovieClick(e, movie.id);
                          }}
                          className="w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all bg-black/50 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/20"
                          title="More options"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </div>

                </div>
                {/* Dynamic ring outline overlay on hover from ProfilePosterCard */}
                <div 
                    className={`absolute inset-0 rounded-xl ring-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                        isWatched ? "ring-[#44FFFF]/40" : "ring-white/20"
                    }`} 
                />
            </div>
        </div>
    );
}