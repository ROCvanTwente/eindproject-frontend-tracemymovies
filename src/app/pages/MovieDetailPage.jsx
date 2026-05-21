import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router";
import { 
    Heart, Plus, Star, DollarSign, Globe, Calendar, 
    Clock, Eye, Share2, Loader2, User, ChevronRight, AlertCircle, RefreshCw,
    Play, X
} from "lucide-react";
import { WatchLogModal } from "../components/WatchLogModal";
import { ShareModal } from "../components/ShareModal";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

const CastSection = React.memo(({ cast }) => {
    const [showAll, setShowAll] = useState(false);
    const displayedCast = useMemo(() => showAll ? cast : cast.slice(0, 10), [cast, showAll]);

    if (!cast || cast.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg md:text-xl font-bold font-heading text-[#F8FAFC]">Cast & Crew</h3>
                {cast.length > 10 && (
                    <button 
                        onClick={() => setShowAll(!showAll)}
                        className="text-[#44FFFF] text-sm font-medium hover:opacity-80 transition-opacity flex items-center gap-1"
                    >
                        {showAll ? "Toon minder" : `Toon alle ${cast.length}`}
                        <ChevronRight className={`w-4 h-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
                    </button>
                )}
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#BFBCFC]/20 scrollbar-track-transparent snap-x snap-proximity">
                {displayedCast.map((actor) => (
                    <div 
                        key={actor.cast_id || actor.id}
                        className="flex-none w-[120px] md:w-[140px] bg-[#151921] border border-[#BFBCFC]/10 rounded-xl overflow-hidden shadow-lg snap-start"
                    >
                        {actor.profile_path ? (
                            <img src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} alt={actor.name} loading="lazy" className="w-full h-[150px] md:h-[185px] object-cover" />
                        ) : (
                            <div className="w-full h-[150px] md:h-[185px] bg-[#1c222d] flex items-center justify-center border-b border-[#BFBCFC]/10">
                                <User className="w-10 h-10 text-[#94A3B8]/50" />
                            </div>
                        )}
                        <div className="p-2 space-y-0.5">
                            <p className="text-[#F8FAFC] font-semibold text-xs md:text-sm truncate" title={actor.name}>{actor.name}</p>
                            <p className="text-[#94A3B8] text-[11px] md:text-xs truncate" title={actor.character}>{actor.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export function MovieDetailPage() {
    const { id } = useParams();
    const auth = useAuth();

    const token = auth?.token || 
                  auth?.user?.token || 
                  auth?.user?.jwtToken || 
                  localStorage.getItem("authToken") || 
                  localStorage.getItem("auth_token") || 
                  localStorage.getItem("token");
    
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    const [isFavorite, setIsFavorite] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const [isWatched, setIsWatched] = useState(false);
    const [showWatchLogModal, setShowWatchLogModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    
    const [showTrailerModal, setShowTrailerModal] = useState(false);
    const [isAnimateIn, setIsAnimateIn] = useState(false);

    const [isSavingWatch, setIsSavingWatch] = useState(false);
    const [isSavingLike, setIsSavingLike] = useState(false);

    const API_URL = 'https://localhost:7245/api/tmdbmovie/GetMovieDetails';
    const SAVE_WATCH_URL = 'https://localhost:7245/api/database/LogWatchActivity';
    const REMOVE_WATCH_URL = `https://localhost:7245/api/database/RemoveWatchActivity/${id}`;
    const TOGGLE_LIKE_URL = 'https://localhost:7245/api/database/ToggleLikeStatus';

    const fetchMovieData = async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`${API_URL}?id=${id}`);
            if (!res.ok) throw new Error("Fout bij laden");
            const data = await res.json();
            setMovie(data);
            
            if (token) {
                fetchUserStatus();
            }
        } catch (error) {
            setError(true);
            toast.error("Fout bij het laden van de filmgegevens");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserStatus = async () => {
        try {
            const res = await fetch(`https://localhost:7245/api/database/GetMovieStatus/${id}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.ok) {
                const status = await res.json();
                setIsWatched(status.isWatched || false);
                setIsFavorite(status.isFavorite || false);
                setIsInWatchlist(status.isInWatchlist || false);
            }
        } catch (err) {
            console.error("Kon status niet ophalen", err);
        }
    };

    useEffect(() => {
        if (id) fetchMovieData();
    }, [id]);

    const trailerVideo = useMemo(() => {
        return movie?.videos?.results?.find(v => v.type === "Trailer" && v.site === "YouTube") || movie?.videos?.results?.[0];
    }, [movie]);

    const openTrailer = () => {
        if (trailerVideo?.key) {
            setShowTrailerModal(true);
            setTimeout(() => setIsAnimateIn(true), 10);
        } else {
            toast.info("Geen trailer beschikbaar");
        }
    };

    const closeTrailer = () => {
        setIsAnimateIn(false);
        setTimeout(() => setShowTrailerModal(false), 200);
    };

    const handleToggleWatch = async () => {
        if (!token) {
            toast.error("Je moet ingelogd zijn.");
            return;
        }

        setIsSavingWatch(true);
        try {
            if (isWatched) {
                // Klik 2: Weer weghalen
                const response = await fetch(REMOVE_WATCH_URL, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.ok) {
                    setIsWatched(false);
                    toast.success("Verwijderd van bekeken films");
                }
            } else {
                // Klik 1: Activeren / Toevoegen
                const response = await fetch(SAVE_WATCH_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ MovieId: parseInt(id), AmountWatched: 1 })
                });
                if (response.ok) {
                    setIsWatched(true);
                    toast.success("Gemarkeerd als bekeken");
                }
            }
        } catch (err) {
            toast.error("Er is iets misgegaan.");
        } finally {
            setIsSavingWatch(false);
        }
    };

    const handleToggleLike = async () => {
        if (!token) {
            toast.error("Je moet ingelogd zijn.");
            return;
        }

        setIsSavingLike(true);
        const nextLikeState = !isFavorite;

        try {
            const response = await fetch(TOGGLE_LIKE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ MovieId: parseInt(id), IsLiked: nextLikeState })
            });

            if (response.ok) {
                setIsFavorite(nextLikeState);
                toast.success(nextLikeState ? "Toegevoegd aan favorieten" : "Verwijderd uit favorieten");
            } else {
                toast.error("Er is iets misgegaan bij het updaten van je favorieten.");
            }
        } catch (err) {
            toast.error("Er is een netwerkfout opgetreden.");
        } finally {
            setIsSavingLike(false);
        }
    };

    if (loading) return <div className="min-h-screen w-full flex items-center justify-center bg-[#0B0E14]"><Loader2 className="w-8 h-8 text-[#44FFFF] animate-spin" /></div>;
    if (error) return <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0B0E14] px-4"><div className="bg-[#151921] border border-[#BFBCFC]/15 p-8 rounded-2xl max-w-md w-full text-center"><AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" /><h2 className="text-xl font-bold text-[#F8FAFC] mb-2">Fout bij laden</h2><button onClick={fetchMovieData} className="w-full flex items-center justify-center gap-2 bg-[#44FFFF] text-[#0B0E14] py-3 rounded-xl font-bold mt-4"><RefreshCw className="w-4 h-4" /> Probeer opnieuw</button></div></div>;
    if (!movie) return null;

    return (
        <div className="min-h-screen bg-[#0B0E14]">
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] overflow-hidden">
                <img src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0">
                    <div className="container mx-auto px-4 max-w-7xl pb-6">
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-32 md:w-48 rounded-lg shadow-2xl border border-[#BFBCFC]/20 md:-mb-12 hidden md:block" />
                            <div className="flex-1 md:pt-16">
                                <h1 className="text-2xl md:text-3xl font-bold font-heading text-[#F8FAFC] mb-1.5">{movie.title}</h1>
                                {movie.tagline && <p className="text-[#BFBCFC] text-base md:text-lg italic mb-3">{movie.tagline}</p>}
                                <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4">
                                    <span className="text-[#94A3B8] font-data text-xs md:text-sm">{new Date(movie.release_date).getFullYear()}</span>
                                    <span className="text-[#94A3B8] hidden md:inline">•</span>
                                    <span className="text-[#94A3B8] font-data text-xs md:text-sm">{movie.runtime} min</span>
                                    {movie.age_rating && <span className="bg-[#FF61D2]/20 text-[#FF61D2] px-2 py-0.5 rounded-lg text-xs font-medium">{movie.age_rating}</span>}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {/* Volledig stabiele Watched-button zonder felle hover of breedteveranderingen */}
                                    <button 
                                        onClick={handleToggleWatch}
                                        disabled={isSavingWatch}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm w-[115px] justify-center
                                            ${isWatched 
                                                ? "bg-[#44FFFF] text-[#000000]" 
                                                : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20 hover:bg-[#151921]"
                                            }`}
                                    >
                                        {isSavingWatch ? (
                                            <Loader2 className="w-3.5 md:w-4 animate-spin" />
                                        ) : (
                                            <>
                                                <Eye className="w-3.5 md:w-4" /> 
                                                <span>Watched</span>
                                            </>
                                        )}
                                    </button>

                                    <button 
                                        onClick={handleToggleLike} 
                                        disabled={isSavingLike}
                                        className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm ${isFavorite ? "bg-[#44FFFF] text-[#000000]" : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20"}`}
                                    >
                                        {isSavingLike ? (
                                            <Loader2 className="w-3.5 md:w-4 animate-spin" />
                                        ) : (
                                            <Heart className={`w-3.5 md:w-4 ${isFavorite ? "fill-current" : ""}`} />
                                        )} 
                                        <span className="hidden sm:inline">Like</span>
                                    </button>
                                    
                                    <button onClick={() => setIsInWatchlist(!isInWatchlist)} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 text-xs md:text-sm ${isInWatchlist ? "bg-[#44FFFF] text-[#0B0E14]" : "bg-[#151921]/70 text-[#F8FAFC] border border-[#BFBCFC]/20"}`}>
                                        <Plus className="w-3.5 md:w-4" /> <span className="hidden sm:inline">Watchlist</span>
                                    </button>
                                    <button onClick={openTrailer} className="bg-[#FF61D2]/10 hover:bg-[#FF61D2] text-[#FF61D2] hover:text-[#0B0E14] px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 border border-[#FF61D2]/30 text-xs md:text-sm">
                                        <Play className="w-3.5 md:w-4 fill-current" /> <span className="hidden sm:inline">Trailer</span>
                                    </button>
                                    <button onClick={() => setShowShareModal(true)} className="bg-[#151921]/70 hover:bg-[#44FFFF] hover:text-[#0B0E14] text-[#F8FAFC] px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-1.5 border border-[#BFBCFC]/20 text-xs md:text-sm">
                                        <Share2 className="w-3.5 md:w-4" /> <span className="hidden sm:inline">Share</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="container mx-auto px-4 max-w-7xl py-8 mt-6 md:mt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-10">
                        <div>
                            <h2 className="text-xl font-bold font-heading text-[#F8FAFC] mb-3">Overview</h2>
                            <p className="text-[#94A3B8] leading-relaxed text-sm">{movie.overview}</p>
                        </div>
                        <CastSection cast={movie.credits?.cast || []} />
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <InfoCard icon={<Calendar className="w-3.5 h-3.5 text-[#44FFFF]" />} label="Release Date" value={movie.release_date} />
                            <InfoCard icon={<Clock className="w-3.5 h-3.5 text-[#44FFFF]" />} label="Runtime" value={`${movie.runtime} min`} />
                            <InfoCard icon={<DollarSign className="w-3.5 h-3.5 text-[#44FFFF]" />} label="Budget" value={movie.budget > 0 ? `$${(movie.budget / 1000000).toFixed(0)}M` : "N/A"} />
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6">
                            <h3 className="text-xl font-bold font-heading text-[#F8FAFC] mb-4">Scores</h3>
                            <div className="flex items-center justify-between">
                                <span className="text-[#94A3B8]">TMDB Score</span>
                                <span className="text-[#44FFFF] font-data font-medium">★ {movie.vote_average?.toFixed(1)}/10</span>
                            </div>
                        </div>
                        <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-xl p-6">
                            <h3 className="text-xl font-bold font-heading text-[#F8FAFC] mb-4">Genres</h3>
                            <div className="flex flex-wrap gap-2">
                                {movie.genres?.map((genre) => (
                                    <span key={genre.id} className="bg-[#BFBCFC]/10 text-[#BFBCFC] px-3 py-1 rounded-lg text-sm border border-[#BFBCFC]/20">{genre.name}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailerModal && trailerVideo?.key && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md transition-opacity duration-200 ${isAnimateIn ? "opacity-100" : "opacity-0"}`} onClick={closeTrailer}>
                    <div className={`relative w-full max-w-5xl bg-[#151921] rounded-2xl overflow-hidden border border-[#BFBCFC]/20 shadow-2xl aspect-video transition-all duration-200 ${isAnimateIn ? "scale-100" : "scale-95"}`} onClick={(e) => e.stopPropagation()}>
                        <button onClick={closeTrailer} className="absolute top-4 right-4 z-10 bg-black/60 text-white p-2.5 rounded-full"><X className="w-5 h-5" /></button>
                        <iframe src={`https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&rel=0`} title="Trailer" className="w-full h-full border-0" allowFullScreen />
                    </div>
                </div>
            )}

            <WatchLogModal isOpen={showWatchLogModal} onClose={() => setShowWatchLogModal(false)} movieTitle={movie.title} />
            <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} movieTitle={movie.title} movieId={movie.id} />
        </div>
    );
}

const InfoCard = ({ icon, label, value }) => (
    <div className="bg-[#151921] border border-[#BFBCFC]/15 rounded-lg p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
            {icon}
            <span className="text-[#94A3B8] text-xs">{label}</span>
        </div>
        <p className="text-[#F8FAFC] font-data text-sm">{value}</p>
    </div>
);