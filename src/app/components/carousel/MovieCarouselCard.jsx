import { useState, useEffect, useMemo } from "react";
import { Star, Heart, Eye, Film, MoreHorizontal } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import { useRefresh } from "../../context/RefreshContext";
import { toast } from "sonner";

export function MovieCarouselCard({ movie, index, showRanking, showReleaseDate, onMovieClick }) {
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

    const [isWatched, setIsWatched] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [hasActivity, setHasActivity] = useState(false);
    const [saving, setSaving] = useState(false);

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

    const handleEyeClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            if (isWatched && hasActivity) {
                toast.error(`'${movie.title}' kan niet worden verwijderd omdat er activiteit op staat.`);
                return;
            } else if (isWatched) {
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

    const handleHeartClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (saving) return;
        const next = !isLiked;
        setIsLiked(next);
        setSaving(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/database/ToggleLikeStatus`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ MovieId: movie.id, IsLiked: next }),
                }
            );
            if (!res.ok) setIsLiked(!next);
            else triggerRefresh();
        } catch { setIsLiked(!next); }
        finally { setSaving(false); }
    };

    const imageUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null;

    const rating = movie.vote_average >= 0.1 ? movie.vote_average.toFixed(1) : null;

    const rankConfig = [
        { grad: 'from-yellow-400 to-amber-500', glow: 'shadow-amber-400/60' },
        { grad: 'from-slate-300 to-slate-400', glow: 'shadow-slate-300/50' },
        { grad: 'from-orange-400 to-orange-600', glow: 'shadow-orange-400/50' },
    ];

    return (
        <div className="group cursor-pointer" onClick={(e) => onMovieClick(e, movie.id)}>
            {/* Poster frame */}
            <div className={`relative overflow-hidden rounded-xl aspect-[2/3] bg-[#151921] border transition-all duration-300 ${
                isWatched
                    ? 'border-[#44FFFF]/20 group-hover:border-[#44FFFF]/50 group-hover:shadow-md group-hover:shadow-[#44FFFF]/10'
                    : 'border-white/5 group-hover:border-[#44FFFF]/30 group-hover:shadow-md group-hover:shadow-[#44FFFF]/10'
            }`}>

                {/* Ranking badge top-3 */}
                {showRanking && index < 3 && (
                    <div className={`absolute top-2 left-2 z-10 bg-gradient-to-br ${rankConfig[index].grad} rounded-lg w-7 h-7 shadow-md ${rankConfig[index].glow} flex items-center justify-center`}>
                        <span className="text-white font-black text-sm leading-none">{index + 1}</span>
                    </div>
                )}

                {/* Release date badge */}
                {showReleaseDate && movie.release_date && (
                    <div className="absolute top-2 right-2 z-10 bg-[#44FFFF] text-[#0B0E14] px-1.5 py-0.5 rounded-md text-[9px] font-black tracking-wide uppercase">
                        {new Date(movie.release_date).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}
                    </div>
                )}

                {/* Rating badge (when not showing release date) */}
                {!showReleaseDate && rating && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-0.5 bg-black/75 backdrop-blur-sm text-[#44FFFF] px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                        <Star className="w-2.5 h-2.5 fill-[#44FFFF]" />
                        {rating}
                    </div>
                )}

                {/* Poster image */}
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#2D3748]">
                        <Film className="w-8 h-8" />
                    </div>
                )}

                {/* Watched tint */}
                {isWatched && (
                    <div className="absolute inset-0 bg-[#44FFFF]/5 pointer-events-none" />
                )}

                {/* Hover action overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14]/90 via-[#0B0E14]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex items-end justify-center pb-3 gap-1.5">
                    <button
                        onClick={handleEyeClick}
                        className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-150 ${
                            isWatched
                                ? 'bg-[#44FFFF]/25 text-[#44FFFF] hover:bg-[#44FFFF]/40'
                                : 'bg-black/60 text-[#94A3B8] hover:text-[#44FFFF] hover:bg-[#44FFFF]/20'
                        }`}
                        title={isWatched ? 'Gezien' : 'Markeer als gezien'}
                    >
                        <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleHeartClick}
                        className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-150 ${
                            isLiked
                                ? 'bg-[#FF61D2]/25 text-[#FF61D2] hover:bg-[#FF61D2]/40'
                                : 'bg-black/60 text-[#94A3B8] hover:text-[#FF61D2] hover:bg-[#FF61D2]/20'
                        }`}
                        title={isLiked ? 'Verwijder favoriet' : 'Favoriet'}
                    >
                        <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-[#FF61D2]' : ''}`} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onMovieClick(e, movie.id); }}
                        className="w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-150 bg-black/60 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/20"
                        title="Details"
                    >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Title below poster */}
            <p className="mt-1.5 text-[#64748B] text-[11px] font-medium truncate leading-tight group-hover:text-[#CBD5E1] transition-colors duration-200 px-0.5">
                {movie.title}
            </p>
        </div>
    );
}
